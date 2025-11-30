"use client";

import React, { useState, useEffect } from 'react';

interface SidebarProps {
  headings: { slug: string; title: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ headings }) => {
  const [activeSlug, setActiveSlug] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' } // highlight when element is in the middle of the viewport
    );

    const elements = headings.map(({ slug }) => document.getElementById(slug)).filter(Boolean);
    elements.forEach((el) => observer.observe(el!));

    return () => elements.forEach((el) => observer.unobserve(el!));
  }, [headings]);

  return (
    <nav>
      <h3 className="text-lg font-semibold mb-4">On this page</h3>
      <ul className="space-y-2">
        {headings.map(({ slug, title }) => (
          <li key={slug}>
            <a
              href={`#${slug}`}
              className={`block text-sm transition-colors duration-200 ${
                activeSlug === slug
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
