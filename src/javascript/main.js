define('main', [
    'components/weather',
    'datasource/weather',
    'datasource/map'
], function(
    Weather,
    WeatherDatasource,
    MapDatasource
) {
    'use strict';
    
    return {
        init: function() {
            console.log('Initiated Clima');
            const clima = document.querySelector('#js-clima');
            const weatherSource = new WeatherDatasource({
                units: 'f' 
            });
            const mapSource = new MapDatasource();

            if (clima) {
                this.clima = new Weather(clima, weatherSource, mapSource);
            }
        }
    };
});