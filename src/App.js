import React, {useEffect , useState} from 'react';
import CurrencyRow from './Components/CurrencyRow'
import './App.css';
import GetRates from './APIService/APIService';


const EUR = 'EUR';

const App = () => {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState(); 
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [CurrentDate, setDate] = useState();
  const [currentRates, setCurrentRates] = useState();


  let toAmount, fromAmount
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = (amount * exchangeRate || 0).toFixed(3)
  } else {
    toAmount = amount
    fromAmount = (amount / exchangeRate).toFixed(3)
  }

  useEffect(() => {
    const fetchdata = async () => {
      let APIdata = await GetRates(EUR);
          
      const SEKCurrency = Object.keys(APIdata.data.rates)[9];
      const CurrentDate = APIdata.data.date;   
      setDate(CurrentDate);
      setCurrencyOptions([APIdata.data.base, ...Object.keys(APIdata.data.rates)])
      setFromCurrency(APIdata.data.base);
      setToCurrency(SEKCurrency)
      setExchangeRate(APIdata.data.rates[SEKCurrency])
      setCurrentRates(APIdata.data.rates);
    }
      
    fetchdata();
    
  }, []);

  const handleGetNewRates = async (e) => {
      let APIdata = await GetRates(e)
      
      const CurrentDate = APIdata.data.date;   
      setDate(CurrentDate);
      setFromCurrency(APIdata.data.base);
      setExchangeRate(APIdata.data.rates[toCurrency])
      setCurrencyOptions([...Object.keys(APIdata.data.rates)])
      setCurrentRates(APIdata.data.rates);
  }
 


  const handleFromAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)  
  }
  const handleToAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)  
  }
  const handleToCurrency = (e) => {
    setToCurrency(e)
    setExchangeRate(currentRates[e])
  }
  return (
    <div className="inputContainer">
    <h1>Valutaomväxlare</h1>
    <CurrencyRow currencyOptions={currencyOptions}
    selectedCurrency={fromCurrency}
    onChangeCurrency={e => handleGetNewRates(e.target.value)}
    amount={fromAmount}
    onChangeAmount={handleFromAmountChange}
    ></CurrencyRow>

    <div className="equals"> = </div>

    <CurrencyRow currencyOptions={currencyOptions}
    selectedCurrency={toCurrency}
    onChangeCurrency={(e) => handleToCurrency(e.target.value)}
    amount={toAmount}
    onChangeAmount={handleToAmountChange}
    ></CurrencyRow>
    <h4>Datum för aktuell kurs: {CurrentDate}</h4>

  </div>
  );
}

export default App;
