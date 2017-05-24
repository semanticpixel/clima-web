define('datasource/map',[
    'datasource/datasource'
], function(
    Datasource
) {
    'use strict';

    const MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    const MAPS_API_KEY = 'AIzaSyCc-XkOZuw2hSehIeBhuIoUPJ5H0Jss-sE';
    
    class Map extends Datasource {
        
        constructor(options) {
            super();
        }

        getCity(lat, long) {
            let options = {
                method: 'GET',
                url: `${MAPS_URL}${lat},${long}`
            };

            return this.fetch(options).then((response) => {
                let jsonResponse = JSON.parse(response);
                console.log(jsonResponse);
                return jsonResponse.results[0].address_components[3].short_name;
            });
        }
    }

    return Map;
});