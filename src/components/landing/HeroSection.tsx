"use client";

import Image from 'next/image';
import { DottedHourglassLoader } from '../DottedHourglassLoader';
import SGCBlackButton from '@/components/SGCBlackButton';

export default function HeroSection() {
  return (
    <section className='h-screen'>
      {/* dotted hourglass background (absolute) */}
      <div className='-mt-10'>
      <DottedHourglassLoader />
      </div>

      {/* blob images on top of the dotted gradient */}
      <div className="pointer-events-none absolute inset-0 z-40 -mt-10">
        <div className="relative w-full h-full">
          {/* left small blob (hidden on very small screens) */}
          <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 hidden sm:block opacity-50">
            <Image src="/pill.png" alt="blob left" width={250} height={250} />
          </div>

          {/* center large blob */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Image src="/main-pill.png" alt="blob center" width={400} height={400} />
          </div>

          {/* right small blob (hidden on very small screens) */}
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:block opacity-50">
            <Image src="/pill.png" alt="blob right" width={250} height={250} />
          </div>
        </div>
      </div>

      {/* ring chain overlay connecting blobs (kept commented if not wanted) */}
      {/* <div className="absolute inset-0 z-45 pointer-events-none">
        <RingChain />
      </div> */}

      {/* Center content (title + subtitle) */}
      <div className="absolute inset-0 z-60 flex items-center justify-center pointer-events-auto">
        <div className="text-center px-4">
            <Image src="/logo-large.png" alt="sgchain logo" width={600} height={200} />
          <p className="md:-mt-18 text-sm sm:text-base md:text-xl text-black">The Autonomous AI Financial Superchain</p>
        </div>
      </div>

      {/* Bottom strip: left/right texts and center CTA */}
      <div className="absolute left-0 right-0 bottom-20 z-60 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-4">
          <div className="hidden sm:flex flex-col w-1/3">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-black">High-throughput cross-chain settlement layer</h3>
            <p className="text-xs md:text-sm text-black/70 text-center">Move funds across chains and fiat rails in seconds — no stack changes needed.</p>
          </div>

          <div className="flex items-center justify-center w-full sm:w-auto">
            <SGCBlackButton
              link="/login"
              name={
                <>
                  <span>Get Started</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 inline-block"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </>
              }
              className="px-6 py-3"
            />
          </div>

          <div className="hidden sm:flex flex-col w-1/3">
            <h3 className="text-2xl md:text-3xl font-semibold text-black text-center">Autonomous liquidity</h3>
            <p className="text-xs md:text-sm text-black/70 text-center">Let AI route order flow, rebalance liquidity, and protect against manipulation in real time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
