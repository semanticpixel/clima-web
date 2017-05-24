define('datasource/weather',[
    'datasource/datasource'
], function(
    Datasource
) {
    'use strict';

    const CORS_PROXY = 'https://crossorigin.me/';
    const URL = 'http://api.openweathermap.org/data/2.5/weather';
    const API_KEY = 'f1db55c38112d4be78d14107861cb2c8';
    const FAHRENHEIT = 'F';
    
    class Weather extends Datasource {

        constructor(options) {
            super();
            this.templates = document.querySelector('#js-templates');
            this.temperatureTemplate = this.templates.querySelector('#js-templates .clima__item');
            this.loadingTemplate = this.templates.querySelector('#js-templates .loading__container');
            
            this.templates.removeChild(this.loadingTemplate);
            
            this.unitSymbol = options.units || 'F';
            this.units = this.unitSymbol.toUpperCase() === FAHRENHEIT ? 'imperial' : 'metric';
        }

        getWeather(lat, long) {
            let options = {
                method: 'GET',
                url: `${CORS_PROXY}${URL}?lat=${lat}&lon=${long}&units=${this.units}&APPID=${API_KEY}`
            };

            return this.fetch(options).then((response) => {
                let jsonResponse = JSON.parse(response);

                return jsonResponse;
            });
        }

        /**
         * Create a loading element, all loading elements are identical
         */
        createLoadingElement() {
            return this.loadingTemplate.cloneNode(true);
        }

        /**
         * Render an item, reusing the provided div if provided
         */
        render(item, div) {
            div = div || this.temperatureTemplate.cloneNode(true);

            div.querySelector('.clima__city').textContent = item.city;
            div.querySelector('.clima__forecast').textContent = `${Math.round(item.temp)}`;

            return div;
        }
    }

    return Weather;
});