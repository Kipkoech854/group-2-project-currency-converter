import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import CurrencyDropdowns from './CurrencyDropDowns';
import { fetchHistoricalRates } from './GetRates.jsx';
import './App.css';

function ChartData() {
  const [historicalRates, setHistoricalRates] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Fetch available currencies once
  useEffect(() => {
    const fetchAvailableCurrencies = async () => {
      try {
        const appId = '77676428db81415db0022d7c5e1bdfe4';
        const response = await fetch(
          `https://openexchangerates.org/api/currencies.json?app_id=${appId}`
        );
        const data = await response.json();
        setAvailableCurrencies(Object.keys(data));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchAvailableCurrencies(); // Only call this once
  }, []);

  // Fetch historical rates once and store them in the state
  useEffect(() => {
    setLoading(true);
    fetchHistoricalRates(baseCurrency, days, setHistoricalRates); // This will call the function and update historicalRates state
    setLoading(false);
  }, [baseCurrency, days]);

  // Create chart using stored historical data
  useEffect(() => {
    if (historicalRates.length === 0 || !targetCurrency) return;

    const labels = historicalRates.map((entry) => entry.date);
    const data = historicalRates.map((entry) => entry.rates[targetCurrency]);

    const chartData = {
      labels,
      datasets: [
        {
          label: `Exchange Rate: ${baseCurrency} to ${targetCurrency}`,
          data,
          borderColor: 'rgba(231, 30, 91, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: {
            above: 'rgb(255, 165, 0)',
            below: 'rgb(204, 102, 0)',
          }
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Exchange Rate',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  }, [historicalRates, baseCurrency, targetCurrency]);

  return (
    <div className="p-4">
      <div className="button-container">
        <button
          className={`button button-default ${days === 14 ? 'button-active-14' : ''}`}
          onClick={() => setDays(14)}
        >
          14 Days
        </button>
        <button
          className={`button button-default ${days === 21 ? 'button-active-21' : ''}`}
          onClick={() => setDays(21)}
        >
          21 Days
        </button>
        <button
          className={`button button-default ${days === 30 ? 'button-active-30' : ''}`}
          onClick={() => setDays(30)}
        >
          30 Days
        </button>
      </div>

      <CurrencyDropdowns
        availableCurrencies={availableCurrencies}
        baseCurrency={baseCurrency}
        targetCurrency={targetCurrency}
        setBaseCurrency={setBaseCurrency}
        setTargetCurrency={setTargetCurrency}
      />

      {loading ? (
        <div className="text-center my-10 bg-green-500 p-10 rounded-md">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-white">Loading chart data...</p>
        </div>
      ) : (
        <canvas ref={chartRef} id="exchangeRateChart"></canvas>
      )}
    </div>
  );
}

export default ChartData;
