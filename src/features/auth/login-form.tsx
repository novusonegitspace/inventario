"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  login,
  type LoginFormState,
} from "@/src/features/auth/actions";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

const initialState: LoginFormState = undefined;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth size="lg" type="submit">
      {pending ? "Entrando..." : "Entrar al dashboard"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <Panel className="w-full max-w-xl" glow padding="lg">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>Acceso operativo</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Ingrese al panel de campañas
            </h1>
            <p className="text-base leading-7 text-white/60">
              Desde aquí podrá abrir campañas, revisar configuraciones y seguir
              el avance del inventario en cada operación.
            </p>
          </div>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/70"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50"
              defaultValue={state?.email}
              id="email"
              name="email"
              placeholder="admin@assetlens.local"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/70"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50"
              id="password"
              name="password"
              placeholder="Demo1234!"
              type="password"
            />
          </div>

          {state?.error ? (
            <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {state.error}
            </div>
          ) : null}

          <SubmitButton />
        </form>

        <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200/72">
            Credenciales de acceso
          </p>
          <div className="mt-3 space-y-2 text-sm text-white/64">
            <p>
              <span className="text-white/40">Email:</span>{" "}
              {`admin@assetlens.local`}
            </p>
            <p>
              <span className="text-white/40">Contraseña:</span>{" "}
              {`Demo1234!`}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
