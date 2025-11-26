"use client"

import React from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import useMarketStore from '@/stores/market.store';

type Props = {
  height?: number
}

const SGCPriceChart: React.FC<Props> = ({ height = 300 }) => {
  const chartContainerRef = React.useRef<HTMLDivElement | null>(null);
  const chartRef = React.useRef<IChartApi | null>(null);
  const seriesRef = React.useRef<ISeriesApi<'Candlestick'> | null>(null);
  const { candles, loading, error } = useMarketStore();

  React.useEffect(() => {
    // If we have data and a container, and the chart hasn't been created yet, create it.
    if (candles.length > 0 && chartContainerRef.current && !chartRef.current) {
      console.log('[SGCPriceChart] Data is ready. Initializing chart and setting data.');
      
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height,
        layout: { background: { color: 'transparent' }, textColor: '#94a3b8' },
        grid: { vertLines: { visible: false }, horzLines: { color: '#e2e8f0' } },
        rightPriceScale: { visible: true },
        timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#e2e8f0' },
      });
      chartRef.current = chart;

      const series = chart.addCandlestickSeries({
        upColor: '#16a34a',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#16a34a',
        wickDownColor: '#ef4444',
      });
      seriesRef.current = series;

      series.setData(candles);

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.resize(chartContainerRef.current.clientWidth, height);
        }
      };
      window.addEventListener('resize', handleResize);
      
      // Return a cleanup function for when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
    // If the chart already exists, just update the last candle
    else if (chartRef.current && seriesRef.current && candles.length > 0) {
      const lastCandle = candles[candles.length - 1];
      console.log('[SGCPriceChart] Updating live data:', lastCandle);
      seriesRef.current.update(lastCandle);
    }
  }, [candles, height]);
  
  // Render loading/error state ONLY if there are no candles
  if (candles.length === 0) {
    if (loading) return <div style={{ height }} className="flex items-center justify-center"><p>Loading historical data...</p></div>;
    if (error) return <div style={{ height }} className="flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return <div ref={chartContainerRef} style={{ width: '100%', height }} />;
};

export default SGCPriceChart;
