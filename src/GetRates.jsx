const API_KEY = 'fca_live_mfLM9nmOX7tTQb4sTn3AH7e3CYfgw7TQUDGQQkR7';

export const getLast14Dates = () => {
  const dates = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const fetchExchangeRateForDate = async (date, baseCurrency) => {
  try {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/historical?apikey=${API_KEY}&date=${date}&base_currency=${baseCurrency}`
    );
    const data = await response.json();
    return { date, rates: data.data[date] };
  } catch (error) {
    console.error(`Error fetching data for ${date}:`, error);
    return null;
  }
};

export const fetchHistoricalRates = async (baseCurrency) => {
  const dates = getLast14Dates();
  const promises = dates.map(date => fetchExchangeRateForDate(date, baseCurrency));
  const results = await Promise.all(promises);
  return results.filter(res => res !== null);
};
