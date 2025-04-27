export const fetchHistoricalRates = async (daysToFetch, existingRates = []) => {
  const appId = import.meta.env.VITE_OPENEXCHANGE_API_KEY || '72f5f952d7454385b20d5a6b858b1c5f'
  const baseURL = 'https://openexchangerates.org/api/';

  // If we only need today's rates (daily update)
  if (daysToFetch === 1) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const url = `${baseURL}historical/${today}.json?app_id=${appId}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return [{ date: today, rates: data.rates }];
    } catch (error) {
      console.error('Daily update failed:', error);
      return []; // Return empty array to prevent breaking the flow
    }
  }

  // For initial 365-day load
  const today = new Date();
  const dates = Array.from({ length: daysToFetch }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  // Check which dates we already have
  const existingDates = existingRates.map(entry => entry.date);
  const missingDates = dates.filter(date => !existingDates.includes(date));

  if (missingDates.length === 0) {
    console.log('All dates already in cache');
    return existingRates;
  }

  // Fetch missing dates with rate limiting
  const results = [];
  for (const date of missingDates) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      const url = `${baseURL}historical/${date}.json?app_id=${appId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`Failed to fetch ${date}: HTTP ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      results.push({ date, rates: data.rates });
      console.log(`Successfully fetched ${date}`);
    } catch (error) {
      console.error(`Error fetching ${date}:`, error);
    }
  }

  return [...existingRates, ...results].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
};