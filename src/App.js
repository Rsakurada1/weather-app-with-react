import { useEffect, useState } from "react";
import cloudy from "./assets/cloudy.jpg";
import night from "./assets/night.jpg";
import morning from "./assets/morning.jpg";
import evening from "./assets/evening.jpg";
import rainy_night from "./assets/rainy_night.jpg";
import rainy from "./assets/rainy.jpg";
import sunny from "./assets/sunny.jpg";
import cloudy_night from "./assets/cloudy_night.jpg";
import "./App.css";
import axios from "axios";

const translateweatherDescription = (description) => {
  const translationMap = {
    晴天: "晴れ",
    厚い雲: "曇り",
    雲: "曇り",
    薄い雲: "曇り",
    曇りがち: "曇り",
  };
  return translationMap[description] || description;
};

const getTimeDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 6) {
    return "morning";
  } else if (currentHour >= 6 && currentHour < 16) {
    return "day";
  } else if (currentHour >= 16 && currentHour < 18) {
    return "evening";
  } else {
    return "night";
  }
};

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("Tokyo");
  const [api, setApi] = useState("");
  const [ BkImg, setBkImg ] = useState({});

  const fetchWeatherData = async (query) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`
      );
      console.log("Fetched data: ", res.data);
      setData(res.data);
    } catch (e) {
      console.error("API request failed", e);
    }
  };

  useEffect(() => {
    fetchWeatherData("Tokyo");
  }, []);

  useEffect(() => {
    setApi(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`
    );
  }, [location]);

  //debug用
  useEffect(() => {
    console.log("Current data: ", data);
  });

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData(location);
      setLocation("");
      console.log("★天候情報★", data.weather[0].description);
    }
  };

  useEffect(() => {
    const newBkImg = getSetBkImg();
    setBkImg(newBkImg);
  }, [data])

  

  const getSetBkImg = () => {
    const description = translateweatherDescription(
      data.weather[0].description
    );
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
        return rainy_night;
      } else {
        return rainy;
      }
    }
  };

  return (
    <div className="app">
      <img className="bg-img" src={getSetBkImg()} />
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
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
            {data.main ? Math.round(data.main.temp - 273.15) : "Loading...."}℃
          </h1>
        </div>
        <div className="description">
          <p>
            {data.weather && data.weather.length > 0
              ? translateweatherDescription(data.weather[0].description)
              : "Loading..."}
          </p>
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
    </div>
  );
}

export default App;
