import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";


function App() {

  const [data, setData] = useState({});
  const [location, setLocation] = useState('Tokyo');
  const [api, setApi] = useState('');

  useEffect(() => {
    fetchWeatherData('Tokyo');
  }, []);

  useEffect(() => {
    setApi(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`);
  }, [location]);

  const fetchWeatherData = (query) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`)
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error('API request failed', error);
    });
  } 

  const searchLocation = (event) => {
    if(event.key === 'Enter') {
      fetchWeatherData(location);
      setLocation('');
      console.log(data)
    }
  };

  return (
    <div className='app'>
      <div className='search'>
        <input
        value={location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='地域を検索'
        type='text'/>
      </div>
      <div className="container">
        <div className="top">
        <div className="location">
          <p>{data.name}</p>
        </div>
        <div className="temp">
        <h1>{data.main ? Math.round(data.main.temp - 273.15) : 'Loading....'}℃</h1>
        </div>
        <div className="description">
        <p>{data.weather && data.weather.length > 0 ? data.weather[0].description : 'Loading...'}</p>
        </div>
        <div className='max'>
            <p>最高</p>
            <p>{data.main ? Math.round(data.main.temp_max - 273.15) : 'Loading....'}℃</p>
        </div>
        <div className="min">
            <p>最低</p>
            <p>{data.main ? Math.round(data.main.temp_min - 273.15) : 'Loading....'}℃</p>
        </div>
        </div>
        <div className="bottom">
        <div className="feel">
          <p className='bold'>{data.main ? Math.round(data.main.feels_like - 273.15) : 'Loading....'}℃</p>
          <p >体感温度</p>
        </div>
        <div className="humidity">
          <p className='bold'>{data.main ? `${data.main.humidity}%` : 'N/A'}</p>
          <p>湿度</p>
        </div>
        <div className="wind">
          <p className='bold'>{data.wind ? (data.wind.speed * 0.44704).toFixed(1) : 'Loading...'}m/s</p>
          <p>風速</p>
         </div>
        </div>
      </div>
    </div>
  )
}

export default App;
