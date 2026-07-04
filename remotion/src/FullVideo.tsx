import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1 } from './Scene1';
import { Scene2 } from './Scene2';
import { Scene3 } from './Scene3';
import { Scene4 } from './Scene4';

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e1a' }}>
      <Sequence from={0} durationInFrames={150}>
        <Scene1 />
      </Sequence>
      <Sequence from={150} durationInFrames={240}>
        <Scene2 />
      </Sequence>
      <Sequence from={390} durationInFrames={300}>
        <Scene3 />
      </Sequence>
      <Sequence from={690} durationInFrames={180}>
        <Scene4 />
      </Sequence>
    </AbsoluteFill>
  );
};
