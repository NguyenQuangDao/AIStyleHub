import { getCache, setCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type ProductResponse = {
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
  createdAt: Date;
};

const CACHE_KEY = "products:all";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const cached = getCache<ProductResponse[]>(CACHE_KEY);
    if (cached) {
      return res.status(200).json({ products: cached, cached: true });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        shop: true,
      },
    });

    type ProductWithShop = typeof products[number];

    const formatted: ProductResponse[] = products.map((product: ProductWithShop) => ({
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
      createdAt: product.createdAt,
    }));

    setCache(CACHE_KEY, formatted, CACHE_TTL);
    return res.status(200).json({ products: formatted, cached: false });
  } catch (error) {
    console.error("Failed to fetch products", error);

    if (error instanceof Error && error.name === "PrismaClientInitializationError") {
      return res.status(503).json({
        error: "Database unavailable",
        hint: "Ensure the database is properly configured and running.",
      });
    }

    return res.status(500).json({ error: "Failed to load products" });
  }
}
