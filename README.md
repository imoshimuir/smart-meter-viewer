# Smart Meter Viewer

A real-time home energy dashboard built with **Next.js 14 (App Router)** and **Tailwind CSS**. Shows electricity and gas usage broken down by household device, with live-updating mock data and personalised cost-saving insights.

## Features

- **Live donut charts** — inline SVG donut charts showing usage breakdown by device (fridge, washing machine, oven, heating, etc.)
- **Electricity & Gas** — separate panels for each fuel type with daily kWh totals and estimated costs
- **Summary bar** — combined cost today plus a monthly forecast at current rate
- **Savings Insights** — 4 personalised tips (e.g. "Upgrade your fridge — save £120/year")
- **Simulated live data** — small random fluctuations every 5 seconds with a live "Updated Xs ago" indicator
- **Dark-mode first** — energy theme using blues, greens, and ambers on a dark slate background

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Inline SVG (no external library) |
| Data | Client-side mock hook with `setInterval` |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout + metadata
    page.tsx            # Mounts <Dashboard />
    globals.css         # Tailwind import + base dark background
  components/
    Dashboard.tsx       # Top-level layout: header, summary bar, cards, insights
    MeterCard.tsx       # Electricity / Gas card with stats + donut + legend
    DonutChart.tsx      # Pure SVG donut chart, no deps
    DeviceLegend.tsx    # Colour-keyed device breakdown list
    LiveTimestamp.tsx   # Animated "Updated Xs ago" indicator
    SavingsInsights.tsx # Four personalised saving tips
  hooks/
    useMeterData.ts     # Mock data + 5s interval fluctuation hook
```

## Customising

- **Real data**: swap `useMeterData.ts` with a fetch/WebSocket call to your smart meter API (e.g. n3rgy, Glowmarkt, or DCC's SMETS2 data).
- **Rates**: update `ratePerKwh` in `useMeterData.ts` to reflect your current tariff.
- **Devices**: edit the `BASE_DATA` arrays to match your actual household appliances.
