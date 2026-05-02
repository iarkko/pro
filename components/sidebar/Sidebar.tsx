import Link from "next/link";

export default function Sidebar() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Recipes", href: "/recipes" },
  ];

  return (
    <aside className="w-72 border-r border-white/10 bg-[#0A0F1C] p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
            IG
          </div>
          <div>
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
              className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

      </div>

      {/* BOTTOM */}
      <div className="text-xs text-white/30">
        © {new Date().getFullYear()} IG Portfolio
      </div>

    </aside>
  );
}