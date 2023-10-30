$(document).ready(function (){
    const apiKey = '91ca803728e08fcbc1a0d92d460de95f';
    let searchForm;
    let locationInput;
    let locationName;
    let currentDate;
    let locationTemp;
    let locationWind;
    let locationHumidity;
    let fiveDayForecast;
    let searchHistory = [];

    cities();

    init();

    //=================================================//

    // // Today's date
    // const momentDay = moment().format('dddd, MMMM Do');
    // $('.todayDate').prepend(momentDay);

    // // Generate dates for the 5-day forecast
    // for (var i = 1; i < 6; i++) {
    //     $(`#${i}Date`).text(moment().add(i, 'd').format('dddd, MMMM Do'));
    // }


    // Search button event listener
    $("#searchBtn").on("click", function () {
        event.preventDefault();
        // Search for a city on click 
        if ($("#search").val() !== "") {
          city = $("#search").val().trim();
        }
        getToday();
      });

    // Add city
    function addCity() {
        $("#search").prepend($("<button>").attr("type", "button").attr("data-city", city).addClass("btn btn-outline-primary btn-block").text(city));
        $("#search").val("");
    }

    // Has city been searched before?
    function previousCity () {
        if ( $(`#prevCity button[data-city="${city}"]`).length ) { 
          $("#search").val("");
        } else {
          addCity();
          searchHistory.push(city);
          localStorage.setItem("cities", JSON.stringify(searchHistory))
        }
    }

    // Event listener for previous cities searched buttons
     $("#prevCity").on("click",".past",function () {
        event.preventDefault();
        city = $(this).attr("data-city");
        getToday();
      });
    
    // Render cities
    function renderCities() {
        for (var i = 0; i < savedCities.length; i++) {
          city = savedCities[i];
          addCity();
        }
      }
    
    // Load Cities
      function cities() {
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        if (storedCities !== null) {
          savedCities = storedCities;
          renderCities();
        } else {
          city = "Richmond"
          previousCity();
        }
      }

    // Clear Previously Searched cities
    $("#clearBtn").on("click", function () {
        localStorage.clear();
        savedCities = [];
        $("#prevCity").empty();
        city = "";
        init();
      })
    

    function init() {
        getToday();
    }
});
