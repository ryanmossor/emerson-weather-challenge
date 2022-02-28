## About

This is a simple weather app created as part of a job interview process with Emerson. It utilizes the [OpenWeather API](https://openweathermap.org/current) and returns current weather conditions based on a city name, ZIP code, or geographic coordinates. It also features a "Use My Location" option, which will retrieve current weather data based on the user's current coordinates.

This app makes use of [OpenWeather's Geocoding API](https://openweathermap.org/api/geocoding-api) to convert city names and ZIP codes to geographic coordinates before retrieving current weather conditions. The user is presented with a description of the weather, temperature (and feels-like temperature), humidity, wind speed, and wind direction.

## Usage

Enter a desired city name, 5-digit ZIP code, or geographic coordinates into the search bar and click "Search" to retrieve weather data. Alternatively, click on the "Use My Location" button and grant location permission in your browser to retrieve weather data for your current location.

### Valid Sample Inputs

-   20390
-   London
-   41.881832, -87.623177

### Invalid Sample Inputs (alerts user with error)

-   4792 (invalid ZIP code)
-   fipajlksk (invalid city name)
-   91.1234, 209.1234 (invalid coordinates)
