'use client';

import React, { useState } from 'react';
import { Section, QuestionResponse, SingleResponse, MultiResponse, TextResponse, RankResponse, PercentageResponse } from '@/lib/types';
import { ChevronDown, ChevronRight, AlertCircle, Edit3 } from 'lucide-react';

interface ReviewScreenProps {
  sections: Section[];
  responses: Record<string, QuestionResponse>;
  onEdit: (sectionIndex: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  totalQuestions: number;
}

function formatResponse(response: QuestionResponse, type: string): string {
  if (!response) return '—';
  
  switch (type) {
    case 'single': {
      const r = response as SingleResponse;
      if (!r.selected) return '—';
      if (r.selected === '__other__') return r.other || 'Other';
      return r.other ? `${r.selected} (Other: ${r.other})` : r.selected;
    }
    case 'multi': {
      const r = response as MultiResponse;
      if (!r.selected || r.selected.length === 0) return '—';
      const items = r.selected
        .filter(s => s !== '__other__')
        .map(s => `• ${s}`);
      if (r.selected.includes('__other__') && r.other) {
        items.push(`• Other: ${r.other}`);
      }
      return items.join('\n');
    }
    case 'text': {
      const r = response as TextResponse;
      return r.text || '—';
    }
    case 'rank': {
      const r = response as RankResponse;
      if (!r.ranked || r.ranked.length === 0) return '—';
      return r.ranked.map((item, i) => `${i + 1}. ${item}`).join('\n');
    }
    case 'percentage': {
      const r = response as PercentageResponse;
      if (!r.allocations || Object.keys(r.allocations).length === 0) return '—';
      return Object.entries(r.allocations)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k}: ${v}%`)
        .join('\n');
    }
    default:
      return '—';
  }
}

function isAnswered(response: QuestionResponse | undefined, type: string): boolean {
  if (!response) return false;
  switch (type) {
    case 'single': return !!(response as SingleResponse).selected;
    case 'multi': return ((response as MultiResponse).selected || []).length > 0;
    case 'text': return !!((response as TextResponse).text || '').trim();
    case 'rank': return ((response as RankResponse).ranked || []).length > 0;
    case 'percentage': return Object.values((response as PercentageResponse).allocations || {}).some(v => v > 0);
    default: return false;
  }
}

export default function ReviewScreen({
  sections,
  responses,
  onEdit,
  onSubmit,
  isSubmitting,
  totalQuestions,
}: ReviewScreenProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    const next = new Set(expandedSections);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setExpandedSections(next);
  };

  const answeredCount = Object.keys(responses).filter((id) => {
    for (const section of sections) {
      const q = section.questions.find((q) => q.id === id);
      if (q) return isAnswered(responses[id], q.type);
    }
    return false;
  }).length;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmitClick = () => {
    if (answeredCount < totalQuestions) {
      setShowConfirm(true);
    } else {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Header */}
      <div className="text-center mb-4 animate-fade-in-up">
        <h2 className="font-heading text-xl tracking-wider uppercase gradient-text mb-2">
          Review Your Answers
        </h2>
        <div className="gradient-line w-24 mx-auto mb-3" />
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-sm text-text-secondary">
            You&apos;ve answered
          </span>
          <span className={`font-mono text-sm font-bold ${answeredCount === totalQuestions ? 'text-accent-green' : 'text-accent-cyan'}`}>
            {answeredCount} of {totalQuestions}
          </span>
          <span className="font-mono text-sm text-text-secondary">
            questions
          </span>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, sectionIndex) => {
        const isExpanded = expandedSections.has(sectionIndex);
        const sectionAnswered = section.questions.filter((q) =>
          isAnswered(responses[q.id], q.type)
        ).length;
        const allAnswered = sectionAnswered === section.questions.length;

        return (
          <div
            key={section.id}
            className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${sectionIndex * 50}ms` }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-bg-tertiary/50 transition-colors"
            >
              <span className="text-lg">{section.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-body text-[15px] text-text-primary">
                  {section.title}
                </div>
                <div className="font-mono text-[11px] text-text-tertiary">
                  {sectionAnswered}/{section.questions.length} answered
                </div>
              </div>
              {!allAnswered && (
                <AlertCircle size={16} className="text-accent-magenta/60 flex-shrink-0" />
              )}
              {isExpanded ? (
                <ChevronDown size={18} className="text-text-tertiary flex-shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-text-tertiary flex-shrink-0" />
              )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-border">
                {section.questions.map((question) => {
                  const response = responses[question.id];
                  const answered = isAnswered(response, question.type);
                  const formatted = response ? formatResponse(response, question.type) : '—';

                  return (
                    <div
                      key={question.id}
                      className="px-4 py-3 border-b border-border/50 last:border-b-0"
                    >
                      <div className="font-body text-[14px] text-text-secondary mb-1">
                        {question.text}
                      </div>
                      <div
                        className={`font-body text-[13px] whitespace-pre-line ${
                          answered ? 'text-text-primary' : 'text-accent-magenta/60'
                        }`}
                      >
                        {formatted}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => onEdit(sectionIndex)}
                  className="w-full px-4 py-2.5 flex items-center justify-center gap-2
                    text-accent-cyan text-sm font-body
                    hover:bg-accent-cyan/5 transition-colors"
                >
                  <Edit3 size={14} />
                  Edit section
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center px-6">
          <div className="glass-card rounded-xl p-6 max-w-sm w-full animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-accent-magenta" />
              <h3 className="font-heading text-sm text-text-primary tracking-wider uppercase">
                Incomplete
              </h3>
            </div>
            <p className="font-body text-sm text-text-secondary mb-5">
              Some questions are unanswered. Submit anyway?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-text-secondary font-body text-sm
                  hover:bg-bg-tertiary transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => { setShowConfirm(false); onSubmit(); }}
                className="flex-1 py-2.5 rounded-lg bg-accent-green/10 border border-accent-green/30
                  text-accent-green font-body text-sm hover:bg-accent-green/20 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary/90 backdrop-blur-md border-t border-border safe-bottom z-50">
        <div className="max-w-[720px] mx-auto">
          <button
            onClick={handleSubmitClick}
            disabled={isSubmitting}
            className={`
              w-full py-4 rounded-lg font-heading text-base tracking-[0.2em] uppercase
              transition-all duration-300 active:scale-[0.98]
              ${
                isSubmitting
                  ? 'bg-bg-tertiary text-text-tertiary cursor-wait'
                  : 'bg-accent-green/10 border border-accent-green text-accent-green shadow-glow-green hover:bg-accent-green/20 animate-pulse-green'
              }
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Your Vision'}
          </button>
        </div>
      </div>
    </div>
  );
}
