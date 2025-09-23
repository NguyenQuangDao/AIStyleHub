import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/try-on", label: "Virtual Try-On" },
  { href: "/recommend", label: "AI Recommendations" },
];

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>AIStyleHub</title>
        <meta
          name="description"
          content="AI-powered fashion platform for virtual try-on and outfit recommendations."
        />
      </Head>
      <div className="min-h-screen bg-slate-950/90 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
              AIStyleHub
            </Link>
            <nav className="flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-t border-slate-800 bg-slate-950/95">
          <div className="mx-auto flex max-w-6xl justify-between px-6 py-6 text-sm text-slate-400">
            <p>© {new Date().getFullYear()} AIStyleHub. All rights reserved.</p>
            <p>Crafted with AI-driven style intelligence.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Layout;
