# Smart Meter Viewer

A real-time home energy dashboard built with **Next.js (App Router)** and **Tailwind CSS**. Shows electricity and gas usage broken down by household device, with live data from Geo Trio and Octopus Energy APIs — falling back to mock data if neither is configured.

## Features

- **Live donut charts** — inline SVG donut charts showing usage breakdown by device (fridge, washing machine, oven, heating, etc.)
- **Electricity & Gas** — separate panels for each fuel type with daily kWh totals and estimated costs
- **Summary bar** — combined cost today plus a monthly forecast at current rate
- **Savings Insights** — 4 personalised tips (e.g. "Upgrade your fridge — save £120/year")
- **Real API integration** — live watts from Geo Trio (every 10s), accurate daily kWh from Octopus Energy (every 60s)
- **Connection status bar** — shows whether data is live, historical, or demo
- **Graceful fallback** — demo mode with mock fluctuations if no API credentials are set
- **Dark-mode first** — energy theme using blues, greens, and ambers on a dark slate background

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Inline SVG (no external library) |
| Data | Geo Trio + Octopus Energy APIs via Next.js API routes |

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in your credentials — see Setup section below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard works without any credentials (demo mode with mock data).

## Setup

### Octopus Energy API

1. Log in at [octopus.energy](https://octopus.energy/dashboard/new/accounts/personal-details/api-access)
2. Scroll to **Personal API access** and generate an API key
3. Your **MPAN** (electricity) and **MPRN** (gas) are on your bills or in the Octopus app under *Meter details*
4. Your meter **serial numbers** are on the meters themselves or in the app

```
OCTOPUS_API_KEY=sk_live_xxxxxxxxxxxx
OCTOPUS_ELECTRICITY_MPAN=1234567890123
OCTOPUS_ELECTRICITY_SERIAL=A1B2C3D4
OCTOPUS_GAS_MPRN=1234567890
OCTOPUS_GAS_SERIAL=E5F6G7H8
```

### Geo Trio (GeoTogether) live data

Geo Trio is the in-home display unit that ships with most SMETS2 smart meters in the UK.

1. Download the **Geo Home** app (iOS or Android) and create an account
2. Pair your IHD (in-home display) with the app — follow the in-app instructions
3. Once paired, use the same email and password in `.env.local`:

```
GEO_EMAIL=you@example.com
GEO_PASSWORD=your_geo_password
```

The server will authenticate automatically, cache the token for 55 minutes, and re-authenticate as needed. Live wattage is polled every 10 seconds.

### .env.local example

```
GEO_EMAIL=you@example.com
GEO_PASSWORD=your_geo_password

OCTOPUS_API_KEY=sk_live_xxxxxxxxxxxx
OCTOPUS_ELECTRICITY_MPAN=1234567890123
OCTOPUS_ELECTRICITY_SERIAL=A1B2C3D4
OCTOPUS_GAS_MPRN=1234567890
OCTOPUS_GAS_SERIAL=E5F6G7H8
```

Any missing variables cause that API to be skipped gracefully. You can run with just Octopus, just Geo, or neither.

## Project Structure

```
src/
  app/
    layout.tsx                        # Root layout + metadata
    page.tsx                          # Mounts <Dashboard />
    globals.css                       # Tailwind import + base dark background
    api/
      geo/
        live/route.ts                 # GET — live watts from Geo Trio (server-side)
        periodic/route.ts             # GET — historical data from Geo Trio (server-side)
      octopus/
        consumption/route.ts          # GET — daily kWh totals from Octopus (server-side)
  components/
    Dashboard.tsx                     # Top-level layout: header, status bar, cards, insights
    MeterCard.tsx                     # Electricity / Gas card with stats + donut + legend
    DonutChart.tsx                    # Pure SVG donut chart, no deps
    DeviceLegend.tsx                  # Colour-keyed device breakdown list
    LiveTimestamp.tsx                 # Animated "Updated Xs ago" indicator
    SavingsInsights.tsx               # Four personalised saving tips
  hooks/
    useMeterData.ts                   # Polls API routes, falls back to mock data
  lib/
    geo-auth.ts                       # Geo Trio login + in-memory token cache
```

## Connection Status

The dashboard shows a status bar beneath the header:

| Indicator | Meaning |
|---|---|
| 🟢 Live — Geo Trio connected | Geo API working; live wattage shown |
| 🟡 Octopus historical data | Only Octopus is available |
| 🔴 Demo mode | Both APIs unavailable; mock data |

## API Security

All external API calls are made server-side in Next.js API routes. Credentials are never sent to the browser. The Geo token is cached in server memory between requests and refreshed automatically.
