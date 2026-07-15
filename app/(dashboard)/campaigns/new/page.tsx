import { CampaignForm } from "@/src/features/campaigns/ui/campaign-form";
import { Button } from "@/src/shared/ui/button";

export default function NewCampaignPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-start">
        <Button href="/campaigns" size="sm" variant="secondary">
          Volver a campañas
        </Button>
      </div>
      <CampaignForm />
    </main>
  );
}
