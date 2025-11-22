"use client"

import React, { useEffect, useRef } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts'

type Props = {
  data?: CandlestickData[]
  height?: number
}

const SGCPriceChart: React.FC<Props> = ({ data, height = 300 }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  // Sample mock data if none provided (time in YYYY-MM-DD -> convert to unix timestamp)
  const sampleData: CandlestickData[] = [
    { time: '2025-11-01', open: 10, high: 12, low: 9, close: 11 },
    { time: '2025-11-02', open: 11, high: 13, low: 10, close: 12 },
    { time: '2025-11-03', open: 12, high: 14, low: 11, close: 13 },
    { time: '2025-11-04', open: 13, high: 15, low: 12, close: 14 },
    { time: '2025-11-05', open: 14, high: 16, low: 13, close: 15 },
    { time: '2025-11-06', open: 15, high: 17, low: 14, close: 16 },
    { time: '2025-11-07', open: 16, high: 18, low: 15, close: 17 }
  ]

  useEffect(() => {
    if (!chartContainerRef.current) return

    // create chart
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#94a3b8'
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: '#0f172a22' }
      },
      rightPriceScale: { visible: true },
      timeScale: { timeVisible: true, secondsVisible: false }
    })

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#16a34a',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#16a34a',
      wickDownColor: '#ef4444'
    })

    // set data
    seriesRef.current.setData(data ?? sampleData)

    // handle resize
    const handleResize = () => {
      if (!chartRef.current || !chartContainerRef.current) return
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [data, height])

  return (
    <div className="w-full">
      <div ref={chartContainerRef} style={{ width: '100%', height }} />
    </div>
  )
}

export default SGCPriceChart
