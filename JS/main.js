"use strict";

    // MapBox API
    mapboxgl.accessToken = mapKey;
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 10,
        center: [-98.4916, 29.4252]
    });

    // the geocode method from mapbox-geocoder-utils.js
    geocode("600 Navarro St #350, San Antonio, TX 78205", mapKey).then(function (result) {
        console.log(result);
        map.setCenter(result);
        map.setZoom(10);
    });

    //Add the control to the map.
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );

    // Converts Coordinates Into Physical Address
    function onDragEnd() {
        const lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
        getWeather(lngLat.lat, lngLat.lng);
        let coords = {
            lng: lngLat.lng,
            lat: lngLat.lat
        };
        reverseGeocode(coords, mapKey).then(function (results){
           let markerLocale = '';
           markerLocale += '<h5>' + 'Address: ' + results + '</h5>';
           $('#broadcast-location').html(markerLocale)
        });
    }

    //--variable referencing empty container in HTML doc--//
    let cardContainer = $('#card-container')

    let lat = 29.4252;
    let long = -98.4916;

    //Creates Location Marker
    let marker = new mapboxgl.Marker({
        color: "blue", draggable: true
    })
        .setLngLat([long, lat])
        .addTo(map);
    marker.on('dragend', onDragEnd);
    function getWeather(lat,long){
        $.get("https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ long +"&appid=" + OPEN_WEATHER_APPID + "&units=imperial").done(function(data) {
            let reports = data.list;
            let html = '';

            marker.setLngLat([long, lat]);

            for(let i = 0; i < reports.length; i += 8) {
                // should get 5 objects back
                console.log(reports[i]);

                //--variables storing data from object properties--//
                let cardHead = reports[i].dt_txt.split(' ');
                let highTemp = reports[i].main.temp_max;
                let lowTemp = reports[i].main.temp_min;
                let iconCode = reports[i].weather[0].icon;
                let weatherDescription = reports[i].weather[0].description;
                let humid = reports[i].main.humidity;
                let wind = reports[i].wind.speed;
                let pressure = reports[i].main.pressure;

                //--building the forecast cards via "for" loop--//
                html +=
                    '<div class="card text-center" style="width: 18rem;">' +
                    '<div class="card-header">' + cardHead[0] + '</div>' +
                    '<ul class="list-group list-group-flush">' +
                    '<li class="list-group-item"><span>' + highTemp + '*F / ' + lowTemp + '*F</span><br><img src="https://openweathermap.org/img/w/' + iconCode + '.png" alt="Weather Icon"></li>'+
                    '<li class="list-group-item"><span>Description: ' + weatherDescription + '</span><br><span>Humidity: ' + humid + '%</span></li>'+
                    '<li class="list-group-item">Wind Speed: ' + wind + 'mph</li>'+
                    '<li class="list-group-item">Pressure: ' + pressure + 'psi</li>'+
                    '</ul>'+
                    '</div>'
            }
            //pushing forecast cards into empty div
            cardContainer.html(html);
        });
    }
    getWeather(lat,long);
    $('#broadcast-location').html('600 Navarro St #350, San Antonio, TX 78205').css('font-weight', 'bold');