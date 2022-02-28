const apiKey = 'cf002751564a4c78f5f7ed479f1b9ba3';

/* Store latitude/longitude in same object format as browser's geolocator for consistency
Used in getWeatherByCoordinates() to retrieve current conditions */
let inputCoords = {
    coords: {
        latitude: '',
        longitude: ''
    }
}

// preventDefault() to stop form from being submitted
document.getElementById("search-button").addEventListener("click", function(event) {
    event.preventDefault();
});

document.getElementById("location-button").addEventListener("click", function(event) {
    event.preventDefault();
});

/* Use browser's geolocation to get current location
Calls getWeatherByCoordinates() to retrieve current conditions */
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByCoordinates);
    }
}

// Regex to check if ZIP code is 5 digits
const isValidZip = (zip) => {
    return /^\d{5}?$/.test(zip);
}

// Converts user input to coordinates if necessary, then calls getWeatherByCoordinates()
const parseLocation = async() => {
    // Store user's input from search bar as a variable
    let input = document.getElementById("search-bar").value;

    // Search by ZIP code if isValidZip() returns true
    if (isValidZip(input)) {
        try {
            let response = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${input}&appid=${apiKey}`);
            
            let data = await response.json();

            // Throw error if invalid ZIP entered; otherwise get lat/lon and call getWeatherByCoordinates()
            if (data.length === 0 || data.cod === '404') {
                alert("Please enter a valid input");
            } else {
                inputCoords.coords.latitude = data.lat;
                inputCoords.coords.longitude = data.lon;
            
                getWeatherByCoordinates(inputCoords);   
            } 
        } catch(err) {
            console.error(err);
        }
    // Search by coordinates
    } else if (input.includes(",")) {
        // If user input contains a comma, split input and store the values in latitude/longitude variables
        let coordsArr = input.split(",");

        let lat = parseFloat(coordsArr[0]);
        let lon = parseFloat(coordsArr[1]);

        // Check that latitude/longitude values are valid
        if ((lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180)) {
            inputCoords.coords.latitude = lat;
            inputCoords.coords.longitude = lon;

            getWeatherByCoordinates(inputCoords);
        } else {
            alert("Please enter a valid input");
        }
    // Search by city
    } else {
        try {
            let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${apiKey}`);
            
            let data = await response.json();

            // Throw error if invalid city entered; otherwise get lat/lon and call getWeatherByCoordinates()
            if (data.length === 0) {
                alert("Please enter a valid input");
            } else {
                inputCoords.coords.latitude = data[0].lat;
                inputCoords.coords.longitude = data[0].lon;
            
                getWeatherByCoordinates(inputCoords);   
            }
        } catch(err) {
            console.error(err);
        }
    }
}

// Takes a coordinates object, retrieves weather using latitude/longitude
const getWeatherByCoordinates = async(coordsObj) => {
    let lat = coordsObj.coords.latitude;
    let lon = coordsObj.coords.longitude;

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
        
        let data = await response.json();

        printCurrentConditions(data);
    } catch(err) {
        console.error(err);
    }
}

// Takes JSON containing weather data; formats and displays it to user
const printCurrentConditions = (json) => {
    // Store weather data in variables, round values where necessary
    let icon = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
    let weather = json.weather[0].description;
    let temp = Math.round(json.main.temp);
    let feelsLike = Math.round(json.main.feels_like);
    let humidity = json.main.humidity;
    let windSpeed = Math.round(json.wind.speed);
    let windDirection = Math.floor(json.wind.deg);
    let city = '';

    // If city name is null, use coordinates instead
    if (json.name === '') {
        city = `${json.coord.lat}, ${json.coord.lon}`;
    } else {
        city = json.name;
    }

    // Convert wind degrees to direction
    if (windDirection >= 349 || windDirection <= 11) { windDirection = "N"; }
    if (windDirection >= 12 && windDirection <= 33) { windDirection = "NNE"; }
    if (windDirection >= 34 && windDirection <= 56) { windDirection = "NE"; }
    if (windDirection >= 57 && windDirection <= 79) { windDirection = "ENE"; }
    if (windDirection >= 80 && windDirection <= 101) { windDirection = "E"; }
    if (windDirection >= 102 && windDirection <= 124) { windDirection = "ESE"; }
    if (windDirection >= 125 && windDirection <= 146) { windDirection = "SE"; }
    if (windDirection >= 147 && windDirection <= 169) { windDirection = "SSE"; }
    if (windDirection >= 170 && windDirection <= 191) { windDirection = "S"; }
    if (windDirection >= 192 && windDirection <= 213) { windDirection = "SSW"; }
    if (windDirection >= 214 && windDirection <= 236) { windDirection = "SW"; }
    if (windDirection >= 237 && windDirection <= 259) { windDirection = "WSW"; }
    if (windDirection >= 260 && windDirection <= 281) { windDirection = "W"; }
    if (windDirection >= 282 && windDirection <= 304) { windDirection = "WNW"; }
    if (windDirection >= 305 && windDirection <= 326) { windDirection = "NW"; }
    if (windDirection >= 327 && windDirection <= 348) { windDirection = "NNW"; }

    // Populate #results div with HTML containing current conditions
    document.getElementById("results").innerHTML = `
        <div>
            <img id="icon" src="${icon}"/>
            <p id="description">${weather}</p>
        </div>
        <div class="col" id="conditions">
            <p id="temp"><span id="currentTemp">${temp}°F</span> (feels like ${feelsLike}°F)</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${windDirection} @ ${windSpeed} mph</p>
        </div>
    `;
    
    // Update header with searched location
    document.getElementById("current-conditions").innerText = `Weather for ${city}`;
}
