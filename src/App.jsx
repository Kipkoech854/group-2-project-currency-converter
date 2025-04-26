import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChartData from './ChartData';
import { fetchHistoricalRates } from './GetRates';
import { checkAndFetchDaily } from './DailyUpdater';
import PeriodDropdown from './PeriodDropdown';

const App = () => {
  const [amount, setAmount] = useState();  // Default value is 1
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('conversionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [historicalRates, setHistoricalRates] = useState([]);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  const isInitialRender = useRef(true);

  // Fetch historical rates when app loads
  useEffect(() => {
    const loadRates = async () => {
      const storedRates = localStorage.getItem('historicalRates');
      if (storedRates) {
        const parsedRates = JSON.parse(storedRates);
        setHistoricalRates(parsedRates);
      } else {
        await fetchInitialRates();
      }
    };
    loadRates();
  }, []);

  const fetchInitialRates = async () => {
    try {
      const fetchedData = await fetchHistoricalRates('USD', 365);
      setHistoricalRates(fetchedData);
      localStorage.setItem('historicalRates', JSON.stringify(fetchedData));
    } catch (error) {
      console.error('Error fetching initial rates:', error);
    }
  };

  useEffect(() => {
    checkAndFetchDaily();
  }, []);

  // Update available currencies
  useEffect(() => {
    if (historicalRates.length > 0) {
      const latest = historicalRates[historicalRates.length - 1];
      if (latest?.rates) {
        const currencies = Object.keys(latest.rates);
        setAvailableCurrencies(currencies.sort());
      }
    }
  }, [historicalRates]);

  // Handle currency conversion when the Submit button is clicked
  const handleConversion = () => {
    if (!amount || amount <= 0 || historicalRates.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const latestData = historicalRates[historicalRates.length - 1];
      const fromRate = latestData.rates[fromCurrency];
      const toRate = latestData.rates[toCurrency];

      if (!fromRate || !toRate) {
        throw new Error('Invalid currency selection');
      }

      const usdAmount = amount / fromRate;
      const convertedAmount = usdAmount * toRate;

      setResult(convertedAmount);

      const newEntry = {
        timestamp: new Date().toISOString(),
        amount,
        from: fromCurrency,
        to: toCurrency,
        result: convertedAmount,
      };

      const updatedHistory = [newEntry, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Conversion Error:', err);
      setError(err.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversionHistory');
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const handlePeriodSelection = async (days) => {
    console.log(`Selected period: ${days} days`);
    setChartLoading(true);

    try {
      const fetchedData = await fetchHistoricalRates('USD', days);
      setHistoricalRates(fetchedData);
      localStorage.setItem('historicalRates', JSON.stringify(fetchedData));
    } catch (error) {
      console.error('Failed to fetch historical rates for selected period:', error);
    } finally {
      setChartLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>

      <div className="converter">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="0"
          step="any"
        />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {availableCurrencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
        <span> to </span>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {availableCurrencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
        <button onClick={handleConversion} className="convert-button">
          Convert
        </button>
      </div>

      {isLoading && <p>Loading conversion...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <h2>Result: {result.toFixed(4)} {toCurrency}</h2>}

      <div className="history-section">
        <button onClick={toggleHistory} className={`history-toggle-button ${showHistory ? 'active' : ''}`}>
          {showHistory ? 'Hide History' : 'Show History'}
        </button>

        {showHistory && (
          <>
            <h3>Recent Conversions</h3>
            {history.length > 0 ? (
              <ul>
                {history.map((entry, index) => (
                  <li key={index}>
                    {entry.amount} {entry.from} → {entry.result.toFixed(4)} {entry.to}
                    <br />
                    <small>{new Date(entry.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No conversion history yet.</p>
            )}
            <button onClick={handleClearHistory} className="clear-history-button">
              Clear History
            </button>
          </>
        )}
      </div>

      <PeriodDropdown historicalRates={historicalRates} onSelectPeriod={handlePeriodSelection} />

      <ChartData 
        historicalRates={historicalRates}
        isLoading={chartLoading}
      />
    </div>
  );
};

export default App;
