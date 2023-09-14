import { useEffect, useState } from "react";
import cloudy from "./assets/cloudy.jpg";
import night from "./assets/night.jpg";
import morning from "./assets/morning.jpg";
import evening from "./assets/evening.jpg";
import rainy_night from "./assets/rainy_night.jpg";
import rainy from "./assets/rainy.jpg";
import sunny from "./assets/sunny.jpg";
import cloudy_night from "./assets/cloudy_night.jpg";
import snow from "./assets/snow2.jpg";
import thunder from "./assets/thunder.jpg";
import snow_night2 from "./assets/snow_night2.jpg"
import "./App.css";
import axios from "axios";

const translateweatherDescription = (description) => {
  const translationMap = {
    晴天: "晴れ",
    厚い雲: "曇り",
    雲: "曇り",
    薄い雲: "曇り",
    曇りがち: "曇り",
    小雨: "雨",
    適度な雨 : "雨",
    大雨 : "雨",
    非常に激しい雨 :"雨",
    極端な雨:"雨",
    凍る雨: "雨",
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
  const [ location, setLocation ] = useState("Tokyo");
  const [ api, setApi ] = useState("");
  const [ BkImg, setBkImg ] = useState({});
  const [ isLoading, setIsLoading ] = useState(true);
  const [ hasError, setHasError ] = useState(false);

  const fetchWeatherData = async (query) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=37a68e1a7debd2495d0e17b1d525cd13&lang=ja`
      );
      setData(res.data);
      setHasError(false);
      setIsLoading(false);
      console.log(isLoading)
      console.log(res.data);
    } catch (e) {
      setHasError(true);
      console.error("API request failed", e);
    } finally {
      setIsLoading(false);
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

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData(location).then(() => {
        if(!hasError) {
      setLocation("");
      console.log("★天候情報★", data.weather[0].description);
    }
  });
}
  };

  useEffect(() => {
    if (data && data.weather && data.weather.length > 0) {
      const newBkImg = getSetBkImg();
      setBkImg(newBkImg);
    }
  }, [data]);
  
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
        return rainy_night;
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

  return (
    <div className="app">
      {isLoading ? (
        <div>
          <h1>now Loading...</h1>
        </div>
      ):(
        <img className="bg-img" src={getSetBkImg()} />
      )}
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
