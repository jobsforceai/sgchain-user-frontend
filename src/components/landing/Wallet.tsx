import React from 'react';
import SGCCard from '@/components/SGCCard';
import Image from 'next/image';

const WalletHero: React.FC = () => {
    return (
        <section className="py-16 mx-10 bg-[linear-gradient(180deg,#F7F7F7_0%,#FFFFFF_20%,rgba(255,255,255,0)_100%)]">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl text-center md:text-5xl font-bold mb-8">Introducing <span className='text-[#0121cb] font-cream'>sgchain</span> <br></br> wallet</h2>

                <div className="flex flex-col md:flex-row gap-6 w-full items-stretch md:min-h-144">
                    {/* Left column: two stacked bentos (row 1 & 2) */}
                    <div className='flex flex-col gap-6 w-full md:w-1/2 h-auto md:h-full md:flex-1'>
                        <SGCCard className='group bg-[radial-gradient(circle_at_top_right,#ABB4E5_0%,rgba(213,217,242,0.75)_28%,rgba(239,241,250,0.85)_41%,rgba(255,255,255,0.92)_61%,rgba(255,255,255,1)_100%)] min-h-72 md:flex-1 flex flex-col mb-0 relative overflow-hidden'>
                            <Image
                                src="/glass/wallet1.svg"
                                alt="wallet feature 1"
                                width={500}
                                height={500}
                                className='w-44 md:w-60 absolute top-0 right-0 group-hover:scale-110 transition-all duration-500' />

                            <div className='absolute bottom-5 left-5 flex flex-col'>
                                <h1 className='text-2xl font-bold text-[#232323]'>Secure by Design</h1>
                                <p className='text-sm w-[80%] text-slate-600'>Your assets stay protected with bank-grade encryption, AI-driven anomaly detection, and decentralized key architecture.</p>
                            </div>
                        </SGCCard>
                        <SGCCard className='group bg-[radial-gradient(circle_at_top_right,#ABB4E5_0%,rgba(213,217,242,0.75)_28%,rgba(239,241,250,0.85)_41%,rgba(255,255,255,0.92)_61%,rgba(255,255,255,1)_100%)] min-h-72 md:flex-1 flex flex-col mb-0 relative overflow-hidden'>
                            <Image
                                src="/glass/wallet2.svg"
                                alt="wallet feature 2"
                                width={500}
                                height={500}
                                className='w-44 md:w-60 absolute top-0 right-0 group-hover:scale-110 transition-all duration-500' />
                            <div className='absolute bottom-5 left-5 flex flex-col'>
                                <h1 className='text-2xl font-bold text-[#232323]'>Instant Cross-Chain Transfers</h1>
                                <p className='text-sm w-[80%] text-slate-600'>Move funds between chains in seconds. No bridges, no delays — SGChain’s settlement layer handles everything automatically.</p>
                            </div>
                        </SGCCard>
                    </div>

                    <div className='w-full md:w-1/2 md:flex-1'>
                        <SGCCard className='group h-full mb-0 border border-[#d4d4da]/50 rounded-xl bg-[#232323] text-white flex flex-col items-center justify-center relative overflow-hidden'>
                            <Image
                                src="/glass/wallet3.svg"
                                alt="wallet feature 3"
                                width={500}
                                height={500}
                                className='w-56 md:w-80 group-hover:scale-110 transition-all duration-500' />
                            <div className='absolute bottom-5 left-5 flex flex-col'>
                                <h1 className='text-2xl font-bold'>Built for Brokers & Retail Users</h1>
                                <p className='text-sm w-[80%]'>A unified wallet for trading, investing, earning yield, and managing multi-chain assets — all inside one sleek interface.</p>
                            </div>
                        </SGCCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WalletHero;
