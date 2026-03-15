import { NextResponse } from "next/server";

const OCTOPUS_BASE = "https://api.octopus.energy";

// UK average unit rates as fallback
const DEFAULT_ELECTRICITY_RATE = 0.245;
const DEFAULT_GAS_RATE = 0.06;

interface OctopusReading {
  consumption: number;
  interval_start: string;
  interval_end: string;
}

interface OctopusResponse {
  results: OctopusReading[];
}

function basicAuth(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

function sumTodayKwh(readings: OctopusReading[]): number {
  const today = new Date().toISOString().slice(0, 10);
  return readings
    .filter((r) => r.interval_start.startsWith(today))
    .reduce((sum, r) => sum + r.consumption, 0);
}

export async function GET() {
  const apiKey = process.env.OCTOPUS_API_KEY;
  const elecMpan = process.env.OCTOPUS_ELECTRICITY_MPAN;
  const elecSerial = process.env.OCTOPUS_ELECTRICITY_SERIAL;
  const gasMprn = process.env.OCTOPUS_GAS_MPRN;
  const gasSerial = process.env.OCTOPUS_GAS_SERIAL;

  if (!apiKey || !elecMpan || !elecSerial || !gasMprn || !gasSerial) {
    return NextResponse.json({ error: "Octopus API not configured" }, { status: 503 });
  }

  const auth = basicAuth(apiKey);
  const elecRate = DEFAULT_ELECTRICITY_RATE;
  const gasRate = DEFAULT_GAS_RATE;

  try {
    const [elecRes, gasRes] = await Promise.all([
      fetch(
        `${OCTOPUS_BASE}/v1/electricity-meter-points/${elecMpan}/meters/${elecSerial}/consumption/?page_size=48`,
        { headers: { Authorization: auth }, cache: "no-store" }
      ),
      fetch(
        `${OCTOPUS_BASE}/v1/gas-meter-points/${gasMprn}/meters/${gasSerial}/consumption/?page_size=48`,
        { headers: { Authorization: auth }, cache: "no-store" }
      ),
    ]);

    if (!elecRes.ok || !gasRes.ok) {
      return NextResponse.json({ error: "Octopus API error" }, { status: 502 });
    }

    const [elecData, gasData]: [OctopusResponse, OctopusResponse] = await Promise.all([
      elecRes.json(),
      gasRes.json(),
    ]);

    const electricityKwh = sumTodayKwh(elecData.results ?? []);
    const gasKwh = sumTodayKwh(gasData.results ?? []);

    return NextResponse.json({
      electricity: {
        totalKwh: electricityKwh,
        estimatedCost: parseFloat((electricityKwh * elecRate).toFixed(2)),
        ratePerKwh: elecRate,
      },
      gas: {
        totalKwh: gasKwh,
        estimatedCost: parseFloat((gasKwh * gasRate).toFixed(2)),
        ratePerKwh: gasRate,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch Octopus data" }, { status: 500 });
  }
}
