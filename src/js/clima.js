async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    apparentTemp: Math.round(data.current.apparent_temperature),
    weatherCode: data.current.weather_code,
    minTemp: Math.round(data.daily.temperature_2m_min[0]),
    maxTemp: Math.round(data.daily.temperature_2m_max[0]),
    daily: data.daily.time.map((dateStr, i) => ({
      date: dateStr,
      weatherCode: data.daily.weather_code[i],
      minTemp: Math.round(data.daily.temperature_2m_min[i]),
      maxTemp: Math.round(data.daily.temperature_2m_max[i]),
    })),
  };
}

function weatherCodeToIcon(code) {
  if (code === 0)                         return 'wi-day-sunny';
  if (code <= 2)                          return 'wi-day-cloudy';
  if (code === 3)                         return 'wi-cloudy';
  if (code <= 48)                         return 'wi-fog';
  if (code <= 55)                         return 'wi-sprinkle';
  if (code <= 57)                         return 'wi-rain-mix';
  if (code <= 65)                         return 'wi-rain';
  if (code <= 67)                         return 'wi-rain-mix';
  if (code <= 75)                         return 'wi-snow';
  if (code === 77)                        return 'wi-snow';
  if (code <= 82)                         return 'wi-showers';
  if (code <= 86)                         return 'wi-snow';
  if (code === 95)                        return 'wi-thunderstorm';
  return 'wi-thunderstorm';
}

function dayLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

async function coordsToCity(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&format=json&zoom=10`;
  const res = await fetch(url);
  const address = await res.json();
  // const { address: { city, state} } = await res.json();
  // console.log(address, city, state);
  return address;
}

// navigator.geolocation.getCurrentPosition(async ({coords}) => {
//   const address = await coordsToCity(coords.latitude, coords.longitude);
//   console.log(address);
// });

function getCoords() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
        const address = await coordsToCity(coords.latitude, coords.longitude);
        // console.log(address);
        resolve({ coords, address });
      },
      err => reject(err),
    );
  });
}

function isLoading(isLoading) {
  if (isLoading) {
    const element = document.createElement('div');
    element.id = 'loader';
    element.className = 'loader';
    element.innerHTML = `
      <div style="--index:0;"></div>
      <div style="--index:1;"></div>
      <div style="--index:2;"></div>
    `;
    
    document.body.appendChild(element);
  } else {
    document.querySelector('#loader').remove();
  }
}

// Temperature ranges (Fahrenheit) mapped to section IDs
// >95: hot-5, >88: hot-4, >81: hot-3, >77: hot-2, >73: hot-1
// 66-73: normal
// >59: cold-1, >52: cold-2, >45: cold-3, >38: cold-4, <=38: cold-5
function determineSectionId(temp) {
  if (temp > 95)  return 'hot-5';
  if (temp > 88)  return 'hot-4';
  if (temp > 81)  return 'hot-3';
  if (temp > 77)  return 'hot-2';
  if (temp > 73)  return 'hot-1';
  if (temp >= 66) return 'normal';
  if (temp >= 59) return 'cold-1';
  if (temp >= 52) return 'cold-2';
  if (temp >= 45) return 'cold-3';
  if (temp >= 38) return 'cold-4';
  return 'cold-5';
}

function updateUI(temp, apparentTemp, location, weatherCode, minTemp, maxTemp, daily) {
  // Remove active state and content from the previous section
  const prev = document.querySelector('.temperature.active');
  if (prev) {
    const content = prev.querySelector('.current');
    if (content) content.remove();
    prev.classList.remove('active');
  }

  // Place weather info in the correct section based on apparent (feels like) temperature
  const section = document.getElementById(determineSectionId(apparentTemp));
  section.classList.add('active');

  const current = document.createElement('div');
  current.className = 'current column';
  current.innerHTML = `
    <div class="forecast-range">
      <span class="forecast-extreme forecast-low">${minTemp}</span>
      <span class="forecast-range-separator">/</span>
      <span class="forecast-extreme forecast-high">${maxTemp}</span>
    </div>
    <div class="weather-main">
      <i class="wi ${weatherCodeToIcon(weatherCode)} weather-icon"></i>
      <div class="forecast">${temp}</div>
    </div>
    <h1 class="location">${location}</h1>
    <div class="forecast-toggle-hint">&#x25BE;</div>
    <div class="forecast-week">
      ${daily.map(day => `
        <div class="forecast-day">
          <span class="forecast-day-name">${dayLabel(day.date)}</span>
          <i class="wi ${weatherCodeToIcon(day.weatherCode)} forecast-day-icon"></i>
          <span class="forecast-day-high">${day.maxTemp}&deg;</span>
          <span class="forecast-day-low">${day.minTemp}&deg;</span>
        </div>
      `).join('')}
    </div>
  `;
  current.addEventListener('click', () => {
    current.classList.toggle('expanded');
  });
  section.appendChild(current);
}

async function init() {
  try {
    isLoading(true);
    const { coords, address } = await getCoords();
    const { latitude, longitude } = coords;
    const { address: { city, state } } = address;

    const { temp, apparentTemp, weatherCode, minTemp, maxTemp, daily } = await getWeather(latitude, longitude);

    isLoading(false);
    updateUI(temp, apparentTemp, `${city}, ${state}`, weatherCode, minTemp, maxTemp, daily);
  } catch (err) {
    console.log(err);
    // show error in UI
  }
}

init();