import React from 'react';
import PropTypes from 'prop-types';
import { currencies } from '../constants/currencies';

const CurrencySelect = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <select value={selectedCurrency} onChange={(e) => onCurrencyChange(e.target.value)} className='currency-dropdown'>
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.code} - {currency.name}
        </option>
      ))}
    </select>
  );
};

CurrencySelect.propTypes = {
  selectedCurrency: PropTypes.string.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
};

export default CurrencySelect;