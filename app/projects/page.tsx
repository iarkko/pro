import Link from "next/link";

const projects = [
  {
    title: "Recipe Book",
    status: "Live",
    description:
      "Подпроект для хранения рецептов: создание, редактирование, удаление, обложки, шаги приготовления и фотографии к каждому шагу.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Uploads"],
    href: "/recipes",
  },
  {
    title: "Todo App",
    status: "Live",
    description:
      "Отдельный подпроект для задач с приоритетами, сроками, выполнением, удалением и хранением в PostgreSQL.",
    tags: ["Next.js", "Prisma", "PostgreSQL"],
    href: "/todo",
  },
  {
    title: "Guestbook Service",
    status: "Live",
    description:
      "Публичная гостевая книга на отдельном HTTP-микросервисе с health, readiness и Prometheus-ready метриками.",
    tags: ["Microservice", "Node.js", "Observability"],
    href: "/guestbook",
  },
  {
    title: "DevOps Lab",
    status: "Planned",
    description:
      "Песочница для Docker, Kubernetes, Prometheus, Grafana, ELK и production-like деплоев.",
    tags: ["Docker", "Kubernetes", "Observability"],
    href: "/#devops",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-lg border border-white/10 bg-[#121a2e] p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
          Projects
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Подпроекты сайта
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Главная страница остаётся основным сайтом, а здесь собраны отдельные
          модули и приложения. Сейчас полноценным live-подпроектом является
          книга рецептов.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex min-h-80 flex-col justify-between rounded-lg border border-white/10 bg-white/[0.04] p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">
                  {project.title}
                </h2>
                <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  {project.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {project.description}
              </p>
            </div>

            <div>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10"
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
    </div>
  );
}
