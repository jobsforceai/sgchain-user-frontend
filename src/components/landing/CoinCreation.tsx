import React from 'react'
import Image from 'next/image'
import SGCBlackButton from '@/components/SGCBlackButton'

const CoinCreation: React.FC = () => {
    return (
        <section className="md:-my-8 h-full w-full">
            <div className="max-w-6xl mx-auto px-4 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 ">
                    {/* Left card */}
                    <div className="relative bg-white/5 p-8 md:p-10 flex flex-col h-full border-b md:border-r md:border-b-0 border-dashed border-slate-200">
                        <div className="absolute right-0 -bottom-2 -translate-y-1/2 translate-x-1/2 h-2 w-2 rounded-full border border-slate-300 bg-white" />
                        <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 h-2 w-2 rounded-full border border-slate-300 bg-white" />

                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-3xl font-semibold">Create token</h3>

                            <div className="w-56 h-56 relative self-center">
                                <Image src="/glass/coin1.png" alt="feature image" fill className="object-contain" />
                            </div>

                            <p className="text-slate-700 mt-2 text-center">Launch a custom token on the SGChain platform with a few clicks — customizable supply, metadata and distribution options.</p>
                        </div>

                        <div className=" mt-2 flex justify-center">
                            <SGCBlackButton link="/login" name="Create Token" />
                        </div>
                    </div>

                    {/* Right card */}
                    <div className="bg-white/5 p-8 md:p-10 flex flex-col h-full ">
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-3xl font-semibold">Create Supercoin</h3>

                            <div className="w-56 h-56 relative self-center">
                                <Image src="/glass/coin.png" alt="feature image" fill className="object-contain" />
                            </div>

                            <p className="text-slate-700 mt-2 text-center">Super Coin is a bold, futuristic digital asset designed with a clean halftone aesthetic, symbolizing strength, simplicity, and universal utility.</p>
                        </div>

                        <div className="mt-2 flex justify-center">
                            <SGCBlackButton link="/login" name="Manage" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CoinCreation