import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import ProductCard from "@/components/ProductCard";
import type { Outfit, Product, Shop } from "@/types";

interface TryOnApiResponse {
  outfit: Outfit;
  shop: Shop;
  cached?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function TryOn() {
  const [products, setProducts] = useState<Product[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TryOnApiResponse | null>(null);
  const [cached, setCached] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to load catalog");
        }
        const payload = await response.json();
        if (!cancelled) {
          setProducts(payload.products ?? []);
          if (payload.products?.length) {
            setSelectedProductId((prev) => prev ?? payload.products[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load catalog");
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((product) => types.add(product.type));
    return ["all", ...Array.from(types)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (typeFilter === "all") return products;
    return products.filter((product) => product.type === typeFilter);
  }, [products, typeFilter]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelectedProductId(null);
      return;
    }
    if (!selectedProductId || !filteredProducts.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(filteredProducts[0].id);
    }
  }, [filteredProducts, selectedProductId]);

  const selectedProduct = filteredProducts.find((product) => product.id === selectedProductId);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setResult(null);
    setCached(false);

    if (!file) {
      setUserImagePreview(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a PNG or JPEG image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be under 5MB");
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setUserImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setError("Unable to read the selected image");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userImagePreview) {
      setError("Please upload an image to continue");
      return;
    }

    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }

    setStatus("loading");
    setError(null);
    setCached(false);

    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImage: userImagePreview,
          productId: selectedProductId,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Failed to generate try-on");
      }

      setResult(payload);
      setCached(Boolean(payload.cached));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setResult(null);
      setCached(false);
      setError(err instanceof Error ? err.message : "Failed to generate try-on");
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl">
          <header className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-blue-400">Virtual Try-On</p>
            <h1 className="text-3xl font-semibold text-white">Try products on your own portrait</h1>
            <p className="text-sm text-slate-300">
              Upload a clear, front-facing image and select a product to visualize how it looks on you. Files remain
              on your device until you trigger the AI overlay.
            </p>
          </header>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Upload portrait</span>
              <input
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleFileChange}
                className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-blue-500"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filter by product type</span>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All products" : type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Choose product</span>
                <select
                  value={selectedProductId ?? ""}
                  onChange={(event) => setSelectedProductId(Number(event.target.value))}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedProduct && (
              <div className="grid gap-4 md:grid-cols-2">
                <ProductCard product={selectedProduct} />
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                  <h3 className="text-base font-semibold text-white">Workflow tips</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                      Use well-lit, front-facing portraits for best alignment.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                      Keep file sizes under 5MB. PNG offers sharper edges for overlays.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                      Try multiple products to compare silhouettes and textures.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !selectedProductId || !userImagePreview}
              className={classNames(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition",
                status === "loading"
                  ? "bg-blue-500/80"
                  : "bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
                (!selectedProductId || !userImagePreview) && status !== "loading" ? "cursor-not-allowed opacity-60" : ""
              )}
            >
              {status === "loading" ? "Processing image…" : "Generate AI Try-On"}
            </button>
          </form>
        </div>

        {userImagePreview && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">Your uploaded photo</h2>
            <p className="text-sm text-slate-400">Used once for the inference request and never stored on the server.</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-black/50">
              <Image
                src={userImagePreview}
                alt="Uploaded user portrait preview"
                width={640}
                height={640}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-6">
        <div className="h-full rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">AI overlay preview</h2>
              <p className="text-sm text-slate-300">
                The generated image combines your portrait with the selected product using Stable Diffusion image-to-image.
              </p>
            </div>
            {cached && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Cached result
              </span>
            )}
          </header>

          <div className="mt-6 flex h-[520px] items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
            {status === "loading" && (
              <div className="text-center text-sm text-slate-400">
                <p className="text-base font-semibold text-white">Generating overlay…</p>
                <p className="mt-2">Stable Diffusion is rendering your outfit. This can take a few seconds.</p>
              </div>
            )}

            {status === "success" && result?.outfit?.imageUrl && (
              <Image
                src={result.outfit.imageUrl}
                alt="AI virtual try-on result"
                width={640}
                height={640}
                className="h-full w-full object-cover"
              />
            )}

            {status === "idle" && (
              <p className="max-w-xs text-center text-sm text-slate-400">
                Upload a portrait and select a product to generate your virtual try-on experience.
              </p>
            )}

            {status === "error" && (
              <p className="text-center text-sm text-rose-300">We couldn&apos;t generate the try-on. Please try again.</p>
            )}
          </div>

          {result?.outfit && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Outfit details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {result.outfit.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p>
                  Shop this look at
                  <a
                    href={result.shop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    {result.shop.name}
                    <span aria-hidden>↗</span>
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
