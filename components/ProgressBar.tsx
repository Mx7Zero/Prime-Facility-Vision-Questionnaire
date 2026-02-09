'use client';

import React from 'react';

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
  sectionIcon: string;
  completedSections: Set<number>;
  answeredInSection: number;
  totalInSection: number;
}

export default function ProgressBar({
  currentSection,
  totalSections,
  sectionTitle,
  sectionIcon,
  completedSections,
  answeredInSection,
  totalInSection,
}: ProgressBarProps) {
  const overallProgress =
    totalSections > 0
      ? Math.round((completedSections.size / totalSections) * 100)
      : 0;

  return (
    <div className="sticky top-0 z-50 safe-top">
      {/* Progress Bar */}
      <div className="h-1 bg-bg-primary w-full">
        <div
          className="h-full progress-gradient transition-all duration-500 ease-out relative"
          style={{ width: `${overallProgress}%` }}
        >
          <div className="absolute right-0 top-0 w-4 h-full bg-accent-cyan/50 blur-sm animate-pulse-glow" />
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-bg-primary/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{sectionIcon}</span>
            <div>
              <div className="font-mono text-[11px] text-accent-cyan tracking-widest uppercase">
                {String(currentSection).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
              </div>
              <h2 className="font-heading text-sm text-text-primary tracking-wide uppercase">
                {sectionTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-tertiary">
              {answeredInSection}/{totalInSection}
            </span>
            <span className="font-mono text-xs text-accent-cyan">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
