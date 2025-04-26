import React, { useState, useEffect } from 'react';

export const fetchHistoricalRates = async (baseCurrency, days, setHistoricalRates) => {
  const appId = '77676428db81415db0022d7c5e1bdfe4';
  const baseURL = 'https://openexchangerates.org/api/';

  const today = new Date();
  const dates = [];

  // Generate list of past N dates
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const formattedDate = d.toISOString().split('T')[0]; // YYYY-MM-DD
    dates.push(formattedDate);
  }

  try {
    // Fetch all rates in parallel
    const fetchPromises = dates.map(async (date) => {
      let url = `${baseURL}historical/${date}.json?app_id=${appId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data for ${date}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.rates) {
        console.error(`No rates found for ${date}.`);
        return { date, rates: {} };
      }

      return { date, rates: data.rates };
    });

    const results = await Promise.all(fetchPromises);

    setHistoricalRates(results.reverse()); // Store results in state (from oldest to newest)
  } catch (error) {
    console.error('Error fetching historical rates:', error);
  }
};
