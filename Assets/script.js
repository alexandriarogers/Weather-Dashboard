

var searchedCity = document.getElementById("city-input");
var form = document.getElementById("city-form");
var searchEl = document.getElementById("search-button");
var pastCities = document.getElementById("search-history")
var currentCity = document.getElementById("current-container")
var forecastEl = document.getElementById("forecast-container")
var APIkey = "f46c188fea03b7e9c497428ced75669c";
var cities = []

var showCities = function() {
    var shownCities = localStorage.getItem("cities")
    if(!shownCities) {
        return false;
    }
    
    shownCities = JSON.parse(shownCities);
    
    for (var i=0; i < shownCities.length; i++) {
        displaySearchedCities(shownCities[i])
        cities.push(shownCities[i])
    }
}

var save = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

var displaySearchedCities = function(city) {
    var cityEl = document.createElement("div");
    cityEl.setAttribute("class", "card");
    var cityNameEl = document.createElement("div");
    cityNameEl.setAttribute("class", "card-body searched-city");
    cityNameEl.textContent = city;
    
    cityEl.appendChild(cityNameEl)

    cityEl.addEventListener("click", function () {
        getData(city)
    });

    pastCities.appendChild(cityEl)

}

var currentData = function(city, data) {

    //Variables for displaying current data
    var tempCurrent = Math.round(data.current.temp);
    var humidity = Math.round(data.current.humidity);
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;
    var iconCurrent = data.current.weather[0].icon;

    //Creating HTML elements for city date and icon
    currentCity.textContent = ""
    currentCity.setAttribute("class", "m-3 border col-10 text-center")
    var divCityHeader = document.createElement("div")
    var headerCityDate = document.createElement("h2");
    var currentdate = moment().format("L");
    var imageIcon = document.createElement("img");
    imageIcon.setAttribute('src', "") 
    imageIcon.setAttribute('src', "https://openweathermap.org/img/wn/" + iconCurrent + "@2x.png")
    headerCityDate.textContent = city + "   (" + currentdate + ")";

    //Add new variables to current data container
    divCityHeader.appendChild(headerCityDate)
    divCityHeader.appendChild(imageIcon)
    currentCity.appendChild(divCityHeader)

    //Creating HTML elements that will show the wether info for current city
    var divCurrent = document.createElement("div")
    var tempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var uvIndexEl = document.createElement ("p");
    var uvIndexColorEl = document.createElement("span")
    uvIndexColorEl.textContent = uvIndex
    //The color that displays favorable, moderate, or serve for UX Index
        if (uvIndex <= 4) {
            uvIndexColorEl.setAttribute("class", "bg-success text-white p-2")
        } else if (uvIndex <= 8) {
            uvIndexColorEl.setAttribute("class","bg-warning text-black p-2")
        } else {
            uvIndexColorEl.setAttribute("class", "bg-danger text-white p-2")
        }
    
    //Adds the current weather data to the page
    tempEl.textContent = "Temperature: " + tempCurrent + "°F";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    windSpeedEl.textContent = "Speed of Wind: " + windSpeed + " MPH";
    uvIndexEl.textContent = "UV Index: ";

    uvIndexEl.appendChild(uvIndexColorEl)

    //Appending the temperature, humidity, wind speed, and UX index to the new div
    divCurrent.appendChild(tempEl);
    divCurrent.appendChild(humidityEl);
    divCurrent.appendChild(windSpeedEl);
    divCurrent.appendChild(uvIndexEl);

    currentCity.appendChild(divCurrent);
    
};

var displayForecastData = function(data) {
    console.log(data)
    //Header for forecast section
    forecastEl.textContent = "";
    var forecastHeaderEl = document.getElementById("five-day");
    forecastHeaderEl.textContent = "5-day Forecast:"

    //For loop that creates the five day forecast
    for (var i=1; i < 6; i++) {
        var tempForecast = Math.round(data.daily[i].temp.day);
        var humidityForecast = data.daily[i].humidity;
        var iconForecast = data.daily[i].weather[0].icon;
    
    //Cards for the 5 day forcast data of the current city
    var cardEl = document.createElement("div");
    cardEl.setAttribute("class","card col-xl-2 col-md-5 col-sm-10 mx-3 my-2 bg-info text-white text-center");

    var cardBodyEl = document.createElement("div");
    cardBodyEl.setAttribute("class","card-body");

    var cardDateEl = document.createElement("h6");
    cardDateEl.textContent = moment().add(i, 'days').format("L");

    var cardIconEl = document.createElement("img");
    cardIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + iconForecast + "@2x.png")

    var cardTempEl = document.createElement("p");
    cardTempEl.setAttribute("class", "card-text");
    cardTempEl.textContent = "Temperature:  " + tempForecast + "°F";

    var cardHumidEl = document.createElement("p")
    cardHumidEl.setAttribute("class", "card-text");
    cardHumidEl.textContent = "Humidity:  " + humidityForecast + "%";
    
    //Appending current city wether data to the card bodies
    cardBodyEl.appendChild(cardDateEl)
    cardBodyEl.appendChild(cardIconEl)
    cardBodyEl.appendChild(cardTempEl)
    cardBodyEl.appendChild(cardHumidEl)
    
    cardEl.appendChild(cardBodyEl);
    forecastEl.appendChild(cardEl);
    
    //Reseting the form after the data for the current city is displayed 
    form.reset()

    }
};

var getData = function(city) {
    event.preventDefault();
    
    //API call
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;

    //Requesting from the url
    fetch(cityUrl).then(function(response) {
        //if response is okay, no errors found
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data);

    //Variables for the data we are requesting 
    var cityName = data.name;
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    
    //If statement for displaying and saving the data of the city is found, show window alert if not
    var prevSearch = cities.includes(cityName)
    if (!prevSearch) {
        cities.push(cityName)
        save()
        displaySearchedCities(cityName)
    }

    weatherData(cityName,latitude,longitude);

    });
    } else { 
        alert("City not Found, Please try again.")
        form.reset()
     }
   });
};

var weatherData = function(city,latitude,longitude) { 
    ///Five day forecast API call
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly&appid=" + APIkey;
        
    fetch(forecastUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);

        currentData(city, data);
        displayForecastData(data);

        });
    });
};

//Function for showing the previously searched cities
showCities()

//fEvent listener for form when a city is searched 
form.addEventListener("submit", function() {
    searchedCity = searchedCity.value.trim();
    getData(searchedCity);
})



