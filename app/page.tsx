'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sections, getTotalQuestions } from '@/data/questions';
import { QuestionResponse, Respondent, SavedState, SingleResponse, MultiResponse, TextResponse, RankResponse, PercentageResponse, SubmissionPayload } from '@/lib/types';
import { saveProgress, loadProgress, clearProgress } from '@/lib/storage';
import WelcomeScreen from '@/components/WelcomeScreen';
import ProgressBar from '@/components/ProgressBar';
import QuestionSection from '@/components/QuestionSection';
import SectionNav from '@/components/SectionNav';
import ReviewScreen from '@/components/ReviewScreen';
import ConfirmationScreen from '@/components/ConfirmationScreen';
import { Menu, ChevronLeft, ChevronRight, ClipboardCopy } from 'lucide-react';

type Screen = 'welcome' | 'questions' | 'review' | 'confirmation';

function isQuestionAnswered(response: QuestionResponse | undefined, type: string): boolean {
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

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [respondent, setRespondent] = useState<Respondent>({ name: '', email: '', role: '' });
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalQuestions = getTotalQuestions();

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setRespondent(saved.respondent);
      setResponses(saved.responses);
      setCurrentSection(saved.currentSection);
      setHasSavedProgress(true);
    }
    setIsLoaded(true);
  }, []);

  // Debounced auto-save
  const debouncedSave = useCallback(
    (state: SavedState) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(state);
      }, 500);
    },
    []
  );

  // Save whenever responses or section changes
  useEffect(() => {
    if (screen === 'questions' || screen === 'review') {
      debouncedSave({
        respondent,
        responses,
        currentSection,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [responses, currentSection, respondent, screen, debouncedSave]);

  const handleStart = (name: string, email: string, role: string) => {
    setRespondent({ name, email, role });
    setResponses({});
    setCurrentSection(0);
    setScreen('questions');
    window.scrollTo(0, 0);
  };

  const handleResume = () => {
    setScreen('questions');
    window.scrollTo(0, 0);
  };

  const handleResponse = (questionId: string, response: QuestionResponse) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen('review');
      window.scrollTo(0, 0);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToSection = (index: number) => {
    setCurrentSection(index);
    setScreen('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCompletedSections = (): Set<number> => {
    const completed = new Set<number>();
    sections.forEach((section, index) => {
      const allAnswered = section.questions.every((q) =>
        isQuestionAnswered(responses[q.id], q.type)
      );
      if (allAnswered) completed.add(index);
    });
    return completed;
  };

  const getAnsweredInSection = (sectionIndex: number): number => {
    const section = sections[sectionIndex];
    return section.questions.filter((q) =>
      isQuestionAnswered(responses[q.id], q.type)
    ).length;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const answeredCount = sections.reduce((acc, section) => {
      return acc + section.questions.filter(q => isQuestionAnswered(responses[q.id], q.type)).length;
    }, 0);

    const payload: SubmissionPayload = {
      respondent,
      responses,
      completionRate: Math.round((answeredCount / totalQuestions) * 100),
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        clearProgress();
        setScreen('confirmation');
        window.scrollTo(0, 0);
      } else {
        setSubmitError(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again or copy your responses.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyResponses = () => {
    const payload = {
      respondent,
      responses,
      submittedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    alert('Responses copied to clipboard!');
  };

  const handleStartOver = () => {
    clearProgress();
    setRespondent({ name: '', email: '', role: '' });
    setResponses({});
    setCurrentSection(0);
    setHasSavedProgress(false);
    setScreen('welcome');
    window.scrollTo(0, 0);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // WELCOME
  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onStart={handleStart}
        savedName={respondent.name || undefined}
        savedEmail={respondent.email || undefined}
        hasSavedProgress={hasSavedProgress}
        onResume={handleResume}
      />
    );
  }

  // CONFIRMATION
  if (screen === 'confirmation') {
    return (
      <ConfirmationScreen email={respondent.email} onStartOver={handleStartOver} />
    );
  }

  const completedSections = getCompletedSections();
  const currentSectionData = sections[currentSection];

  // REVIEW
  if (screen === 'review') {
    return (
      <div className="min-h-[100dvh]">
        <ProgressBar
          currentSection={sections.length}
          totalSections={sections.length}
          sectionTitle="Review & Submit"
          sectionIcon="📋"
          completedSections={completedSections}
          answeredInSection={0}
          totalInSection={0}
        />
        <div className="max-w-[720px] mx-auto px-4 py-6">
          <ReviewScreen
            sections={sections}
            responses={responses}
            onEdit={handleNavigateToSection}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            totalQuestions={totalQuestions}
          />
          {submitError && (
            <div className="fixed bottom-20 left-4 right-4 max-w-[720px] mx-auto z-[60]">
              <div className="glass-card rounded-lg p-4 border border-accent-magenta/30 bg-accent-magenta/5">
                <p className="font-body text-sm text-accent-magenta mb-3">{submitError}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-2 rounded-lg border border-accent-cyan/30 text-accent-cyan text-sm font-body hover:bg-accent-cyan/10 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleCopyResponses}
                    className="flex-1 py-2 rounded-lg border border-border text-text-secondary text-sm font-body hover:bg-bg-tertiary transition-colors flex items-center justify-center gap-2"
                  >
                    <ClipboardCopy size={14} />
                    Copy Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // QUESTIONS
  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <SectionNav
        sections={sections}
        currentSection={currentSection}
        completedSections={completedSections}
        onNavigate={handleNavigateToSection}
        isOpen={sidenavOpen}
        onClose={() => setSidenavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-[100dvh]">
        {/* Progress Bar */}
        <ProgressBar
          currentSection={currentSection + 1}
          totalSections={sections.length}
          sectionTitle={currentSectionData.title}
          sectionIcon={currentSectionData.icon}
          completedSections={completedSections}
          answeredInSection={getAnsweredInSection(currentSection)}
          totalInSection={currentSectionData.questions.length}
        />

        {/* Mobile menu button */}
        <button
          onClick={() => setSidenavOpen(true)}
          className="lg:hidden fixed top-16 right-4 z-40 w-10 h-10 rounded-lg bg-bg-secondary border border-border
            flex items-center justify-center text-text-secondary hover:text-accent-cyan
            hover:border-accent-cyan/30 transition-all duration-200"
          aria-label="Open section navigation"
        >
          <Menu size={18} />
        </button>

        {/* Section Description */}
        <div className="max-w-[720px] mx-auto w-full px-4 pt-6 pb-2" ref={contentRef}>
          <p className="font-body text-text-secondary text-sm mb-6">
            {currentSectionData.description}
          </p>
          <div className="gradient-line mb-6" />
        </div>

        {/* Questions */}
        <div className="flex-1 max-w-[720px] mx-auto w-full px-4">
          <QuestionSection
            key={currentSectionData.id}
            questions={currentSectionData.questions}
            responses={responses}
            onResponse={handleResponse}
          />
        </div>

        {/* Bottom Navigation */}
        <div className="sticky bottom-0 z-40 bg-bg-primary/90 backdrop-blur-md border-t border-border safe-bottom">
          <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <button
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-body text-sm
                transition-all duration-200
                ${
                  currentSection === 0
                    ? 'text-text-tertiary cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-border'
                }
              `}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {/* Section dots */}
            <div className="hidden md:flex items-center gap-1.5 max-w-[300px] overflow-hidden">
              {sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigateToSection(i)}
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                    i === currentSection
                      ? 'bg-accent-cyan w-4'
                      : completedSections.has(i)
                      ? 'bg-accent-green/60'
                      : 'bg-border hover:bg-text-tertiary'
                  }`}
                  aria-label={`Go to section ${i + 1}: ${sections[i].title}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSection}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-body text-sm
                bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan
                hover:bg-accent-cyan/20 hover:shadow-glow-cyan
                transition-all duration-200 active:scale-[0.98]"
            >
              {currentSection === sections.length - 1 ? 'Review' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
