"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { AuthPermissions } from "@/types/auth";
import type { GuestbookEntry, GuestbookList } from "@/types/guestbook";

type Props = {
  permissions: AuthPermissions;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export default function GuestbookClient({ permissions }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const canDelete = permissions.delete;

  const stats = useMemo(
    () => [
      { label: "Messages", value: String(total) },
      { label: "Visible", value: String(entries.length) },
      { label: "Service", value: "Guestbook" },
    ],
    [entries.length, total]
  );

  async function loadEntries() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/guestbook", {
        cache: "no-store",
      });
      const payload = (await response.json()) as Partial<GuestbookList> & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load guestbook");
      }

      setEntries(payload.entries ?? []);
      setTotal(payload.total ?? 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load guestbook"
      );
      setEntries([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEntries();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const normalizedName = name.trim();
    const normalizedMessage = message.trim();

    if (normalizedName.length < 2 || normalizedMessage.length < 3) {
      setError("Добавьте имя и сообщение.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          message: normalizedMessage,
        }),
      });
      const payload = (await response.json()) as GuestbookEntry & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save message");
      }

      setEntries((prev) => [payload, ...prev]);
      setTotal((prev) => prev + 1);
      setName("");
      setMessage("");
      setNotice("Сообщение опубликовано. Спасибо!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save message");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteEntry(id: string) {
    setError(null);
    setNotice(null);

    const response = await fetch(`/api/guestbook/${id}`, {
      method: "DELETE",
    });
    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Failed to delete message");
      return;
    }

    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    setNotice("Сообщение удалено.");
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-[#121a2e] p-6 shadow-[var(--shadow)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
            Guestbook service
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Гостевая книга
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Небольшой публичный feedback-сервис: посетители оставляют
            сообщения, сайт показывает их через отдельный микросервис.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-slate-950/55 p-4"
              >
                <p className="text-2xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submitMessage}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-[var(--shadow)] sm:p-6"
        >
          <label className="grid gap-2 text-sm font-medium text-slate-200">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              required
              className="rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="Your name"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-200">
            Message
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={700}
              required
              rows={5}
              className="min-h-32 resize-y rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60"
              placeholder="Leave a short note, question, or feedback."
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </section>

      {notice && (
        <div className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-sm text-slate-400">
            Loading messages...
          </div>
        ) : entries.length ? (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {entry.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>

                {canDelete && (
                  <button
                    type="button"
                    onClick={() => void deleteEntry(entry.id)}
                    className="rounded-lg border border-red-300/20 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {entry.message}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
            <h2 className="text-xl font-semibold text-white">
              No messages yet
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Be the first person to leave a note.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
