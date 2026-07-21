"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronRight } from "lucide-react";

import {
  login,
  type LoginFormState,
} from "@/src/features/auth/actions";

const initialState: LoginFormState = undefined;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-16 w-full items-center justify-between rounded-lg border border-[#d8e0ec] bg-white px-5 text-base font-semibold text-[#344054] shadow-[0_18px_42px_rgba(20,55,90,0.10)] transition hover:border-[#16b8ac] hover:shadow-[0_22px_48px_rgba(20,55,90,0.14)] disabled:cursor-wait disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      <span className="inline-flex items-center gap-4">
        <Image
          alt=""
          aria-hidden="true"
          height={32}
          src="/Iconmicrosoft.png"
          width={32}
        />
        {pending ? "Iniciando sesión..." : "Iniciar sesión con Microsoft"}
      </span>
      <ChevronRight aria-hidden="true" className="h-6 w-6 text-[#667085]" strokeWidth={2.2} />
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="w-full">
      <form action={formAction} className="space-y-4">
        <input name="email" type="hidden" value={state?.email ?? "admin@assetlens.local"} />
        <input name="password" type="hidden" value="Demo1234!" />
        <SubmitButton />

        {state?.error ? (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff1f0] px-4 py-3 text-sm text-[#b42318]">
            {state.error}
          </div>
        ) : null}
      </form>
    </div>
  );
}
