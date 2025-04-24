import React, { useState, useEffect } from 'react';

// Full list of 150+ currencies with symbols and flags
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
  // Add more currencies here...
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

const App = () => {
  console.log('Available currencies:', currencies);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch exchange rates
  useEffect(() => {
    const fetchData = async () => {
      if (!amount || amount <= 0) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        const data = await response.json();
        setResult(data.rates[toCurrency]);
      } catch (error) {
        console.error("API Error:", error);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className='currency-converter'>
      <h2 className='conveter-title'>Currency Converter</h2>
      <form className='converter-form' onSubmit={(e) => e.preventDefault()}>
        <div className='form-group'>
          <label className='form-label'>Amount</label>
          <input
            type="number"
            className='form-input'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            placeholder="1.00"
          />
        </div>

        <div className='form-group form-currency-group'>
          <div className='form-section'>
            <label className='form-label'>From</label>
            <div className='currency-select'>
              <img 
                src={`https://flagcdn.com/48x36/${fromCurrency.substring(0, 2).toLowerCase()}.png`}
                alt={fromCurrency}
                onError={(e) => e.target.src = 'https://flagcdn.com/48x36/un.png'}
              />
              <select
                value={fromCurrency}
                onChange={(e) => {
                  console.log('Selected currency:', e.target.value);
                  setFromCurrency(e.target.value);
                }}
                className='currency-dropdown'
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='swap-icon' onClick={handleSwap}>
            <svg width="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 17.01V10H14V17.01H11L15 21L19 17.01H16ZM9 3L5 6.99H8V14H10V6.99H13L9 3Z" fill="#FFF"/>
            </svg>
          </div>

          <div className='form-section'>
            <label className='form-label'>To</label>
            <div className='currency-select'>
              <img 
                src={`https://flagcdn.com/48x36/${toCurrency.substring(0, 2).toLowerCase()}.png`}
                alt={toCurrency}
                onError={(e) => e.target.src = 'https://flagcdn.com/48x36/un.png'}
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className='currency-dropdown'
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='exchange-rate-results'>
          {isLoading ? (
            <p>Loading rates...</p>
          ) : result ? (
            <p>
              {amount} {fromCurrency} ={" "}
              <strong>
                {result} {toCurrency}
              </strong>
            </p>
          ) : (
            <p>Enter amount to convert</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;