import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ChartData from './ChartData';
import { fetchHistoricalRates } from './GetRates';
import { checkAndFetchDaily } from './DailyUpdater';
import PeriodDropdown from './PeriodDropdown';

// HomePage component moved outside
const HomePage = ({
  amount, setAmount,
  fromCurrency, setFromCurrency,
  toCurrency, setToCurrency,
  handleConversion,
  toggleFavorite,
  isFavorite,
  isLoading,
  error,
  result,
  availableCurrencies,
  showHistory,
  toggleHistory,
  history,
  handleClearHistory
}) => (
  <div className="home-page">
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
      <button 
        onClick={toggleFavorite} 
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      {isLoading && <p>Loading conversion...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <h2>Result: {result.toFixed(4)} {toCurrency}</h2>}
    </div>

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

    <Link to="/history" className="nav-button">
      View Historical Graph
    </Link>
  </div>
);

// FavoritesPage moved outside
const FavoritesPage = ({
  favorites, setFavorites, setFromCurrency, setToCurrency
}) => (
  <div className="favorites-page">
    <h2>Favorite Conversions</h2>
    {favorites.length > 0 ? (
      <ul>
        {favorites.map((pair, index) => {
          const [from, to] = pair.split('-');
          return (
            <li key={index}>
              <button 
                onClick={() => {
                  setFromCurrency(from);
                  setToCurrency(to);
                }}
                className="favorite-item"
              >
                {from} → {to}
              </button>
              <button 
                onClick={() => {
                  const updatedFavorites = favorites.filter(fav => fav !== pair);
                  setFavorites(updatedFavorites);
                  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                }}
                className="remove-favorite"
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <p>No favorites yet. Add some using the star button on the converter.</p>
    )}
    <Link to="/" className="nav-button">
      Back to Converter
    </Link>
  </div>
);

// HistoryGraphPage moved outside
const HistoryGraphPage = ({ historicalRates, handlePeriodSelection, chartLoading }) => (
  <div className="history-graph-page">
    <h2>Historical Rates</h2>
    <PeriodDropdown historicalRates={historicalRates} onSelectPeriod={handlePeriodSelection} />
    <ChartData historicalRates={historicalRates} isLoading={chartLoading} />
    <Link to="/" className="nav-button">
      Back to Converter
    </Link>
  </div>
);

const App = () => {
  const [amount, setAmount] = useState(1);
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
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const isInitialRender = useRef(true);

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

  useEffect(() => {
    if (historicalRates.length > 0) {
      const latest = historicalRates[historicalRates.length - 1];
      if (latest?.rates) {
        const currencies = Object.keys(latest.rates);
        setAvailableCurrencies(currencies.sort());
      }
    }
  }, [historicalRates]);

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

  const toggleFavorite = () => {
    const pair = `${fromCurrency}-${toCurrency}`;
    let updatedFavorites;
    
    if (favorites.includes(pair)) {
      updatedFavorites = favorites.filter(fav => fav !== pair);
    } else {
      updatedFavorites = [...favorites, pair];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = favorites.includes(`${fromCurrency}-${toCurrency}`);

  return (
    <Router>
      <div className="App">
      
    <h1 className="app-title">
     <span className="title-gradient">Currency Converter</span>
    <span className="title-icon">💱</span>
  </h1>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/history">History Graph</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <HomePage
              amount={amount}
              setAmount={setAmount}
              fromCurrency={fromCurrency}
              setFromCurrency={setFromCurrency}
              toCurrency={toCurrency}
              setToCurrency={setToCurrency}
              handleConversion={handleConversion}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              isLoading={isLoading}
              error={error}
              result={result}
              availableCurrencies={availableCurrencies}
              showHistory={showHistory}
              toggleHistory={toggleHistory}
              history={history}
              handleClearHistory={handleClearHistory}
            />
          } />
          <Route path="/favorites" element={
            <FavoritesPage
              favorites={favorites}
              setFavorites={setFavorites}
              setFromCurrency={setFromCurrency}
              setToCurrency={setToCurrency}
            />
          } />
          <Route path="/history" element={
            <HistoryGraphPage
              historicalRates={historicalRates}
              handlePeriodSelection={handlePeriodSelection}
              chartLoading={chartLoading}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
