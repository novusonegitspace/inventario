"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

type Severity = "critical" | "high" | "medium" | "low";

export type DashboardSeverityChartItem = {
  severity: Severity;
  label: string;
  count: number;
};

type ProgressDonutProps = {
  found: number;
  missing: number;
  pending: number;
  progress: number;
  total: number;
};

const severityColors: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#facc15",
  low: "#3b82f6",
};

function getPercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function FindingsSeverityDonut({
  items,
}: {
  items: DashboardSeverityChartItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const chartData =
    total > 0
      ? items.map((item) => ({
          name: item.label,
          value: item.count,
          color: severityColors[item.severity],
        }))
      : [{ name: "Sin datos", value: 1, color: "#e4e7eb" }];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.9fr)_1fr] lg:items-center">
      <div className="relative mx-auto h-[260px] w-full max-w-[320px]">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="value"
              innerRadius="54%"
              outerRadius="82%"
              paddingAngle={total > 0 ? 2 : 0}
              stroke="#fff"
              strokeWidth={3}
            >
              {chartData.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-4xl font-semibold text-[#14375a]">{total}</p>
            <p className="mt-1 text-sm font-medium text-[#667085]">Total</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-sm"
            key={item.severity}
          >
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: severityColors[item.severity] }}
            />
            <span className="font-semibold text-[#344054]">{item.label}</span>
            <span className="text-right font-semibold text-[#14375a]">{item.count}</span>
            <span className="w-10 text-right font-semibold text-[#667085]">
              {getPercent(item.count, total)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressDonut({
  found,
  missing,
  pending,
  progress,
  total,
}: ProgressDonutProps) {
  const chartData = [
    { name: "Encontrados", value: found, color: "#16b8ac" },
    { name: "No encontrados", value: missing, color: "#f97316" },
    { name: "Pendientes", value: pending, color: "#d0d5dd" },
  ].filter((item) => item.value > 0);
  const safeChartData =
    chartData.length > 0 ? chartData : [{ name: "Sin datos", value: 1, color: "#e4e7eb" }];

  return (
    <div className="space-y-6">
      <div className="relative mx-auto h-[230px] w-full max-w-[260px]">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={safeChartData}
              dataKey="value"
              innerRadius="70%"
              outerRadius="86%"
              paddingAngle={chartData.length > 1 ? 4 : 0}
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
              strokeWidth={4}
            >
              {safeChartData.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-4xl font-semibold text-[#14375a]">{progress}%</p>
            <p className="mt-1 text-sm font-medium text-[#667085]">Avance global</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#eef2f7]">
        <ProgressRow color="#16b8ac" label="Encontrados" value={found} />
        <ProgressRow color="#f97316" label="No encontrados" value={missing} />
        <ProgressRow color="#98a2b3" label="Pendientes" value={pending} />
        <div className="flex items-center justify-between pt-5 text-base">
          <span className="font-semibold text-[#667085]">Total activos</span>
          <span className="font-semibold text-[#14375a]">{total.toLocaleString("es-CL")}</span>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between py-4 text-sm">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="truncate font-semibold text-[#667085]">{label}</span>
      </div>
      <span className="font-semibold text-[#14375a]">{value.toLocaleString("es-CL")}</span>
    </div>
  );
}
