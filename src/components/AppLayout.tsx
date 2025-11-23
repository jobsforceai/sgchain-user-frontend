'use client';

import useAuthStore from '@/stores/auth.store';
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import AuthInitializer from './AuthInitializer';
import { DottedHourglassLoader } from './DottedHourglassLoader';
import SGCNavbar from './SGCNavbar';
import useConfigStore from '@/stores/config.store';
import useWalletStore from '@/stores/wallet.store';
import useTransactionStore from '@/stores/transaction.store';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthInitialized } = useAuthStore();
  const { fetchEmojiConfig } = useConfigStore();
  const { isWalletUnlocked, lockWallet, unlockTimestamp, _hasHydrated, resetUnlockTimer } = useWalletStore();
  const { connect, disconnect } = useTransactionStore();

  useEffect(() => {
    fetchEmojiConfig();
  }, [fetchEmojiConfig]);

  // Effect to manage WebSocket connection based on auth state
  useEffect(() => {
    if (token) {
      connect();
    }
    // Cleanup on logout or unmount
    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  // Effect to check session validity on load, only after rehydration
  useEffect(() => {
    if (!_hasHydrated) {
      console.log('[AppLayout] Waiting for wallet store hydration...');
      return;
    }

    console.log('[AppLayout] Hydration complete. Checking wallet session...');
    console.log(`[AppLayout] Initial state: isWalletUnlocked=${isWalletUnlocked}, unlockTimestamp=${unlockTimestamp}`);

    if (isWalletUnlocked && unlockTimestamp) {
      const timeElapsed = Date.now() - unlockTimestamp;
      const timeRemaining = (5 * 60 * 1000) - timeElapsed;
      console.log(`[AppLayout] Time elapsed since unlock: ${timeElapsed}ms. Time remaining: ${timeRemaining}ms.`);

      if (timeRemaining <= 0) {
        console.log('[AppLayout] Session expired on load. Locking wallet.');
        lockWallet();
      } else {
        console.log('[AppLayout] Session valid on load. Resetting auto-lock timer for remaining time.');
        // If the session is still valid, restart the timer for the remaining time
        resetUnlockTimer(timeRemaining);
      }
    }
  }, [_hasHydrated, isWalletUnlocked, unlockTimestamp, lockWallet, resetUnlockTimer]);


  if (!isAuthInitialized) {
    return (
      <>
        <AuthInitializer />
        <div className="flex items-center justify-center h-screen">
          <DottedHourglassLoader />
        </div>
      </>
    );
  }

  if (token) {
    return (
      <>
        <AuthInitializer />
        <div className="flex">
          <Sidebar />
          <main className="flex-grow p-6 ml-64">{children}</main>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthInitializer />
      <SGCNavbar />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;

