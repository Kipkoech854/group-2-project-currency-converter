import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import CurrencyDropdowns from './CurrencyDropDowns';
import './App.css';

function ChartData({ historicalRates, isLoading }) {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [selectedRange, setSelectedRange] = useState('14'); // default 14 days

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!historicalRates.length || isLoading) return;

    let filteredRates = [...historicalRates];

    if (selectedRange !== 'all') {
      const days = parseInt(selectedRange, 10);
      filteredRates = historicalRates.slice(-days);
    }

    const validData = filteredRates.filter(entry =>
      entry.rates?.[baseCurrency] && entry.rates?.[targetCurrency]
    );

    if (validData.length === 0) return;

    const labels = validData.map(entry => entry.date);
    const data = validData.map(entry => {
      const baseRate = entry.rates[baseCurrency];
      const targetRate = entry.rates[targetCurrency];
      return targetRate / baseRate;
    });

    const chartData = {
      labels,
      datasets: [{
        label: `1 ${baseCurrency} to ${targetCurrency}`,
        data,
        borderColor: 'rgba(231, 30, 91, 1)',
        backgroundColor: 'rgba(231, 30, 91, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `1 ${baseCurrency} = ${context.parsed.y.toFixed(4)} ${targetCurrency}`
          }
        },
      },
      scales: {
        y: {
          title: { display: true, text: 'Exchange Rate' },
        },
        x: {
          title: { display: true, text: 'Date' },
        },
      },
    };

    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [historicalRates, baseCurrency, targetCurrency, selectedRange, isLoading]);

  if (isLoading) return <p>Loading chart...</p>;
  if (!historicalRates.length) return <p>No data to display</p>;

  return (
    <div className="chart-container">
      <div className="button-container">
  {[
    { range: '14', label: '2 Weeks', color: '#2196F3' },    
    { range: '30', label: '1 Month', color: '#4CAF50' },     
    { range: '60', label: '2 Months', color: '#FF9800' },   
    { range: '90', label: '3 Months', color: '#9C27B0' },    
    { range: '180', label: '6 Months', color: '#F44336' },   
    { range: '365', label: '1 Year', color: '#607D8B' },     
        
  ].map(({ range, label, color }) => (
    <button
      key={range}
      className={`button ${selectedRange === range ? 'active' : ''}`}
      onClick={() => setSelectedRange(range)}
      style={{
        backgroundColor: selectedRange === range ? color : '#f0f0f0',
        color: selectedRange === range ? 'white' : '#333',
        border: `1px solid ${selectedRange === range ? color : '#ccc'}`,
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '0 4px',
        transition: 'all 0.3s ease'
      }}
    >
      {label}
    </button>
  ))}
</div>
      
      <CurrencyDropdowns
        availableCurrencies={Object.keys(historicalRates[0]?.rates || {})}
        baseCurrency={baseCurrency}
        targetCurrency={targetCurrency}
        setBaseCurrency={setBaseCurrency}
        setTargetCurrency={setTargetCurrency}
      />

            <canvas
        ref={chartRef}
        id="exchangeRateChart"
        aria-label="Exchange Rate Chart"
      />
    </div>
  );
}

export default ChartData;
