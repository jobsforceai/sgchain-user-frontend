"use client"

import React from 'react';
import { createChart, IChartApi, ISeriesApi, AreaData, Time } from 'lightweight-charts';
import useMarketStore from '@/stores/market.store';

type Props = {
  height?: number
}

const SGCPriceChart: React.FC<Props> = ({ height = 300 }) => {
  const chartContainerRef = React.useRef<HTMLDivElement | null>(null);
  const chartRef = React.useRef<IChartApi | null>(null);
  const seriesRef = React.useRef<ISeriesApi<'Area'> | null>(null);
  const { candles, loading, error } = useMarketStore();

  React.useEffect(() => {
    // If we have data and a container, and the chart hasn't been created yet, create it.
    if (candles.length > 0 && chartContainerRef.current && !chartRef.current) {
      console.log('[SGCPriceChart] Data is ready. Initializing chart and setting data.');
      
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height,
        layout: { 
          background: { color: 'transparent' }, 
          textColor: '#94a3b8',
          attributionLogo: false,
        },
        grid: { vertLines: { visible: false }, horzLines: { color: '#e2e8f0' } },
        rightPriceScale: { visible: true },
        timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#e2e8f0' },
        watermark: { visible: false },
      });
      chartRef.current = chart;

      const series = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: 'rgba(41, 98, 255, 0.28)',
        bottomColor: 'rgba(41, 98, 255, 0.05)',
      });
      seriesRef.current = series;

      const areaData: AreaData[] = candles.map(candle => ({
        time: candle.time as Time,
        value: candle.close,
      }));
      series.setData(areaData);

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
      seriesRef.current.update({
        time: lastCandle.time as Time,
        value: lastCandle.close,
      });
    }
  }, [candles, height]);
  
  // Render loading/error state ONLY if there are no candles
  if (candles.length === 0) {
    if (loading) return <div style={{ height }} className="flex items-center justify-center"><p>Loading historical data...</p></div>;
    if (error) return <div style={{ height }} className="flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  const livePrice = candles.length > 0 ? candles[candles.length - 1].close : null;

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {livePrice !== null && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(41, 98, 255, 0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 10
        }}>
          Live Price: ${livePrice.toFixed(2)}
        </div>
      )}
      <div ref={chartContainerRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default SGCPriceChart;
