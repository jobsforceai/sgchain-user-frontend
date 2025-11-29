'use client';

import useAuthStore from '@/stores/auth.store';
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AuthInitializer from './AuthInitializer';
import { DottedHourglassLoader } from './DottedHourglassLoader';
import SGCNavbar from './SGCNavbar';
import useConfigStore from '@/stores/config.store';
import useWalletStore from '@/stores/wallet.store';
import useTransactionStore from '@/stores/transaction.store';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import BottomNavBar from './BottomNavBar';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import { Toaster } from 'react-hot-toast';
import ConfettiManager from './ConfettiManager';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthInitialized } = useAuthStore();
  const { fetchEmojiConfig } = useConfigStore();
  const { isWalletUnlocked, lockWallet, unlockTimestamp, _hasHydrated, resetUnlockTimer } = useWalletStore();
  const { connect, disconnect } = useTransactionStore();

  return (
    <>
      <AuthInitializer />
      <Toaster position="top-right" />
      <ConfettiManager />
      {token ? (
// ... existing code
        <>
          <MobileHeader />
          <div className="flex h-screen flex-col">
            <div className="flex flex-grow">
              <div className="hidden lg:block">
                <Sidebar />
              </div>
              <main className="flex-grow p-6 transition-all duration-300 ease-in-out overflow-y-auto lg:ml-64 pb-20 lg:pb-6 pt-16 lg:pt-6">
                <DesktopHeader />
                <div className="flex-grow">{children}</div>
              </main>
            </div>
          </div>
          <BottomNavBar />
        </>
      ) : (
        <>
          <SGCNavbar />
          <main>{children}</main>
        </>
      )}
    </>
  );
};

export default AppLayout;