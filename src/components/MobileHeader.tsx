'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiLogOut } from 'react-icons/fi';
import useAuthStore from '@/stores/auth.store';
import Modal from './Modal';

const MobileHeader: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gray-50 border-b border-gray-200 shadow-sm z-50 lg:hidden h-16 flex items-center justify-between px-4">
        <Link href="/dashboard">
          <Image src="/sg-logo.png" alt="SGC Logo" width={100} height={32} />
        </Link>
        <button 
          onClick={() => setIsLogoutModalOpen(true)} 
          className="p-2 rounded-full text-red-600 hover:bg-red-50"
          aria-label="Logout"
        >
          <FiLogOut className="h-6 w-6" />
        </button>
      </header>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
};

export default MobileHeader;
