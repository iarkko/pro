import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recipe Book",
  description:
    "Личная книга рецептов с фотографиями, пошаговым приготовлением и быстрым редактированием.",
};

const navItems = [
  { label: "Recipes", href: "/recipes" },
  { label: "New recipe", href: "/recipes?new=1" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0f172a] text-slate-100 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(20,184,166,0.18),transparent_30%),linear-gradient(180deg,#111827_0%,#0f172a_48%,#111827_100%)]">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111827]/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <Link href="/recipes" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-sm font-bold text-white shadow-lg shadow-teal-500/20">
                  RB
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    Recipe Book
                  </span>
                  <span className="block text-xs text-slate-400">
                    Рецепты, шаги и фотографии
                  </span>
                </span>
              </Link>

              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
