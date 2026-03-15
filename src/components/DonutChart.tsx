"use client";

import { DeviceReading } from "@/hooks/useMeterData";

interface DonutChartProps {
  devices: DeviceReading[];
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({
  devices,
  size = 180,
  strokeWidth = 28,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let cumulativePercent = 0;

  const segments = devices.map((device) => {
    const startPercent = cumulativePercent;
    cumulativePercent += device.percentage;

    const startAngle = (startPercent / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = (cumulativePercent / 100) * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArcFlag = device.percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    ].join(" ");

    return { ...device, pathData };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => (
        <path
          key={i}
          d={seg.pathData}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          className="transition-all duration-700 ease-in-out"
        />
      ))}
      {/* Inner dark circle */}
      <circle cx={cx} cy={cy} r={radius - strokeWidth / 2 - 2} fill="#1e2332" />
    </svg>
  );
}
