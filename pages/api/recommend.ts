import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { getCache, setCache } from "@/lib/cache";
import { getRecommendedProductIds } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

type OutfitProduct = {
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
};

type RecommendationPayload = {
  outfit: OutfitProduct[];
  shops: {
    name: string;
    url: string;
    productName: string;
  }[];
};

const recommendSchema = z.object({
  style: z.string().min(3, "style description is required"),
});

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const parseResult = recommendSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { style } = parseResult.data;
  const normalizedStyle = style.trim().toLowerCase();
  const cacheKey = `recommend:${normalizedStyle}`;

  const cached = getCache<RecommendationPayload>(cacheKey);
  if (cached) {
    return res.status(200).json({ ...cached, cached: true });
  }

  try {
    const products = await prisma.product.findMany({
      include: { shop: true },
    });

    type ProductWithShop = typeof products[number];

    if (!products.length) {
      return res.status(500).json({ error: "Product catalog is empty" });
    }

    const recommendedIds = await getRecommendedProductIds(style, products);
    let selectedProducts: ProductWithShop[] = products.filter((product: ProductWithShop) =>
      recommendedIds.includes(product.id)
    );

    if (!selectedProducts.length) {
      const fallback: ProductWithShop[] = products
        .filter((product: ProductWithShop) => {
          const tags = JSON.parse(product.styleTags || '[]');
          return tags.some((tag: string) => normalizedStyle.includes(tag.toLowerCase()));
        })
        .slice(0, 4);

      selectedProducts = fallback.length ? fallback : products.slice(0, 4);
    }

    const outfitRecord = await prisma.outfit.create({
      data: {
        style,
        products: {
          connect: selectedProducts.map((product) => ({ id: product.id })),
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

    type OutfitProductWithShop = typeof outfitRecord.products[number];

    const outfit = outfitRecord.products.map((product: OutfitProductWithShop) => ({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      imageUrl: product.imageUrl,
      styleTags: JSON.parse(product.styleTags || '[]'),
      shop: {
        name: product.shop.name,
        url: product.shop.url,
      },
    }));

    const shops = outfit.map((product: OutfitProduct) => ({
      name: product.shop.name,
      url: product.shop.url,
      productName: product.name,
    }));

    const responsePayload: RecommendationPayload = { outfit, shops };
    setCache(cacheKey, responsePayload, CACHE_TTL);

    return res.status(200).json({ ...responsePayload, cached: false });
  } catch (error) {
    console.error("Recommendation API error", error);

    if (error instanceof Error && error.name === "PrismaClientInitializationError") {
      return res.status(503).json({
        error: "Database unavailable",
        hint: "Start the database before requesting outfits.",
      });
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    return res.status(500).json({ error: message });
  }
}
