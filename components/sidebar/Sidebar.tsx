import Link from "next/link";

export default function Sidebar() {
  const items = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "Projects", href: "/projects", icon: "📁" },
    { label: "Recipes", href: "/recipes", icon: "🍲" },
  ];

  return (
    <aside className="w-20 md:w-72 border-r border-white/10 bg-[#0A0F1C] p-3 md:p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-8 md:mb-10 flex items-center justify-center md:justify-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
            IG
          </div>
          <div className="hidden md:block">
            <p className="font-semibold">Iaroslav Gritsenko</p>
            <p className="text-xs text-white/40">Fullstack Developer</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center md:justify-start gap-2 px-2 md:px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              <span className="text-base">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>

      </div>

      {/* BOTTOM */}
      <div className="hidden md:block text-xs text-white/30">
        © {new Date().getFullYear()} IG Portfolio
      </div>

    </aside>
  );
}
