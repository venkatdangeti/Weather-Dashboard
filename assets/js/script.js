//all variables
var selectedCity = $("#selected-city");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumid = $("#current-humid");
var currentUv = $("#current-uv");
var weatherContainer = $(".weather-container");
var searchButton = $("#search-button");
var listOfCities = $("#history");
var currentDay = dayjs();

var city = [];

//validate the localstorage for history
if (localStorage.getItem("history") != null) {
  city = JSON.parse(localStorage.getItem("history"));
}

//save the city to local storage
function saveCity() {
  localStorage.setItem("history", JSON.stringify(city));
}

function initial() {
  weatherContainer.attr("style", "display: none");

  // could do eventlistener for page, then have it get key
  searchButton.on("click", function (e) {
    e.preventDefault();
    var cityInput = $("#search-input").val();
    displayWeather(cityInput);
    for (var i = 0; i < city.length; i++) {
      if (cityInput == city[i]) {
        return;
      }
    }

    city.push(cityInput);
    $("#search-input").val('');

  });
}
// closes initial function


//display weather function
function displayWeather(x) {
  var cityInput = x;
  weatherContainer.attr("style", "display: block");

  var currentConditions = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=5b787b122cd0fc16a703d189885623e5`;

  fetch(currentConditions)
    .then(function (response) {

      if (response.status === 404 || response.status === 400) {
        alert("Error: City not found, please try again.");
        location.reload();
      } else {
        renderCity();
        saveCity();
      }
      return response.json();
    })
    .then(function (data) {
      var currentDate = currentDay.format("DD/MM/YYYY");
      var iconcode = data.weather[0].icon;
      var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
      $("#wicon").attr("src", iconurl);

      selectedCity.text(`${data.name} (${currentDate})`);
      currentTemp.text(`Temp: ${data.main.temp}° F`);
      currentWind.text(`Wind: ${data.wind.speed} MPH`);
      currentHumid.text(`Humidity: ${data.main.humidity} %`);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var uvIndex = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=5b787b122cd0fc16a703d189885623e5`;

      fetch(uvIndex)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          currentUv.text(`UV Index: ${data.current.uvi}`);
          currentUv.removeClass("favorable-uv")
          currentUv.removeClass("moderate-uv")
          currentUv.removeClass("severe-uv")
          if (data.current.uvi < 2) {
            currentUv.addClass("favorable-uv");
          } else if (data.current.uvi > 2 && data.current.uvi < 7) {
            currentUv.addClass("moderate-uv");
          } else {
            currentUv.addClass("severe-uv");
          }

          for (var i = 1; i < 6; i++) {
            var date5 = $("#date-" + i);
            var temp5 = $("#temp-" + i);
            var wind5 = $("#wind-" + i);
            var humid5 = $("#humid-" + i);
            var wicon5 = $("#wicon-" + i);

            var futurDate = new Date(data.daily[i].dt * 1000);
            var date = dayjs(futurDate).format("DD/MM/YYYY");
            var iconcode = data.daily[i].weather[0].icon;
            var iconurl =
              "https://openweathermap.org/img/w/" + iconcode + ".png";

            date5.text(date);
            wicon5.attr("src", iconurl);
            temp5.text(`Temp: ${data.daily[i].temp.day}° F`);
            wind5.text(`Wind: ${data.daily[i].wind_speed} MPH`);
            humid5.text(`Humidity: ${data.daily[i].humidity} %`);
          }

        });

    })

}
//closes displayweather function


// render function
function renderCity() {
  listOfCities.text("");

  for (var i = 0; i < city.length; i++) {
    var pEl = document.createElement("p");
    pEl.textContent = city[i].toUpperCase();
    pEl.setAttribute("id", "history" + i);
    document.querySelector("#history").appendChild(pEl);
  }
}

//display history list
function displayOldCity() {
  listOfCities.on("click", function (event) {
    var element = event.target;

    if (element.matches("p") === true) {
      var index = element.getAttribute("id");

      for (var i = 0; i < city.length; i++) {
        var oldCity = $("#history" + i)[0].innerText;

        if (index == $("#history" + i)[0].id) {
          displayWeather(oldCity);
          break;
        }
      }
    }
  });
}

renderCity();
displayOldCity();
initial();