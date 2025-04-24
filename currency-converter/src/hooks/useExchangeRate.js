import { useState, useEffect } from 'react';

const useExchangeRate = (amount, fromCurrency, toCurrency) => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExchangeRate = async () => {
    if (!amount || amount <= 0) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      setResult(data.rates[toCurrency]);
    } catch (error) {
      console.error("API Error:", error);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [amount, fromCurrency, toCurrency]);

  return { result, isLoading };
};

export default useExchangeRate;