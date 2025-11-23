'use client';

import React, { useMemo } from 'react';
import useConfigStore from '@/stores/config.store';

interface EmojiKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const EmojiKeypad: React.FC<EmojiKeypadProps> = ({ onKeyPress, onDelete, onClear }) => {
  const { emojis } = useConfigStore();

  const shuffledKeys = useMemo(() => {
    if (!emojis) return [];
    // Combine and shuffle keys once
    const keys = [...emojis.spiritual, ...emojis.mudra];
    return keys.sort(() => Math.random() - 0.5);
  }, [emojis]);

  if (!emojis) {
    return <div className="text-center p-4">Loading keypad...</div>;
  }

  // Distribute shuffled keys into more balanced rows
  const numRows = 5;
  const keysPerRow = Math.ceil(shuffledKeys.length / numRows);
  const rows = Array.from({ length: numRows }, (_, i) =>
    shuffledKeys.slice(i * keysPerRow, (i + 1) * keysPerRow)
  );

  const keyClass = "flex-1 p-2 text-xl bg-gray-200 rounded-md hover:bg-gray-300 transition-colors";

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 justify-center">
          {row.map(key => <button key={key} onClick={() => onKeyPress(key)} className={keyClass}>{key}</button>)}
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <button onClick={onDelete} className="flex-grow p-3 bg-yellow-400 rounded-md hover:bg-yellow-500">Delete</button>
        <button onClick={onClear} className="flex-grow p-3 bg-red-400 rounded-md hover:bg-red-500">Clear</button>
      </div>
    </div>
  );
};

export default EmojiKeypad;
