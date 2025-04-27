import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase"; 
import { fetchHistoricalRates } from "./yourFetchFunctions"; 

export const checkAndFetchDaily = async () => {
  const today = new Date().toISOString().split('T')[0];
  const ratesRef = ref(db, 'historicalRates');
  
  onValue(ratesRef, async (snapshot) => {
    const currentRates = snapshot.val() || [];
    
    // Check if we already have today's rates
    const hasToday = currentRates.some(rate => rate.date === today);
    
    if (!hasToday) {
      try {
        console.log('Fetching daily update...');
        const newData = await fetchHistoricalRates(1, currentRates);
        if (newData.length > 0) {
          await set(ratesRef, [...newData, ...currentRates.slice(0, 364)]);
          console.log('Daily update successful');
        }
      } catch (error) {
        console.error('Daily update failed:', error);
      }
    }
  });
};