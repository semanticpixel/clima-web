define('datasource/datasource',[
], function() {
    'use strict';
    
    class Datasource {
        
        constructor(options) {}

        /**
         * Fetch items from datasource.
         */
        fetch(obj) {
            return new Promise((resolve, reject) => {

                let params = obj.params;
                if (params && typeof params === 'object') {
                    params = Object.keys(params).map((key) => {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                    }).join('&');
                }

                const url = params ? obj.url + '?' + params : obj.url;

                let xhr = new XMLHttpRequest();
                xhr.open(obj.method || 'GET', url);

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.statusText);
                    }
                };

                xhr.onerror = () => {
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
    }

    return Datasource;
});