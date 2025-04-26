import { fetchHistoricalRates } from './GetRates';

export const checkAndFetchDaily = async () => {
  const lastChecked = localStorage.getItem('lastUpdateCheck');
  const now = new Date();

  if (lastChecked) {
    const lastCheckedDate = new Date(lastChecked);
    const diffInHours = (now - lastCheckedDate) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      // Already checked in the last 24 hours, do nothing
      return;
    }
  }

  try {
    const existingData = JSON.parse(localStorage.getItem('historicalRates')) || [];
    const updatedData = await fetchHistoricalRates(365, existingData);
    localStorage.setItem('historicalRates', JSON.stringify(updatedData));
    localStorage.setItem('lastUpdateCheck', now.toISOString());
  } catch (error) {
    console.error('Daily update check failed:', error);
  }
};
