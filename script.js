
//all variables

var selectedCity = $("#selected-city");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumidity = $("#current-humid");
var weatherContainer = $(".weather-container");
var searchButton = $("#search-button");
var listOfCities = $("#history");
var currentDay = dayjs();

var city = [];
if (localStorage.getItem("city") != null) {
  city = JSON.parse(localStorage.getItem("city"));
}
function saveCity() {
  localStorage.setItem("city", JSON.stringify(city));
}