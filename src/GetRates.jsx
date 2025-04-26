export const fetchHistoricalRates = async (days, existingRates = []) => {
  const appId = '77676428db81415db0022d7c5e1bdfe4';
  const baseURL = 'https://openexchangerates.org/api/';
  
  const today = new Date();
  const dates = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const formattedDate = d.toISOString().split('T')[0]; // YYYY-MM-DD
    dates.push(formattedDate);
  }

  const existingDates = existingRates.map((entry) => entry.date);
  const missingDates = dates.filter(date => !existingDates.includes(date));

  if (missingDates.length === 0) {
    return existingRates; 
  }

  try {
    const fetchPromises = missingDates.map(async (date) => {
      const url = `${baseURL}historical/${date}.json?app_id=${appId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data for ${date}: ${response.statusText}`);
      }

      const data = await response.json();
      return { date, rates: data.rates || {} };
    });

    const missingResults = await Promise.all(fetchPromises);
    const allRates = [...existingRates, ...missingResults].reverse();

    return allRates;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    throw error;
  }
};
