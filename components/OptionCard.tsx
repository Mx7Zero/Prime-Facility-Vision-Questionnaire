'use client';

import React from 'react';

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'radio' | 'checkbox';
  disabled?: boolean;
}

export default function OptionCard({
  label,
  selected,
  onClick,
  variant = 'radio',
  disabled = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role={variant === 'radio' ? 'radio' : 'checkbox'}
      aria-checked={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200 ease-out
        flex items-center gap-3 min-h-[48px] cursor-pointer
        font-body text-[15px] leading-snug
        ${
          selected
            ? 'border-accent-cyan bg-bg-tertiary shadow-glow-cyan scale-[1.02]'
            : 'border-border bg-bg-secondary hover:border-[#3a3a4e] hover:bg-bg-tertiary'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        active:scale-[0.98]
      `}
      style={{
        transform: selected ? 'scale(1.02)' : undefined,
        transition: 'all 200ms ease-out',
      }}
    >
      {/* Indicator */}
      <span
        className={`
          flex-shrink-0 w-5 h-5 flex items-center justify-center
          ${variant === 'radio' ? 'rounded-full' : 'rounded-[4px]'}
          border-2 transition-all duration-200
          ${
            selected
              ? 'border-accent-cyan bg-accent-cyan/20'
              : 'border-text-tertiary bg-transparent'
          }
        `}
      >
        {selected && variant === 'radio' && (
          <span className="w-2 h-2 rounded-full bg-accent-cyan" />
        )}
        {selected && variant === 'checkbox' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-accent-cyan"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      {/* Label */}
      <span
        className={`flex-1 ${selected ? 'text-white font-medium' : 'text-text-primary'}`}
      >
        {label}
      </span>
    </button>
  );
}
