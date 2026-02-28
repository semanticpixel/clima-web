async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    apparentTemp: Math.round(data.current.apparent_temperature),
    weatherCode: data.current.weather_code,
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
// >105: hot-7, 100-105: hot-6, 95-100: hot-5, 90-95: hot-4
// 85-90: hot-3, 80-85: hot-2, 75-80: hot-1
// 70-75: normal
// 65-70: cold-1, 60-65: cold-2, 55-60: cold-3, 50-55: cold-4
// 45-50: cold-5, 40-45: cold-6, <40: cold-7
function determineSectionId(temp) {
  if (temp > 105) return 'hot-7';
  if (temp > 100) return 'hot-6';
  if (temp > 95)  return 'hot-5';
  if (temp > 90)  return 'hot-4';
  if (temp > 85)  return 'hot-3';
  if (temp > 80)  return 'hot-2';
  if (temp > 75)  return 'hot-1';
  if (temp >= 70) return 'normal';
  if (temp >= 65) return 'cold-1';
  if (temp >= 60) return 'cold-2';
  if (temp >= 55) return 'cold-3';
  if (temp >= 50) return 'cold-4';
  if (temp >= 45) return 'cold-5';
  if (temp >= 40) return 'cold-6';
  return 'cold-7';
}

function updateUI(temp, apparentTemp, location, weatherCode) {
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
    <div class="weather-main">
      <i class="wi ${weatherCodeToIcon(weatherCode)} weather-icon"></i>
      <div class="forecast">${temp}</div>
    </div>
    <h1 class="location">${location}</h1>
  `;
  section.appendChild(current);
}

async function init() {
  try {
    isLoading(true);
    const { coords, address } = await getCoords();
    const { latitude, longitude } = coords;
    const { address: { city, state } } = address;

    const { temp, apparentTemp, weatherCode } = await getWeather(latitude, longitude);

    isLoading(false);
    updateUI(temp, apparentTemp, `${city}, ${state}`, weatherCode);
  } catch (err) {
    console.log(err);
    // show error in UI
  }
}

init();