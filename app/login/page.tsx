import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, normalizeNextPath } from "@/app/lib/auth";
import { login, logout } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "Login | Iaroslav Gritsenko",
  description: "Авторизация для управления подпроектами сайта.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "У этой учетной записи нет нужного права для выбранного раздела.",
  invalid: "Неверный email или пароль.",
  missing: "Введите email и пароль.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const nextPath = normalizeNextPath(params.next ?? "/");
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-12">
      <section className="rounded-lg border border-white/10 bg-[#121a2e] p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
          Access
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Авторизация
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          Вход нужен для приватных разделов и операций создания, изменения и
          удаления контента.
        </p>
      </section>

      {errorMessage && (
        <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          {errorMessage}
        </div>
      )}

      {user ? (
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Вы вошли как</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {Object.entries(user.permissions).map(([permission, enabled]) => (
              <span
                key={permission}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  enabled
                    ? "bg-emerald-300/10 text-emerald-100 ring-emerald-300/25"
                    : "bg-white/5 text-slate-500 ring-white/10"
                }`}
              >
                {permission}: {enabled ? "yes" : "no"}
              </span>
            ))}
          </div>

          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="rounded-lg border border-red-300/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </form>
        </section>
      ) : (
        <form
          action={login}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-[var(--shadow)]"
        >
          <input type="hidden" name="next" value={nextPath} />

          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="you@example.com"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-[#5b8cff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#6f9cff]"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-slate-400">
            Нет аккаунта?{" "}
            <Link
              href={`/register?next=${encodeURIComponent(nextPath)}`}
              className="font-semibold text-cyan-200 hover:text-white"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
