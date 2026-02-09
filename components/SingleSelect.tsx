'use client';

import React, { useState, useEffect } from 'react';
import OptionCard from './OptionCard';
import { SingleResponse } from '@/lib/types';

interface SingleSelectProps {
  questionId: string;
  options: string[];
  hasOther?: boolean;
  otherLabel?: string;
  value: SingleResponse | null;
  onChange: (response: SingleResponse) => void;
}

export default function SingleSelect({
  options,
  hasOther,
  otherLabel,
  value,
  onChange,
}: SingleSelectProps) {
  const [otherText, setOtherText] = useState(value?.other || '');
  const isOtherSelected = value?.selected === '__other__';

  useEffect(() => {
    if (value?.other) setOtherText(value.other);
  }, [value?.other]);

  const handleSelect = (option: string) => {
    onChange({ selected: option, other: null });
  };

  const handleOtherSelect = () => {
    onChange({ selected: '__other__', other: otherText });
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    onChange({ selected: '__other__', other: text });
  };

  return (
    <div className="flex flex-col gap-2.5" role="radiogroup">
      {options.map((option) => (
        <OptionCard
          key={option}
          label={option}
          selected={value?.selected === option}
          onClick={() => handleSelect(option)}
          variant="radio"
        />
      ))}

      {hasOther && (
        <div className="flex flex-col gap-2">
          <OptionCard
            label={otherLabel || 'Other'}
            selected={isOtherSelected}
            onClick={handleOtherSelect}
            variant="radio"
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
    </div>
  );
}
