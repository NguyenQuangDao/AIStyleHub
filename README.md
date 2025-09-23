# AIStyleHub

AIStyleHub is an AI-driven fashion experience built with Next.js. Shoppers can generate virtual try-ons powered by Stable Diffusion, receive GPT-4o curated outfits, and jump directly to partner stores through smart shopping links. The project is optimized for Vercel hosting with a Postgres database managed via Prisma.

## 🚀 Features

- **Virtual Try-On (VTO):** Upload a portrait, select any catalog product, and Stable Diffusion (Hugging Face Inference) renders a realistic overlay. Results are cached and persisted for quick comparisons.
- **AI Outfit Recommendations:** Submit a style prompt—GPT-4o suggests cohesive outfits mapped to live catalog products and shops.
- **Smart Shopping Links:** Each recommended product includes purchase-ready links to retailers such as Zara, H&M, Shopee, and more.
- **Rich Catalog Management:** Prisma-backed Postgres schema with seeded data covering 10 shops and 50 products tagged by style.
- **Performance & Resilience:** Response caching, file-size validation, and environment-isolated API keys keep the UX responsive and secure.

## 🧱 Tech Stack

- **Frontend:** Next.js 15 (Pages Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (local, Neon, or Render)
- **AI Providers:** Hugging Face (`stabilityai/stable-diffusion-2`), OpenAI GPT-4o
- **Deployment Targets:** Vercel (web + serverless APIs) and Neon/Render for managed Postgres

## 📁 Key Structure

```
aistylehub/
├── components/        # Reusable UI (layout, try-on, recommendation, product cards)
├── pages/             # Pages Router views and API routes
├── prisma/            # Schema & seeding scripts
├── public/uploads/    # Generated try-on assets (runtime)
├── lib/               # Prisma client, caching, AI helpers
├── styles/            # Global Tailwind styles
├── types/             # Shared TypeScript types
└── .env.example       # Environment variable template
```

## ⚙️ Prerequisites

- Node.js 18+
- npm (or compatible package manager)
- PostgreSQL instance (local or hosted)
- Hugging Face Inference API key
- OpenAI API key with access to GPT-4o

## 🔧 Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Update DATABASE_URL, HF_API_KEY, OPENAI_API_KEY
   ```

3. **Generate Prisma client & sync schema**
   ```bash
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to explore AIStyleHub.

## 📡 API Summary

| Endpoint            | Method | Description |
|---------------------|--------|-------------|
| `/api/products`     | GET    | Returns the latest product catalog with shop metadata. Cached for 10 minutes. |
| `/api/try-on`       | POST   | `{ userImage (Base64), productId }` → Generates Stable Diffusion overlay, persists an outfit, returns shop info. |
| `/api/recommend`    | POST   | `{ style }` → GPT-4o chooses catalog product IDs, stores an outfit, and returns products + shop links. |

### Try-On Request Example
```json
{
  "userImage": "data:image/png;base64,iVBORw0...",
  "productId": 12
}
```

### Recommendation Request Example
```json
{
  "style": "casual beach afternoon"
}
```

## 🧪 Testing the Experience

- **Virtual Try-On:** Upload a PNG/JPEG portrait (<5 MB), pick a product, and verify the generated overlay image in the right-hand preview panel.
- **Outfit Recommendation:** Provide prompts such as “minimalist office look” or “sunset beach dress” and confirm returned products plus retailer links.
- **Shop Links:** Each product card contains outbound links—confirm they resolve to live retailer experiences.

## 🛡️ Security & Performance Notes

- API keys are read from `.env.local` and never exposed client-side.
- User uploads are validated for type and size, stored only when generating overlays, and written to `public/uploads` for local previewing.
- Hugging Face and OpenAI responses are cached to mitigate rate limits and accelerate repeated requests.
- Remote images are wrapped with `next/image` for optimized delivery; local renders are generated once per request and reused via the cache.

## 📦 Available Scripts

| Script              | Purpose |
|---------------------|---------|
| `npm run dev`       | Launches Next.js in development mode |
| `npm run build`     | Builds the production bundle |
| `npm run start`     | Starts the production server |
| `npm run lint`      | Runs ESLint checks |
| `npm run prisma:generate` | Generates Prisma client |
| `npm run db:push`   | Pushes schema changes to the database |
| `npm run db:seed`   | Seeds shops and products |

## 🚀 Deployment

1. **Vercel**
   - Import the repository and select the Next.js preset.
   - Add environment variables (`DATABASE_URL`, `HF_API_KEY`, `OPENAI_API_KEY`).
   - Configure Root Directory if necessary and deploy.

2. **Database Hosting**
   - **Neon** or **Render** Postgres: create a new database, copy the connection string, and update `DATABASE_URL` in production settings.
   - Run migrations/seeds through a one-off job (`npm run db:push` + `npm run db:seed`) pointed at the production database.

3. **File Storage**
   - For production deployments, route generated try-on images to object storage (S3, R2) instead of local `/public/uploads`. The current implementation stores locally for development simplicity.

## 🔮 Extending AIStyleHub

- Replace the placeholder Stable Diffusion workflow with a dedicated virtual try-on model.
- Introduce authentication and user wardrobes (NextAuth already included as a dependency).
- Add outfit history, likes, or social sharing.
- Integrate inventory availability checks per retailer before surfacing links.

---
Crafted to showcase an end-to-end AI fashion journey—happy styling!
