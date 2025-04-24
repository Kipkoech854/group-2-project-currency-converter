import React, { createContext, useContext, useEffect, useState } from 'react';
import { getExchangeRates } from './exchangeRateService';
import handleApiErrors from './apiErrorHandler';

const ExchangeRateContext = createContext();

export const ExchangeRateProvider = ({ children }) => {
  const [state, setState] = useState({
    rates: {},
    loading: true,
    error: null,
    lastUpdated: null,
    baseCurrency: 'USD'
  });

  const refreshRates = async (baseCurrency = state.baseCurrency) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { rates, lastUpdated } = await getExchangeRates(baseCurrency);
      
      setState({
        rates,
        loading: false,
        error: null,
        lastUpdated,
        baseCurrency
      });
      
    } catch (err) {
      const { userMessage } = handleApiErrors(err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: userMessage
      }));
    }
  };

  useEffect(() => {
    refreshRates();
    
    const interval = setInterval(() => {
      refreshRates();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ExchangeRateContext.Provider value={{
      ...state,
      refreshRates
    }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRates = () => useContext(ExchangeRateContext);