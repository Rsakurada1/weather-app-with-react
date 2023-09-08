import './App.css';
import axios from "axios";


function App() {

const api = "https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=37a68e1a7debd2495d0e17b1d525cd13"

  return (
    <div className='app'>
      <div className="container">
        <div className="top">
        <div className="location">
          <p>Tokyo</p>
        </div>
        <div className="temp">
          <h1>30°</h1>
        </div>
        <div className="description">
        <p>曇り</p>
        </div>
        </div>
        <div className="bottom">
        <div className="feel">
          <p className='bold'>35°</p>
          <p>体感温度</p>
        </div>
        <div className="humidity">
          <p className='bold'>20%</p>
          <p>湿度</p>
        </div>
        <div className="wind">
          <p className='bold'>20m/s</p>
          <p>風速</p>
         </div>
        </div>
      </div>
    </div>
  )
}

export default App;
