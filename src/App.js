import React, {useEffect , useState} from 'react';
import CurrencyRow from './CurrencyRow'
import './App.css';

const BASE_URL = 'https://api.exchangeratesapi.io/latest?base=SEK';
function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState(); 
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }


  useEffect(() => {
    fetch(BASE_URL)
    .then(result => result.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0]
      const euroCurrency = Object.keys(data.rates).filter(r => r.includes('EUR'));
      const SEKCurrency = Object.keys(data.rates).filter(r => r.includes('SEK'));
      setCurrencyOptions([...Object.keys(data.rates)])
      setFromCurrency(data.base);
      setToCurrency(euroCurrency)
      setExchangeRate(data.rates[euroCurrency])
    })
  }, []);

  // useEffect(() => {
  //   if (fromCurrency != null && toCurrency != null) {
  //     fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
  //       .then(res => res.json())
  //       .then(data => setExchangeRate(data.rates[toCurrency]))
  //   }
  // }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)  
  }
  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)  
  }
  return (
    <>
    <h1>Valutaomväxlare</h1>
    <CurrencyRow currencyOptions={currencyOptions}
    selectedCurrency={fromCurrency}
    onChangeCurrency={e => setFromCurrency(e.target.value)}
    amount={fromAmount}
    onChangeAmount={handleFromAmountChange}
    ></CurrencyRow>

    <div className="equals"> = </div>

    <CurrencyRow currencyOptions={currencyOptions}
    selectedCurrency={toCurrency}
    onChangeCurrency={e => setToCurrency(e.target.value)}
    amount={toAmount}
    onChangeAmount={handleToAmountChange}
    ></CurrencyRow>
  </>
  );
}

export default App;
