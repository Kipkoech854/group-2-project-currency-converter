// filepath: /currency-converter/currency-converter/src/App.jsx
import React, { useState } from 'react';
import CurrencySelect from './components/CurrencySelect';
import SwapButton from './components/SwapButton';
import { currencies } from './constants/currencies';
import useExchangeRate from './hooks/useExchangeRate';
import './styles/index.css';

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const { result, isLoading } = useExchangeRate(amount, fromCurrency, toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className='currency-converter'>
      <h2 className='converter-title'>Currency Converter</h2>
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
          <CurrencySelect 
            label="From"
            currency={fromCurrency}
            onCurrencyChange={setFromCurrency}
            currencies={currencies}
          />
          <SwapButton onClick={handleSwap} />
          <CurrencySelect 
            label="To"
            currency={toCurrency}
            onCurrencyChange={setToCurrency}
            currencies={currencies}
          />
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