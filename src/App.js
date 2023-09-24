import { useEffect, useState } from "react";
import React from "react";
import cloudy from "./assets/cloudy.jpg";
import night from "./assets/night.jpg";
import morning from "./assets/morning.jpg";
import evening from "./assets/evening3.jpg";
import rainy from "./assets/rainy4.jpg";
import sunny from "./assets/sunny.jpg";
import cloudy_night from "./assets/cloudy_night.jpg";
import snow from "./assets/snow2.jpg";
import thunder from "./assets/thunder.jpg";
import snow_night2 from "./assets/snow_night2.jpg"
import rainy_night2 from  "./assets/rainy_night2.jpg"
import "./App.css";
import { ThreeDots } from 'react-loader-spinner';
import 'font-awesome/css/font-awesome.min.css';
import axios from "axios";
import Sidebar from './Sidebar';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import "./firebase"
import { auth } from "./firebase";
import StarIcon from "./StarIcon";
import FavoriteList from "./FavoriteList";

const filterTodayData = (data, todayStr) => {
  return data.filter(item => item.dt_txt.startsWith(todayStr));
};

const filterFutureData = (data, todayStr) => {
  return data.filter(item => !item.dt_txt.startsWith(todayStr));
};

const formatDate = (dateStr) => {
  const parts = dateStr.split('-');
  return `${parts[1]}/${parts[2]}`;
};

const translateweatherDescription = (description) => {
  const translationMap = {
    晴天: "晴れ",
    厚い雲: "曇り",
    雲: "曇り",
    薄い雲: "曇り",
    曇りがち: "曇り",
    霧: "曇り",
    小雨: "雨",
    適度な雨 : "雨",
    大雨 : "雨",
    非常に激しい雨 :"雨",
    極端な雨:"雨",
    凍る雨: "雨",
    弱いにわか雨: "雨",
    にわか雨: "雨",
    強いにわか雨: "雨",
    小雪: "雪",
    大雪 : "雪",
    不規則な雷雨 : "雷雨",
    小雨を伴う雷雨: "雷雨",
    大雨を伴う雷雨: "雷雨",
    小霧雨を伴う雷雨: "雷雨",
    大霧雨を伴う雷雨: "雷雨",
    霧雨を伴う雷雨: "雷雨",
  };
  return translationMap[description] || description;
};

const getWeatherIcon = (weatherDescription) => {
  const translatedDescription = translateweatherDescription(weatherDescription);

  let icon, iconColor;
  switch (translatedDescription) {
    case '晴れ':
      icon = "fa fa-sun-o";
      iconColor = "orange";
      break;
    case '曇り':
      icon = "fa fa-cloud";
      iconColor = "white";
      break;
    case '雨':
      icon = "fa fa-tint";
      iconColor = "blue";
      break;
    case '雪':
      icon = "fa fa-snowflake-o";
      iconColor = "lightblue";
      break;
    case '雷雨':
      icon = "fa fa-bolt";
      iconColor = "yellow";
      break;
    default:
      icon = "fa fa-question-circle";
      iconColor = "black";
      break;
  }

  return <i className={icon} style={{ color: iconColor }}></i>;
};


const getTimeDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 8) {
    return "morning";
  } else if (currentHour >= 8 && currentHour < 16) {
    return "day";
  } else if (currentHour >= 16 && currentHour < 18) {
    return "evening";
  } else {
    return "night";
  }
};



function App() {
  const [ data, setData ] = useState({});
  const [ location, setLocation ] = useState("tokyo");
  const [ api, setApi ] = useState("");
  const [ BkImg, setBkImg ] = useState({});
  const [ isLoading, setIsLoading ] = useState(true);
  const [ hasError, setHasError ] = useState(false);
  const [ hourlyData, setHourlyData ] = useState({today: [], future: []});
  const [ todayData, setTodayData ] = useState(null);
  const [ uniqueDates, setUniqueDates ] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ isAuth, setIsAuth ] = useState(false);
  const [inputLocation, setInputLocation] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);
  
 


  async function fetchWeatherData (query) {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`
      );
      setData(res.data);
      setTodayData(res.data);
      setHasError(false);
      setIsLoading(false);
    } catch (e) {
      setHasError(true);
      console.error("API request failed", e);
    } finally {
      setIsLoading(false);
    }
  };

async function fetchWeatherHoursData(query, todayStr)  {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`
    );
    setHasError(false);
    const todayData = filterTodayData(res.data.list, todayStr);
    const futureData = filterFutureData(res.data.list, todayStr);
    setHourlyData({today: todayData, future: futureData});
    console.log(res.data);
  }catch(e) {
    setHasError(true);
    console.error("Hourly API request failed", e);
  } finally{
    setIsLoading(false);
  }
};
  //初期値を東京、文字列の整理
  useEffect(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    fetchWeatherData("tokyo");
    fetchWeatherHoursData("tokyo", todayStr);
  }, []);

  //検索した際に検索した地域のリクエスト
  useEffect(() => {
    setApi(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`
    );
  }, [location]);

  //文字列の整理
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      setSearchedLocation(inputLocation);
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      fetchWeatherData(inputLocation).then(() => {
        if(!hasError) {
      setLocation(inputLocation);
      setInputLocation("");
    }
  });
  fetchWeatherHoursData(inputLocation, todayStr);
}
  };

  useEffect(() => {
    if (data && data.weather && data.weather.length > 0) {
      const newBkImg = getSetBkImg();
      setBkImg(newBkImg);
    }
  }, [data]);

  useEffect(() => {
    const newUniqueDates = [];
    hourlyData.future.forEach((data) => {
      const dateStr = data.dt_txt.split(' ')[0];
      const formattedDate = formatDate(dateStr); 
      if (!newUniqueDates.includes(formattedDate)){
      newUniqueDates.push(formattedDate);
    }
    });
    console.log("New Unique Dates:", Array.from(newUniqueDates));
    setUniqueDates(newUniqueDates);
  }, [hourlyData.future]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
      } else {
        localStorage.removeItem("isAuth");
        setIsAuth(false);
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  
  const getSetBkImg = () => {
    const description = data.weather && data.weather.length > 0 ?
    translateweatherDescription(data.weather[0].description) : "";

    const Time = getTimeDay();

    if (description === "曇り") {
      if (Time === "night") {
        return cloudy_night;
      } else {
        return cloudy;
      }
    } else if (description === "晴れ") {
      if (Time === "morning") {
        return morning;
      } else if (Time === "day") {
        return sunny;
      } else if (Time === "evening") {
        return evening;
      } else {
        return night;
      }
    } else if (description === "雨") {
      if (Time === "night") {
        return rainy_night2;
      } else {
        return rainy;
      }
    }else if (description === "雪") {
      if (Time === "night") {
        return snow_night2;
      } else {
        return snow;
      }
    }else if (description === "雷雨"){
      return thunder;
    }
  }
  //バーの管理
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      {isLoading ? (
        <div className="Loading">
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ThreeDots type="ThreeDots" color="#00BFFF" height={120} width={120} />
            </div>
        </div>
      ):(
        <img className="bg-img" src={getSetBkImg()} />
      )}
      <div>
      <div className="Bar">
      <button onClick={handleSidebarToggle} className="toggle-button">
        ☰
      </button>
      <Sidebar open={sidebarOpen} 
      setLocation={setLocation} 
      fetchWeatherData={fetchWeatherData} 
      fetchWeatherHoursData={fetchWeatherHoursData} />
    </div>
      </div>
      <StarIcon 
      isAuth={isAuth} 
      location={location}
      hasError={hasError} 
      />
      <div className="search">
        <input
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          onKeyPress={searchLocation}
          placeholder="地域を検索"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top"></div>
        <div className="location">
          <p>{data.name}</p>
        </div>
        <div className="temp">
          <h1>
            {data && data.main ? Math.round(data.main.temp - 273.15) : "Loading...."}℃
          </h1>
        </div>
        <div className="description">
          {hasError ? (
            <div>
              <p>
               {data.weather && data.weather.length > 0
              ? translateweatherDescription(data.weather[0].description)
              : "Loading..."}
              </p>
            <p>入力した地域は対応しておりません。</p>
            </div>
          ) : (
          <p>
            {data.weather && data.weather.length > 0
              ? translateweatherDescription(data.weather[0].description)
              : "Loading..."}
          </p>
          )}
        </div>
        <div className="tempbox">
          <div className="max">
            <p>最高</p>
            <p>
              {data.main
                ? Math.round(data.main.temp_max - 273.15)
                : "Loading...."}
              ℃
            </p>
          </div>
          <div className="min">
            <p>最低</p>
            <p>
              {data.main
                ? Math.round(data.main.temp_min - 273.15)
                : "Loading...."}
              ℃
            </p>
          </div>
        </div>
        <div> 
        <div className="DescriptionData">
        <h3>3時間ごとの天気</h3>
        <div className="flex-container-all"> 
        {hourlyData.today && hourlyData.today.map((data, index) => (
          <div key={index} className="flex-container"> 
            <span>{parseInt(data.dt_txt.split(' ')[1].split(':')[0], 10)}時</span>
            <span>{Math.round(data.main.temp - 273.15)}℃</span>
            <span>{getWeatherIcon(data.weather[0].description)}</span>
          </div>
        ))}
      </div>
      </div>
      </div>
      </div>
      <div className="bottom">
        <div className="feel">
          <p className="bold">
            {data.main
              ? Math.round(data.main.feels_like - 273.15)
              : "Loading...."}
            ℃
          </p>
          <p>体感温度</p>
        </div>
        <div className="humidity">
          <p className="bold">{data.main ? `${data.main.humidity}%` : "N/A"}</p>
          <p>湿度</p>
        </div>
        <div className="wind">
          <p className="bold">
            {data.wind ? (data.wind.speed * 0.44704).toFixed(1) : "Loading..."}
            m/s
          </p>
          <p>風速</p>
        </div>
      </div>
      <div>
      <div className="future-DescriptionData">
          <h3>明日以降の天気</h3>
          <div className="future-flex-container-all">
              {uniqueDates.map((uniqueDate, index) => {
              const [ month, day ] = uniqueDate.split('/');
              const cleanMonth = parseInt(month, 10);
              const cleanDay = parseInt(day, 10);
              const cleanUniqueDate =`${cleanMonth}/${cleanDay}`;
              const firstDataOfTheDay = hourlyData.future.find((data) => {
              const dateStr = data.dt_txt.split(' ')[0];
              const formattedDate = formatDate(dateStr);
              return formattedDate === uniqueDate;
              });
              return (
                <div key={index} className="future-flex-container">
                  <span>{cleanUniqueDate}</span>
                  <span>{Math.round(firstDataOfTheDay.main.temp - 273.15)}℃</span>
                  <span>{getWeatherIcon(firstDataOfTheDay.weather[0].description)}</span>
                </div>
              );
            })}
          </div>
        </div>
        </div>
    </div>
  );
}

export default App;