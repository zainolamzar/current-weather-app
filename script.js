async function getCoordinates(city) {
    const geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=910f8c67ed6b2646ba7301010baaaa4b`;

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
    const apiKey = '910f8c67ed6b2646ba7301010baaaa4b';
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
    const weatherResult = document.getElementById('weatherResult');

    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].main;

    const resultHTML = `<p>City: ${cityName}</p>
                       <p>Temperature: ${temperature} °C</p>
                       <p>Description: ${description}</p>`;

    weatherResult.innerHTML = resultHTML;
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