'use client';

import React, { useState, useEffect } from 'react';
import useWalletStore from '@/stores/wallet.store';
import EmojiKeypad from './EmojiKeypad';
import SGCButton from '../SGCButton';
import SGCCard from '../SGCCard';

interface PinLockScreenProps {
  isSettingPin: boolean;
}

const PinLockScreen: React.FC<PinLockScreenProps> = ({ isSettingPin }) => {
  const { verifyPin, setPin, loading, error, unlockWallet } = useWalletStore();
  const [pin, setPinInput] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSaveScreen, setShowSaveScreen] = useState(false);

  useEffect(() => {
    setPinInput([]);
    setConfirmPin([]);
    setIsConfirming(false);
    setLocalError(null);
    setShowSaveScreen(false);
  }, [isSettingPin]);

  const handleKeyPress = (key: string) => {
    if (isConfirming) {
      if (confirmPin.length < 4) setConfirmPin(p => [...p, key]);
    } else {
      if (pin.length < 4) setPinInput(p => [...p, key]);
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin(p => p.slice(0, -1));
    } else {
      setPinInput(p => p.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (isConfirming) {
      setConfirmPin([]);
    } else {
      setPinInput([]);
    }
  };

  const handleSubmit = async () => {
    setLocalError(null);
    const finalPin = pin.join('');
    const finalConfirmPin = confirmPin.join('');

    if (isSettingPin) {
      if (!isConfirming) {
        if (pin.length === 4) setIsConfirming(true);
        else setLocalError("PIN must be 4 characters long.");
      } else {
        if (finalPin === finalConfirmPin) {
          try {
            await setPin(finalPin);
            setShowSaveScreen(true); // Show the save screen
          } catch (e) {
            setLocalError("Failed to set PIN. Please try again.");
          }
        } else {
          setLocalError("PINs do not match. Please try again.");
          setPinInput([]);
          setConfirmPin([]);
          setIsConfirming(false);
        }
      }
    } else {
      if (pin.length === 4) {
        try {
          await verifyPin(finalPin);
        }
        catch (e) {
          setLocalError("Invalid PIN. Please try again.");
          setPinInput([]);
        }
      }
      else {
        setLocalError("PIN must be 4 characters long.");
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pin.join(''));
  };

  const handleDownload = () => {
    const blob = new Blob([pin.join('')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sgchain-wallet-pin.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const SavePinScreen = () => (
    <SGCCard title="Save Your PIN" className="max-w-sm mx-auto">
      <p className="text-center text-gray-600 mb-4">Your PIN has been set. Please save it in a secure location. You will not be able to recover it.</p>
      <div className="flex justify-center items-center h-16 mb-6 bg-gray-100 rounded-md text-4xl" style={{ fontFamily: '"apple color emoji", "segoe ui emoji", "segoe ui symbol", "noto color emoji"' }}>
        {pin.join(' ')}
      </div>
      <div className="flex gap-4">
        <SGCButton onClick={handleCopy} className="w-full">Copy</SGCButton>
        <SGCButton onClick={handleDownload} className="w-full">Download</SGCButton>
      </div>
       <SGCButton onClick={unlockWallet} className="w-full mt-4 bg-green-500">Done</SGCButton>
    </SGCCard>
  );

  if (showSaveScreen) {
    return <SavePinScreen />;
  }

  const displayPin = isConfirming ? confirmPin : pin;
  const title = isSettingPin 
    ? (isConfirming ? 'Confirm Your Emoji PIN' : 'Set Your Emoji PIN') 
    : 'Enter Emoji PIN to Unlock';

  return (
    <SGCCard title={title} className="max-w-lg mx-auto">
      <div className="flex justify-center items-center h-16 mb-4 bg-gray-100 rounded-md">
        {Array(4).fill(0).map((_, i) => (
          <span key={i} className="text-4xl mx-2" style={{ fontFamily: '"apple color emoji", "segoe ui emoji", "segoe ui symbol", "noto color emoji"' }}>
            {displayPin[i] || '◦'}
          </span>
        ))}
      </div>
      <EmojiKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} onClear={handleClear} />
      <div className="mt-6">
        <SGCButton onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Processing...' : (isSettingPin && !isConfirming) ? 'Next' : 'Submit'}
        </SGCButton>
      </div>
      {localError && <p className="text-red-500 text-sm mt-4 text-center">{localError}</p>}
      {error && !localError && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
    </SGCCard>
  );
};

export default PinLockScreen;
