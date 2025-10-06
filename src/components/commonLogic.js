const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchLocationDetails(zipCode, country) {
  const ZIP_CODE_URL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${country}&appid=${API_KEY}&units=metric`;

  const weatherRes = await fetch(ZIP_CODE_URL);

  if (!weatherRes.ok) {
    throw new Error("No such zip code exists, Recheck your zip code. ");
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
}
