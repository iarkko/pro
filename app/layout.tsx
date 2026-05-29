import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Iaroslav Gritsenko | Backend & DevOps Portfolio",
  description:
    "Основной сайт-портфолио backend/fullstack разработчика с подпроектами, включая книгу рецептов.",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Todo", href: "/todo" },
  { label: "Recipes", href: "/recipes" },
  { label: "Guestbook", href: "/guestbook" },
  { label: "DevOps Lab", href: "/#devops" },
  { label: "Admin", href: "/admin/users" },
  { label: "About", href: "/#about" },
  { label: "Login", href: "/login" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0b1020] text-slate-100 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(91,140,255,0.18),transparent_34%),linear-gradient(180deg,#0b1020_0%,#0d1426_52%,#101827_100%)]">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1020]/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5b8cff] text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                  IG
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    Iaroslav Gritsenko
                  </span>
                  <span className="block text-xs text-slate-400">
                    Backend / DevOps Engineer
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
