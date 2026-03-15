"use client";

interface Insight {
  icon: string;
  title: string;
  description: string;
  saving: string;
  savingColor: string;
  category: string;
}

const INSIGHTS: Insight[] = [
  {
    icon: "❄️",
    title: "Upgrade Your Fridge",
    description:
      "Your fridge/freezer appears to be 8+ years old based on usage patterns. Modern A+++ models use up to 60% less energy.",
    saving: "Save ~£120/year",
    savingColor: "#10b981",
    category: "Appliances",
  },
  {
    icon: "🌀",
    title: "Wash at 30°C",
    description:
      "You're running cycles at 60°C on average. Switching to 30°C uses 40% less electricity with the same cleaning results.",
    saving: "Save ~£65/year",
    savingColor: "#10b981",
    category: "Habits",
  },
  {
    icon: "🔥",
    title: "Smart Heating Schedule",
    description:
      "Your heating runs for 14hrs/day. Installing a smart thermostat and dropping temperature by 1°C could cut your gas bill significantly.",
    saving: "Save ~£200/year",
    savingColor: "#f59e0b",
    category: "Heating",
  },
  {
    icon: "💡",
    title: "Switch to LED Lighting",
    description:
      "Replacing remaining halogen bulbs with LED equivalents reduces lighting energy use by up to 80% with no change in brightness.",
    saving: "Save ~£40/year",
    savingColor: "#10b981",
    category: "Lighting",
  },
];

export default function SavingsInsights() {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">💰</span>
        <h2 className="text-lg font-semibold text-slate-100">Savings Insights</h2>
        <span className="ml-auto text-xs text-slate-500 bg-slate-900/50 px-2.5 py-1 rounded-full">
          Personalised
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {INSIGHTS.map((insight, i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">{insight.icon}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400">
                {insight.category}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-1">{insight.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {insight.description}
              </p>
            </div>
            <div
              className="mt-auto text-sm font-bold"
              style={{ color: insight.savingColor }}
            >
              {insight.saving}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
