import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  Download,
  Flag,
  FolderOpen,
  Package,
  PlusCircle,
  TrendingUp,
  UploadCloud,
  UserPlus,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getAuthSession } from "@/src/features/auth/session";
import { getDashboardOverview } from "@/src/features/dashboard/application/get-dashboard-overview";
import {
  FindingsSeverityDonut,
  ProgressDonut,
} from "@/src/features/dashboard/ui/dashboard-charts";
import { MvpStatusPill } from "@/src/shared/ui/mvp-status-pill";

const numberFormatter = new Intl.NumberFormat("es-CL");

const metricToneClasses = {
  blue: {
    icon: "bg-[#eef6ff] text-[#2e90fa]",
    delta: "text-[#16b8ac]",
  },
  teal: {
    icon: "bg-[#e9fbf7] text-[#16b8ac]",
    delta: "text-[#16b8ac]",
  },
  violet: {
    icon: "bg-[#f4f0ff] text-[#7a5af8]",
    delta: "text-[#16b8ac]",
  },
  orange: {
    icon: "bg-[#fff4e5] text-[#f97316]",
    delta: "text-[#f97316]",
  },
} as const;

const activityIconClasses = {
  capture: "bg-[#e9fbf7] text-[#16b8ac]",
  finding: "bg-[#fff4e5] text-[#f97316]",
  approval: "bg-[#e9fbf7] text-[#16b8ac]",
  import: "bg-[#eef6ff] text-[#2e90fa]",
  user: "bg-[#eef6ff] text-[#2e90fa]",
} as const;

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function getRelativeTime(date: Date) {
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `Hace ${hours} h`;
  }

  return `Hace ${Math.round(hours / 24)} d`;
}

function getDerivedProgress(totalAssets: number, progress: number, openFindings: number) {
  const found = Math.min(totalAssets, Math.round((totalAssets * progress) / 100));
  const missing = Math.min(openFindings, Math.max(0, totalAssets - found));
  const pending = Math.max(0, totalAssets - found - missing);

  return {
    found,
    missing,
    pending,
  };
}

function MetricCard({
  Icon,
  label,
  tone,
  value,
  supporting,
}: {
  Icon: LucideIcon;
  label: string;
  tone: keyof typeof metricToneClasses;
  value: string;
  supporting: string;
}) {
  const toneClasses = metricToneClasses[tone];

  return (
    <article className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
      <div className="flex items-center gap-5">
        <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${toneClasses.icon}`}>
          <Icon aria-hidden="true" className="h-8 w-8" strokeWidth={2.1} />
        </div>
        <div className="min-w-0">
          <p className="text-4xl font-semibold leading-none text-[#14375a]">{value}</p>
          <p className="mt-3 text-base font-semibold text-[#344054]">{label}</p>
        </div>
      </div>
      <div className={`mt-8 flex items-center gap-2 text-sm font-semibold ${toneClasses.delta}`}>
        <span>{supporting}</span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
      </div>
    </article>
  );
}

function ActivityIcon({
  type,
}: {
  type: keyof typeof activityIconClasses;
}) {
  const Icon =
    type === "capture"
      ? Camera
      : type === "finding"
        ? Flag
        : type === "approval"
          ? CheckCircle2
          : type === "import"
            ? UploadCloud
            : UserPlus;

  return (
    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-lg ${activityIconClasses[type]}`}>
      <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={2.1} />
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const overview = await getDashboardOverview();
  const progress = getDerivedProgress(
    overview.totalAssets,
    overview.globalProgress,
    overview.openFindings,
  );
  const visibleActivity = overview.recentActivity.slice(0, 5);
  const fallbackActivity = [
    {
      id: "fallback-import",
      title: "Importación de activos preparada",
      description: "Base maestra lista para iniciar captura móvil.",
      occurredAt: new Date(),
      type: "import" as const,
    },
  ];
  const activity = visibleActivity.length
    ? visibleActivity.map((item, index) => ({
        ...item,
        type: (index === 0
          ? "capture"
          : index === 1
            ? "finding"
            : index === 2
              ? "approval"
              : index === 3
                ? "import"
                : "user") as keyof typeof activityIconClasses,
      }))
    : fallbackActivity;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-normal text-[#14375a]">Dashboard</h1>
          <p className="mt-2 text-base font-medium text-[#667085]">
            Resumen general de campañas e inventarios
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex h-14 items-center justify-between gap-4 rounded-lg border border-[#e4e7eb] bg-white px-5 text-base font-semibold text-[#344054] shadow-[0_14px_32px_rgba(20,55,90,0.05)]">
            <span className="inline-flex items-center gap-3">
              <Building2 aria-hidden="true" className="h-5 w-5 text-[#14375a]" />
              Todos los clientes
            </span>
            <ChevronDown aria-hidden="true" className="h-5 w-5 text-[#667085]" />
          </button>
          <button className="inline-flex h-14 items-center justify-between gap-4 rounded-lg border border-[#e4e7eb] bg-white px-5 text-base font-semibold text-[#344054] shadow-[0_14px_32px_rgba(20,55,90,0.05)]">
            <span className="inline-flex items-center gap-3">
              <Download aria-hidden="true" className="h-5 w-5 text-[#14375a]" />
              Exportar
            </span>
            <ChevronDown aria-hidden="true" className="h-5 w-5 text-[#667085]" />
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          Icon={FolderOpen}
          label="Campañas"
          supporting={`${formatNumber(overview.activeCampaigns)} activas`}
          tone="blue"
          value={formatNumber(overview.totalCampaigns)}
        />
        <MetricCard
          Icon={Package}
          label="Activos"
          supporting={`${formatNumber(progress.found)} encontrados`}
          tone="teal"
          value={formatNumber(overview.totalAssets)}
        />
        <MetricCard
          Icon={TrendingUp}
          label="Avance Global"
          supporting={`${formatNumber(progress.pending)} pendientes`}
          tone="violet"
          value={`${overview.globalProgress}%`}
        />
        <MetricCard
          Icon={Flag}
          label="Hallazgos"
          supporting={`${formatNumber(overview.openFindings)} abiertos`}
          tone="orange"
          value={formatNumber(overview.openFindings)}
        />
        <MetricCard
          Icon={UsersRound}
          label="Auditores"
          supporting={`${formatNumber(overview.totalAuditors)} asignados`}
          tone="blue"
          value={formatNumber(overview.totalAuditors)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.92fr_0.72fr]">
        <article className="overflow-hidden rounded-lg border border-[#e4e7eb] bg-white shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
          <div className="flex items-center justify-between gap-4 px-6 py-6">
            <h2 className="text-2xl font-semibold text-[#14375a]">Campañas activas</h2>
            <Link className="text-base font-semibold text-[#2e90fa] transition hover:text-[#14375a]" href="/campaigns">
              Ver todas
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-left text-sm font-semibold text-[#667085]">
                  <th className="px-6 py-4">Campaña</th>
                  <th className="px-4 py-4">Cliente</th>
                  <th className="px-4 py-4">Avance</th>
                  <th className="px-4 py-4">Auditores</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f7]">
                {overview.activeCampaignList.length ? (
                  overview.activeCampaignList.map((campaign) => (
                    <tr className="text-sm text-[#344054]" key={campaign.id}>
                      <td className="px-6 py-5">
                        <Link className="font-semibold text-[#14375a] transition hover:text-[#16b8ac]" href={`/campaigns/${campaign.id}`}>
                          {campaign.name}
                        </Link>
                      </td>
                      <td className="px-4 py-5 font-medium text-[#667085]">{campaign.clientName}</td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-2.5 w-36 overflow-hidden rounded-full bg-[#e9eef5]">
                            <div
                              className="h-full rounded-full bg-[#16b8ac]"
                              style={{ width: `${campaign.progressPercentage}%` }}
                            />
                          </div>
                          <span className="w-10 font-semibold text-[#667085]">
                            {campaign.progressPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="inline-flex items-center gap-2 font-semibold text-[#14375a]">
                          <UsersRound aria-hidden="true" className="h-4 w-4 text-[#667085]" />
                          {campaign.auditorCount}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <MvpStatusPill value={campaign.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-10 text-center text-sm font-medium text-[#667085]" colSpan={5}>
                      No hay campañas activas para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[#eef2f7] px-6 py-4">
            <Link
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#e4e7eb] text-base font-semibold text-[#16b8ac] transition hover:bg-[#f8fafc]"
              href="/campaigns/new"
            >
              <PlusCircle aria-hidden="true" className="h-5 w-5" />
              Crear nueva campaña
            </Link>
          </div>
        </article>

        <article className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#14375a]">Hallazgos por severidad</h2>
            <Link className="text-base font-semibold text-[#2e90fa] transition hover:text-[#14375a]" href="/findings">
              Ver todos
            </Link>
          </div>
          <FindingsSeverityDonut items={overview.findingsBySeverity} />
        </article>

        <article className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
          <h2 className="mb-5 text-2xl font-semibold text-[#14375a]">Progreso general</h2>
          <ProgressDonut
            found={progress.found}
            missing={progress.missing}
            pending={progress.pending}
            progress={overview.globalProgress}
            total={overview.totalAssets}
          />
        </article>
      </section>

      <section className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
        <h2 className="text-2xl font-semibold text-[#14375a]">Última actividad</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {activity.map((item) => (
            <article className="flex min-w-0 gap-4" key={item.id}>
              <ActivityIcon type={item.type} />
              <div className="min-w-0">
                <p className="line-clamp-2 text-base font-semibold leading-6 text-[#344054]">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-[#667085]">
                  {item.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#667085]">
                  {getRelativeTime(item.occurredAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
