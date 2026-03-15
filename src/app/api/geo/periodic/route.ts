import { NextResponse } from "next/server";
import { getGeoAuth, invalidateGeoCache } from "@/lib/geo-auth";

const GEO_BASE = "https://api.geotogether.com";

export async function GET() {
  const auth = await getGeoAuth();
  if (!auth) {
    return NextResponse.json({ error: "Geo API not configured" }, { status: 503 });
  }

  const { token, systemId } = auth;

  try {
    const res = await fetch(
      `${GEO_BASE}/api/userapi/system/smets2-periodic-data/${systemId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (res.status === 401) {
      invalidateGeoCache();
      return NextResponse.json({ error: "Auth expired, please retry" }, { status: 401 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Geo API error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch periodic data" }, { status: 500 });
  }
}
