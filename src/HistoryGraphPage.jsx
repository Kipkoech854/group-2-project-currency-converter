import React, { useState } from 'react';
import ChartData from './ChartData';

const HistoryGraphPage = ({ historicalRates, isLoading }) => {
  return (
    <div className="history-graph-page">
      <h2>Historical Rates</h2>
      <ChartData 
        historicalRates={historicalRates} 
        isLoading={isLoading} 
      />
      <Link to="/" className="nav-button">
        Back to Converter
      </Link>
    </div>
  );
};

export default HistoryGraphPage;