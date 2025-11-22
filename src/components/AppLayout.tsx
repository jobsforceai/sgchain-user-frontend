'use client';

import useAuthStore from '@/stores/auth.store';
import React from 'react';
import Sidebar from './Sidebar';
import AuthInitializer from './AuthInitializer';
import { DottedHourglassLoader } from './DottedHourglassLoader';
import SGCNavbar from './SGCNavbar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthInitialized } = useAuthStore();

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
