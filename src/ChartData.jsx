import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import CurrencyDropdowns from './CurrencyDropDowns';
import {fetchHistoricalRates} from './GetRates.jsx';

function ChartData() {
  const [historicalRates, setHistoricalRates] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchAvailableCurrencies = async () => {
      try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_mfLM9nmOX7tTQb4sTn3AH7e3CYfgw7TQUDGQQkR7`);
        const data = await response.json();
        setAvailableCurrencies(Object.keys(data.data));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchAvailableCurrencies();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchHistoricalRates(baseCurrency);
      setHistoricalRates(results);
    };

    fetchData();
  }, [baseCurrency]);

  useEffect(() => {
    if (historicalRates.length === 0 || !targetCurrency) return;

    const labels = historicalRates.map(entry => entry.date);
    const data = historicalRates.map(entry => entry.rates[targetCurrency]);

    const chartData = {
      labels,
      datasets: [
        {
          label: `Exchange Rate: ${baseCurrency} to ${targetCurrency}`,
          data,
          borderColor: 'rgba(231, 30, 91, 1)',
          borderWidth: 1,
          tension: 0.4,
          fill: false,
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
    <div>
      <CurrencyDropdowns
        availableCurrencies={availableCurrencies}
        baseCurrency={baseCurrency}
        targetCurrency={targetCurrency}
        setBaseCurrency={setBaseCurrency}
        setTargetCurrency={setTargetCurrency}
      />
      <canvas ref={chartRef} id="exchangeRateChart"></canvas>
    </div>
  );
}

export default ChartData;
