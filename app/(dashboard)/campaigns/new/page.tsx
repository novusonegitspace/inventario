import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CampaignForm } from "@/src/features/campaigns/ui/campaign-form";

export default function NewCampaignPage() {
  return (
    <main className="space-y-7">
      <header className="space-y-5">
        <Link
          className="inline-flex items-center gap-2 text-base font-semibold text-[#0f988c] transition hover:text-[#087e75]"
          href="/campaigns"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
          Campañas
        </Link>
        <div>
          <h1 className="text-4xl font-semibold text-[#14375a]">Crear campaña</h1>
          <p className="mt-3 text-base font-medium text-[#667085]">
            Complete la información para crear una nueva campaña de inventario.
          </p>
        </div>
      </header>

      <CampaignForm />
    </main>
  );
}
