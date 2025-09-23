import OpenAI from "openai";

type CatalogProduct = {
  id: number;
  name: string;
  type: string;
  price: number;
  styleTags: string[];
  shop: {
    name: string;
  };
};

const openaiSingleton = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }
  return new OpenAI({ apiKey });
};

const globalForOpenAI = globalThis as unknown as { openai?: OpenAI };

export const openai = globalForOpenAI.openai ?? openaiSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForOpenAI.openai = openai;
}

export async function getRecommendedProductIds(
  style: string,
  products: CatalogProduct[],
  maxItems = 5
) {
  const productCatalog = products.map((product) => ({
    id: product.id,
    name: product.name,
    type: product.type,
    price: product.price,
    styleTags: product.styleTags,
    shop: product.shop.name,
  }));

  const systemPrompt =
    `You are a fashion stylist for AIStyleHub. Recommend cohesive outfits from the provided product catalog. Respond strictly with a JSON object that contains a \"productIds\" property whose value is an array of catalog product IDs sorted in dress order. Select between 3 and ${maxItems} distinct items covering tops, bottoms or dresses, accessories, and footwear when possible. Only return IDs that exist in the catalog.`;

  const userPrompt = `Recommend an outfit for style: ${style}.\nCatalog: ${JSON.stringify(productCatalog)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const rawContent = response.choices[0]?.message?.content;
  if (!rawContent) {
    throw new Error("OpenAI response did not include content");
  }

  let parsed: { productIds?: unknown };

  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("Failed to parse OpenAI JSON response");
  }

  if (!Array.isArray(parsed.productIds)) {
    throw new Error("OpenAI response missing productIds array");
  }

  const uniqueIds = [...new Set(parsed.productIds as Array<number | string>)].slice(0, maxItems);
  return uniqueIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
}
