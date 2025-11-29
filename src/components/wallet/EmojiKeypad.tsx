 'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SGCButton from '@/components/SGCButton';
import { fetchEmojis, EmojiGroup } from '@/services/emoji.service';
import { Smile, User, Leaf, Utensils, Plane, PartyPopper, Lightbulb, Heart, Flag, Delete } from 'lucide-react';

interface EmojiKeypadProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

// Map category names to functions that render Lucide icons
const categoryIcons: { [key: string]: () => React.ReactNode } = {
  'Smileys & Emotion': () => <Smile size={24} />,
  'People & Body': () => <User size={24} />,
  'Animals & Nature': () => <Leaf size={24} />,
  'Food & Drink': () => <Utensils size={24} />,
  'Travel & Places': () => <Plane size={24} />,
  'Activities': () => <PartyPopper size={24} />,
  'Objects': () => <Lightbulb size={24} />,
  'Symbols': () => <Heart size={24} />,
  'Flags': () => <Flag size={24} />,
};

const EmojiKeypad: React.FC<EmojiKeypadProps> = ({ onKeyPress, disabled = false }) => {
  const [groups, setGroups] = useState<EmojiGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [search, setSearch] = useState('');
  
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchEmojis()
      .then((data) => {
        if (!mounted) return;
        setGroups(data.categorized || []);
        setLoading(false);
      })
      .catch((e) => { 
        setError(e.message || 'Failed to load emojis'); 
        setLoading(false); 
      });
    return () => { mounted = false; };
  }, []);

  const activeGroup = groups[activeGroupIdx];

  const emojiList = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const found: string[] = [];
      groups.forEach(g => 
        g.categories.forEach(c => 
          c.emojis.forEach(e => { 
            if (e.char.includes(q) || e.name.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
              found.push(e.char);
            }
          })
        )
      );
      return Array.from(new Set(found));
    }
    if (activeGroup) {
      return activeGroup.categories.flatMap(c => c.emojis.map(e => e.char));
    }
    return [];
  }, [groups, activeGroupIdx, search]);

  const visibleEmojis = showAll ? emojiList : emojiList.slice(0, 200);

  const handlePick = (e: string) => {
    if (disabled) return;
    onKeyPress(e);
  };

  if (loading) return <div className="text-center p-4">Loading keypad...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative mb-3 flex items-center">
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search emojis" 
          className="flex-1 px-3 py-2 border rounded" 
        />
      </div>
      
      <div className="mb-3 overflow-x-auto">
        <div className="flex justify-start gap-2 border-b pb-2">
          {groups.map((g, idx) => {
            const renderIcon = categoryIcons[g.name];
            return (
              <button
                key={g.name}
                onClick={() => { setActiveGroupIdx(idx); setSearch(''); }}
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${idx === activeGroupIdx ? 'bg-gray-200' : 'bg-transparent hover:bg-gray-100'}`}
                title={g.name} // Tooltip for accessibility
              >
                {renderIcon ? renderIcon() : g.name.charAt(0)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-80 overflow-y-auto p-2">
        <div className="grid grid-cols-6 md:grid-cols-8 gap-1 justify-items-center">
          {visibleEmojis.map((k, idx) => (
            <button
              key={`${k}-${idx}`}
              onClick={() => handlePick(k)}
              aria-label={`emoji-${k}`}
              className={`w-10 h-10 md:w-12 mdh-12 flex items-center justify-center text-xl bg-white rounded-lg hover:scale-110 active:scale-95 transition-transform ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {k}
            </button>
          ))}
          {visibleEmojis.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-500 py-8">
              <p>No emojis found.</p>
            </div>
          )}
        </div>
      </div>

      {emojiList.length > visibleEmojis.length && (
        <div className="mt-3 text-center">
          <button onClick={() => setShowAll(s => !s)} className="text-sm text-blue-600 hover:underline">{showAll ? 'Show less' : `Show all (${emojiList.length})`}</button>
        </div>
      )}
    </div>
  );
};

export default EmojiKeypad;
