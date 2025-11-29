'use client';

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useUiStore from '@/stores/ui.store';

const ConfettiManager: React.FC = () => {
  const { showConfetti } = useUiStore();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!showConfetti) {
    return null;
  }

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={400}
      gravity={0.1}
    />
  );
};

export default ConfettiManager;
