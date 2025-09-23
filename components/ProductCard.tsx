import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  selected?: boolean;
  onSelect?: (product: Product) => void;
  footer?: ReactNode;
}

export function ProductCard({ product, selected = false, onSelect, footer }: ProductCardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border transition duration-150 ${
        selected ? "border-blue-500 bg-blue-600/10" : "border-slate-800 bg-slate-900/60 hover:border-blue-500/60"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect?.(product)}
        className="relative h-52 w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </button>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-300/80">{product.type}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-300">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-400">
          {product.styleTags.map((tag) => (
            <span key={`${product.id}-${tag}`} className="rounded-full border border-slate-700 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 text-sm">
          <Link
            href={product.shop.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 transition hover:text-blue-300"
          >
            {product.shop.name}
            <span aria-hidden>↗</span>
          </Link>
          {footer}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
