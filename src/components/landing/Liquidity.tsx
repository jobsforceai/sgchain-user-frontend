import React from 'react'
import Link from 'next/link'
import SGCBlackButton from '../SGCBlackButton'
import Image from 'next/image'

const Liquidity = () => {
    return (
        <section className="">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                    <div>
                        <Image src="/liquidity.png" alt="liquidity illustration" width={500} height={300} className="mt-6" />
                    </div>

                    <div className="flex flex-col items-start md:items-center gap-4">
                        <h2 className="text-3xl text-center md:text-5xl font-bold">Become a <span className='text-[#0121cb] font-cream'>Liquidity Provider</span> today</h2>
                        <p className="mt-3 text-slate-700 text-center max-w-lg">Earn fees and incentives by supplying liquidity to trading pools on SGChain. Our protocol offers low slippage and automated market-making tailored for institutional and retail participants.</p>
                        <SGCBlackButton name="Provide Liquidity" link="/login" >
                        </SGCBlackButton>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Liquidity