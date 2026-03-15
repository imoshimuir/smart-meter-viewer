"use client";

import { useMeterData, DataSource } from "@/hooks/useMeterData";
import LiveTimestamp from "./LiveTimestamp";
import MeterCard from "./MeterCard";
import SavingsInsights from "./SavingsInsights";

function ConnectionBar({
  source,
  liveWatts,
  usingEstimated,
}: {
  source: DataSource;
  liveWatts?: { electricity: number; gas: number };
  usingEstimated: boolean;
}) {
  const configs = {
    live: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      label: "Live — Geo Trio connected",
    },
    octopus: {
      dot: "bg-yellow-400",
      text: "text-yellow-400",
      label: "Octopus historical data",
    },
    demo: {
      dot: "bg-red-400",
      text: "text-red-400",
      label: "Demo mode",
    },
  };

  const cfg = configs[source];

  return (
    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs">
      <span className={`flex items-center gap-1.5 font-medium ${cfg.text}`}>
        <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`} />
        {cfg.label}
        {source === "live" && liveWatts && (
          <span className="ml-2 text-slate-400 font-normal">
            {liveWatts.electricity.toLocaleString()} W live
          </span>
        )}
      </span>
      {usingEstimated && source !== "demo" && (
        <span className="text-slate-500 italic">using estimated data</span>
      )}
    </div>
  );
}

function footerText(source: DataSource): string {
  if (source === "live") return "Live data via Geo Trio smart meter.";
  if (source === "octopus") return "Historical data via Octopus Energy API.";
  return "Data is simulated for demonstration.";
}

export default function Dashboard() {
  const { data, status } = useMeterData();

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-emerald-950/10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 leading-tight">
                Smart Meter Viewer
              </h1>
              <p className="text-xs text-slate-500">Home Energy Dashboard</p>
            </div>
          </div>
          <LiveTimestamp lastUpdated={data.lastUpdated} />
        </header>

        {/* Connection status bar */}
        <ConnectionBar
          source={status.source}
          liveWatts={status.liveWatts}
          usingEstimated={status.usingEstimated}
        />

        {/* Summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Electricity Today",
              value: `${data.electricity.totalKwh.toFixed(2)} kWh`,
              sub: `£${data.electricity.estimatedCostToday.toFixed(2)}`,
              color: "#3b82f6",
              bg: "from-blue-900/40 to-blue-800/20",
            },
            {
              label: "Gas Today",
              value: `${data.gas.totalKwh.toFixed(2)} kWh`,
              sub: `£${data.gas.estimatedCostToday.toFixed(2)}`,
              color: "#f97316",
              bg: "from-orange-900/40 to-orange-800/20",
            },
            {
              label: "Combined Cost",
              value: `£${(
                data.electricity.estimatedCostToday + data.gas.estimatedCostToday
              ).toFixed(2)}`,
              sub: "est. today",
              color: "#10b981",
              bg: "from-emerald-900/40 to-emerald-800/20",
            },
            {
              label: "Monthly Forecast",
              value: `£${(
                (data.electricity.estimatedCostToday + data.gas.estimatedCostToday) *
                30
              ).toFixed(0)}`,
              sub: "at current rate",
              color: "#a78bfa",
              bg: "from-violet-900/40 to-violet-800/20",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.bg} border border-slate-700/40 rounded-xl p-4`}
            >
              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Meter sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MeterCard
            title="Electricity"
            icon="⚡"
            section={data.electricity}
            accentColor="#3b82f6"
          />
          <MeterCard
            title="Gas"
            icon="🔥"
            section={data.gas}
            accentColor="#f97316"
          />
        </div>

        {/* Savings Insights */}
        <SavingsInsights />

        {/* Footer */}
        <footer className="text-center text-xs text-slate-600 pb-4">
          {footerText(status.source)} Updates every {status.source === "live" ? "10" : status.source === "octopus" ? "60" : "5"} seconds. &nbsp;·&nbsp;
          Smart Meter Viewer &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
