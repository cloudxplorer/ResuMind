
"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  value: number; 
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

function colorFor(value: number): string {
  if (value >= 80) return "oklch(0.6 0.15 162)"; 
  if (value >= 60) return "oklch(0.75 0.16 95)"; 
  if (value >= 40) return "oklch(0.72 0.16 70)"; 
  return "oklch(0.62 0.22 27)"; 
}

export function ScoreGauge({
  value,
  size = 160,
  stroke = 12,
  label,
  sublabel,
}: ScoreGaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const color = colorFor(v);
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? "Score"}: ${v} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-semibold tabular-nums"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(v)}
        </motion.span>
        {label && <span className="text-xs text-muted-foreground mt-0.5">{label}</span>}
        {sublabel && <span className="text-[10px] text-muted-foreground/70">{sublabel}</span>}
      </div>
    </div>
  );
}

export function ScoreBar({
  value,
  label,
  hint,
}: {
  value: number;
  label: string;
  hint?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const color = colorFor(v);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums font-semibold" style={{ color }}>
          {Math.round(v)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
