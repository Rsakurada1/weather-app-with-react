import './App.css';


function App() {

const api = "https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=37a68e1a7debd2495d0e17b1d525cd13"

  return (
    <div className='app'>
      <div className="container">
        <div className="top">
        <div className="location">
          <p>Tpkyo</p>
        </div>
        <div className="temp">
          <h1>30°</h1>
        </div>
        <div className="description">
        <p>Clouds</p>
        </div>
        </div>
        <div className="bottom">
        <div className="feel">
          <p>35°</p>
        </div>
        <div className="humidity">
          <p>20%</p>
        </div>
        <div className="wind">
          12 MPH
         </div>
        </div>
      </div>
    </div>
  )
}

export default App;
