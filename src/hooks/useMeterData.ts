"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

export type DataSource = "live" | "octopus" | "demo";

export interface ConnectionStatus {
  source: DataSource;
  liveWatts?: { electricity: number; gas: number };
  usingEstimated: boolean;
}

export interface UseMeterDataResult {
  data: MeterData;
  status: ConnectionStatus;
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

interface OctopusResult {
  electricity: { totalKwh: number; estimatedCost: number; ratePerKwh: number };
  gas: { totalKwh: number; estimatedCost: number; ratePerKwh: number };
}

interface GeoLiveResult {
  electricity: number;
  gas: number;
}

export function useMeterData(): UseMeterDataResult {
  const [data, setData] = useState<MeterData>(BASE_DATA);
  const [status, setStatus] = useState<ConnectionStatus>({
    source: "demo",
    usingEstimated: true,
  });

  const octopusRef = useRef<OctopusResult | null>(null);
  const geoRef = useRef<GeoLiveResult | null>(null);
  const geoOkRef = useRef(false);
  const octopusOkRef = useRef(false);

  const applyRealData = useCallback(
    (oct: OctopusResult | null, geo: GeoLiveResult | null) => {
      const hasOctopus = oct !== null;
      const hasGeo = geo !== null;

      if (!hasOctopus && !hasGeo) return; // demo interval handles this branch

      const elecKwh = oct?.electricity.totalKwh ?? BASE_DATA.electricity.totalKwh;
      const gasKwh = oct?.gas.totalKwh ?? BASE_DATA.gas.totalKwh;
      const elecRate = oct?.electricity.ratePerKwh ?? BASE_DATA.electricity.ratePerKwh;
      const gasRate = oct?.gas.ratePerKwh ?? BASE_DATA.gas.ratePerKwh;

      setData({
        electricity: {
          totalKwh: elecKwh,
          estimatedCostToday: oct?.electricity.estimatedCost ?? elecKwh * elecRate,
          ratePerKwh: elecRate,
          devices: BASE_DATA.electricity.devices,
        },
        gas: {
          totalKwh: gasKwh,
          estimatedCostToday: oct?.gas.estimatedCost ?? gasKwh * gasRate,
          ratePerKwh: gasRate,
          devices: BASE_DATA.gas.devices,
        },
        lastUpdated: new Date(),
      });

      setStatus({
        source: hasGeo ? "live" : "octopus",
        liveWatts: geo ?? undefined,
        usingEstimated: !hasOctopus,
      });
    },
    []
  );

  const fetchGeoLive = useCallback(async () => {
    try {
      const res = await fetch("/api/geo/live");
      if (!res.ok) throw new Error("not ok");
      const json = await res.json();
      geoOkRef.current = true;
      geoRef.current = { electricity: json.electricity, gas: json.gas };
    } catch {
      geoOkRef.current = false;
      geoRef.current = null;
    }
    applyRealData(octopusRef.current, geoRef.current);
  }, [applyRealData]);

  const fetchOctopus = useCallback(async () => {
    try {
      const res = await fetch("/api/octopus/consumption");
      if (!res.ok) throw new Error("not ok");
      const json: OctopusResult = await res.json();
      octopusOkRef.current = true;
      octopusRef.current = json;
    } catch {
      octopusOkRef.current = false;
      octopusRef.current = null;
    }
    applyRealData(octopusRef.current, geoRef.current);
  }, [applyRealData]);

  useEffect(() => {
    fetchGeoLive();
    fetchOctopus();

    const geoInterval = setInterval(fetchGeoLive, 10_000);
    const octopusInterval = setInterval(fetchOctopus, 60_000);

    // Demo mode: keep mock fluctuating when both APIs are unavailable
    const demoInterval = setInterval(() => {
      if (!geoOkRef.current && !octopusOkRef.current) {
        setData({
          electricity: fluctuateSection(BASE_DATA.electricity),
          gas: fluctuateSection(BASE_DATA.gas),
          lastUpdated: new Date(),
        });
        setStatus({ source: "demo", usingEstimated: true });
      }
    }, 5_000);

    return () => {
      clearInterval(geoInterval);
      clearInterval(octopusInterval);
      clearInterval(demoInterval);
    };
  }, [fetchGeoLive, fetchOctopus]);

  return { data, status };
}
