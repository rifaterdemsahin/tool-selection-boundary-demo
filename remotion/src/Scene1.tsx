import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0e1a',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const badgeOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div
          style={{
            opacity: badgeOpacity,
            display: 'inline-flex',
            gap: '0.5rem',
            alignItems: 'center',
            border: '1px solid #00d4aa',
            color: '#00d4aa',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '1.2rem',
            marginBottom: '2rem',
            background: 'rgba(0,212,170,0.1)',
          }}
        >
          🤖 Built with DeepSeek V4 Flash — 1M Token Context
        </div>

        <h1
          style={{
            fontSize: '4.5rem',
            fontWeight: 800,
            color: '#e2e8f0',
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          ⚡ Tool Selection<br />
          <span style={{ color: '#00d4aa' }}>Boundary-Contrast</span> Demo
        </h1>

        <p
          style={{
            fontSize: '1.5rem',
            color: '#94a3b8',
            opacity: subtitleOpacity,
            marginBottom: '2rem',
          }}
        >
          Claude AI Architect Exam — Proving Why Targeted Few-Shot Examples Beat Bulk Token Bloat
        </p>

        <div style={{ opacity: badgeOpacity, display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '1rem', background: 'rgba(0,212,170,0.1)', border: '1px solid #00d4aa', color: '#00d4aa' }}>🎯 6 Boundary Examples</span>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '1rem', background: 'rgba(233,69,96,0.1)', border: '1px solid #e94560', color: '#e94560' }}>❌ 18 Bulk Examples</span>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '1rem', background: 'rgba(240,192,64,0.1)', border: '1px solid #f0c040', color: '#f0c040' }}>📊 55% Token Savings</span>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '1rem', background: 'rgba(124,58,237,0.1)', border: '1px solid #7c3aed', color: '#a78bfa' }}>📈 +30% Accuracy</span>
        </div>

        <div
          style={{
            opacity: badgeOpacity,
            marginTop: '2rem',
            fontSize: '1.2rem',
            color: '#94a3b8',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          <p style={{ color: '#e94560', fontWeight: 600 }}>
            📝 Problem: Agent selects get_customer when lookup_order is correct
          </p>
          <p style={{ marginTop: '0.5rem', color: '#00d4aa' }}>
            💡 Solution: Add 4-6 boundary-contrast examples with explicit WHY/WHY-NOT reasoning
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
