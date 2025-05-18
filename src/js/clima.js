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

function updateUI(temp, location) {
  // grab template, update template with data

  // remove any previous template in the UI (maybe reuse an animate???)

  // append new template
}

async function init() {
  try {
    isLoading(true);
    const { coords, address } = await getCoords();
    const { latitude, longitude } = coords;
    const { address: { city, state } } = address;

    isLoading(false);
    updateUI();
    console.log(latitude, longitude, city, state);
  } catch (err) {
    console.log(err);
    // show error in UI
  }
}

init();