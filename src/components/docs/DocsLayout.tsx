"use client";

import React from 'react';

interface DocsLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="bg-white">
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <aside className="w-full md:w-64 lg:w-72 md:sticky md:top-24 h-full">
              {sidebar}
            </aside>
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsLayout;
