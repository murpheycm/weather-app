document.querySelector(".search-column").addEventListener("click", async function (event) {
    if (event.target.nodeName !== "BUTTON") {
      return;
    }
    let city-name = event.target.getAttribute("data-city-name");
    if (!city-name) {
      city-name = document.querySelector("#city-name").value;
      addCityToStorage(city-name);
    }

    let coordinatesRequestUrl =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city-name +
      "&limit=1&appid=c4d8aa17891ee763b028f523635c2fad";
    /*  using fetch we are getting the latitude and longitude
  of a city.*/
    /* setting empty string to lat and lon variable so that we can assign the actual data from the api response later */
    let lat = "";
    let lon = "";
    /* 'await' holds the current execution till we get the response back.Once we get the response it moves to next line (which is line 31 here ). 
  Awaits can only be used inside asynchronous functions */
    await fetch(coordinatesRequestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data && data.length) {
          lat = data[0].lat;
          lon = data[0].lon;
        }
      });
    /* using if condition checking if we have a valid lon and lat value and using it to fetch the actual weather details */

    if (lat && lon) {
      let weatherData = "";
      let weatherRequestUrl =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=c4d8aa17891ee763b028f523635c2fad&units=imperial";
      await fetch(weatherRequestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          weatherData = data;
        });
      /* once we get a valid weather data then query selecting and assigning the values in the elements */
      if (weatherData) {
        let currentDayWeather = weatherData.list[0];
        let temperature = currentDayWeather.main.temp;
        let wind = currentDayWeather.wind.speed;
        let humidity = currentDayWeather.main.humidity;
        let icon = currentDayWeather.weather[0].icon;
        document.querySelector("#city-name").textContent =
          city-name + " (" + dayjs().format("MM/DD/YYYY") + ")";
        document.querySelector("#current-temp").textContent =
          "Temp: " + temperature + "\xB0 F";
        document.querySelector("#current-wind").textContent =
          "Wind: " + wind + " MPH";
        document.querySelector("#current-humidity").textContent =
          "Humidity: " + humidity + " %";
        /* weather api icon url */
        document.querySelector("#current-weather-image").src =
          "https://openweathermap.org/img/wn/" + icon + ".png";
        /* Iterating for next 5 days weather forecast */
        let cardElement = "";

        for (let i = 1; i <= 5; i++) {
          /* adding one day to current date using "i" */
          let nextDay = dayjs().add(i, "day");
          /* Finding the "nextDay" weather by comparing the date from the list using dayjs format function, since the time varies */
          let nextDateWeather = weatherData.list.find(
            (eachDay) =>
              dayjs(eachDay.dt_txt).format("YYYY-M-D") ===
              nextDay.format("YYYY-M-D")
          );
          /* implementation of 5-day weather using Js dynamically */
          let temperature = nextDateWeather.main.temp;
          let wind = nextDateWeather.wind.speed;
          let humidity = nextDateWeather.main.humidity;
          let icon = nextDateWeather.weather[0].icon;
          cardElement += `<div class="card col-lg-2 col-sm-12 ms-lg-3 mb-sm-4 custom-card">
        <div class="card-body card-body-weather">
          <h4 class="city-name" id="date">(${nextDay.format("M/D/YYYY")})</h4>
          <img src="${"https://openweathermap.org/img/wn/" + icon + ".png"}" />
          <p class="city-text">Temp: ${temperature}&deg;F</p>
          <p class="city-text">Wind: ${wind} MPH</p>
          <p class="city-text">Humidity: ${humidity} %</p>
        </div>
      </div>`;
        }
        /* appending the values to HTML div */
        document.querySelector("#day-wise-section").innerHTML = cardElement;
      }
    }
    document.querySelector(".weather-column").style.display = "block";
  });

/* adding the searched cities to the local storage using */
function addCityToStorage(city-name) {
  let availableCity = window.localStorage.getItem("city-name");
  if (!availableCity) {
    /* we should place everything in local storage as string so using stringfy! also setting it as an array of string so that it will be easier to push new city names to array */
    window.localStorage.setItem("city-name", JSON.stringify([city-name]));
  } else {
    /* Parse here converts the string to native datatype */
    let availableCityArray = JSON.parse(availableCity);
    if (!availableCityArray.includes(city-name)) {
      availableCityArray.push(city-name);
    }
    window.localStorage.setItem("city-name", JSON.stringify(availableCityArray));
  }
  /* first we should write a function 'appendsearchedcity() ' to display the
  stored local storage city names as a button and then call it here */
  appendSearchedCity();
}

function appendSearchedCity() {
  let availableCity = window.localStorage.getItem("city-name");

  if (availableCity) {
    let availableCityArray = JSON.parse(availableCity);
    let buttonElement = "";
    for (let i = 0; i < availableCityArray.length; i++) {
      /* since we doesnt know the number buttons to be displayed we are trying to append it using dynamic JS */
      buttonElement += ` <div class="d-grid mb-3">
    <button
      class="btn btn-outline-secondary storage-button"
      type="button" id="searchBtn" data-city-name="${availableCityArray[i]}"
    >
      ${availableCityArray[i]}
    </button>
  </div>`;
      /* ${availableCityArray[i]} we have array of city-names in the local storage and setting those names to each button using for loop (i) */
    }
    document.querySelector("#search-column").innerHTML = buttonElement;
  }
}

/* this is called here to display the city names when we reload the page*/
appendSearchedCity();
