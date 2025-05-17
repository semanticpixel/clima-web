define('components/weather',[
], function() {
    'use strict';

    class Weather {

        constructor(clima, weatherSource, mapSource) {
            this.clima = clima;
            this.weatherSource = weatherSource;
            this.mapSource = mapSource;

            this.loadingSecton = document.querySelector('#js-loading');
            this.currentClimaBlockSection = null;

            this.loadingElement = this.weatherSource.createLoadingElement();

            this.requestInProgress = false;
            this.latitude = null;
            this.longitude = null;

            this.city = null;
            this.temperature = null;

            this.addEventListeners();

            this.loadClima();
        }

        addEventListeners() {
            document.querySelector('#js-refresh').addEventListener('click', () => this.refreshClima());
        }

        loadClima() {

            this.requestInProgress = true;

            this.showLoading();

            this.getLocation()
                .then((position) => {
                    const crd = position.coords;

                    this.latitude = crd.latitude;
                    this.longitude = crd.longitude;

                    return this.mapSource.getCity(this.latitude, this.longitude);
                })
                .then((city) => {
                    this.city = city;
                    // return this.weatherSource.getWeather(this.latitude, this.longitude);
                    return this.weatherSource.getForecast(this.latitude, this.longitude);
                })
                .then((clima) => this.populateClima(clima));
        }

        populateClima(clima) {
            const temperature = clima.currently.temperature; // clima.main.temp for openweather API

            let climaBlockSection = this.determineClimaBlock(temperature, this.weatherSource.unitSymbol.toUpperCase());
            this.currentClimaBlockSection = this.clima.querySelector(climaBlockSection);

            const climaBlock = this.weatherSource.render({
                city: this.city,
                temp: temperature
            });
            this.currentClimaBlockSection.appendChild(climaBlock);
            this.currentClimaBlockSection.classList.add('clima__temperature--active');

            this.removeLoading();

            this.requestInProgress = false;
        }

        showLoading() {
            this.loadingSecton.appendChild(this.loadingElement);
        }

        removeLoading() {
            this.loadingSecton.removeChild(this.loadingElement);
        }

        refreshClima() {
            this.clearClima();

            this.loadClima();
        }

        clearClima() {
            this.currentClimaBlockSection.removeChild(this.currentClimaBlockSection.firstChild);
            this.currentClimaBlockSection.classList.remove('clima__temperature--active');
        }

        /**
         * Returns object containing latitude and longitude
         */
        getLocation() {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((position) => resolve(position), (error) => reject(error));
            });
        }

        locationFailure(error) {
            console.log(`ERROR(${err.code}): ${err.message}`);
            this.requestInProgress = false;
        }

        determineClimaBlock(temp, units) {
            let climaBlock = 'js-clima--normal';

            if (units === 'C') {
                temp = this.convertToFahrenheit(temp);
            }

            if (temp > 105) {
                climaBlock = 'js-clima--hot7';
            } else if (temp > 100 && temp <= 105) {
                climaBlock = 'js-clima--hot6';
            } else if (temp > 95 && temp <= 100) {
                climaBlock = 'js-clima--hot5';
            } else if (temp > 90 && temp <= 95) {
                climaBlock = 'js-clima--hot4';
            } else if (temp > 85 && temp <= 90) {
                climaBlock = 'js-clima--hot3';
            } else if (temp > 80 && temp <= 85) {
                climaBlock = 'js-clima--hot2';
            } else if (temp > 75 && temp <= 80) {
                climaBlock = 'js-clima--hot1';
            } else if (temp >= 70 && temp <= 75) {
                climaBlock = 'js-clima--normal';
            } else if (temp >= 65 && temp < 70) {
                climaBlock = 'js-clima--cold1';
            } else if (temp >= 60 && temp < 65) {
                climaBlock = 'js-clima--cold2';
            } else if (temp >= 55 && temp < 60) {
                climaBlock = 'js-clima--cold3';
            } else if (temp >= 50 && temp < 55) {
                climaBlock = 'js-clima--cold4';
            } else if (temp >= 45 && temp < 50) {
                climaBlock = 'js-clima--cold5';
            } else if (temp >= 40 && temp < 45) {
                climaBlock = 'js-clima--cold6';
            } else if (temp < 40) {
                climaBlock = 'js-clima--cold7';
            }

            return `#${climaBlock}`;
        }
        
        convertToFahrenheit(C) {
            return (9/5) * C + 32;
        }
    }

    return Weather;
});