"use client";

import { MeterSection } from "@/hooks/useMeterData";
import DonutChart from "./DonutChart";
import DeviceLegend from "./DeviceLegend";

interface MeterCardProps {
  title: string;
  icon: string;
  section: MeterSection;
  accentColor: string;
  unit?: string;
}

export default function MeterCard({
  title,
  icon,
  section,
  accentColor,
  unit = "kWh",
}: MeterCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        </div>
        <div
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
        >
          Live
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Today&apos;s Usage
          </p>
          <p className="text-2xl font-bold text-slate-100">
            {section.totalKwh.toFixed(2)}
            <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
          </p>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Est. Cost Today
          </p>
          <p className="text-2xl font-bold" style={{ color: accentColor }}>
            £{section.estimatedCostToday.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <DonutChart devices={section.devices} size={180} strokeWidth={32} />
        </div>
        <div className="flex-1 min-w-0">
          <DeviceLegend devices={section.devices} />
        </div>
      </div>
    </div>
  );
}
