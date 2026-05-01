import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f1a] text-white">
        <div className="flex min-h-screen">

          {/* SIDEBAR */}
          <aside className="w-72 border-r border-white/10 bg-[#0a0e17] p-6 flex flex-col justify-between">
            {/* Top */}
            <div>

              {/* Logo */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
                  IG
                </div>
                <div>
                  <p className="font-semibold">Iaroslav Gritsenko</p>
                  <p className="text-xs text-gray-400">DevOps engineer</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex flex-col gap-2 text-sm">
                {[
                  "Home",
                  "About",
                  "Projects",
                  "Tech Stack",
                  "Cookbook",
                  "Blog",
                  "Contact",
                ].map((item) => {
                  let href = "/";

                  if (item === "Cookbook") href = "/cookbook";

                  return (
                    <Link
                      key={item}
                      href={href}
                      className="px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
                    >
                      {item}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom */}
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Iaroslav Gritsenko
            </div>

          </aside>

          {/* MAIN */}
          <main className="flex-1 p-8 bg-gradient-to-b from-[#0b0f1a] to-[#0a0e17]">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-10">

              <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                ● Available for opportunities
              </div>

              <div className="flex items-center gap-4">

                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm">
                  Download CV
                </button>

                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                  IG
                </div>

              </div>

            </div>

            {/* CONTENT */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}