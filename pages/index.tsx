import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-10 text-white shadow-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Elevate your wardrobe with AIStyleHub
        </h1>
        <p className="mt-4 text-lg text-slate-200">
          Discover AI-powered outfit recommendations and virtual try-on experiences driven by
          Stable Diffusion and GPT-4o.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/try-on"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-slate-200"
          >
            Try-On Experience
          </Link>
          <Link
            href="/recommend"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Get Outfit Recommendations
          </Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-white">Virtual Try-On</h2>
          <p className="mt-2 text-sm text-slate-300">
            Upload your photo and visualize products with precision using Stable Diffusion image-to-image
            workflows.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-white">AI Outfit Recommendations</h2>
          <p className="mt-2 text-sm text-slate-300">
            Describe your desired style and allow GPT-4o to curate cohesive outfits mapped to our product
            catalog.
          </p>
        </div>
      </div>
    </section>
  );
}
