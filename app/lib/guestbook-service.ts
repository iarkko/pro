import "server-only";

const defaultGuestbookUrl = "http://127.0.0.1:4001";

export function guestbookUrl(path: string) {
  const baseUrl = process.env.GUESTBOOK_SERVICE_URL ?? defaultGuestbookUrl;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBase);
}

export function guestbookAdminHeaders(): HeadersInit {
  const devAdminToken =
    process.env.NODE_ENV === "production" ? "" : "dev-guestbook-token";
  const token = process.env.GUESTBOOK_ADMIN_TOKEN ?? devAdminToken;

  return token
    ? {
        "x-guestbook-admin-token": token,
      }
    : {};
}
