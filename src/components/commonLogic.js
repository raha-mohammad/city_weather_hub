const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchLocationDetails(zipCode, country) {
  const ZIP_CODE_URL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${country}&appid=${API_KEY}&units=metric`;
  try {
    const weatherRes = await fetch(ZIP_CODE_URL);

    if (!weatherRes.ok) {
      if (weatherRes.status === 404) {
        throw new Error("No such zip code exists. Please check and try again.");
      } else if (weatherRes.status === 401) {
        throw new Error("Invalid API key. Please verify your credentials.");
      } else {
        throw new Error("Server error. Try again later.");
      }
    }

    const weatherData = await weatherRes.json();
    return {
      cityName: weatherData.name,
      temp: weatherData.main.temp,
      weather: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      feelsLike: weatherData.main.feels_like,
      weatherDescription: weatherData.weather[0].description,
    };
  } catch (err) {
    if (err.name === "TypeError") {
      throw new Error("Network issue — please check your internet connection.");
    }
    throw err;
  }
}
