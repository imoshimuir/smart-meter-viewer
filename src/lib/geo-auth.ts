const GEO_BASE = "https://api.geotogether.com";
const TOKEN_TTL_MS = 55 * 60 * 1000; // 55 minutes

interface TokenCache {
  token: string;
  expiresAt: number;
  systemId: string;
}

let cache: TokenCache | null = null;

export async function getGeoAuth(): Promise<{ token: string; systemId: string } | null> {
  const email = process.env.GEO_EMAIL;
  const password = process.env.GEO_PASSWORD;

  if (!email || !password) return null;

  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return { token: cache.token, systemId: cache.systemId };
  }

  try {
    const loginRes = await fetch(`${GEO_BASE}/usersservice/v2/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: email, password }),
    });

    if (!loginRes.ok) return null;

    const loginData = await loginRes.json();
    const token: string = loginData.accessToken;
    if (!token) return null;

    const systemRes = await fetch(
      `${GEO_BASE}/api/userapi/v2/user/detail-systems?systemDetails=true`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!systemRes.ok) return null;

    const systemData = await systemRes.json();
    const systemId: string | undefined =
      systemData.systemDetails?.[0]?.systemId ??
      systemData.systemRoles?.[0]?.systemId;

    if (!systemId) return null;

    cache = { token, systemId, expiresAt: now + TOKEN_TTL_MS };
    return { token, systemId };
  } catch {
    return null;
  }
}

export function invalidateGeoCache(): void {
  cache = null;
}
