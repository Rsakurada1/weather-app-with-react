import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";


function App() {

  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [api, setApi] = useState('');

  useEffect(() => {
    setApi(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=37a68e1a7debd2495d0e17b1d525cd13`);
  }, [location]);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(api)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
      console.error('API request failed', error);
      })
      setLocation('')
    }
  }

  return (
    <div className='app'>
      <div className='search'>
        <input
        value={location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='Enter Location'
        type='text'/>
      </div>
      <div className="container">
        <div className="top">
        <div className="location">
          <p>{data.name}</p>
        </div>
        <div className="temp">
          <h1>{Math.round(data.main.temp) - 273}℃</h1>
        </div>
        <div className="description">
        <p>曇り</p>
        </div>
        </div>
        <div className="bottom">
        <div className="feel">
          <p className='bold'>35°C</p>
          <p>体感温度</p>
        </div>
        <div className="humidity">
          <p className='bold'>20%</p>
          <p>湿度</p>
        </div>
        <div className="wind">
          <p className='bold'>15m/s</p>
          <p>風速</p>
         </div>
        </div>
      </div>
    </div>
  )
}

export default App;
