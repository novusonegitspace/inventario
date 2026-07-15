"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AUTH_SESSION_COOKIE,
  encodeAuthSession,
  type AuthSession,
} from "@/src/features/auth/session";

export type LoginFormState =
  | {
      email?: string;
      error?: string;
    }
  | undefined;

const DEMO_LOGIN = {
  email: "admin@assetlens.local",
  name: "Jose Rodrigues",
  password: "Demo1234!",
  role: "tenant_admin",
  tenantName: "Novus One",
  userId: "demo-admin-001",
} satisfies AuthSession & { password: string };

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      email,
      error: "Completa email y contraseña para entrar.",
    };
  }

  if (email !== DEMO_LOGIN.email || password !== DEMO_LOGIN.password) {
    return {
      email,
      error: "El correo o la contraseña no son válidos.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_SESSION_COOKIE,
    encodeAuthSession({
      email: DEMO_LOGIN.email,
      name: DEMO_LOGIN.name,
      role: DEMO_LOGIN.role,
      tenantName: DEMO_LOGIN.tenantName,
      userId: DEMO_LOGIN.userId,
    }),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_SESSION_COOKIE);

  redirect("/login");
}
