define('datasource/weather',[
    'datasource/datasource'
], function(
    Datasource
) {
    'use strict';

    const CORS_PROXY = 'https://crossorigin.me/';
    const URL = 'http://api.openweathermap.org/data/2.5/weather';
    const API_KEY = 'f1db55c38112d4be78d14107861cb2c8';

    const FORECAST_URL = 'https://api.darksky.net/forecast';
    const FORECAST_API_KEY = 'd1d02e99b64fd7ba063978ac19af2f04';
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

        getForecast(lat, long) {
            let options = {
                method: 'GET',
                url: `${FORECAST_URL}/${FORECAST_API_KEY}/${lat},${long}`
            };

            return new Promise((resolve, reject) => {
                
                // Callback function
                window.callbackJSON = (forecast) => {
                    // delete callback from global scope
                    delete window.callbackJSON;
                    document.body.removeChild(this.dummyScript);
                    this.dummyScript = null;
                    
                    // resolve promise with forecast
                    resolve(forecast);
                };

                const callbackName = 'callbackJSON';
                this.dummyScript = document.createElement('script');
                this.dummyScript.src = `${options.url}?callback=${callbackName}`;
                
                // reject promise on error
                this.dummyScript.onerror = reject;

                // append dummy script to load JSON
                document.body.appendChild(this.dummyScript);
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