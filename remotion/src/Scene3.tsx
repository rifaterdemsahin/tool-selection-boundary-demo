import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0e1a',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  background: 'linear-gradient(180deg, rgba(0,212,170,0.05) 0%, transparent 50%)',
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const cardOpacity = (i: number) => interpolate(frame, [20 + i * 20, 40 + i * 20], [0, 1], { extrapolateRight: 'clamp' });
  const cardY = (i: number) => interpolate(frame, [20 + i * 20, 40 + i * 20], [60, 0], { extrapolateRight: 'clamp' });

  const features = [
    { icon: '🧠', title: 'Boundary Reasoning', desc: 'Each example explains why one tool was chosen over plausible alternatives' },
    { icon: '🎯', title: 'Ambiguity-Focused', desc: 'Targets exact scenarios where the agent previously failed' },
    { icon: '⚡', title: 'Compact & Efficient', desc: '6 examples with rich reasoning use 55% fewer tokens than 18 bulk examples' },
  ];

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '1200px' }}>
        <div
          style={{
            opacity: titleOpacity,
            display: 'inline-flex',
            gap: '0.5rem',
            alignItems: 'center',
            border: '1px solid #00d4aa',
            color: '#00d4aa',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '1.2rem',
            marginBottom: '1.5rem',
            background: 'rgba(0,212,170,0.1)',
          }}
        >
          ✅ Act 2: The Resilient Architecture
        </div>

        <h2 style={{ opacity: titleOpacity, fontSize: '3rem', fontWeight: 700, color: '#00d4aa', marginBottom: '1rem' }}>
          🎯 Boundary-Contrast Few-Shot Examples
        </h2>
        <p style={{ opacity: titleOpacity, fontSize: '1.3rem', color: '#94a3b8', marginBottom: '2rem' }}>
          6 targeted examples with explicit WHY/WHY-NOT reasoning for ambiguous scenarios
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {features.map((feat, i) => (
            <div
              key={i}
              style={{
                opacity: cardOpacity(i),
                transform: `translateY(${cardY(i)}px)`,
                background: '#1a1f35',
                border: '1px solid rgba(0,212,170,0.3)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                width: '320px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{feat.icon}</div>
              <h3 style={{ color: '#00d4aa', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feat.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
