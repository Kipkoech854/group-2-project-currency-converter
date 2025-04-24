import React from 'react';

function CurrencyDropdowns({ availableCurrencies, baseCurrency, targetCurrency, setBaseCurrency, setTargetCurrency }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>Base Currency: </label>
      <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
        {availableCurrencies.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>

      <label style={{ marginLeft: '1rem' }}>Target Currency: </label>
      <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
        {availableCurrencies.map((currency) => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </div>
  );
}

export default CurrencyDropdowns;

