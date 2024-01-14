// Get today's date using day.js
const todayDate = dayjs().format('DD/MM/YYYY');

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const cityName = document.getElementById('search-input').value.trim();
    if (cityName) {
      getWeatherForCity(cityName);
    }
  });
  function getWeatherForCity(cityName) {
    const apiKey = '7aa989e2bc5171a6551c18a2e68ae038';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => displayCurrentWeather(data));
    console.log(data).catch((error) => {
      console.error('Fetching weather data failed:', error);
    });
  }

  function displayCurrentWeather(data) {
    const weatherContainer = document.getElementById('current-weather');

    // Convert temperature from Kelvin to Celsius
    const tempCelsius = (data.main.temp - 273.15).toFixed(2);

    weatherContainer.innerHTML = `
      <h2>Current Weather for ${data.name} ${todayDate}</h2>
      <p><strong>Temperature:</strong> ${tempCelsius} °C</p>
      <p><strong>Conditions:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${(data.wind.speed * 3.6).toFixed(
        2
      )} km/h</p>
    `;
  }
});
