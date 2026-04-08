import React, { useEffect, useState } from 'react';
import type { GenerationStatus } from '../types/course';

interface GenerationProgressProps {
  status: GenerationStatus;
}

interface Step {
  id: GenerationStatus;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { id: 'generating_outline', label: 'Building course outline', icon: '📋' },
  { id: 'generating_lessons', label: 'Writing lesson content', icon: '✍️' },
  { id: 'finding_videos', label: 'Finding relevant videos', icon: '🎥' },
  { id: 'generating_quizzes', label: 'Creating quizzes', icon: '✦' },
];

const STATUS_ORDER: GenerationStatus[] = [
  'generating_outline',
  'generating_lessons',
  'finding_videos',
  'generating_quizzes',
  'done',
];

function getStepState(stepId: GenerationStatus, currentStatus: GenerationStatus): 'done' | 'active' | 'pending' {
  const stepIdx = STATUS_ORDER.indexOf(stepId);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  if (currentIdx < 0) return 'pending';
  if (currentIdx > stepIdx) return 'done';
  if (currentIdx === stepIdx) return 'active';
  return 'pending';
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ status }) => {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const currentIdx = STATUS_ORDER.indexOf(status);
    setVisibleSteps(Math.max(currentIdx + 1, 1));
  }, [status]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Crafting your course
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Our AI is working hard to build something great for you…
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {STEPS.map((step, i) => {
            const state = getStepState(step.id, status);
            const isVisible = i < visibleSteps;

            return (
              <div
                key={step.id}
                className={isVisible ? 'animate-step-in' : ''}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  opacity: isVisible ? undefined : 0,
                }}
              >
                <div className="step-item">
                  {/* Connector line */}
                  {i > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '15px',
                        top: '-1rem',
                        width: '2px',
                        height: '1rem',
                        background: state !== 'pending' ? 'var(--border-accent)' : 'var(--border)',
                        marginLeft: '23px',
                      }}
                    />
                  )}

                  <div className={`step-icon step-icon--${state}`}>
                    {state === 'done' ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : state === 'active' ? (
                      <div
                        className="animate-spin"
                        style={{
                          width: '12px',
                          height: '12px',
                          border: '2px solid rgba(232,201,126,0.3)',
                          borderTopColor: 'var(--accent)',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '10px' }}>{i + 1}</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <span className={`step-label--${state}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}>
                      {step.label}
                    </span>
                  </div>

                  <span style={{ fontSize: '1.1rem', opacity: state === 'pending' ? 0.3 : 1 }}>
                    {step.icon}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      marginLeft: '44px',
                      height: '1.25rem',
                      borderLeft: `2px dashed ${state === 'done' ? 'var(--border-accent)' : 'var(--border)'}`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
