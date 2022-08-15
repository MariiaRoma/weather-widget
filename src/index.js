function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let day = date.getDay();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Sunday",
  ];
  return `${days[day]} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecast_elem = document.querySelector("#forecast");

  let forecast_html = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun"];
  forecast.forEach(function (forecast_day, index) {
    if (index < 6) {
      forecast_html += `
				<div class="col-2">
					<div class="weather-forecast-date">${formatDay(forecast_day.dt)}</div>
					<img
						src="http://openweathermap.org/img/wn/${forecast_day.weather[0].icon}@2x.png"
						alt=""
						width="56px"
					/>
					<div class="weather-forecast-temperatures">
						<span
							class="weather-forecast-temperature-max"
						>
							${Math.round(forecast_day.temp.max)}&deg;
						</span>
						<span
							class="weather-forecast-temperature-min"
						>
							${Math.round(forecast_day.temp.min)}&deg;
						</span>
					</div>
				</div>
				`;
    }
  });
  forecast_html += `</div>`;
  forecast_elem.innerHTML = forecast_html;
}

function getForecast(coordinates) {
  let api_key = "63608bc5eef30d17258d77a3cb58927f";
  let one_call_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${api_key}&units=metric`;
  axios.get(one_call_url).then(displayForecast);
}

function displayTemperature(response) {
  let temperature_elem = document.querySelector("#temperature");
  let city_elem = document.querySelector("#city");
  let description_elem = document.querySelector("#description");
  let humidity_elem = document.querySelector("#humidity");
  let wind_elem = document.querySelector("#wind");
  let date_elem = document.querySelector("#date");
  let icon_elem = document.querySelector("#icon");

  celciusTemperature = response.data.main.temp;

  temperature_elem.innerHTML = Math.round(celciusTemperature);
  city_elem.innerHTML = response.data.name;
  description_elem.innerHTML = response.data.weather[0].description;
  humidity_elem.innerHTML = response.data.main.humidity;
  wind_elem.innerHTML = Math.round(response.data.wind.speed);
  date_elem.innerHTML = formatDate(response.data.dt * 1000);
  icon_elem.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon_elem.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let api_key = "30c4109a1cd7a0698b53f1fcf195aefc";
  let api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;

  axios.get(api_url).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city_input_elem = document.querySelector("#city-input");
  search(city_input_elem.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Kyiv");
