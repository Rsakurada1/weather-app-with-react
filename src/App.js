import { useEffect, useState } from 'react';
import cloudy from './assets/cloudy.jpg';
import night from './assets/night.jpg';
import './App.css';
import axios from "axios";

const translateweatherDescription = (description) => {
    const translationMap = {
      '晴天' : '晴れ',
      '厚い雲' : '曇り',
      '雲' : '曇り',
      '薄い雲' : '曇り',
      '曇りがち' : '曇り',
      '小雨' : '雨'
    };
    return translationMap[description] || description;
};

const getTimeDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 6) {
    return 'morning';

  }else if (currentHour >= 6 && currentHour < 16){
    return 'day';
  
  }else if (currentHour >= 16 && currentHour < 18){
    return 'evening';

  }else{
    return 'night';
  }
};

const chooseBackgroundImage = (weatherDescription) => {
  const timeDay = getTimeDay();
  const backgroundImageMap = {
    '晴れ': {
      'morning': 'morning.jpg',
      'day': 'sunny.jpg',
      'evening': 'evening.jpg',
      'night': 'night.jpg'
    },
    '曇り': {
      'morning': 'cloudy.jpg',
      'day': 'cloudy.jpg',
      'evening': 'cloudy.jpg',
      'night': 'cloudy.jpg'
    },
    '雨': {
      'morning': 'rainy.jpg',
      'day': 'rainy.jpg',
      'evening': 'rainy.jpg',
      'night': 'rainy_night.jpg'
    }
  };
  const weatherImages = backgroundImageMap[weatherDescription] || {};
  return weatherImages [timeDay]; 
};

function App() {
  
  const [ data, setData ] = useState({});
  const [ currentBackgroundImage, setCurrentBackgroundImage] = useState('');
  const [ location, setLocation ] = useState('Tokyo');
  const [ api, setApi ] = useState('');
  
  const fetchWeatherData = (query) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`)
    .then((response) => {
      console.log("Fetched data: ", response.data);
      setData(response.data);
    })
    .catch((error) => {
      console.error('API request failed', error);
    });
  } 

  useEffect(() => {
    fetchWeatherData('Tokyo');
  }, []);

  useEffect(() => {
    if (data.weather && data.weather.length > 0) {
      const description = translateweatherDescription(data.weather[0].description);
      const img = chooseBackgroundImage(description);
      setCurrentBackgroundImage(`./assets/${img}`);
    }
  }, [data]);

  useEffect(() => {
    setApi(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`);
  }, [location]);

  //debug用
  useEffect(() => {
    console.log("Current data: ", data);
    console.log("Current location: ", location);
    console.log("Current api: ", api);
    console.log("Current background image: ", currentBackgroundImage);
  }, [data, location, api, currentBackgroundImage]);

  const searchLocation = (event) => {
    if(event.key === 'Enter') {
      fetchWeatherData(location);
      setLocation('');
      console.log(data)
    }
  };
    const randomImg = () => {
      return Math.random() >= 0.5 ? cloudy : night
    }
  return (
    <div className='app'>
      <img className='bg-img' src={randomImg()} />
      <div className='search'>
        <input
        value={location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='地域を検索'
        type='text'/>
      </div>
      <div className="container">
        <div className="top"></div>
        <div className="location">
          <p>{data.name}</p>
        </div>
        <div className="temp">
        <h1>{data.main ? Math.round(data.main.temp - 273.15) : 'Loading....'}℃</h1>
        </div>
        <div className="description">
        <p>{data.weather && data.weather.length > 0 ? translateweatherDescription(data.weather[0].description) : 'Loading...'}</p>
        </div>
        <div className='tempbox'>
        <div className='max'>
            <p>最高</p>
            <p>{data.main ? Math.round(data.main.temp_max - 273.15) : 'Loading....'}℃</p>
        </div>
        <div className="min">
            <p>最低</p>
            <p>{data.main ? Math.round(data.main.temp_min - 273.15) : 'Loading....'}℃</p>
        </div>
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
    
  )
}

export default App;
