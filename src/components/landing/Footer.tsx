"use client";

import React from 'react'
import GlobeBackground from './GlobeBackground'

const Footer: React.FC = () => {
    return (
        <footer className="relative text-slate-200 h-[75vh] overflow-hidden">
            
            {/* glassy top strip */}
            <div className="px-6 md:px-24 bg-linear-to-b from-black/50 to-black/95 backdrop-blur-[2px] mx-auto w-full h-full">
                <div className="relative md:h-full flex flex-col md:flex-row items-start md:items-center py-8 md:py-0">
                    <div className="grid grid-cols-1 md:grid-cols-9 gap-6 md:gap-12 items-stretch w-full">
                        {/* Column 1 (big) spans 3 cols on md */}
                        <div className="md:col-span-3">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold">Sgchain</div>
                                    <div className="mt-3 flex items-center gap-3">
                                        {/* social icons - simple SVG placeholders */}
                                        <a href="#" aria-label="twitter" className="text-slate-200 hover:text-white">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.66.3-1.37.5-2.11.6.76-.46 1.35-1.2 1.63-2.08-.71.42-1.5.72-2.34.88A3.6 3.6 0 0015.5 4c-2 0-3.6 1.7-3.6 3.8 0 .3 0 .6.06.9-3-.14-5.7-1.6-7.5-3.8-.32.56-.5 1.2-.5 1.9 0 1.3.95 2.4 2.2 2.7-.6 0-1.15-.18-1.6-.46v.05c0 1.8 1.3 3.3 3 3.6-.32.08-.66.12-1 .12-.25 0-.5 0-.75-.06.5 1.6 2 2.8 3.7 2.8A7.2 7.2 0 014 19.6c1.3.8 2.9 1.3 4.6 1.3 5.5 0 8.5-4.7 8.5-8.8v-.4c.6-.45 1.1-1 1.5-1.6-.5.24-1 .4-1.52.47z" /></svg>
                                        </a>
                                        <a href="#" aria-label="discord" className="text-slate-200 hover:text-white">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 0H4C1.8 0 0 1.8 0 4v16c0 2.2 1.8 4 4 4h12l4-4V4c0-2.2-1.8-4-4-4zM8.6 11.4c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8c.9 0 1.6.8 1.6 1.8s-.7 1.8-1.6 1.8zm6.8 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8c.9 0 1.6.8 1.6 1.8s-.7 1.8-1.6 1.8z" /></svg>
                                        </a>
                                        <a href="#" aria-label="linkedin" className="text-slate-200 hover:text-white">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 24h5V7H0v17zM7 7h5v2.4h.1c.7-1.2 2.5-2.4 5.1-2.4 5.4 0 6.4 3.6 6.4 8.4V24h-5v-7.4c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 1.9-2.9 4v7.5H7V7z" /></svg>
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-col gap-2">
                                        <a href="#" className="text-sm text-slate-200 hover:text-white">Terms &amp; Conditions</a>
                                        <a href="#" className="text-sm text-slate-200 hover:text-white">Privacy Policy</a>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-sm text-slate-300">Sgxchain © 2025. All rights reserved.</div>
                                </div>
                            </div>
                        </div>

                        {/* Separator after col1 */}
                        <div className="hidden md:flex md:col-span-1 md:items-stretch">
                            <div className="relative h-full w-full flex items-center justify-center">
                                <div className="h-full border-l border-dashed border-slate-200 relative" />
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-1 h-1  border border-slate-200 rounded-full" />
                                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1 h-1  border border-slate-200 rounded-full" />
                            </div>
                        </div>

                        {/* Column 2 About */}
                        <div className="md:col-span-1">
                            <h3 className="font-semibold mb-3">About</h3>
                            <ul className="flex flex-col gap-2 text-sm text-slate-200">
                                <li><a href="#wallet" className="hover:text-white">Wallet</a></li>
                                <li><a href="#api" className="hover:text-white">API</a></li>
                                <li><a href="#coin-creation" className="hover:text-white">Coin Creation</a></li>
                                <li><a href="#liquidity" className="hover:text-white">Liquidity</a></li>
                                <li><a href="#register-company" className="hover:text-white">Register Company</a></li>
                            </ul>
                        </div>

                        {/* Separator after col2 */}
                        <div className="hidden md:flex md:col-span-1 md:items-stretch">
                            <div className="relative h-full w-full flex items-center justify-center">
                                <div className="h-full border-l border-dashed border-slate-200 relative" />
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-1 h-1  border border-slate-200 rounded-full" />
                                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1 h-1  border border-slate-200 rounded-full" />
                            </div>
                        </div>

                        {/* Column 3 Products */}
                        <div className="md:col-span-1">
                            <h3 className="font-semibold mb-3">Products</h3>
                            <ul className="flex flex-col gap-2 text-sm text-slate-200">
                                <li><a href="/dashboard" className="hover:text-white">Buy SGC</a></li>
                                <li><a href="/dashboard" className="hover:text-white">Sell SGC</a></li>
                                <li><a href="/wallet" className="hover:text-white">Wallet</a></li>
                                <li><a href="/#api" className="hover:text-white">API</a></li>
                            </ul>
                        </div>

                        {/* Separator after col3 */}
                        <div className="hidden md:flex md:col-span-1 md:items-stretch">
                            <div className="relative h-full w-full flex items-center justify-center">
                                <div className="h-full border-l border-dashed border-slate-200 relative" />
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-1 h-1  border border-slate-200 rounded-full" />
                                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1 h-1  border border-slate-200 rounded-full" />
                            </div>
                        </div>

                        {/* Column 4 Coming Soon */}
                        <div className="md:col-span-1">
                            <h3 className="font-semibold mb-3">Coming Soon</h3>
                            <ul className="flex flex-col gap-2 text-sm text-slate-200">
                                <li><a href="#" className="hover:text-white">Mobile App</a></li>
                                <li><a href="#" className="hover:text-white">Staking</a></li>
                                <li><a href="#" className="hover:text-white">Advanced Analytics</a></li>
                                <li><a href="#" className="hover:text-white">More</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* globe background behind footer content */}
            <GlobeBackground className="-z-10 scale-125" speed={0.08} />
        </footer>
    )
}

export default Footer