import config from './config.js';

const apiKey = config.apiKey;

async function getCoordinates(city) {
    const geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodingApiUrl);
    const data = await response.json();

    if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const latlon = [lat, lon];

        return latlon;
    } else {
        throw new Error('Unable to get coordinates for the city');
    }
}

async function getWeather(latlon) {
    const lat = latlon[0];
    const lon = latlon[1];
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    if (data.cod === 200) {
        return data;
    } else {
        throw new Error('Unable to get weather data');
    }
}

function displayWeather(data) {
    const weatherLocation = document.getElementById('location');
    const weatherDetail = document.getElementById('detail');
    
    const city = data.name;
    const country = data.sys.country;
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;
    const temperature = Math.ceil(data.main.temp);
    const description = data.weather[0].main;
    const humidity = data.main.humidity;

    const resultLocation = `${city}, ${country}`;
    const resultLatLon = `${latitude}, ${longitude}`;

    const location = `<p id="resultLocation">${resultLocation}</p>
                    <p id="resultLatLon">${resultLatLon}</p>
                    `;
    weatherLocation.innerHTML = location;
    weatherLocation.style.display = 'block';

    const resultTemperature = `${temperature}°C`;
    const resultHumidity = `${humidity}%`;
    const resultDescription = `${description}`;

    const detail = `<p id="resultTemperature">${resultTemperature}</p>
                    <p id="resultDescription">${resultDescription}</p>
                    <p id="resultHumidity">${resultHumidity}</p>
                    `;
    weatherDetail.innerHTML = detail;
    weatherDetail.style.display = 'block';
}

async function searchWeather() {
    const city = document.getElementById('searchLocation').value;

    if (city) {
        try {
            const coordinates = await getCoordinates(city);
            const weatherData = await getWeather(coordinates);
            displayWeather(weatherData);
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching weather data. Please try again.');
        }
    } else {
        alert('Please enter a city name');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchWeather);
});