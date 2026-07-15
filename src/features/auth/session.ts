import { cookies } from "next/headers";

export const AUTH_SESSION_COOKIE = "assetlens_session";

export type AuthSession = {
  email: string;
  name: string;
  role: string;
  tenantName: string;
  userId: string;
};

export function encodeAuthSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeAuthSession(value: string) {
  try {
    return JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as AuthSession;
  } catch {
    return null;
  }
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  return decodeAuthSession(value);
}
