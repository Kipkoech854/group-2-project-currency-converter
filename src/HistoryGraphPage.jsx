import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import './App.css'

function HistoryGraphPage() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    try {
      const today = new Date();
      const endDate = today.toISOString().split('T')[0]; // "2025-04-26"
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 7); // 7 days ago
      const startDate = pastDate.toISOString().split('T')[0]; // "2025-04-19"
  
      const response = await fetch(
        `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${fromCurrency}&symbols=${toCurrency}`
      );
      const data = await response.json();
      console.log(data);
  
      if (!data.success) {
        console.error("API call unsuccessful:", data);
        return;
      }
  
      const historyArray = Object.entries(data.rates).map(([date, rateObj]) => ({
        date,
        rate: rateObj[toCurrency],
      }));
  
      setHistoryData(historyArray);
    } catch (error) {
      console.error("Failed to fetch history data", error);
    }
  };
  
  return (
    <div className="converter">
      <h2>Currency History Graph</h2>
      <div>
        <label>
          From:
          <input
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          />
        </label>
        <label>
          To:
          <input
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          />
        </label>
        <button onClick={fetchHistory}>Fetch History</button>
      </div>

      {/* Only show chart if historyData exists */}
      {historyData.length > 0 ? (
        <HistoryChart data={historyData} />
      ) : (
        <p>No data yet. Please fetch history!</p>
      )}
    </div>
  );
}

export default HistoryGraphPage;