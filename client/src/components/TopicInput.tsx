import React, { useState, useEffect, useRef } from 'react';
import type { GenerationStatus } from '../types/course';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  status: GenerationStatus;
  error: string | null;
}

const STATUS_LABELS: Partial<Record<GenerationStatus, string>> = {
  generating_outline: 'Designing your course outline...',
  generating_lessons: 'Writing lesson content...',
  finding_videos: 'Finding the best videos...',
  generating_quizzes: 'Crafting quizzes for you...',
};

const CYCLE_LABELS = [
  'Designing your course outline...',
  'Writing lesson content...',
  'Finding the best videos...',
  'Crafting quizzes for you...',
];

export const TopicInput: React.FC<TopicInputProps> = ({ onSubmit, status, error }) => {
  const [topic, setTopic] = useState('');
  const [cycleIndex, setCycleIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = status !== 'idle' && status !== 'done' && status !== 'error';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cycle through status labels every 3 seconds when loading
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % CYCLE_LABELS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const currentLabel =
    STATUS_LABELS[status] ?? CYCLE_LABELS[cycleIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
    }
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
      }}
    >
      {/* Background decorative element */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,201,126,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '680px', position: 'relative', zIndex: 1 }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontSize: '1.75rem',
                filter: 'drop-shadow(0 0 12px rgba(232,201,126,0.4))',
              }}
            >
              ✦
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-muted)',
              }}
            >
              AI Course Builder
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}
          >
            Learn anything,{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>beautifully.</em>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Enter any topic and we'll craft a structured, expert-quality course with
            lessons, videos, and quizzes — in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="topic-input-wrapper">
            <input
              ref={inputRef}
              className="topic-input"
              type="text"
              placeholder="e.g. Pointers in C++, React hooks, Binary Search Trees..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              style={{ paddingRight: '1.5rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !topic.trim()}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              letterSpacing: '0.04em',
              borderRadius: '12px',
            }}
          >
            {isLoading ? 'Building your course...' : '✦ Build My Course'}
          </button>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div className="spinner" />
            <p
              key={currentLabel}
              className="animate-fade-in"
              style={{
                color: 'var(--accent)',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                fontStyle: 'italic',
                letterSpacing: '0.01em',
              }}
            >
              {currentLabel}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
              This may take up to a minute. Grab a coffee ☕
            </p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && error && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'var(--error-dim)',
              border: '1px solid var(--error)',
              borderRadius: '10px',
              color: '#e87a7a',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
            }}
          >
            <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠</span>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Something went wrong</strong>
              {error}
            </div>
          </div>
        )}

        {/* Example topics */}
        {status === 'idle' && (
          <div
            className="animate-fade-in"
            style={{ marginTop: '2rem', textAlign: 'center' }}
          >
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                marginBottom: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Try these
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {[
                'Binary Trees in Python',
                'REST API Design',
                'CSS Grid Layout',
                'Async/Await in JavaScript',
                'SQL Joins',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setTopic(example)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.borderColor = 'var(--border-accent)';
                    e.currentTarget.style.background = 'var(--accent-dim)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
