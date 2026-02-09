'use client';

import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (name: string, email: string, role: string) => void;
  savedName?: string;
  savedEmail?: string;
  hasSavedProgress: boolean;
  onResume: () => void;
}

export default function WelcomeScreen({
  onStart,
  savedName,
  savedEmail,
  hasSavedProgress,
  onResume,
}: WelcomeScreenProps) {
  const [name, setName] = useState(savedName || '');
  const [email, setEmail] = useState(savedEmail || '');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({});

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; role?: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email';
    if (!role.trim()) newErrors.role = 'Role / Title is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onStart(name.trim(), email.trim(), role.trim());
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-green/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo / Title */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="font-heading text-3xl md:text-4xl tracking-wider uppercase gradient-text mb-3">
            Prime Facility Vision
          </h1>
          <div className="gradient-line w-32 mx-auto mb-4" />
          <p className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-3">
            60,000 SF &nbsp;|&nbsp; Phoenix, AZ &nbsp;|&nbsp; Sports Performance + Longevity
          </p>
          <p className="font-body text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            Help us design a world-class facility. Tap through the questions below — your answers shape every square foot. Takes about 20-25 minutes.
          </p>
        </div>

        {/* Returning User */}
        {hasSavedProgress && savedName && (
          <div
            className="w-full glass-card rounded-xl p-5 mb-6 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="font-body text-text-primary text-sm">
                Welcome back, <strong className="text-accent-cyan">{savedName}</strong>
              </span>
            </div>
            <button
              onClick={onResume}
              className="w-full py-3 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30
                text-accent-cyan font-heading text-sm tracking-widest uppercase
                hover:bg-accent-cyan/20 hover:shadow-glow-cyan
                transition-all duration-200 active:scale-[0.98]"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-mono text-xs text-text-tertiary mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
              placeholder="Your full name"
              className={`w-full px-4 py-3.5 rounded-lg bg-bg-secondary border
                text-text-primary font-body text-[15px] placeholder:text-text-tertiary
                focus:border-accent-cyan focus:shadow-glow-cyan focus:outline-none
                transition-all duration-200
                ${errors.name ? 'border-accent-magenta' : 'border-border'}
              `}
            />
            {errors.name && (
              <span className="text-accent-magenta text-xs font-body mt-1 block">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-mono text-xs text-text-tertiary mb-1.5 uppercase tracking-wider">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3.5 rounded-lg bg-bg-secondary border
                text-text-primary font-body text-[15px] placeholder:text-text-tertiary
                focus:border-accent-cyan focus:shadow-glow-cyan focus:outline-none
                transition-all duration-200
                ${errors.email ? 'border-accent-magenta' : 'border-border'}
              `}
            />
            {errors.email && (
              <span className="text-accent-magenta text-xs font-body mt-1 block">{errors.email}</span>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block font-mono text-xs text-text-tertiary mb-1.5 uppercase tracking-wider">
              Role / Title <span className="text-accent-magenta">*</span>
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => { setRole(e.target.value); if (errors.role) setErrors(prev => ({ ...prev, role: undefined })); }}
              placeholder="e.g. Investor, Partner, Operations Lead"
              className={`w-full px-4 py-3.5 rounded-lg bg-bg-secondary border
                text-text-primary font-body text-[15px] placeholder:text-text-tertiary
                focus:border-accent-cyan focus:shadow-glow-cyan focus:outline-none
                transition-all duration-200 ${errors.role ? 'border-accent-magenta' : 'border-border'}`}
            />
            {errors.role && <p className="mt-1 text-accent-magenta text-xs font-mono">{errors.role}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 py-4 rounded-lg bg-accent-cyan/10 border border-accent-cyan
              text-accent-cyan font-heading text-base tracking-[0.2em] uppercase
              hover:bg-accent-cyan/20 shadow-glow-cyan hover:shadow-glow-cyan-lg
              transition-all duration-300 active:scale-[0.98]
              animate-pulse-glow"
          >
            Begin →
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-8 text-text-tertiary text-xs font-body text-center">
          Your progress saves automatically. Pick up where you left off anytime.
        </p>
      </div>
    </div>
  );
}
