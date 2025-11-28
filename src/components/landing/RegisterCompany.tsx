"use client"

import React from 'react'
import Image from 'next/image'
import SGCBlackButton from '@/components/SGCBlackButton'

const RegisterCompany: React.FC = () => {
    return (
        <section className="md:-my-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center">

                    {/* Left: heading, description, bullets, CTA */}
                    <div className='flex flex-col items-start md:items-center gap-4'>
                        <h2 className="text-3xl text-center md:text-5xl font-bold w-full">Register your company<br></br> at <span className='text-[#0121cb] font-cream'>Sgchain</span>   </h2>
                        <p className="mt-4 text-slate-700 max-w-md text-center">Start your on-chain journey: register your company to access institutional-grade tools, token issuance, and liquidity management tailored for enterprises.</p>

                        {/* <ul className="mt-6 space-y-3  text-sm flex flex-col items-start justify-center text-slate-600">
                            <li className="flex gap-3">
                                <span className="inline-block w-1 h-1 mt-1 bg-[#1e3bcd] rounded-full" />
                                <span>Fast KYC onboarding and company verification</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="inline-block w-1 h-1 mt-1 bg-[#1e3bcd] rounded-full" />
                                <span>Native token issuance and supply controls</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="inline-block w-1 h-1 mt-1 bg-[#1e3bcd] rounded-full" />
                                <span>Access to liquidity & institutional tooling</span>
                            </li>
                        </ul> */}

                        <div className="mt-6 flex justify-center w-full">
                            <SGCBlackButton link="/login" name={"Register Now"} className="px-6 py-3" />
                        </div>
                    </div>

                    {/* Right: image card */}
                    <div className="relative">
                        <div className="rounded-xl overflow-hidden ">
                            <div className="">
                                <Image src="/bse.png" alt="BSE" width={640} height={420} className="object-contain w-full h-full" />
                            </div>
                        </div>

                        {/* <div className="absolute -bottom-4 left-6 md:left-10">
              <div className="bg-[#0f172a] text-xs text-slate-300 px-3 py-2 rounded-lg shadow">Trusted listing partners</div>
            </div> */}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default RegisterCompany
