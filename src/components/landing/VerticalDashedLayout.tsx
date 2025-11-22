import React from 'react';

interface VerticalDashedLayoutProps {
  children: React.ReactNode;
}

const VerticalDashedLayout: React.FC<VerticalDashedLayoutProps> = ({
  children,
}) => {
  const items = React.Children.toArray(children);

  return (
    <div className="relative mb-22 flex w-full justify-center">
      <div className="w-full max-w-5xl relative">
        {/* Left vertical dashed border */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 border-l border-dashed border-slate-200" />
        {/* Right vertical dashed border */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 border-r border-dashed border-slate-200" />

        <div className="flex w-full flex-col gap-28">
          {/* Top left/right circles aligned to the side borders */}
          <div className="pointer-events-none relative h-2">
            <div className="absolute left-0 top-0 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full border border-slate-300 bg-white" />
            <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 h-2 w-2 rounded-full border border-slate-300 bg-white" />
          </div>

          {items.map((child, index) => (
            <div key={index} className="relative -mt-28 my-0">
              {child}

              {/* If not the last child, render a centered dashed divider with side markers */}
              {index < items.length - 1 && (
                <div className="relative my-8">
                  <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full border border-slate-300 bg-white" />
                  <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-2 w-2 rounded-full border border-slate-300 bg-white" />
                  <div className="w-full border-t border-dashed border-slate-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalDashedLayout;
