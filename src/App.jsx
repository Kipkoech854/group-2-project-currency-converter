import React, { useState, useEffect } from 'react';
import './App.css';
import GraphDisplay from './GraphDisplay';
import chart from 'chart.js/auto';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('conversionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false); 

function toggleHistory() {
  setShowHistory(prev => !prev);
}


  useEffect(() => {
    const fetchData = async () => {
      if (!amount || amount <= 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }
        const data = await response.json();
        const convertedAmount = data.rates[toCurrency];
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
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [amount, fromCurrency, toCurrency]);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversionHistory');
  };
  function toggleHistory() {
    setShowHistory(prev => !prev);
  }

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </option>
          ))}
        </select>
        <span> to </span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name} ({currency.code})
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <h2>Result: {result} {toCurrency}</h2>}
      <div className="history-section">
  <button
    onClick={toggleHistory}
    className={`history-toggle-button ${showHistory ? 'active' : ''}`}
  >
    {showHistory ? 'Hide History' : 'Show History'}
  </button>

  {showHistory && (
    <>
      <h3>Recent Conversions</h3>
      {history.length > 0 ? (
        <>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {entry.amount} {entry.from} → {entry.result} {entry.to}
                <br />
                <small>{new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
          <button onClick={handleClearHistory}>Clear History</button>
        </>
      ) : (
        <p>No conversion history yet.</p>
      )}
    </>
  )}
</div>

      <GraphDisplay />
      
      
    </div>
  );
};

export default App;
