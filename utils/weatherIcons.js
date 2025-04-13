export const getWeatherIcon = (weatherCode) => {
  switch (weatherCode) {
    case "01d":
      return "weather-sunny";
    case "01n":
      return "weather-night";
    case "02d":
      return "weather-partly-cloudy";
    case "02n":
      return "weather-night-partly-cloudy";
    case "03d":
    case "03n":
      return "weather-cloudy";
    case "04d":
    case "04n":
      return "weather-cloudy";
    case "09d":
    case "09n":
      return "weather-rainy";
    case "10d":
    case "10n":
      return "weather-pouring";
    case "11d":
    case "11n":
      return "weather-lightning";
    case "13d":
    case "13n":
      return "weather-snowy";
    case "50d":
    case "50n":
      return "weather-fog";
    default:
      return "weather-sunny";
  }
};
