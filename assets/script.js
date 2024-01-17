document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const cityName = searchInput.value.trim();
    if (cityName) {
      getWeatherForCity(cityName);
    }
  });

  function getWeatherForCity(cityName) {
    const apiKey = '7aa989e2bc5171a6551c18a2e68ae038';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(weatherUrl)
      .then((response) => response.json())
      .then((data) => {
        displayCurrentWeather(data);
        updateSearchHistory(cityName);
      });

    // Fetch 5-day forecast data
    fetch(forecastUrl)
      .then((response) => response.json())
      .then((forecastData) => {
        displayFiveDayForecast(forecastData);
      })
      .catch((error) => console.error('Fetching weather data failed:', error));
  }

  function displayCurrentWeather(data) {
    const weatherContainer = document.getElementById('current-weather');
    const tempCelsius = (data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
    const todayDate = dayjs().format('DD/MM/YYYY'); // Format today's date using day.js

    weatherContainer.innerHTML = `
      <h2>Current Weather for ${data.name} (${todayDate})</h2>
      <p><strong>Temperature:</strong> ${tempCelsius} °C</p>
      <p><strong>Conditions:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${(data.wind.speed * 3.6).toFixed(
        2
      )} km/h</p>
    `;
  }

  function updateSearchHistory(cityName) {
    if (!searchHistory.includes(cityName)) {
      searchHistory.unshift(cityName);
      searchHistory.splice(5);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      displaySearchHistory();
    }
  }

  function displaySearchHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = searchHistory
      .map(
        (city) =>
          `<button class="list-group-item list-group-item-action" onclick="getWeatherForCity('${city}')">${city}</button>`
      )
      .join('');
  }

  function displayFiveDayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Process and display each day's forecast
    forecastData.list.forEach((forecast, index) => {
      if (index % 8 === 0) {
        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-card';
        const date = new Date(forecast.dt * 1000);
        const tempCelsius = (forecast.main.temp - 273.15).toFixed(2);

        dayCard.innerHTML = `
          <h3>${date.toDateString()}</h3>
          <p>Temp: ${tempCelsius} °C</p>
          <p>Conditions: ${forecast.weather[0].description}</p>
        `;

        forecastContainer.appendChild(dayCard);
      }
    });
  }

  displaySearchHistory();
});
