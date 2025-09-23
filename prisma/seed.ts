import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const shops = [
  { name: "Zara", url: "https://www.zara.com" },
  { name: "H&M", url: "https://www2.hm.com" },
  { name: "Uniqlo", url: "https://www.uniqlo.com" },
  { name: "ASOS", url: "https://www.asos.com" },
  { name: "Everlane", url: "https://www.everlane.com" },
  { name: "Mango", url: "https://shop.mango.com" },
  { name: "COS", url: "https://www.cos.com" },
  { name: "Banana Republic", url: "https://bananarepublic.gap.com" },
  { name: "Shopee Style Market", url: "https://shopee.sg" },
  { name: "Nordstrom", url: "https://www.nordstrom.com" },
];

const imageBaseByType: Record<string, string> = {
  top: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  bottom: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  dress: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  outerwear: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80",
  footwear: "https://images.unsplash.com/photo-1528701800489-20be3c2c6424?auto=format&fit=crop&w=600&q=80",
  accessory: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
};

type ProductTemplate = {
  baseName: string;
  type: "top" | "bottom" | "dress" | "outerwear" | "footwear" | "accessory";
  basePrice: number;
  styleTags: string[];
  shop: string;
  variations: string[];
  priceIncrement?: number;
};

const productTemplates: ProductTemplate[] = [
  {
    baseName: "Linen Resort Shirt",
    type: "top",
    basePrice: 59.9,
    styleTags: ["casual", "summer", "beach"],
    shop: "Zara",
    variations: ["Sky Blue", "Sand", "Olive", "Soft White"],
    priceIncrement: 2.1,
  },
  {
    baseName: "Tailored Cotton Oxford",
    type: "top",
    basePrice: 64.5,
    styleTags: ["office", "smart", "minimal"],
    shop: "H&M",
    variations: ["Powder Blue", "Charcoal", "Fresh White", "Muted Lilac"],
    priceIncrement: 1.8,
  },
  {
    baseName: "BreezeFlex Performance Tee",
    type: "top",
    basePrice: 39.9,
    styleTags: ["athleisure", "street", "minimal"],
    shop: "Uniqlo",
    variations: ["Slate", "Coral", "Seafoam", "Jet Black"],
    priceIncrement: 1.5,
  },
  {
    baseName: "Coastal Chino Shorts",
    type: "bottom",
    basePrice: 49.5,
    styleTags: ["casual", "weekend", "vacation"],
    shop: "Mango",
    variations: ["Stone", "Terracotta", "Sage", "Navy"],
    priceIncrement: 2.4,
  },
  {
    baseName: "High-Rise Wide Leg Trousers",
    type: "bottom",
    basePrice: 74.2,
    styleTags: ["office", "elevated", "evening"],
    shop: "COS",
    variations: ["Ivory", "Ink", "Taupe", "Mocha"],
    priceIncrement: 2.6,
  },
  {
    baseName: "Sculpted Denim Jeans",
    type: "bottom",
    basePrice: 68.0,
    styleTags: ["street", "casual", "denim"],
    shop: "Zara",
    variations: ["Vintage Wash", "Midnight", "Ecru", "Charcoal"],
    priceIncrement: 2.0,
  },
  {
    baseName: "Satin Slip Midi Dress",
    type: "dress",
    basePrice: 89.9,
    styleTags: ["evening", "romantic", "event"],
    shop: "ASOS",
    variations: ["Champagne", "Emerald", "Midnight", "Rose"],
    priceIncrement: 3.1,
  },
  {
    baseName: "Structured Modern Blazer",
    type: "outerwear",
    basePrice: 129.0,
    styleTags: ["office", "tailored", "layering"],
    shop: "Everlane",
    variations: ["Graphite", "Camel", "Oat", "Deep Navy"],
    priceIncrement: 4.5,
  },
  {
    baseName: "Quilted Tech Bomber",
    type: "outerwear",
    basePrice: 118.5,
    styleTags: ["street", "athleisure", "layering"],
    shop: "Banana Republic",
    variations: ["Carbon", "Forest", "Clay", "Night"],
    priceIncrement: 3.8,
  },
  {
    baseName: "Minimalist Leather Sneakers",
    type: "footwear",
    basePrice: 139.9,
    styleTags: ["street", "smart", "weekend"],
    shop: "Nordstrom",
    variations: ["Triple White", "Stone Grey", "Black", "Ash"],
    priceIncrement: 5.0,
  },
  {
    baseName: "Strappy Evening Sandals",
    type: "footwear",
    basePrice: 119.5,
    styleTags: ["evening", "summer", "party"],
    shop: "Zara",
    variations: ["Gold", "Silver", "Blush", "Onyx"],
    priceIncrement: 4.2,
  },
  {
    baseName: "Layered Pendant Necklace",
    type: "accessory",
    basePrice: 39.5,
    styleTags: ["romantic", "minimal", "evening"],
    shop: "Shopee Style Market",
    variations: ["Warm Gold", "Cool Silver", "Rose Gold", "Matte Black"],
    priceIncrement: 1.2,
  },
  {
    baseName: "Structured Carryall Tote",
    type: "accessory",
    basePrice: 89.0,
    styleTags: ["office", "commuter", "minimal"],
    shop: "H&M",
    variations: ["Camel", "Charcoal", "Oxblood", "Soft Grey"],
    priceIncrement: 2.9,
  },
];

async function main() {
  await prisma.outfit.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();

  const shopRecords = await Promise.all(shops.map((shop) => prisma.shop.create({ data: shop })));
  const shopMap = new Map(shopRecords.map((shop) => [shop.name, shop.id]));

  let counter = 1;
  const products = productTemplates.flatMap((template) =>
    template.variations.map((variant, index) => {
      const price = Number((template.basePrice + index * (template.priceIncrement ?? 2)).toFixed(2));
      const shopId = shopMap.get(template.shop);
      if (!shopId) {
        throw new Error(`Missing shop for template: ${template.shop}`);
      }

      return {
        name: `${variant} ${template.baseName}`.trim(),
        type: template.type,
        price,
        styleTags: JSON.stringify(template.styleTags),
        imageUrl: `${imageBaseByType[template.type]}&sig=${counter++}`,
        shopId,
      };
    })
  );

  await prisma.product.createMany({ data: products });

  console.log(`Seeded ${shopRecords.length} shops and ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
