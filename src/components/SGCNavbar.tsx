'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SGCNavbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/market', label: 'Market' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/profile', label: 'Profile' },
    { href: '/buy', label: 'Buy SGC' },
    { href: '/redeem', label: 'Redeem' },
    { href: '/sell', label: 'Sell SGC' },
    { href: '/history', label: 'History' },
    { href: '/kyc', label: 'KYC' },
    { href: '/withdraw', label: 'Withdraw' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800">
              SGChain
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'text-white bg-gray-900'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SGCNavbar;
