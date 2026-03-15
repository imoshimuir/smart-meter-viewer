"use client";

import { useState, useEffect } from "react";

export interface DeviceReading {
  name: string;
  percentage: number;
  color: string;
  icon: string;
}

export interface MeterSection {
  totalKwh: number;
  estimatedCostToday: number;
  ratePerKwh: number;
  devices: DeviceReading[];
}

export interface MeterData {
  electricity: MeterSection;
  gas: MeterSection;
  lastUpdated: Date;
}

const BASE_DATA: MeterData = {
  electricity: {
    totalKwh: 8.4,
    estimatedCostToday: 2.94,
    ratePerKwh: 0.35,
    devices: [
      { name: "Fridge / Freezer", percentage: 28, color: "#3b82f6", icon: "❄️" },
      { name: "Washing Machine", percentage: 22, color: "#8b5cf6", icon: "🌀" },
      { name: "Oven & Hob", percentage: 18, color: "#f59e0b", icon: "🍳" },
      { name: "TV & Entertainment", percentage: 14, color: "#06b6d4", icon: "📺" },
      { name: "Lighting", percentage: 10, color: "#10b981", icon: "💡" },
      { name: "Other", percentage: 8, color: "#6b7280", icon: "🔌" },
    ],
  },
  gas: {
    totalKwh: 14.2,
    estimatedCostToday: 0.71,
    ratePerKwh: 0.05,
    devices: [
      { name: "Central Heating", percentage: 52, color: "#ef4444", icon: "🔥" },
      { name: "Hot Water", percentage: 28, color: "#f97316", icon: "🚿" },
      { name: "Cooker / Hob", percentage: 13, color: "#f59e0b", icon: "🍲" },
      { name: "Other", percentage: 7, color: "#6b7280", icon: "⚙️" },
    ],
  },
  lastUpdated: new Date(),
};

function jitter(value: number, maxPct: number): number {
  const delta = value * maxPct * (Math.random() * 2 - 1);
  return Math.max(0, value + delta);
}

function fluctuateDevices(devices: DeviceReading[]): DeviceReading[] {
  const raw = devices.map((d) => ({
    ...d,
    percentage: jitter(d.percentage, 0.08),
  }));
  const total = raw.reduce((s, d) => s + d.percentage, 0);
  return raw.map((d) => ({ ...d, percentage: (d.percentage / total) * 100 }));
}

function fluctuateSection(section: MeterSection): MeterSection {
  const totalKwh = jitter(section.totalKwh, 0.05);
  return {
    ...section,
    totalKwh,
    estimatedCostToday: totalKwh * section.ratePerKwh,
    devices: fluctuateDevices(section.devices),
  };
}

export function useMeterData(): MeterData {
  const [data, setData] = useState<MeterData>(BASE_DATA);

  useEffect(() => {
    const tick = () => {
      setData({
        electricity: fluctuateSection(BASE_DATA.electricity),
        gas: fluctuateSection(BASE_DATA.gas),
        lastUpdated: new Date(),
      });
    };

    const interval = setInterval(tick, 5000);
    return () => clearInterval(interval);
  }, []);

  return data;
}
