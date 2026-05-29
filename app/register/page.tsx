import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, normalizeNextPath } from "@/app/lib/auth";
import { register } from "./actions";

export const metadata: Metadata = {
  title: "Register | Iaroslav Gritsenko",
  description: "Регистрация новой учетной записи для доступа к приватным разделам.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  emailTaken: "Этот email уже зарегистрирован.",
  missing: "Пожалуйста, заполните все поля.",
  passwordMismatch: "Пароли не совпадают.",
  short: "Пароль должен быть минимум 8 символов.",
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const nextPath = normalizeNextPath(params.next ?? "/");
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-12">
      <section className="rounded-lg border border-white/10 bg-[#121a2e] p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
          Register
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Создать аккаунт
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          Зарегистрируйтесь, чтобы затем войти и получить доступ к приватным разделам.
        </p>
      </section>

      {errorMessage && (
        <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          {errorMessage}
        </div>
      )}

      {user ? (
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Вы уже вошли как</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              На главную
            </Link>
          </div>
        </section>
      ) : (
        <form
          action={register}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-[var(--shadow)]"
        >
          <input type="hidden" name="next" value={nextPath} />

          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Имя
            <input
              name="name"
              type="text"
              autoComplete="name"
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="Ваше имя"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
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
            Пароль
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="••••••••"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
            Повторите пароль
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-[#5b8cff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#6f9cff]"
          >
            Зарегистрироваться
          </button>

          <p className="mt-4 text-sm text-slate-400">
            Уже есть аккаунт?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(nextPath)}`}
              className="font-semibold text-cyan-200 hover:text-white"
            >
              Войти
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
