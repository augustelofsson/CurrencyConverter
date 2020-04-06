
const GetRates = async (country) => {
    
    let rateData = JSON.parse(localStorage.getItem(country));

    const Now = new Date();
    
    const expireDate = new Date()
    let storageDate;
    if(rateData !== null){
        storageDate = new Date(rateData.date); //converts Localstorage date to from UTC to local time zone date
    }
    
    expireDate.setHours(expireDate.getHours() + 1);
    
    
    if(rateData === null || Now > storageDate){
        console.log('Ny data hämtas');
        let CurrencyData = {
            data : null,
            date : expireDate
        }

        CurrencyData.data = await fetch(`https://api.exchangeratesapi.io/latest?base=${country}`)
        .then(result => result.json())
        .then(data => {    
           return data;    
        })
        if(rateData !== null){
            localStorage.removeItem(country);
        }
        let dataSerialized = JSON.stringify(CurrencyData);
        localStorage.setItem(country, dataSerialized);
        return CurrencyData;
        
    }
    else{
        console.log('Local storage data')
        return rateData;
    }
}
export default GetRates;