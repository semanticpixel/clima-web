'use strict';

// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'src/javascript',
    paths: {
        app: '../dist'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['main'], function (main) {
    main.init();
});
'use strict';

define('main', ['components/weather', 'datasource/weather', 'datasource/map'], function (Weather, WeatherDatasource, MapDatasource) {
    'use strict';

    return {
        init: function init() {
            console.log('Initiated Clima');
            var clima = document.querySelector('#js-clima');
            var weatherSource = new WeatherDatasource({
                units: 'f'
            });
            var mapSource = new MapDatasource();

            if (clima) {
                this.clima = new Weather(clima, weatherSource, mapSource);
            }
        }
    };
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('components/weather', [], function () {
    'use strict';

    var Weather = function () {
        function Weather(clima, weatherSource, mapSource) {
            _classCallCheck(this, Weather);

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

        _createClass(Weather, [{
            key: 'addEventListeners',
            value: function addEventListeners() {
                var _this = this;

                document.querySelector('#js-refresh').addEventListener('click', function () {
                    return _this.refreshClima();
                });
            }
        }, {
            key: 'loadClima',
            value: function loadClima() {
                var _this2 = this;

                this.requestInProgress = true;

                this.showLoading();

                this.getLocation().then(function (position) {
                    var crd = position.coords;

                    _this2.latitude = crd.latitude;
                    _this2.longitude = crd.longitude;

                    return _this2.mapSource.getCity(_this2.latitude, _this2.longitude);
                }).then(function (city) {
                    _this2.city = city;
                    return _this2.weatherSource.getWeather(_this2.latitude, _this2.longitude);
                }).then(function (clima) {
                    return _this2.populateClima(clima);
                });
            }
        }, {
            key: 'populateClima',
            value: function populateClima(clima) {
                var climaBlockSection = this.determineClimaBlock(clima.main.temp, this.weatherSource.unitSymbol.toUpperCase());
                this.currentClimaBlockSection = this.clima.querySelector(climaBlockSection);

                var climaBlock = this.weatherSource.render({
                    city: this.city,
                    temp: clima.main.temp
                });
                this.currentClimaBlockSection.appendChild(climaBlock);
                this.currentClimaBlockSection.classList.add('clima__temperature--active');

                this.removeLoading();

                this.requestInProgress = false;
            }
        }, {
            key: 'showLoading',
            value: function showLoading() {
                this.loadingSecton.appendChild(this.loadingElement);
            }
        }, {
            key: 'removeLoading',
            value: function removeLoading() {
                this.loadingSecton.removeChild(this.loadingElement);
            }
        }, {
            key: 'refreshClima',
            value: function refreshClima() {
                this.clearClima();

                this.loadClima();
            }
        }, {
            key: 'clearClima',
            value: function clearClima() {
                this.currentClimaBlockSection.removeChild(this.currentClimaBlockSection.firstChild);
                this.currentClimaBlockSection.classList.remove('clima__temperature--active');
            }

            /**
             * Returns object containing latitude and longitude
             */

        }, {
            key: 'getLocation',
            value: function getLocation() {
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        return resolve(position);
                    }, function (error) {
                        return reject(error);
                    });
                });
            }
        }, {
            key: 'locationFailure',
            value: function locationFailure(error) {
                console.log('ERROR(' + err.code + '): ' + err.message);
                this.requestInProgress = false;
            }
        }, {
            key: 'determineClimaBlock',
            value: function determineClimaBlock(temp, units) {
                var climaBlock = 'js-clima--normal';

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

                return '#' + climaBlock;
            }
        }, {
            key: 'convertToFahrenheit',
            value: function convertToFahrenheit(C) {
                return 9 / 5 * C + 32;
            }
        }]);

        return Weather;
    }();

    return Weather;
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('datasource/datasource', [], function () {
    'use strict';

    var Datasource = function () {
        function Datasource(options) {
            _classCallCheck(this, Datasource);
        }

        /**
         * Fetch items from datasource.
         */


        _createClass(Datasource, [{
            key: 'fetch',
            value: function fetch(obj) {
                return new Promise(function (resolve, reject) {

                    var params = obj.params;
                    if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
                        params = Object.keys(params).map(function (key) {
                            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                        }).join('&');
                    }

                    var url = params ? obj.url + '?' + params : obj.url;

                    var xhr = new XMLHttpRequest();
                    xhr.open(obj.method || 'GET', url);

                    xhr.onload = function () {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(xhr.statusText);
                        }
                    };

                    xhr.onerror = function () {
                        reject(xhr.statusText);
                    };

                    // let params = obj.params;
                    // if (params && typeof params === 'object') {
                    //     params = Object.keys(params).map((key) => {
                    //         return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                    //     }).join('&');
                    // }
                    xhr.send();
                });
            }
        }]);

        return Datasource;
    }();

    return Datasource;
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define('datasource/map', ['datasource/datasource'], function (Datasource) {
    'use strict';

    var MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    var MAPS_API_KEY = 'AIzaSyCc-XkOZuw2hSehIeBhuIoUPJ5H0Jss-sE';

    var Map = function (_Datasource) {
        _inherits(Map, _Datasource);

        function Map(options) {
            _classCallCheck(this, Map);

            return _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this));
        }

        _createClass(Map, [{
            key: 'getCity',
            value: function getCity(lat, long) {
                var options = {
                    method: 'GET',
                    url: '' + MAPS_URL + lat + ',' + long
                };

                return this.fetch(options).then(function (response) {
                    var jsonResponse = JSON.parse(response);
                    console.log(jsonResponse);
                    return jsonResponse.results[0].address_components[3].short_name;
                });
            }
        }]);

        return Map;
    }(Datasource);

    return Map;
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define('datasource/weather', ['datasource/datasource'], function (Datasource) {
    'use strict';

    var CORS_PROXY = 'https://crossorigin.me/';
    var URL = 'http://api.openweathermap.org/data/2.5/weather';
    var API_KEY = 'f1db55c38112d4be78d14107861cb2c8';
    var FAHRENHEIT = 'F';

    var Weather = function (_Datasource) {
        _inherits(Weather, _Datasource);

        function Weather(options) {
            _classCallCheck(this, Weather);

            var _this = _possibleConstructorReturn(this, (Weather.__proto__ || Object.getPrototypeOf(Weather)).call(this));

            _this.templates = document.querySelector('#js-templates');
            _this.temperatureTemplate = _this.templates.querySelector('#js-templates .clima__item');
            _this.loadingTemplate = _this.templates.querySelector('#js-templates .loading__container');

            _this.templates.removeChild(_this.loadingTemplate);

            _this.unitSymbol = options.units || 'F';
            _this.units = _this.unitSymbol.toUpperCase() === FAHRENHEIT ? 'imperial' : 'metric';
            return _this;
        }

        _createClass(Weather, [{
            key: 'getWeather',
            value: function getWeather(lat, long) {
                var options = {
                    method: 'GET',
                    url: '' + CORS_PROXY + URL + '?lat=' + lat + '&lon=' + long + '&units=' + this.units + '&APPID=' + API_KEY
                };

                return this.fetch(options).then(function (response) {
                    var jsonResponse = JSON.parse(response);

                    return jsonResponse;
                });
            }

            /**
             * Create a loading element, all loading elements are identical
             */

        }, {
            key: 'createLoadingElement',
            value: function createLoadingElement() {
                return this.loadingTemplate.cloneNode(true);
            }

            /**
             * Render an item, reusing the provided div if provided
             */

        }, {
            key: 'render',
            value: function render(item, div) {
                div = div || this.temperatureTemplate.cloneNode(true);

                div.querySelector('.clima__city').textContent = item.city;
                div.querySelector('.clima__forecast').textContent = '' + Math.round(item.temp);

                return div;
            }
        }]);

        return Weather;
    }(Datasource);

    return Weather;
});