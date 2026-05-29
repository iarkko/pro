import type { Metadata } from "next";
import { connection } from "next/server";
import { hasPermission, requirePagePermission } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  createTodoTask,
  deleteTodoTask,
  toggleTodoTask,
} from "@/app/todo/actions";

export const metadata: Metadata = {
  title: "Todo Board | Iaroslav Gritsenko",
  description:
    "Отдельная ToDo-страница портфолио с задачами, сохраненными в PostgreSQL.",
};

const priorityMeta = {
  high: {
    label: "High",
    tone: "border-rose-300/30 bg-rose-400/10 text-rose-100",
  },
  medium: {
    label: "Medium",
    tone: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  },
  low: {
    label: "Low",
    tone: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  },
};

function formatDueDate(date: Date | null) {
  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function getPriorityMeta(priority: string) {
  return priorityMeta[priority as keyof typeof priorityMeta] ?? priorityMeta.medium;
}

export default async function TodoPage() {
  const user = await requirePagePermission("read", "/todo");
  await connection();

  const tasks = await prisma.todoTask.findMany({
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.length - openTasks.length;
  const highPriorityTasks = openTasks.filter(
    (task) => task.priority === "high"
  ).length;
  const canCreate = hasPermission(user, "create");
  const canDelete = hasPermission(user, "delete");

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-white/10 bg-[#121a2e] p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Todo board
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Задачи в базе данных
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Отдельный подпроект для быстрых рабочих задач: создание, хранение в
            PostgreSQL, отметка выполнения и удаление.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
              <p className="text-2xl font-semibold text-white">
                {openTasks.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">Open</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
              <p className="text-2xl font-semibold text-white">
                {completedTasks}
              </p>
              <p className="mt-1 text-xs text-slate-500">Done</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
              <p className="text-2xl font-semibold text-white">
                {highPriorityTasks}
              </p>
              <p className="mt-1 text-xs text-slate-500">High priority</p>
            </div>
          </div>
        </div>

        {canCreate ? (
          <form
            action={createTodoTask}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-[var(--shadow)] sm:p-6"
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-200">
                Title
                <input
                  name="title"
                  required
                  maxLength={120}
                  placeholder="Deploy Grafana dashboards"
                  className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-200/60"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-200">
                Description
                <textarea
                  name="description"
                  rows={4}
                  maxLength={500}
                  placeholder="Short context, acceptance criteria or command notes"
                  className="min-h-28 resize-y rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-200/60"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  Priority
                  <select
                    name="priority"
                    defaultValue="medium"
                    className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-200/60"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-200">
                  Due date
                  <input
                    type="date"
                    name="dueDate"
                    className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-200/60"
                  />
                </label>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                >
                  Add task
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400 shadow-[var(--shadow)] sm:p-6">
            У вашей учетной записи есть доступ на чтение задач, но нет права на
            создание или изменение.
          </div>
        )}
      </section>

      <section className="space-y-4">
        {tasks.length ? (
          tasks.map((task) => {
            const priority = getPriorityMeta(task.priority);

            return (
              <article
                key={task.id}
                className={`grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 transition ${
                  task.completed ? "opacity-60" : "hover:border-emerald-200/30"
                } lg:grid-cols-[1fr_auto] lg:items-start`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${priority.tone}`}
                    >
                      {priority.label}
                    </span>
                    <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
                      {formatDueDate(task.dueDate)}
                    </span>
                    {task.completed && (
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                        Done
                      </span>
                    )}
                  </div>

                  <h2
                    className={`mt-4 text-xl font-semibold text-white ${
                      task.completed ? "line-through decoration-white/40" : ""
                    }`}
                  >
                    {task.title}
                  </h2>

                  {task.description && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                      {task.description}
                    </p>
                  )}
                </div>

                {(canCreate || canDelete) && (
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {canCreate && (
                      <form action={toggleTodoTask}>
                        <input type="hidden" name="id" value={task.id} />
                        <input
                          type="hidden"
                          name="completed"
                          value={String(!task.completed)}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                        >
                          {task.completed ? "Reopen" : "Done"}
                        </button>
                      </form>
                    )}

                    {canDelete && (
                      <form action={deleteTodoTask}>
                        <input type="hidden" name="id" value={task.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-300/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
            <h2 className="text-xl font-semibold text-white">No tasks yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Add the first task and it will be saved in PostgreSQL.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
