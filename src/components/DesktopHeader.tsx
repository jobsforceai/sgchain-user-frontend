'use client';

import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import useAuthStore from '@/stores/auth.store';
import Modal from './Modal';
import SGCButton from './SGCButton';

const DesktopHeader: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <header className="hidden lg:flex h-16 items-center justify-end px-6">
        <SGCButton
          variant="danger"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <FiLogOut className="mr-2" />
          Logout
        </SGCButton>
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

export default DesktopHeader;
