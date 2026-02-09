'use client';

import React from 'react';
import { Question, QuestionResponse, SingleResponse, MultiResponse, TextResponse, RankResponse, PercentageResponse } from '@/lib/types';
import SingleSelect from './SingleSelect';
import MultiSelect from './MultiSelect';
import TextInput from './TextInput';
import RankInput from './RankInput';
import PercentageAllocator from './PercentageAllocator';

interface QuestionSectionProps {
  questions: Question[];
  responses: Record<string, QuestionResponse>;
  onResponse: (questionId: string, response: QuestionResponse) => void;
}

export default function QuestionSection({
  questions,
  responses,
  onResponse,
}: QuestionSectionProps) {
  return (
    <div className="flex flex-col gap-8 pb-4">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
        >
          {/* Question Text */}
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-1">
              <span className="font-mono text-xs text-accent-cyan/60 mt-1 flex-shrink-0">
                Q{question.id.replace(/[a-z]+/, '').toUpperCase() || index + 1}
              </span>
            </div>
            <h3 className="font-body text-[18px] md:text-[20px] text-text-primary leading-snug">
              {question.text}
            </h3>
          </div>

          {/* Question Input */}
          <div>
            {question.type === 'single' && (
              <SingleSelect
                questionId={question.id}
                options={question.options || []}
                hasOther={question.hasOther}
                otherLabel={question.otherLabel}
                value={(responses[question.id] as SingleResponse) || null}
                onChange={(resp) => onResponse(question.id, resp)}
              />
            )}
            {question.type === 'multi' && (
              <MultiSelect
                questionId={question.id}
                options={question.options || []}
                hasOther={question.hasOther}
                otherLabel={question.otherLabel}
                maxSelections={question.maxSelections}
                value={(responses[question.id] as MultiResponse) || null}
                onChange={(resp) => onResponse(question.id, resp)}
              />
            )}
            {question.type === 'text' && (
              <TextInput
                questionId={question.id}
                placeholder={question.placeholder}
                value={(responses[question.id] as TextResponse) || null}
                onChange={(resp) => onResponse(question.id, resp)}
              />
            )}
            {question.type === 'rank' && (
              <RankInput
                questionId={question.id}
                options={question.options || []}
                rankSlots={question.rankSlots || 3}
                value={(responses[question.id] as RankResponse) || null}
                onChange={(resp) => onResponse(question.id, resp)}
              />
            )}
            {question.type === 'percentage' && (
              <PercentageAllocator
                questionId={question.id}
                zones={question.zones || []}
                value={(responses[question.id] as PercentageResponse) || null}
                onChange={(resp) => onResponse(question.id, resp)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
