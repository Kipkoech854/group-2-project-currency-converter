import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { db, ref, set, onValue, off } from './firebase';
import { fetchHistoricalRates } from './GetRates';
import './App.css';
import ChartData from './ChartData';

// Currency name mapping
const currencyNames = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  SEK: 'Swedish Krona',
  NZD: 'New Zealand Dollar',
  // Add more as needed
};

const getCurrencyName = (code) => currencyNames[code] || code;

// HomePage Component
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
  currencyOptions,
  showHistory,
  toggleHistory,
  history,
  handleClearHistory,
  handleSwapCurrencies
}) => (
  <div className="home-page">
    <div className="converter">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min="0"
        step="any"
        placeholder="Amount"
      />
      
      <div className="currency-selectors">
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="currency-select"
        >
          {currencyOptions.map(currency => (
            <option key={`from-${currency}`} value={currency}>
              {currency} - {getCurrencyName(currency)}
            </option>
          ))}
        </select>
        
        <button 
          onClick={handleSwapCurrencies}
          className="swap-button"
          aria-label="Swap currencies"
        >
          ⇄
        </button>
        
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="currency-select"
        >
          {currencyOptions.map(currency => (
            <option key={`to-${currency}`} value={currency}>
              {currency} - {getCurrencyName(currency)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="converter-actions">
        <button onClick={handleConversion} className="convert-button">
          Convert
        </button>
        <button 
          onClick={toggleFavorite} 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {result && (
        <div className="conversion-result">
          Result: <strong>{result.toFixed(4)} {toCurrency}</strong>
        </div>
      )}
    </div>

    <div className="history-section">
      <button 
        onClick={toggleHistory} 
        className={`history-toggle ${showHistory ? 'active' : ''}`}
      >
        {showHistory ? 'Hide History' : 'Show History'}
      </button>

      {showHistory && (
        <div className="history-container">
          <h3>Recent Conversions</h3>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={index} className="history-item">
                  <div className="history-amount">
                    {entry.amount} {entry.from} → {entry.result.toFixed(4)} {entry.to}
                  </div>
                  <div className="history-date">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-history">No conversion history yet.</p>
          )}
          {history.length > 0 && (
            <button 
              onClick={handleClearHistory} 
              className="clear-history"
            >
              Clear History
            </button>
          )}
        </div>
      )}
    </div>

    <Link to="/history" className="nav-button">
      View Historical Graph
    </Link>
  </div>
);

// FavoritesPage Component
const FavoritesPage = ({ favorites, setFromCurrency, setToCurrency }) => (
  <div className="favorites-page">
    <h2>Favorite Conversions</h2>
    {favorites.length > 0 ? (
      <ul className="favorites-list">
        {favorites.map((pair, index) => {
          const [from, to] = pair.split('-');
          return (
            <li key={index} className="favorite-item">
              <button
                onClick={() => {
                  setFromCurrency(from);
                  setToCurrency(to);
                }}
                className="favorite-pair"
              >
                {from} → {to}
              </button>
              <button
                onClick={() => {
                  const updatedFavorites = favorites.filter(fav => fav !== pair);
                  set(ref(db, 'favorites'), updatedFavorites);
                }}
                className="remove-favorite"
                aria-label={`Remove ${from} to ${to} from favorites`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="no-favorites">No favorites yet. Add some using the star button.</p>
    )}
    <Link to="/" className="nav-button">
      Back to Converter
    </Link>
  </div>
);

// HistoryGraphPage Component
const HistoryGraphPage = ({ historicalRates, handlePeriodSelection, chartLoading }) => (
  <div className="history-graph-page">
    <h2>Historical Rates</h2>
    <div className="period-selector">
      <label htmlFor="period">Time Period:</label>
      <select 
        id="period"
        onChange={(e) => handlePeriodSelection(Number(e.target.value))}
        disabled={chartLoading}
      >
        <option value="7">1 Week</option>
        <option value="30">1 Month</option>
        <option value="90">3 Months</option>
        <option value="180">6 Months</option>
        <option value="365">1 Year</option>
      </select>
    </div>
    {chartLoading ? (
      <div className="chart-loading">Loading chart data...</div>
    ) : (
      <div className="chart-container">
        <ChartData historicalRates={historicalRates} />
      </div>
    )}
    <Link to="/" className="nav-button">
      Back to Converter
    </Link>
  </div>
);

const App = () => {
  // State declarations
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historicalRates, setHistoricalRates] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initialize Firebase listeners and data loading
  useEffect(() => {
    const ratesRef = ref(db, 'historicalRates');
    const favRef = ref(db, 'favorites');
    const historyRef = ref(db, 'conversionHistory');

    // Load historical rates
    const unsubscribeRates = onValue(ratesRef, async (snapshot) => {
      const data = snapshot.val() || [];
      
      if (!initialLoadComplete && data.length === 0) {
        console.log('Starting initial data load...');
        try {
          const initialData = await fetchHistoricalRates(365, []);
          await set(ratesRef, initialData);
          setHistoricalRates(initialData);
        } catch (error) {
          console.error('Initial data load failed:', error);
          setError('Failed to load initial rates. Please try again later.');
        } finally {
          setInitialLoadComplete(true);
        }
      } else {
        setHistoricalRates(data);
      }
    });

    // Load favorites
    onValue(favRef, (snapshot) => {
      setFavorites(snapshot.val() || []);
    });

    // Load conversion history
    onValue(historyRef, (snapshot) => {
      setHistory(snapshot.val() || []);
    });

    // Setup daily updater
    const checkAndFetchDaily = async () => {
      const today = new Date().toISOString().split('T')[0];
      const ratesRef = ref(db, 'historicalRates');
      
      onValue(ratesRef, async (snapshot) => {
        const currentRates = snapshot.val() || [];
        const hasToday = currentRates.some(rate => rate.date === today);
        
        if (!hasToday) {
          try {
            console.log('Fetching daily update...');
            const newData = await fetchHistoricalRates(1, currentRates);
            if (newData.length > 0) {
              await set(ratesRef, [...newData, ...currentRates.slice(0, 364)]);
            }
          } catch (error) {
            console.error('Daily update failed:', error);
          }
        }
      });
    };

    checkAndFetchDaily();

    return () => {
      off(ratesRef);
      off(favRef);
      off(historyRef);
    };
  }, [initialLoadComplete]);

  // Update currency options when rates change
  useEffect(() => {
    if (historicalRates.length > 0) {
      const latestRates = historicalRates[0]?.rates;
      if (latestRates) {
        const currencies = Object.keys(latestRates)
          .filter(currency => currency.length === 3)
          .sort();
        
        setCurrencyOptions(currencies);
        
        // Set default currencies if not set
        if (!fromCurrency && currencies.includes('USD')) {
          setFromCurrency('USD');
        }
        if (!toCurrency && currencies.includes('EUR')) {
          setToCurrency('EUR');
        }
      }
    }
  }, [historicalRates, fromCurrency, toCurrency]);

  // Currency conversion handler
  const handleConversion = () => {
    if (!amount || amount <= 0 || historicalRates.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const latestRates = historicalRates[0].rates;
      const fromRate = latestRates[fromCurrency];
      const toRate = latestRates[toCurrency];

      if (!fromRate || !toRate) {
        throw new Error('Selected currency not available in rates');
      }

      const convertedAmount = (amount / fromRate) * toRate;
      setResult(convertedAmount);

      const newEntry = {
        timestamp: new Date().toISOString(),
        amount,
        from: fromCurrency,
        to: toCurrency,
        result: convertedAmount,
      };

      const updatedHistory = [newEntry, ...history].slice(0, 20);
      set(ref(db, 'conversionHistory'), updatedHistory);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Swap currencies handler
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Other handlers
  const handleClearHistory = () => {
    set(ref(db, 'conversionHistory'), []);
  };

  const toggleFavorite = () => {
    const pair = `${fromCurrency}-${toCurrency}`;
    const updatedFavorites = favorites.includes(pair)
      ? favorites.filter(fav => fav !== pair)
      : [...favorites, pair];
    set(ref(db, 'favorites'), updatedFavorites);
  };

  const handlePeriodSelection = async (days) => {
    setChartLoading(true);
    try {
      if (historicalRates.length < days) {
        const fetchedData = await fetchHistoricalRates(days, historicalRates);
        set(ref(db, 'historicalRates'), fetchedData);
      }
    } catch (error) {
      console.error('Failed to fetch historical rates:', error);
      setError('Failed to load historical data. Please try again later.');
    } finally {
      setChartLoading(false);
    }
  };

  const toggleHistory = () => setShowHistory(prev => !prev);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-gradient">Currency Converter</span>
            <span className="title-icon">💱</span>
          </h1>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/history">History Graph</Link>
          </nav>
        </header>

        <main className="app-content">
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
                isFavorite={favorites.includes(`${fromCurrency}-${toCurrency}`)}
                isLoading={isLoading}
                error={error}
                result={result}
                currencyOptions={currencyOptions}
                showHistory={showHistory}
                toggleHistory={toggleHistory}
                history={history}
                handleClearHistory={handleClearHistory}
                handleSwapCurrencies={handleSwapCurrencies}
              />
            } />
            <Route path="/favorites" element={
              <FavoritesPage
                favorites={favorites}
                setFromCurrency={setFromCurrency}
                setToCurrency={setToCurrency}
              />
            } />
            <Route path="/history" element={
                 <HistoryGraphPage historicalRates={historicalRates}isLoading={chartLoading} />} />
             
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;