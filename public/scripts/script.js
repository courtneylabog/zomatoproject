"use strict";

zomatoApp = {};

zomatoApp.inputLocationName = "";
zomatoApp.inputLatitude = "";
zomatoApp.inputLongitude = "";

//helper function that displays variables
zomatoApp.displayResults = function (a, b, c) {
    $('main').append("<h3>Name:" + a + "</h3>");
    $('main').append("<h3>Latitude:" + b + "</h3>");
    $('main').append("<h3>Longitude:" + c + "</h3>");
    console.log('display results printed');
};

zomatoApp.getUserLocation = function () {
    var input = $('#location')[0];
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        zomatoApp.inputLocationName = place.name;
        zomatoApp.inputLatitude = place.geometry.location.lat();
        zomatoApp.inputLongitude = place.geometry.location.lng();

        zomatoApp.displayResults(zomatoApp.inputLocationName, zomatoApp.inputLatitude, zomatoApp.inputLongitude); // this can be removed...it was just displaying the info
    });
    console.log('get user location printed');
};

zomatoApp.init = function () {
    google.maps.event.addDomListener(window, 'load', zomatoApp.getUserLocation());
};

$(function () {
    zomatoApp.init();
});