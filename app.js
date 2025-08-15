// app.js
const apiKey  = "59ba95bf6836742c767297d666de7ca3";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcon = document.getElementById("weatherIcon");
const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherEl = document.getElementById("weather");
const errorEl = document.getElementById("error");
const errorText = document.getElementById("errorText");

async function checkWeather(city) {
  city = city.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  // show loading state (optional)
  errorEl.style.display = "none";

  try {
    const url = apiUrl + encodeURIComponent(city) + `&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      // handle common HTTP errors
      if (response.status === 404) {
        showError("City not found. Check spelling.");
      } else if (response.status === 401) {
        showError("Invalid API key.");
      } else {
        showError("Server error. Try again later.");
      }
      weatherEl.style.display = "none";
      return;
    }

    const data = await response.json();
    // console.log(data);

    // update DOM
    cityEl.textContent = `${data.name}, ${data.sys?.country ?? ""}`;
    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;

    // Convert wind from m/s to km/h (OpenWeatherMap returns m/s when units=metric)
    const windMs = data.wind && data.wind.speed ? data.wind.speed : 0;
    const windKmh = Math.round(windMs * 3.6);
    windEl.textContent = `${windKmh} km/h`;

    // Set icon: use OWM icon if available else fallback to local images
    const iconCode = data.weather[0].icon; // e.g. "10d"
    if (iconCode) {
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      weatherIcon.alt = data.weather[0].description || "weather icon";
    } else {
      // fallback based on main
      const main = (data.weather[0].main || "").toLowerCase();
      if (main.includes("cloud")) weatherIcon.src = "./images/clouds.png";
      else if (main.includes("clear")) weatherIcon.src = "./images/clear.png";
      else if (main.includes("rain")) weatherIcon.src = "./images/rain.png";
      else if (main.includes("drizzle")) weatherIcon.src = "./images/drizzle.png";
      else weatherIcon.src = "./images/mist.png";
      weatherIcon.alt = data.weather[0].description || "weather icon";
    }

    weatherEl.style.display = "block";
    errorEl.style.display = "none";
  } catch (err) {
    console.error(err);
    showError("Network error. Please check your connection.");
    weatherEl.style.display = "none";
  }
}

function showError(message) {
  errorText.textContent = message;
  errorEl.style.display = "block";
}

// click
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

// Enter key
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
