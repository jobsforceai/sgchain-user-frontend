"use client"
import React, { useMemo, useState } from 'react'
import { Coins, Settings, TrendingUp } from 'lucide-react'

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
}

const Liquiditycontainers = () => {
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

  return (
    <section className="">
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
              <label className="text-sm text-slate-400">Enter principal (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                className="mt-2 w-full rounded-md bg-transparent border border-slate-700 px-3 py-2"
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
              <label className="text-sm text-slate-400">Duration (months)</label>
              <input
                type="number"
                min={1}
                value={months}
                onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
                className="mt-2 w-full rounded-md bg-transparent border border-slate-700 px-3 py-2"
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
  )
}

export default Liquiditycontainers