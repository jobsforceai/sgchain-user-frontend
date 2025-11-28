'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FiHome, FiPlusSquare, FiCreditCard, FiCheckSquare, FiDownload } from 'react-icons/fi';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { href: '/token', label: 'Create Token', icon: <FiPlusSquare /> },
  { href: '/wallet', label: 'Wallet', icon: <FiCreditCard /> },
  { href: '/kyc', label: 'KYC', icon: <FiCheckSquare /> },
  { href: '/withdraw', label: 'Withdraw', icon: <FiDownload /> },
];

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 shadow-lg z-50 lg:hidden">
      <div className="flex justify-around max-w-screen-lg mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${
              pathname === link.href
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <span className="text-2xl mb-1">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
