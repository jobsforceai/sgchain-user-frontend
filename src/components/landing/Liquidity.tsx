"use client"
import React, { useMemo, useState } from 'react'
import SGCBlackButton from '../SGCBlackButton'
import Image from 'next/image'
import { Coins, Settings, TrendingUp } from 'lucide-react'
import Modal from '@/components/Modal'
import { formsService } from '@/services/forms.service'
import SGCInput from '../SGCInput'
import SGCButton from '../SGCButton'

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
}

const Liquidity = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [apiResponse, setApiResponse] = useState<any>(null);

    const [amount, setAmount] = useState<number>(1000)
    const [apy, setApy] = useState<number>(12) // percent
    const [months, setMonths] = useState<number>(12)

    // monthly compound interest
    const results = useMemo(() => {
        const r = apy / 100 / 12
        const n = months
        const final = amount * Math.pow(1 + r, n)
        const profit = final - amount
        return { final, profit }
    }, [amount, apy, months])

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSubmissionStatus('idle');
        setEmail('');
        setApiResponse(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('loading');
        try {
            const response = await formsService.submitLiquidityInterest({
                email,
                principalAmountUsd: amount,
                durationMonths: months,
            });
            setApiResponse(response.data);
            setSubmissionStatus('success');
        } catch (error) {
            setSubmissionStatus('error');
        }
    };

    return (
        <>
            <section className="">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                        <div>
                            <Image src="/liquidity.png" alt="liquidity illustration" width={500} height={300} className="mt-6" />
                        </div>

                        <div className="flex flex-col items-start md:items-center gap-4">
                            <h2 className="text-3xl text-center md:text-5xl font-bold">Become a <span className='text-[#0121cb] font-cream'>Liquidity Provider</span> today</h2>
                            <p className="mt-3 text-slate-700 text-center max-w-lg">Earn fees and incentives by supplying liquidity to trading pools on SGChain. Our protocol offers low slippage and automated market-making tailored for institutional and retail participants.</p>
                            <SGCBlackButton name="Provide Liquidity" onClick={handleOpenModal} />
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="mt-16">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* 1. Amount to invest */}
                  <div className="bg-white/5 border border-slate-200/10 rounded-lg p-6 flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md">
                        <Coins className="w-5 h-5 text-black" />
                      </div>
                      <h4 className="text-lg font-semibold">Liquidity to invest</h4>
                    </div>

                    <div className="mt-4">
                      <SGCInput
                        id="amount"
                        label="Enter principal (USD)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                      />
                    </div>

                    <div className="mt-4 text-sm text-slate-400">
                      Current: <span className="font-medium text-white">{formatCurrency(amount)}</span>
                    </div>
                  </div>

                  {/* 2. Algorithm / calculation settings */}
                  <div className="bg-white/5 border border-slate-200/10 rounded-lg p-6 flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md">
                        <Settings className="w-5 h-5 text-black" />
                      </div>
                      <h4 className="text-lg font-semibold">Algorithm / APY</h4>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm text-slate-400">Estimated APY (%)</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={apy}
                        onChange={(e) => setApy(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="mt-2 text-sm">APY: <span className="font-medium">{apy}%</span></div>
                    </div>

                    <div className="mt-4">
                      <SGCInput
                        id="months"
                        label="Duration (months)"
                        type="number"
                        min={1}
                        value={months}
                        onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
                      />
                    </div>
                  </div>

                  {/* 3. Returns */}
                  <div className="bg-white/5 border border-slate-200/10 rounded-lg p-6 flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md">
                        <TrendingUp className="w-5 h-5 text-black" />
                      </div>
                      <h4 className="text-lg font-semibold">Projected returns</h4>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-slate-400">Estimated final balance</div>
                      <div className="mt-2 text-2xl font-bold">{formatCurrency(results.final)}</div>
                      <div className="mt-2 text-sm text-slate-400">Profit: <span className="font-medium text-white">{formatCurrency(results.profit)}</span></div>
                      <div className="mt-4 text-xs text-slate-400">Calculation: monthly compounding using APY and duration.</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Submit Liquidity Interest">
                {submissionStatus === 'success' && apiResponse ? (
                    <div>
                        <h3 className="text-lg font-semibold text-green-600">Interest Submitted Successfully!</h3>
                        <p className="mt-2">Thank you for your interest. Here is your confirmation receipt:</p>
                        <div className="mt-4 p-4 bg-slate-100 rounded-md text-sm text-slate-800 space-y-1">
                            <p><strong>Principal:</strong> {formatCurrency(apiResponse.calculation.principal)}</p>
                            <p><strong>APY:</strong> {apiResponse.calculation.apy}%</p>
                            <p><strong>Duration:</strong> {apiResponse.calculation.durationMonths} months</p>
                            <hr className="my-2"/>
                            <p className="font-bold"><strong>Projected Balance:</strong> {formatCurrency(apiResponse.calculation.projectedBalance)}</p>
                            <p className="font-bold"><strong>Estimated Profit:</strong> {formatCurrency(apiResponse.calculation.profit)}</p>
                        </div>
                        <div className="flex justify-end mt-6">
                            <SGCBlackButton name="Close" onClick={handleCloseModal} />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p className='mb-4 text-gray-700 text-sm'>Enter your email to record your interest. Our team will get in touch with you.</p>
                        <SGCInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
                            <h4 className="font-semibold text-slate-800">Your Interest Summary:</h4>
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                                <p><strong>Principal:</strong> {formatCurrency(amount)}</p>
                                <p><strong>Duration:</strong> {months} months</p>
                                <p><strong>Projected Balance:</strong> {formatCurrency(results.final)}</p>
                            </div>
                        </div>

                        {submissionStatus === 'error' && (
                            <p className="mt-4 text-sm text-center text-red-600">An error occurred. Please try again.</p>
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                             <SGCButton onClick={handleCloseModal} variant="outline">
                                Cancel
                            </SGCButton>
                            <SGCButton
                                type="submit"
                                disabled={submissionStatus === 'loading' || !email}
                            >
                                {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Interest'}
                            </SGCButton>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    )
}

export default Liquidity;