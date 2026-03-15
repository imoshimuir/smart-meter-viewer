"use client";

import { useState, useEffect } from "react";

interface LiveTimestampProps {
  lastUpdated: Date;
}

export default function LiveTimestamp({ lastUpdated }: LiveTimestampProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <span className="flex items-center gap-1.5 text-sm text-slate-400">
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      {seconds === 0 ? "Live" : `Updated ${seconds}s ago`}
    </span>
  );
}
