import { createHash, randomUUID } from "crypto";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { z } from "zod";

import { getCache, setCache } from "@/lib/cache";
import { isPrismaInitializationError } from "@/lib/errors";
import { generateTryOnImage } from "@/lib/huggingface";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const tryOnSchema = z.object({
  userImage: z
    .string({ required_error: "userImage is required" })
    .min(100, "userImage must be a base64 string"),
  productId: z.coerce.number().int().positive(),
});

type TryOnResponse = {
  outfit: {
    id: number;
    style: string;
    imageUrl: string | null;
    products: {
      id: number;
      name: string;
      type: string;
      price: number;
      imageUrl: string;
      styleTags: string[];
      shop: {
        name: string;
        url: string;
      };
    }[];
    createdAt: Date;
  };
  shop: {
    name: string;
    url: string;
  };
};

function extractBase64(input: string) {
  const matches = input.match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (matches) {
    return {
      mimeType: matches[1],
      base64: matches[2],
    };
  }

  return {
    mimeType: "image/png",
    base64: input,
  };
}

function ensureSizeLimit(base64: string) {
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) {
    throw new Error("Provided image is empty or invalid");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Image exceeds the 5MB upload limit");
  }
  return buffer;
}

async function persistImage(buffer: Buffer, mimeType: string) {
  const extension = mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "png";
  const fileName = `${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const parsed = tryOnSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { userImage, productId } = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { base64: base64Payload } = extractBase64(userImage);
    ensureSizeLimit(base64Payload);

    const cacheKey = `tryon:${productId}:${createHash("sha256").update(base64Payload).digest("hex")}`;
    const cached = getCache<TryOnResponse>(cacheKey);
    if (cached) {
      return res.status(200).json({ ...cached, cached: true });
    }

    const { base64: resultBase64, mimeType } = await generateTryOnImage({
      image: base64Payload,
    });

    const resultBuffer = Buffer.from(resultBase64, "base64");
    const savedImageUrl = await persistImage(resultBuffer, mimeType);

    const outfit = await prisma.outfit.create({
      data: {
        style: `Virtual try-on for ${product.name}`,
        imageUrl: savedImageUrl,
        products: {
          connect: { id: product.id },
        },
      },
      include: {
        products: {
          include: {
            shop: true,
          },
        },
      },
    });

    type OutfitProductWithShop = typeof outfit.products[number];

    const responsePayload: TryOnResponse = {
      outfit: {
        id: outfit.id,
        style: outfit.style,
        imageUrl: outfit.imageUrl,
        products: outfit.products.map((item: OutfitProductWithShop) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          price: item.price,
          imageUrl: item.imageUrl,
          styleTags: JSON.parse(item.styleTags || '[]'),
          shop: {
            name: item.shop.name,
            url: item.shop.url,
          },
        })),
        createdAt: outfit.createdAt,
      },
      shop: {
        name: product.shop.name,
        url: product.shop.url,
      },
    };

    setCache(cacheKey, responsePayload, 10 * 60 * 1000);

    return res.status(200).json({ ...responsePayload, cached: false });
  } catch (error) {
    console.error("Try-on API error", error);

    if (isPrismaInitializationError(error)) {
      return res.status(503).json({
        error: "Database unavailable",
        hint: "Start the database referenced in DATABASE_URL before generating try-ons.",
      });
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    return res.status(500).json({ error: message });
  }
}
