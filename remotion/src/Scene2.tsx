import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0e1a',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  background: 'linear-gradient(180deg, rgba(233,69,96,0.05) 0%, transparent 50%)',
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const card1Y = interpolate(frame, [20, 50], [60, 0], { extrapolateRight: 'clamp' });
  const card1Opacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const card2Y = interpolate(frame, [40, 70], [60, 0], { extrapolateRight: 'clamp' });
  const card2Opacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '1200px' }}>
        <div
          style={{
            opacity: titleOpacity,
            display: 'inline-flex',
            gap: '0.5rem',
            alignItems: 'center',
            border: '1px solid #e94560',
            color: '#e94560',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '1.2rem',
            marginBottom: '1.5rem',
            background: 'rgba(233,69,96,0.1)',
          }}
        >
          ❌ Act 1: The Naive Approach
        </div>

        <h2 style={{ opacity: titleOpacity, fontSize: '3rem', fontWeight: 700, color: '#e94560', marginBottom: '1rem' }}>
          🚫 Bulk Examples Create Token Bloat
        </h2>
        <p style={{ opacity: titleOpacity, fontSize: '1.3rem', color: '#94a3b8', marginBottom: '2rem' }}>
          18 short, obvious examples that don't teach boundary decision-making
        </p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              opacity: card1Opacity,
              transform: `translateY(${card1Y}px)`,
              background: '#1a1f35',
              border: '1px solid #2a2f45',
              borderRadius: '0.75rem',
              padding: '2rem',
              width: '400px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📜</div>
            <h3 style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>Massive Prompt</h3>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
              18 redundant examples inflate the prompt by <strong style={{ color: '#e94560' }}>2.5x</strong>, consuming valuable context window without improving boundary accuracy
            </p>
          </div>

          <div
            style={{
              opacity: card2Opacity,
              transform: `translateY(${card2Y}px)`,
              background: '#1a1f35',
              border: '1px solid #e94560',
              borderRadius: '0.75rem',
              padding: '2rem',
              width: '400px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>Wrong Tool Selected</h3>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
              Without boundary reasoning, the agent picks <code style={{ color: '#e94560' }}>cancel_order</code> instead of <code style={{ color: '#00d4aa' }}>lookup_order</code>
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
