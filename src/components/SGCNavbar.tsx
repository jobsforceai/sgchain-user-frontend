'use client';
import useAuthStore from '@/stores/auth.store';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SGCBlackButton from './SGCBlackButton';

const SGCNavbar: React.FC = () => {
  const pathname = usePathname();
  const { token } = useAuthStore();
  const isLandingPage = pathname === '/';

  const unauthedLinks = [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  const landingLinks = [
    { href: '#wallet', label: 'Wallet' },
    { href: '#api', label: 'API' },
    { href: '#coin-creation', label: 'Coin Creation' },
    { href: '#liquidity', label: 'Liquidity' },
    { href: '#register-company', label: 'Register Company' },
  ];

  const navLinks = isLandingPage ? landingLinks : unauthedLinks;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, '');
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: 'smooth',
    });
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Don't render the navbar if the user is authenticated
  if (token) {
    return null;
  }

  return (
    <nav className="bg-white border-b z-50 border-dashed border-gray-300 mx-4 relative">
      <div className="px-4 mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/sg-logo.png" alt="SGC Logo" width={120} height={40} />
            </Link>
          </div>

          {/* Desktop / large tablet nav */}
          <div className="hidden lg:flex bg-[#f4f4f5] rounded-lg shadow p-1 items-center space-x-4">
            {navLinks.map((link) => (
              isLandingPage ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleScroll}
                  className="px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-700 hover:bg-white hover:shadow-md"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-white bg-gray-900'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center">
            <SGCBlackButton name="Create Account" link="/login" />
          </div>

          {/* Mobile / tablet hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="relative z-50 p-3 rounded-full bg-[#232323] shadow-md flex items-center justify-center"
            >
              <span
                className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
                  open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-200 absolute ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
                  open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop: blur and block interaction/scroll behind the menu */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-30 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      >
        <div className="w-full h-full backdrop-blur-sm bg-black/20" />
      </div>

      {/* Mobile / tablet menu panel */}
      <div
        className={`lg:hidden absolute left-0 right-0 top-full mt-2 transform origin-top transition-transform duration-200 z-40 ${
          open ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-3 space-y-2">
            {navLinks.map((link) => (
              isLandingPage ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleScroll}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? 'text-white bg-gray-900'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-2">
              <SGCBlackButton name="Create Account" link="/register" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SGCNavbar;
