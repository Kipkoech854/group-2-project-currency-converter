import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function ChartData({ historicalRates, baseCurrency, targetCurrency }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (historicalRates.length === 0 || !targetCurrency) return;

    const labels = historicalRates.map((entry) => entry.date);
    const data = historicalRates.map((entry) => entry.rates[targetCurrency]);

    const chartData = {
      labels,
      datasets: [
        {
          label: `Exchange Rate: ${baseCurrency} to ${targetCurrency}`,
          data,
          borderColor: 'rgb(231, 30, 91)',
          borderWidth: 1,
          tension: 0.4,
          backgroundColor: 'rgba(231, 30, 91, 0.1)',
          fill: false,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Exchange Rate',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: chartOptions,
    });

  }, [historicalRates, baseCurrency, targetCurrency]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ChartData;
