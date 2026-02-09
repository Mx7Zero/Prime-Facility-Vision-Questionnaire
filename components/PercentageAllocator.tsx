'use client';

import React from 'react';
import { PercentageResponse } from '@/lib/types';
import { Minus, Plus, Sparkles } from 'lucide-react';

interface PercentageAllocatorProps {
  questionId: string;
  zones: string[];
  recommendedAllocations?: Record<string, number>;
  value: PercentageResponse | null;
  onChange: (response: PercentageResponse) => void;
}

export default function PercentageAllocator({
  zones,
  recommendedAllocations,
  value,
  onChange,
}: PercentageAllocatorProps) {
  const allocations = value?.allocations || {};
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const handleChange = (zone: string, delta: number) => {
    const current = allocations[zone] || 0;
    const newVal = Math.max(0, Math.min(100, current + delta));
    const newAllocations = { ...allocations, [zone]: newVal };
    // Remove zero values
    if (newVal === 0) delete newAllocations[zone];
    onChange({ allocations: newAllocations });
  };

  const handleUseRecommended = () => {
    if (recommendedAllocations) {
      onChange({ allocations: { ...recommendedAllocations } });
    }
  };

  const getTotalColor = () => {
    if (total === 100) return 'text-accent-green';
    if (total > 100) return 'text-accent-magenta';
    return 'text-accent-cyan';
  };

  const getTotalGlow = () => {
    if (total === 100) return 'shadow-glow-green';
    if (total > 100) return 'shadow-glow-magenta';
    return '';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-text-secondary text-sm font-body mb-1">
        Allocate 60,000 SF across zones. Use +/- buttons (increments of 5%).
      </div>

      {recommendedAllocations && (
        <button
          type="button"
          onClick={handleUseRecommended}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
            border border-accent-cyan/40 bg-accent-cyan/5
            text-accent-cyan font-body text-sm font-medium
            hover:bg-accent-cyan/10 hover:border-accent-cyan/60
            active:scale-[0.98] transition-all duration-200"
        >
          <Sparkles size={16} />
          Use Industry Standard Recommendations
        </button>
      )}

      {zones.map((zone) => {
        const pct = allocations[zone] || 0;
        const sqft = Math.round((pct / 100) * 60000);
        const rec = recommendedAllocations?.[zone];
        return (
          <div
            key={zone}
            className="glass-card rounded-lg p-3 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="font-body text-[14px] text-text-primary leading-tight block">
                  {zone}
                </span>
                {rec !== undefined && (
                  <span className="font-mono text-[11px] text-accent-cyan/70 leading-tight">
                    Recommended: {rec}% ({(rec / 100 * 60000).toLocaleString()} SF)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleChange(zone, -5)}
                  disabled={pct <= 0}
                  className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border
                    flex items-center justify-center text-text-secondary
                    hover:border-accent-cyan hover:text-accent-cyan
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-150 active:scale-90"
                  aria-label={`Decrease ${zone} by 5%`}
                >
                  <Minus size={16} />
                </button>
                <span
                  className={`font-mono text-sm w-12 text-center font-bold ${
                    pct > 0 ? 'text-accent-cyan' : 'text-text-tertiary'
                  }`}
                >
                  {pct}%
                </span>
                <button
                  type="button"
                  onClick={() => handleChange(zone, 5)}
                  disabled={pct >= 100}
                  className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border
                    flex items-center justify-center text-text-secondary
                    hover:border-accent-cyan hover:text-accent-cyan
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-150 active:scale-90"
                  aria-label={`Increase ${zone} by 5%`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {/* Bar */}
            <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out progress-gradient"
                style={{ width: `${pct}%` }}
              />
            </div>
            {pct > 0 && (
              <div className="text-right">
                <span className="font-mono text-xs text-text-tertiary">
                  ~{sqft.toLocaleString()} SF
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Total */}
      <div
        className={`
          mt-2 p-4 rounded-lg border text-center
          transition-all duration-300
          ${total === 100 ? 'border-accent-green/50 bg-accent-green/5' : total > 100 ? 'border-accent-magenta/50 bg-accent-magenta/5' : 'border-border bg-bg-secondary'}
          ${getTotalGlow()}
        `}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="font-body text-text-secondary text-sm">TOTAL:</span>
          <span className={`font-mono text-2xl font-bold ${getTotalColor()}`}>
            {total}%
          </span>
        </div>
        <div className="font-mono text-xs text-text-tertiary mt-1">
          {total === 100
            ? '✓ Perfect — 60,000 SF allocated'
            : total > 100
            ? `⚠ Over by ${total - 100}% — reduce some zones`
            : `${100 - total}% remaining`}
        </div>
      </div>
    </div>
  );
}
