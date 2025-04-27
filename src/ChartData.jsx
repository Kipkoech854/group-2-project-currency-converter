import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const ChartData = ({ historicalRates, isLoading }) => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [selectedRange, setSelectedRange] = useState('14');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!historicalRates.length || isLoading) return;

    let filteredRates = [...historicalRates];
    if (selectedRange !== 'all') {
      const days = parseInt(selectedRange, 10);
      filteredRates = historicalRates.slice(0, days).reverse();
    }

    const validData = filteredRates.filter(entry =>
      entry.rates?.[baseCurrency] && entry.rates?.[targetCurrency]
    );

    if (validData.length === 0) return;

    const labels = validData.map(entry => entry.date);
    const data = validData.map(entry => {
      const baseRate = entry.rates[baseCurrency];
      const targetRate = entry.rates[targetCurrency];
      return (1 / baseRate) * targetRate;
    });

    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `1 ${baseCurrency} to ${targetCurrency}`,
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => 
                `1 ${baseCurrency} = ${context.parsed.y.toFixed(4)} ${targetCurrency}`
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [historicalRates, baseCurrency, targetCurrency, selectedRange, isLoading]);

  if (isLoading) return <div className="loading">Loading chart data...</div>;
  if (!historicalRates.length) return <div>No data available</div>;

  return (
    <div className="chart-container">
      <div className="chart-controls">
        <div className="currency-selectors">
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {historicalRates[0]?.rates && Object.keys(historicalRates[0].rates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <span>to</span>
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            {historicalRates[0]?.rates && Object.keys(historicalRates[0].rates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        
        <div className="range-buttons">
          {['14', '30', '90', '180', '365'].map(range => (
            <button
              key={range}
              className={selectedRange === range ? 'active' : ''}
              onClick={() => setSelectedRange(range)}
            >
              {range === '14' ? '2 Weeks' :
               range === '30' ? '1 Month' :
               range === '90' ? '3 Months' :
               range === '180' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>
      
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartData;