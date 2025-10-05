# AIStyleHub - Modern Fashion Platform

A beautiful, modern Next.js application with smooth animations, excellent UX, and AI-powered fashion features. Built with TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🎨 Modern Design System
- **Light/Dark Theme**: Automatic theme detection with manual toggle
- **Design Tokens**: Consistent spacing, colors, and typography
- **Responsive Design**: Mobile-first approach with adaptive breakpoints
- **Glassmorphism**: Subtle glass effects and modern aesthetics

### 🎭 Smooth Animations
- **Page Transitions**: Seamless navigation with Framer Motion
- **Micro-interactions**: Hover effects, button animations, and loading states
- **Staggered Animations**: Beautiful entrance animations for lists and grids
- **Reduced Motion**: Respects user's motion preferences

### 🧩 Reusable Components
- **Button Variants**: Multiple styles with loading states and animations
- **Card Components**: Hover effects and consistent styling
- **Modal System**: Accessible modals with focus management
- **Toast Notifications**: Stacked notifications with animations
- **Skeleton Loaders**: Beautiful loading states

### 📱 Pages & Features
- **Landing Page**: Hero section, feature cards, testimonials
- **Dashboard**: Collapsible sidebar, stat cards, data tables
- **Product Listing**: Grid view, filters, quick-view modal
- **Profile/Settings**: Multi-step forms with validation
- **Virtual Try-On**: AI-powered outfit visualization
- **Recommendations**: GPT-4o powered style suggestions

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper semantic markup
- **Screen Reader**: Optimized for assistive technologies
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Proper focus trapping and indicators

### 🤖 AI Features
- **Virtual Try-On (VTO):** Upload a portrait, select any catalog product, and Stable Diffusion renders a realistic overlay
- **AI Outfit Recommendations:** Submit a style prompt—GPT-4o suggests cohesive outfits mapped to live catalog products
- **Smart Shopping Links:** Each recommended product includes purchase-ready links to retailers
- **Rich Catalog Management:** Prisma-backed Postgres schema with seeded data
- **Performance & Resilience:** Response caching, file-size validation, and environment-isolated API keys

## 🧱 Tech Stack

### Core Framework
- **Next.js 15**: React framework with Pages Router
- **TypeScript**: Type-safe development
- **React 19**: Latest React features

### Styling & Design
- **Tailwind CSS v4**: Utility-first CSS framework
- **Design Tokens**: Consistent design system
- **CSS Variables**: Dynamic theming support

### Animations & Interactions
- **Framer Motion**: Smooth animations and transitions
- **Lottie**: Vector animations (optional)
- **CSS Transforms**: Hardware-accelerated animations

### UI Components
- **Radix UI**: Accessible component primitives
- **Headless UI**: Unstyled, accessible components
- **Lucide React**: Beautiful icons
- **Class Variance Authority**: Component variants

### Backend & Database
- **Next.js API routes**: Serverless functions
- **Prisma ORM**: Database management
- **PostgreSQL**: Database (local, Neon, or Render)

### AI Providers
- **Hugging Face**: Stable Diffusion for virtual try-on
- **OpenAI GPT-4o**: Outfit recommendations

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📁 Project Structure

```
aistylehub/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Animated button variants
│   │   ├── Card.tsx        # Card components with hover effects
│   │   ├── Modal.tsx       # Accessible modal system
│   │   ├── Toast.tsx       # Toast notifications
│   │   ├── Skeleton.tsx    # Loading skeletons
│   │   └── ThemeToggle.tsx # Theme switcher
│   ├── Layout.tsx          # Main layout with navigation
│   └── PageTransition.tsx  # Page transition wrapper
├── lib/
│   ├── utils.ts           # Utility functions & animation constants
│   ├── theme.tsx          # Theme provider & context
│   ├── accessibility.ts   # Accessibility utilities
│   ├── prisma.ts          # Database client
│   ├── cache.ts           # Response caching
│   ├── openai.ts          # OpenAI integration
│   └── huggingface.ts     # Hugging Face integration
├── pages/
│   ├── index.tsx          # Animated landing page
│   ├── dashboard.tsx      # Dashboard with sidebar
│   ├── products.tsx       # Product listing with filters
│   ├── profile.tsx        # Profile & settings
│   ├── try-on.tsx         # Virtual try-on page
│   ├── recommend.tsx      # AI recommendations
│   └── api/               # API routes
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seeding scripts
├── styles/
│   └── globals.css        # Global styles & design tokens
├── types/
│   └── index.ts           # TypeScript definitions
└── public/
    └── uploads/           # Generated try-on assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Pink (#ec4899)
- **Neutral**: Slate scale
- **Semantic**: Success, Warning, Error colors

### Typography
- **Font Family**: Geist Sans (system fallback)
- **Scale**: Consistent size progression
- **Weights**: 400, 500, 600, 700

### Spacing
- **Base Unit**: 0.25rem (4px)
- **Scale**: xs, sm, md, lg, xl, 2xl, 3xl
- **Container**: Max-width with responsive padding

### Animations
- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: Custom cubic-bezier curves
- **Reduced Motion**: Respects user preferences

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
