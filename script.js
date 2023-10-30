$(document).ready(function () {
  const apiKey = "91ca803728e08fcbc1a0d92d460de95f";
  let city;
  let weatherId;
  let weather;
  let lat;
  let lon;
  let uvIndex = "";
  let uv;
  let savedLocations= [];

  loadLocations();

  init();

  
  // SEARCH -----------------------------------------------------------------------

  // Listen for search btn click

  $("#searchBtn").on("click", function () {
    event.preventDefault();
    if ($("#search").val() !== "") {
      let city = $("#search").val().trim();
    }
    weatherToday();
  });

  // Add previously searched location buttons to aside
  function addLocation() {
    $("#prevLocation").prepend($("<button>").attr("type", "button").attr("data-city", city).addClass("past text-muted list-group-item list-group-item-action").text(city));
    $("#search").val("");
  }

  // Previously searched button event listener
  $("#prevLocation").on("click",".past",function () {
    event.preventDefault();
    let city = $(this).attr("data-city");
    weatherToday();
  });

  function reviewPrev () {
    if ( $(`#prevLocation button[data-city="${city}"]`).length ) { 
      $("#search").val("");
    } else {
      addLocation();
      savedLocations.push(city);
      localStorage.setItem("cities", JSON.stringify(savedLocations))
    }
  }
  

  // TODAY -----------------------------------------------------------------------


  // Get today's weather 
  function weatherToday() {
    let apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: apiCurrent,
      method: "GET",
      error: function () {
        alert("Location not found.");
        $("#search").val("");
      }
    }).then(function (response) {
      reviewPrev();
      weatherId = response.weather[0].id;
      dataCases();

      $("#location").text(response.name);
      $("#temp").text(`${response.main.temp} °F`);
      $("#hum").text(`${response.main.humidity} %`);
      $("#wind").text(`${response.wind.speed} MPH`);
      $("#today-img").attr("src", `./Assets/${weather}.png`).attr("alt", weather);

      lat = response.coord.lat;
      lon = response.coord.lon;

      getUV();
      getFiveDay();
    });
  }

  // Get UV
  function getUV() {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
      method: "GET"
    }).then(function (response) {
      uvIndex = response.value;
      uvCases();
      $("#uv").text(uvIndex).css("background-color", uv);
    })
  }

  // FIVE DAY -----------------------------------------------------------------------

  
  function getFiveDay() {
    let apiFive = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current&appid=${apiKey}&units=imperial`
    $.ajax({
      url: apiFive,
      method: "GET"
    }).then(function (response) {
      for (let i = 0; i < 5; i++) {
        let unixTime = response.daily[i].dt
        $(`#day${i}`).text(moment.unix(unixTime).format('l'))
        $(`#temp${i}`).text(`${response.daily[i].temp.day} °F`);
        $(`#hum${i}`).text(`${response.daily[i].humidity} %`);
        weatherId = response.daily[i].weather[0].id
        dataCases();
        $(`#img${i}`).attr("src", `./Assets/${weather}.png`).attr("alt", weather)
      }
    })
  }


  // WEATHER DECODERS -----------------------------------------------------------------------

  // Change img for weather 
  function dataCases() {
    switch (true) {
      case (weatherId > 199 && weatherId < 299):
        weather = "Thunderstorm";
        break;
      case (weatherId > 299 && weatherId < 599):
        weather = "Rain";
        break;
      case (weatherId > 599 && weatherId < 699):
        weather = "Snow";
        break;
      case (weatherId > 699 && weatherId < 799):
        weather = "Atmostphere";
        break;
      case weatherId === 800:
        weather = "Clear";
        break;
      case weatherId > 800:
        weather = "Clouds"
    }
  }

  function uvCases() {
    uv = "";
    switch (true) {
      case (uvIndex >= 0 && uvIndex < 3):
        uv = "green";
        break;
      case (uvIndex >= 3 && uvIndex < 6):
        uv = "darkkhaki";
        break;
      case (uvIndex >= 6 && uvIndex < 8):
        uv = "orange";
        break;
      case (uvIndex >= 8 && uvIndex < 11):
        uv = "red";
        break;
      case (uvIndex >= 11):
        uv = "violet"
    }
  }


  // LOCAL STORAGE -----------------------------------------------------------------------

  // Load Cities
  function loadLocations() {
    let storedLocations = JSON.parse(localStorage.getItem("cities"));
    if (storedLocations !== null) {
      savedLocations = storedLocations;
      renderLocations();
    } else {
      let city = "Richmond"
      reviewPrev();
    }
  }

  function renderLocations() {
    for (let i = 0; i < savedLocations.length; i++) {
      let city = savedLocations[i];
      addLocation();
    }
  }

  // Clear Storage 

  $("#clear").on("click", function () {
    localStorage.clear();
    savedLocations = [];
    $("#prevLocation").empty();
    let city = "Richmond";
    init();
  })

  // INIT -----------------------------------------------------------------------

  // Initialize with SD
  function init() {
    weatherToday();
  }

});
