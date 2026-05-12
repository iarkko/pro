import Link from "next/link";

const metrics = [
  { value: "99.95%", label: "Uptime target" },
  { value: "12", label: "Dashboards" },
  { value: "4m", label: "MTTR drills" },
  { value: "36", label: "Deploys / mo" },
];

const stack = [
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "Kubernetes",
  "Prometheus",
  "Grafana",
  "ELK",
];

const projects = [
  {
    title: "Recipe Book",
    description:
      "Книга рецептов с CRUD, обложками, пошаговым приготовлением и фотографиями к шагам.",
    tags: ["Next.js", "Prisma", "PostgreSQL"],
    href: "/recipes",
  },
  {
    title: "Todo App",
    description:
      "Планировщик задач с приоритетами, фильтрами и понятной моделью ежедневной работы.",
    tags: ["TypeScript", "API", "Product"],
    href: "/projects",
  },
  {
    title: "DevOps Lab",
    description:
      "Лаборатория инфраструктуры: контейнеризация, мониторинг, алерты и наблюдаемость сервисов.",
    tags: ["Docker", "Kubernetes", "Grafana"],
    href: "/projects",
  },
];

const notes = [
  "Проектирую API так, чтобы фронтенду не приходилось угадывать состояние.",
  "Собираю observability вокруг вопросов, на которые реально нужно отвечать.",
  "Люблю маленькие деплои, понятные rollback-пути и инфраструктуру без магии.",
];

export default function Page() {
  return (
    <div className="space-y-16 pb-12">
      <section className="grid gap-6 pt-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-white/10 bg-[#121a2e]/90 p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
            Backend / DevOps Engineer
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Строю веб-продукты и инфраструктуру, которая спокойно держит
            нагрузку.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Это основной сайт-портфолио. Внутри него живут подпроекты:
            продуктовые приложения, DevOps-лаборатория и книга рецептов как
            отдельный полноценный модуль.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-lg bg-[#5b8cff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#6f9cff]"
            >
              Смотреть проекты
            </a>
            <Link
              href="/recipes"
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-200/40 hover:bg-white/5"
            >
              Открыть рецепты
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {stack.slice(0, 6).map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside
          id="devops"
          className="rounded-lg border border-white/10 bg-[#11172a]/95 p-5 shadow-[var(--shadow)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                DevOps Snapshot
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Production-style telemetry view
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Stable
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-white/10 bg-white/10">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-[#0f1527] p-4">
                <p className="text-2xl font-semibold text-white">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-[#0b1020] p-4">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Deploy pipeline</span>
              <span className="text-cyan-200">18m avg</span>
            </div>
            <div className="space-y-3">
              {["Build", "Test", "Scan", "Deploy"].map((step, index) => (
                <div key={step} className="grid grid-cols-[64px_1fr] gap-3">
                  <span className="text-xs text-slate-400">{step}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-[#5b8cff] to-emerald-300"
                      style={{ width: `${92 - index * 11}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-6 items-end gap-2 rounded-lg border border-white/10 bg-[#0b1020] p-4">
            {[34, 50, 42, 68, 58, 78].map((height, index) => (
              <span
                key={height + index}
                className="rounded-sm bg-cyan-300/80"
                style={{ height }}
              />
            ))}
          </div>
        </aside>
      </section>

      <section
        id="projects"
        className="scroll-mt-28 rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
              Projects
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Подпроекты основного сайта
            </h2>
          </div>
          <Link
            href="/projects"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
          >
            Все проекты
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex min-h-64 flex-col justify-between rounded-lg border border-white/10 bg-[#121a2e] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={project.href}
                  className="mt-5 inline-flex rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                >
                  Открыть
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-28 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-[#121a2e] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
            About
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Инженерный подход к продуктовой скорости
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            Мне нравится строить системы, где архитектура помогает двигаться
            быстрее: ясные границы модулей, предсказуемые деплои, измеримые
            метрики и интерфейсы, которые не заставляют пользователя разбираться
            в устройстве приложения.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#0f1527] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
            Stack
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-28">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
            Notes
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Заметки из разработки
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm leading-6 text-slate-300">{note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
