import type { Metadata } from "next";
import { getCurrentUser } from "@/app/lib/auth";
import GuestbookClient from "@/components/guestbook/GuestbookClient";
import type { AuthPermissions } from "@/types/auth";

export const metadata: Metadata = {
  title: "Guestbook | Iaroslav Gritsenko",
  description:
    "Публичная гостевая книга сайта, работающая через отдельный микросервис.",
};

const publicPermissions: AuthPermissions = {
  read: true,
  create: false,
  delete: false,
};

export default async function GuestbookPage() {
  const user = await getCurrentUser();

  return (
    <GuestbookClient permissions={user?.permissions ?? publicPermissions} />
  );
}
