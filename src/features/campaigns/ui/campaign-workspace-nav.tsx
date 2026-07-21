"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/src/shared/lib/cn";

const sections = [
  { key: "summary", label: "Resumen", href: (campaignId: string) => `/campaigns/${campaignId}` },
  { key: "assets", label: "Activos", href: (campaignId: string) => `/campaigns/${campaignId}/assets` },
  { key: "auditors", label: "Auditores", href: (campaignId: string) => `/campaigns/${campaignId}/auditors` },
  { key: "evidence", label: "Evidencias", href: (campaignId: string) => `/campaigns/${campaignId}/evidence` },
  { key: "reconciliation", label: "Conciliación", href: (campaignId: string) => `/campaigns/${campaignId}/reconciliation` },
  { key: "settings", label: "Configuración", href: (campaignId: string) => `/campaigns/${campaignId}/settings` },
] as const;

function isActive(pathname: string, section: (typeof sections)[number], campaignId: string) {
  const base = `/campaigns/${campaignId}`;

  if (section.key === "summary") {
    return pathname === base;
  }

  return pathname.startsWith(section.href(campaignId));
}

export function CampaignWorkspaceNav({ campaignId }: { campaignId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto rounded-xl border border-[#e4e7eb] bg-white p-2 shadow-[0_18px_48px_rgba(20,55,90,0.05)]">
      {sections.map((section) => {
        const active = isActive(pathname, section, campaignId);

        return (
          <Link
            key={section.key}
            href={section.href(campaignId)}
            className={cn(
              "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-[#eef5fb] text-[#14375a]"
                : "text-[#667085] hover:bg-[#f7f8fa] hover:text-[#14375a]",
            )}
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}
