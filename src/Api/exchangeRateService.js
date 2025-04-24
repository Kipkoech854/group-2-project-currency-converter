const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

// Primary API fetch function
const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`${BASE_URL}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return {
      rates: data.rates,
      lastUpdated: new Date(),
      baseCurrency: data.base
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

// Cached rates implementation
let cachedRates = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const getExchangeRates = async (baseCurrency) => {
  const now = new Date();
  if (!cachedRates || !lastFetchTime || (now - lastFetchTime) > CACHE_DURATION) {
    cachedRates = await fetchExchangeRates(baseCurrency);
    lastFetchTime = now;
  }
  return cachedRates;
};

export { getExchangeRates, fetchExchangeRates };