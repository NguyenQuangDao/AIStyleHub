import { useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

interface RecommendationShop {
  name: string;
  url: string;
  productName: string;
}

interface RecommendApiResponse {
  outfit: Product[];
  shops: RecommendationShop[];
  cached?: boolean;
}

const suggestionPills = [
  "weekend brunch",
  "minimalist office",
  "sunset beach",
  "elevated streetwear",
  "winter city escape",
];

export default function Recommend() {
  const [style, setStyle] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendApiResponse | null>(null);
  const [cached, setCached] = useState<boolean>(false);
  const [lastPrompt, setLastPrompt] = useState<string>("");

  const outfitSubtotal = useMemo(() => {
    if (!result?.outfit?.length) return 0;
    return result.outfit.reduce((sum, product) => sum + product.price, 0);
  }, [result]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!style.trim()) {
      setError("Describe the look you want first");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ style }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Failed to fetch outfit");
      }

      setResult(payload);
      setCached(Boolean(payload.cached));
      setLastPrompt(style);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setResult(null);
      setCached(false);
      setError(err instanceof Error ? err.message : "Failed to fetch outfit");
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
        <header className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-blue-400">AI Outfit Recommendation</p>
          <h1 className="text-3xl font-semibold text-white">Describe your vibe, receive a styled look</h1>
          <p className="text-sm text-slate-300">
            GPT-4o analyzes your prompt, cross-references the AIStyleHub catalog, and assembles a cohesive outfit with
            shoppable links.
          </p>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              placeholder="e.g. elegant office wear with a pop of color"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Curating look…" : "Generate outfit"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {suggestionPills.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setStyle(suggestion)}
                className="rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-slate-200 transition hover:border-blue-500 hover:text-blue-300"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {error && (
            <p className="rounded-xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
        </form>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recommended outfit</h2>
            <p className="text-sm text-slate-300">
              {status === "success" && lastPrompt
                ? `Styled for “${lastPrompt}”`
                : "Your curated look will appear here after submitting a prompt."}
            </p>
          </div>
          {cached && (
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Cached insight
            </span>
          )}
        </header>

        <div className="mt-6 min-h-[260px]">
          {status === "idle" && (
            <p className="text-sm text-slate-400">
              Describe the destination, mood, or dress code you have in mind. The AI stylist will mix and match items
              that complement each other.
            </p>
          )}

          {status === "loading" && (
            <div className="text-sm text-slate-400">
              <p className="text-base font-semibold text-white">Assembling outfit…</p>
              <p className="mt-2">Consulting GPT-4o and filtering the product catalog for the perfect combination.</p>
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-rose-300">We couldn&apos;t create an outfit. Please refine your description and try again.</p>
          )}

          {status === "success" && result?.outfit?.length ? (
            <RecommendationResult result={result} subtotal={outfitSubtotal} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface RecommendationResultProps {
  result: RecommendApiResponse;
  subtotal: number;
}

function RecommendationResult({ result, subtotal }: RecommendationResultProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {result.outfit.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-white">Shopping links</h3>
          <ul className="mt-3 space-y-2">
            {result.shops.map((shop) => (
              <li key={`${shop.name}-${shop.productName}`} className="flex flex-wrap items-center justify-between gap-2">
                <span>{shop.productName}</span>
                <a
                  href={shop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  {shop.name}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
          <h3 className="text-base font-semibold text-white">Budget insight</h3>
          <p className="mt-2 text-sm">
            Estimated basket total:
            <span className="ml-2 text-lg font-semibold text-white">${subtotal.toFixed(2)}</span>
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Prices are indicative and sourced from the latest catalog sync. Visit shop links to confirm availability.
          </p>
        </div>
      </div>
    </div>
  );
}
