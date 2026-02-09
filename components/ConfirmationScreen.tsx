'use client';

import React from 'react';

interface ConfirmationScreenProps {
  email: string;
  onStartOver: () => void;
}

export default function ConfirmationScreen({
  email,
  onStartOver,
}: ConfirmationScreenProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-green/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Animated Checkmark */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-full border-2 border-accent-green/30 flex items-center justify-center shadow-glow-green animate-pulse-green">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="animate-draw-check"
            >
              <path
                d="M12 24L20 32L36 16"
                stroke="#39FF14"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                strokeDashoffset="100"
                style={{
                  animation: 'draw-check-path 0.8s ease-out 0.3s forwards',
                }}
              />
            </svg>
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border border-accent-green/20 animate-ping" style={{ animationDuration: '2s' }} />
        </div>

        {/* Text */}
        <h2
          className="font-heading text-2xl tracking-wider uppercase gradient-text mb-4 animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
        >
          Vision Submitted
        </h2>

        <div
          className="gradient-line w-24 mx-auto mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
        />

        <p
          className="font-body text-text-secondary text-base mb-2 animate-fade-in-up"
          style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}
        >
          Your vision has been submitted successfully.
        </p>

        <p
          className="font-body text-text-tertiary text-sm mb-2 animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}
        >
          A copy has been sent to{' '}
          <span className="text-accent-cyan">{email}</span>
        </p>

        <p
          className="font-body text-text-tertiary text-sm mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.9s', animationFillMode: 'backwards' }}
        >
          We&apos;ll be in touch within 48 hours.
        </p>

        {/* Start Over */}
        <button
          onClick={onStartOver}
          className="px-8 py-3 rounded-lg border border-border text-text-secondary
            font-body text-sm hover:bg-bg-tertiary hover:border-text-tertiary
            transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: '1s', animationFillMode: 'backwards' }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
