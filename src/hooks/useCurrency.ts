import { useAppContext } from '../context/AppContext';

export const useCurrency = () => {
  const { currencyConfig } = useAppContext();
  
  const formatPrice = (usdPrice: number) => {
    const { activeCurrency, rates, cryptoSettings, bdtSettings, usdSettings } = currencyConfig;
    
    if (activeCurrency === 'USD') {
      return `${usdSettings.symbol}${usdPrice.toLocaleString()}`;
    }
    
    if (activeCurrency === 'BDT') {
      const bdtAmount = Math.round(usdPrice * rates.BDT);
      const formattedAmount = bdtAmount.toLocaleString();
      return bdtSettings.symbolPosition === 'prefix' 
        ? `${bdtSettings.symbol} ${formattedAmount}`
        : `${formattedAmount} ${bdtSettings.symbol}`;
    }
    
    if (activeCurrency === 'BTC') {
      const cryptoAmount = usdPrice * rates.BTC;
      // Show up to the number of decimals configured
      const formattedAmount = Number(cryptoAmount.toFixed(cryptoSettings.decimals));
      return `${formattedAmount} ${cryptoSettings.symbol}`;
    }
    
    return `$${usdPrice.toLocaleString()}`;
  };

  return { formatPrice, currencyConfig };
};
