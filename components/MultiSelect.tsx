'use client';

import React, { useState, useEffect } from 'react';
import OptionCard from './OptionCard';
import { MultiResponse } from '@/lib/types';

interface MultiSelectProps {
  questionId: string;
  options: string[];
  hasOther?: boolean;
  otherLabel?: string;
  maxSelections?: number;
  value: MultiResponse | null;
  onChange: (response: MultiResponse) => void;
}

export default function MultiSelect({
  options,
  hasOther,
  otherLabel,
  maxSelections,
  value,
  onChange,
}: MultiSelectProps) {
  const selected = value?.selected || [];
  const [otherText, setOtherText] = useState(value?.other || '');
  const isOtherSelected = selected.includes('__other__');
  const atMax = maxSelections ? selected.filter(s => s !== '__other__').length >= maxSelections : false;

  useEffect(() => {
    if (value?.other) setOtherText(value.other);
  }, [value?.other]);

  const handleToggle = (option: string) => {
    let newSelected: string[];
    if (selected.includes(option)) {
      newSelected = selected.filter((s) => s !== option);
    } else {
      if (atMax && !selected.includes(option)) return;
      newSelected = [...selected, option];
    }
    onChange({ selected: newSelected, other: isOtherSelected ? otherText : null });
  };

  const handleOtherToggle = () => {
    let newSelected: string[];
    if (isOtherSelected) {
      newSelected = selected.filter((s) => s !== '__other__');
      onChange({ selected: newSelected, other: null });
    } else {
      newSelected = [...selected, '__other__'];
      onChange({ selected: newSelected, other: otherText });
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    onChange({ selected, other: text });
  };

  const selectionCount = selected.filter(s => s !== '__other__').length;

  return (
    <div className="flex flex-col gap-2.5">
      {maxSelections && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-text-secondary text-sm font-body">
            Select up to {maxSelections}
          </span>
          <span
            className={`font-mono text-sm px-2 py-0.5 rounded ${
              selectionCount === maxSelections
                ? 'text-accent-green bg-accent-green/10'
                : 'text-text-tertiary bg-bg-tertiary'
            }`}
          >
            {selectionCount}/{maxSelections}
          </span>
        </div>
      )}

      {options.map((option) => (
        <OptionCard
          key={option}
          label={option}
          selected={selected.includes(option)}
          onClick={() => handleToggle(option)}
          variant="checkbox"
          disabled={atMax && !selected.includes(option)}
        />
      ))}

      {hasOther && (
        <div className="flex flex-col gap-2">
          <OptionCard
            label={otherLabel || 'Other'}
            selected={isOtherSelected}
            onClick={handleOtherToggle}
            variant="checkbox"
          />
          {isOtherSelected && (
            <input
              type="text"
              value={otherText}
              onChange={(e) => handleOtherTextChange(e.target.value)}
              placeholder={otherLabel || 'Please specify...'}
              className="ml-8 px-4 py-3 rounded-lg bg-bg-secondary border border-border
                text-text-primary font-body text-[15px] placeholder:text-text-tertiary
                focus:border-accent-cyan focus:shadow-glow-cyan focus:outline-none
                transition-all duration-200"
              autoFocus
            />
          )}
        </div>
      )}

      {!maxSelections && selected.length > 0 && (
        <div className="text-right">
          <span className="font-mono text-xs text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">
            {selectionCount} selected
          </span>
        </div>
      )}
    </div>
  );
}
