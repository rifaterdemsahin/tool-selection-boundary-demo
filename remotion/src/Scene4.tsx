import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0e1a',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

interface MetricCardProps {
  value: number;
  suffix: string;
  label: string;
  color: string;
  frame: number;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, suffix, label, color, frame, delay }) => {
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(frame, [delay, delay + 15], [40, 0], { extrapolateRight: 'clamp' });
  const displayValue = interpolate(frame, [delay + 10, delay + 50], [0, value], {
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: '#1a1f35',
        border: `1px solid ${color}33`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        textAlign: 'center',
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: '2.5rem', fontWeight: 800, color }}>
        {Math.round(displayValue)}{suffix}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const metrics = [
    { value: 70, suffix: '%', label: '❌ Naive Accuracy', color: '#e94560', delay: 25 },
    { value: 100, suffix: '%', label: '✅ Resilient Accuracy', color: '#00d4aa', delay: 35 },
    { value: 1788, suffix: '', label: '❌ Naive Tokens/Req', color: '#e94560', delay: 45 },
    { value: 792, suffix: '', label: '✅ Resilient Tokens/Req', color: '#00d4aa', delay: 55 },
    { value: 55, suffix: '%', label: '💰 Token Reduction', color: '#f0c040', delay: 65 },
    { value: 3, suffix: '', label: '❌ Naive Interventions', color: '#e94560', delay: 75 },
    { value: 0, suffix: '', label: '✅ Resilient Interventions', color: '#00d4aa', delay: 85 },
  ];

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '1200px', width: '100%' }}>
        <h2
          style={{
            opacity: titleOpacity,
            fontSize: '3rem',
            fontWeight: 700,
            color: '#e2e8f0',
            marginBottom: '0.5rem',
          }}
        >
          📊 Performance Comparison
        </h2>
        <p
          style={{
            opacity: titleOpacity,
            fontSize: '1.2rem',
            color: '#94a3b8',
            marginBottom: '2rem',
          }}
        >
          Quantitative proof that boundary-contrast examples outperform bulk examples
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {metrics.map((m, i) => (
            <MetricCard key={i} {...m} frame={frame} />
          ))}
        </div>

        <div
          style={{
            opacity: titleOpacity,
            marginTop: '2rem',
            fontSize: '1rem',
            color: '#64748b',
          }}
        >
          ⚡ Built with DeepSeek V4 Flash — 1M Token Context Window
        </div>
      </div>
    </AbsoluteFill>
  );
};
