'use client';

import React from 'react';
import { RankResponse } from '@/lib/types';

interface RankInputProps {
  questionId: string;
  options: string[];
  rankSlots: number;
  value: RankResponse | null;
  onChange: (response: RankResponse) => void;
}

export default function RankInput({
  options,
  rankSlots,
  value,
  onChange,
}: RankInputProps) {
  const ranked = value?.ranked || [];

  const handleOptionClick = (option: string) => {
    if (ranked.includes(option)) {
      // Remove it
      onChange({ ranked: ranked.filter((r) => r !== option) });
    } else if (ranked.length < rankSlots) {
      // Add it
      onChange({ ranked: [...ranked, option] });
    }
  };

  const handleSlotClick = (index: number) => {
    // Remove item at this slot
    const newRanked = [...ranked];
    newRanked.splice(index, 1);
    onChange({ ranked: newRanked });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Rank Slots */}
      <div className="flex flex-col gap-2">
        <span className="text-text-secondary text-sm font-body mb-1">
          Your top {rankSlots} (tap options below to fill)
        </span>
        {Array.from({ length: rankSlots }).map((_, index) => {
          const item = ranked[index];
          return (
            <button
              key={index}
              type="button"
              onClick={() => item && handleSlotClick(index)}
              className={`
                w-full px-4 py-3 rounded-lg border flex items-center gap-3 min-h-[48px]
                transition-all duration-200 text-left
                ${
                  item
                    ? 'border-accent-green/50 bg-accent-green/5 shadow-glow-green cursor-pointer hover:border-accent-magenta/50'
                    : 'border-border border-dashed bg-bg-secondary/50 cursor-default'
                }
              `}
            >
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                  font-mono text-sm font-bold
                  ${
                    item
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-bg-tertiary text-text-tertiary'
                  }
                `}
              >
                {index + 1}
              </span>
              <span
                className={`flex-1 font-body text-[15px] ${
                  item ? 'text-text-primary' : 'text-text-tertiary'
                }`}
              >
                {item || 'Tap an option below...'}
              </span>
              {item && (
                <span className="text-text-tertiary text-xs">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="gradient-line" />

      {/* Available Options */}
      <div className="flex flex-col gap-2">
        <span className="text-text-secondary text-sm font-body">
          Available options
        </span>
        {options.map((option) => {
          const isRanked = ranked.includes(option);
          const rankPosition = ranked.indexOf(option) + 1;
          const isFull = ranked.length >= rankSlots;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={isFull && !isRanked}
              className={`
                w-full text-left px-4 py-3 rounded-lg border
                flex items-center gap-3 min-h-[48px]
                transition-all duration-200 font-body text-[15px]
                ${
                  isRanked
                    ? 'border-accent-green/30 bg-accent-green/5 text-text-secondary'
                    : isFull
                    ? 'border-border bg-bg-secondary/50 text-text-tertiary opacity-50 cursor-not-allowed'
                    : 'border-border bg-bg-secondary hover:border-accent-cyan/30 hover:bg-bg-tertiary cursor-pointer text-text-secondary'
                }
              `}
            >
              <span className="flex-1">{option}</span>
              {isRanked && (
                <span className="flex-shrink-0 font-mono text-xs bg-accent-green/20 text-accent-green px-2 py-0.5 rounded">
                  #{rankPosition}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
