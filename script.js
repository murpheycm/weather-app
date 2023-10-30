//store searched city
var city="";

var searchCity = $("#search-city");
var cityList=[];
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var temperature = $("#temperature");
var humidty= $("#humidity");
var windSpeed=$("#wind-speed");
var uvIndex= $("#uv-index");

//API key
var APIKey="a0aca8a89948154a4182dcecc780b513";

//Find available cities
function find(c){
    for (var i=0; i<cityList.length; i++){
        if(c.toUpperCase()===cityList[i]){
            return -1;
        }
    }
    return 1;
}