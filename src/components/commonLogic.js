import { v4 as uuid4 } from "uuid";
const API_KEY = import.meta.env.VITE_API_KEY;

async function fetchLocationDetails(lat, lon) {
  const LAT_LON_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const weatherRes = await fetch(LAT_LON_URL);

  if (!weatherRes.ok)
    throw new Error("Failed to fetch weather data  from Weather API");

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

export async function saveOrUpdateLocWeather({
  zip,
  country,
  data,
  existingCard = null,
  setCards,
}) {
  const { lat, lon } = data;
  const id = existingCard?.id || uuid4();
  //Add or update card with  loading state
  setCards((prevCards) => {
    const loadingCard = {
      id,
      zip,
      country,
      data,
      details: null,
      loading: true,
      error: null,
      lastUpdated: null,
    };

    //If its an update or refresh
    if (existingCard) {
      return prevCards.map((card) => (card.id === id ? loadingCard : card));
    }

    //if its a new card
    return [loadingCard, ...prevCards];
  });

  //update card with details or erros

  try {
    const details = await fetchLocationDetails(lat, lon);
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              loading: false,
              error: null,
              details,
              lastUpdated: new Date().toLocaleTimeString(),
            }
          : card
      )
    );
  } catch (err) {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              loading: false,
              details: null,
              lastUpdated: null,
              error: err.message || "Unable to fetch weather details ",
            }
          : card
      )
    );
  }
}
