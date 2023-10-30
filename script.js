$(document).ready(function (){
    const apiKey = '91ca803728e08fcbc1a0d92d460de95f';
    const searchForm = document.getElementById('sidebar');
    const locationInput = document.getElementById('location');
    const locationName = document.getElementById('userLocation');
    const currentDate = document.getElementById('currentDate');
    const locationTemp = document.getElementById('tempInputLoc');
    const locationWind = document.getElementById('windInputLoc');
    const locationHumidity = document.getElementById('humidityInputLoc');
    const fiveDayForecast = document.getElementById('fiveDayForecast');
  
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const city = locationInput.value;
      const units = 'imperial';
  
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
  
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Update HTML with the retrieved data
          locationName.textContent = `Location: ${city}`;
          currentDate.textContent = `Date: ${new Date().toLocaleDateString()}`;
          locationTemp.textContent = `${data.list[0].main.temp} °C`;
          locationWind.textContent = `${data.list[0].wind.speed} MPH`;
          locationHumidity.textContent = `${data.list[0].main.humidity} %`;
  
          // Display the 5-day forecast
          displayFiveDayForecast(data.list);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  
    function displayFiveDayForecast(forecastData) {
      fiveDayForecast.innerHTML = '';
  
      for (let i = 0; i < forecastData.length; i += 8) {
        const forecast = forecastData[i];
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <h5 class="card-title">Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</h5>
          <img class="card-img-top" src="https://example.com/your-image-url.jpg" alt="Weather Icon">
          <ul class="card-body" style="list-style:none">
            <li class="card-text">Temp: ${forecast.main.temp} °C</li>
            <li class="card-text">Wind: ${forecast.wind.speed} MPH</li>
            <li class="card-text">Humidity: ${forecast.main.humidity} %</li>
          </ul>
        `;
  
        fiveDayForecast.appendChild(card);
      }
    }
  });
