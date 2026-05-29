import type { Metadata } from "next";
import { requireOwnerPage } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import {
  createClient,
  deleteClient,
  resetClientPassword,
  updateClientPermissions,
} from "@/app/admin/users/actions";

export const metadata: Metadata = {
  title: "Admin Users | Iaroslav Gritsenko",
  description: "Управление клиентами и правами доступа к сайту.",
};

function permissionTone(enabled: boolean) {
  return enabled
    ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
    : "border-white/10 bg-white/5 text-slate-500";
}

export default async function AdminUsersPage() {
  const owner = await requireOwnerPage("/admin/users");
  const users = await prisma.authUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          sessions: true,
        },
      },
    },
  });

  const clients = users.filter((user) => user.role !== "owner");
  const owners = users.filter((user) => user.role === "owner");

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-lg border border-white/10 bg-[#121a2e] p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Клиенты и права
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Эта панель доступна только owner-аккаунту. Здесь можно создавать
          клиентов, менять права `read`, `create`, `delete`, сбрасывать пароль
          и удалять клиентские учетные записи.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(owner.permissions).map(([permission, enabled]) => (
            <span
              key={permission}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${permissionTone(
                enabled
              )}`}
            >
              {permission}: {enabled ? "yes" : "no"}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          action={createClient}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-[var(--shadow)] sm:p-6"
        >
          <h2 className="text-xl font-semibold text-white">Новый клиент</h2>

          <label className="mt-5 grid gap-2 text-sm font-medium text-slate-200">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="client@example.com"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
            Name
            <input
              name="name"
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="Client name"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="Temporary password"
            />
          </label>

          <div className="mt-5 grid gap-3 text-sm text-slate-200">
            {[
              ["canRead", "Read"],
              ["canCreate", "Create"],
              ["canDelete", "Delete"],
            ].map(([name, label]) => (
              <label
                key={name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3"
              >
                <span>{label}</span>
                <input
                  name={name}
                  type="checkbox"
                  defaultChecked={name === "canRead"}
                  className="h-4 w-4 accent-cyan-400"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
          >
            Create client
          </button>
        </form>

        <div className="rounded-lg border border-white/10 bg-[#11172a] p-5 shadow-[var(--shadow)] sm:p-6">
          <h2 className="text-xl font-semibold text-white">Owner access</h2>
          <div className="mt-4 space-y-3">
            {owners.map((user) => (
              <article
                key={user.id}
                className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {user.name ?? user.email}
                    </h3>
                    <p className="mt-1 text-sm text-cyan-100/80">
                      {user.email}
                    </p>
                  </div>
                  <span className="rounded-full border border-cyan-200/30 px-3 py-1 text-xs font-semibold text-cyan-100">
                    owner
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Clients
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Список клиентов
            </h2>
          </div>
          <span className="text-sm text-slate-500">
            {clients.length} account{clients.length === 1 ? "" : "s"}
          </span>
        </div>

        {clients.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {clients.map((user) => (
              <article
                key={user.id}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {user.name ?? user.email}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                    {user.role}
                  </span>
                </div>

                <form action={updateClientPermissions} className="mt-5">
                  <input type="hidden" name="id" value={user.id} />

                  <label className="grid gap-2 text-sm font-medium text-slate-200">
                    Display name
                    <input
                      name="name"
                      defaultValue={user.name ?? ""}
                      className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-200/60"
                      placeholder="Client name"
                    />
                  </label>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      ["canRead", "Read", user.canRead],
                      ["canCreate", "Create", user.canCreate],
                      ["canDelete", "Delete", user.canDelete],
                    ].map(([name, label, enabled]) => (
                      <label
                        key={String(name)}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/45 px-3 py-3 text-sm text-slate-200"
                      >
                        <span>{label}</span>
                        <input
                          name={String(name)}
                          type="checkbox"
                          defaultChecked={Boolean(enabled)}
                          className="h-4 w-4 accent-emerald-400"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                    >
                      Save rights
                    </button>
                    <span className="text-xs text-slate-500">
                      active sessions: {user._count.sessions}
                    </span>
                  </div>
                </form>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <form action={resetClientPassword} className="flex gap-2">
                    <input type="hidden" name="id" value={user.id} />
                    <input
                      name="password"
                      type="password"
                      minLength={8}
                      required
                      className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
                      placeholder="New password"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-cyan-300/20 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/10"
                    >
                      Reset
                    </button>
                  </form>

                  <form action={deleteClient}>
                    <input type="hidden" name="id" value={user.id} />
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-red-300/20 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
            <h3 className="text-xl font-semibold text-white">
              Клиентов пока нет
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Создай первого клиента через форму выше и выдай ему нужный набор
              прав.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
