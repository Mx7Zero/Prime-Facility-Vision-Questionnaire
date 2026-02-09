'use client';

import React from 'react';
import { Section } from '@/lib/types';
import { ChevronRight, Check } from 'lucide-react';

interface SectionNavProps {
  sections: Section[];
  currentSection: number;
  completedSections: Set<number>;
  onNavigate: (sectionIndex: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SectionNav({
  sections,
  currentSection,
  completedSections,
  onNavigate,
  isOpen,
  onClose,
}: SectionNavProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 right-0 h-full w-72 bg-bg-primary border-l border-border
          z-[70] transform transition-transform duration-300 ease-out
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:sticky lg:top-[60px] lg:translate-x-0 lg:h-[calc(100dvh-60px)]
          lg:border-l lg:w-64 lg:block
          ${!isOpen ? 'hidden lg:block' : ''}
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="font-heading text-sm text-accent-cyan tracking-widest uppercase">
              Sections
            </h3>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>

          <h3 className="hidden lg:block font-heading text-xs text-accent-cyan tracking-widest uppercase mb-4">
            Sections
          </h3>

          <div className="flex flex-col gap-1">
            {sections.map((section, index) => {
              const isActive = index === currentSection;
              const isCompleted = completedSections.has(index);
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onNavigate(index);
                    onClose();
                  }}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5
                    transition-all duration-200 group min-h-[44px]
                    ${
                      isActive
                        ? 'bg-bg-tertiary border border-accent-cyan/30 shadow-glow-cyan'
                        : 'hover:bg-bg-secondary border border-transparent'
                    }
                  `}
                >
                  <span
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                      text-[10px] font-mono font-bold transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-accent-green/20 text-accent-green'
                          : isActive
                          ? 'bg-accent-cyan/20 text-accent-cyan'
                          : 'bg-bg-tertiary text-text-tertiary'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check size={12} />
                    ) : (
                      section.number
                    )}
                  </span>
                  <span
                    className={`
                      text-[13px] font-body leading-tight flex-1
                      ${
                        isActive
                          ? 'text-text-primary'
                          : 'text-text-secondary group-hover:text-text-primary'
                      }
                    `}
                  >
                    {section.title}
                  </span>
                  {isActive && (
                    <ChevronRight size={14} className="text-accent-cyan flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
