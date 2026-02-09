'use client';

import React from 'react';
import { TextResponse } from '@/lib/types';

interface TextInputProps {
  questionId: string;
  placeholder?: string;
  value: TextResponse | null;
  onChange: (response: TextResponse) => void;
}

export default function TextInput({
  placeholder,
  value,
  onChange,
}: TextInputProps) {
  const text = value?.text || '';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ text: e.target.value });
  };

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={placeholder || 'Type your answer...'}
        rows={4}
        className="w-full px-4 py-3.5 rounded-lg bg-bg-secondary border border-border
          text-text-primary font-body text-[15px] leading-relaxed
          placeholder:text-text-tertiary
          focus:border-accent-cyan focus:shadow-glow-cyan focus:outline-none
          transition-all duration-200 resize-y min-h-[120px]"
        style={{
          fieldSizing: 'content' as unknown as undefined,
        }}
      />
      {text.length > 0 && (
        <span className="absolute bottom-3 right-3 font-mono text-xs text-text-tertiary">
          {text.length} chars
        </span>
      )}
    </div>
  );
}
