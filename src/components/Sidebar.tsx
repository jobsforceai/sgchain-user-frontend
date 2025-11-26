'use client';
import useAuthStore from '@/stores/auth.store';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import SGCButton from './SGCButton';
import Modal from './Modal';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/token', label: 'Create Token' },
    { href: '/swap', label: 'Swap' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/kyc', label: 'KYC' },
    { href: '/withdraw', label: 'Withdraw' },
    // { href: '/profile', label: 'Profile' },
  ];

  return (
    <>
      <aside className="bg-gray-50 border-r border-gray-200 w-64 h-screen flex flex-col p-4 fixed top-0 left-0 z-50">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Image src="/sg-logo.png" alt="SGC Logo" width={120} height={40} />
          </Link>
        </div>
        <nav className="grow">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-white bg-gray-900'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <SGCButton onClick={() => setIsLogoutModalOpen(true)} className="w-full" variant="danger">
            Logout
          </SGCButton>
        </div>
      </aside>

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

export default Sidebar;
