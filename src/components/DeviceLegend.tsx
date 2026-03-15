"use client";

import { DeviceReading } from "@/hooks/useMeterData";

interface DeviceLegendProps {
  devices: DeviceReading[];
}

export default function DeviceLegend({ devices }: DeviceLegendProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {devices.map((device, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: device.color }}
          />
          <span className="text-sm text-slate-300 flex-1 truncate">
            {device.icon} {device.name}
          </span>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: device.color }}
          >
            {device.percentage.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}
