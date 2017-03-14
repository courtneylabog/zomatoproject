const zomatoApp = {};

zomatoApp.inputLocationName = "";
zomatoApp.inputLatitude = "";
zomatoApp.inputLongitude = "";
zomatoApp.allRestaurants = [];
zomatoApp.inputUserRating = 0;
zomatoApp.restoLatitude = "";
zomatoApp.restoLongitude = "";

// zomatoApp.tenRestaurants = [];
// zomatoApp.markers = [];

var inputVal = $('#inputRating');

inputVal.bind('input', function(){
    getRangeValue(inputVal);
}).bind('change', function(){
    getRangeValue(inputVal);   /* for IE */
});

function getRangeValue(e){
    var value = $(e).val()/10;
    $('#displayRatingVal').text(value);
    $('#displayRatingVal').attr('data-value', value);
    inputVal.attr('value', value);
}

//helper function that displays variables
zomatoApp.displayResults = function(a){
    $(".userInput").empty();
	$('.userInput').append(`<i class="fa fa-map-o" aria-hidden="true"></i>
<h3>Restaurants around ${a}: </h3>`);
};

zomatoApp.getUserLocation = function(){
    var input = $('#location')[0];

    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        zomatoApp.inputLocationName = place.name;
        zomatoApp.inputLatitude = place.geometry.location.lat();
        zomatoApp.inputLongitude = place.geometry.location.lng();
    });
    google.maps.event.addDomListener(input, 'keydown', function(e) { 
    if (e.keyCode == 13) { 
        e.preventDefault(); 
     } 
    });
};

zomatoApp.getRestaurants = function(latitude,longitude, usersChoice){
    zomatoApp.ajaxRestaurantsOne = $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search",
        method: "GET",
        dataType: "json",
        data: {
            lat: latitude,
            lon: longitude,
            count: 20,
            radius: "20000"
        },
        headers: {
        "user-key": "7a5271a9bcd39c98815f81510b921ec4"
        }
    });

    zomatoApp.ajaxRestaurantsTwo = $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search",
        method: "GET",
        dataType: "json",
        data: {
            start: 21,
            lat: latitude,
            lon: longitude,
            count: 20,
            radius: "20000"
        },
        headers: {
        "user-key": "7a5271a9bcd39c98815f81510b921ec4"
        }
    });
    
    zomatoApp.ajaxRestaurantsThree = $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search",
        method: "GET",
        dataType: "json",
        data: {
            start: 41,
            lat: latitude,
            lon: longitude,
            count: 20,
            radius: "20000"
        },
        headers: {
        "user-key": "7a5271a9bcd39c98815f81510b921ec4"
        }
    });

    $.when(zomatoApp.ajaxRestaurantsOne, zomatoApp.ajaxRestaurantsTwo, zomatoApp.ajaxRestaurantsThree)
    .then(function(dataOne, dataTwo, dataThree) {
        $('#loadingMap').hide();
        $('#restaurants').fadeIn();
        $('html, body').animate({
            scrollTop: $("#restaurants").offset().top
        }, 500);
        var allRestaurantsOne = dataOne[0].restaurants;
        var allRestaurantsTwo = dataTwo[0].restaurants;
        var allRestaurantsThree = dataThree[0].restaurants;
        zomatoApp.allRestaurants = allRestaurantsOne.concat(allRestaurantsTwo, allRestaurantsThree);

        zomatoApp.filteredRes = zomatoApp.allRestaurants.filter(function(item) {
            var restaurantRating = item.restaurant.user_rating.aggregate_rating;
            return restaurantRating >= usersChoice;
        });

        console.log("Filtered", zomatoApp.filteredRes)
        if(zomatoApp.filteredRes.length === 0){
            $('#infoRestaurant').empty();
            $('#infoRestaurant').append(`<p>Sorry, there are no Restaurants around!</p>`);
        } else if(zomatoApp.filteredRes.length > 0 && zomatoApp.filteredRes.length < 10){
            var firstFive = [];
            firstFive = zomatoApp.filteredRes;
        } else if(zomatoApp.filteredRes.length > 5){
            var firstFive = [];
            for(let i = 0; i < 5; i++) {
                if(firstFive.length < 5){
                    console.log(zomatoApp.filteredRes[i]);
                    firstFive.push(zomatoApp.filteredRes[i]);
                }
            }
        } else {
            console.log("ERROR: Something happenning appending firstFive");
        }

        console.log("this is the ten",firstFive);
        zomatoApp.displayMarker(firstFive);
        $('#infoRestaurant').empty();
        $('#infoRestaurant').append(`<i class="fa fa-hand-pointer-o" aria-hidden="true"></i><p>Please, click on a marker and restaurant information will appear here</p>`);
    });
};

// ATTEMPTING MAPS

zomatoApp.displayMarker = function(results) {
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap',
        zoom: 10, //Important to add ZOOMMMMM
        center: {lat: zomatoApp.inputLatitude, lng: zomatoApp.inputLongitude}
    };

    // Display a map on the page
    zomatoApp.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    // zomatoApp.map.setTilt(45);

    // Multiple Markers
    // var markers = zomatoApp.markers;

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    var infoWindowContent = [];
    //U S E R marker
    var marker = new google.maps.Marker({
        position: {
            lat: zomatoApp.inputLatitude,
            lng: zomatoApp.inputLongitude,
        },
        map: zomatoApp.map,
        icon:'/zomatosauce/images/userMarker.svg'
    });
    // Loop through our array of markers & place each one on the map  
    for(let i = 0; i < results.length; i++ ) {

        let position = new google.maps.LatLng(results[i].restaurant.location.latitude, results[i].restaurant.location.longitude);

        let infoWindowMarker = [`<div class="info_content"><h3>${results[i].restaurant.name}</h3><p>${results[i].restaurant.cuisines}</p><p>Rating: ${results[i].restaurant.user_rating.aggregate_rating}</p></div>`];

        infoWindowContent.push(infoWindowMarker);
        let marker = new google.maps.Marker({
            position: {
                lat: parseFloat(results[i].restaurant.location.latitude),
                lng: parseFloat(results[i].restaurant.location.longitude),
            },
            map: zomatoApp.map,
            title: results[i].restaurant.name,
            icon:'/zomatosauce/images/mapMarkerIcon.svg',
            price:  results[i].restaurant.price_range,
            address: results[i].restaurant.location.address+" "+ results[i].restaurant.location.city,
            cuisine: results[i].restaurant.cuisines,
            latitude: results[i].restaurant.location.latitude,
            longitude: results[i].restaurant.location.longitude,
            picture: results[i].restaurant.featured_image,
        });

        bounds.extend(marker.position);
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

              if(marker.price === 1){
                  var priceDollar = '$'
              } else if (marker.price === 2){
                  var priceDollar = '$$'
              } else if(marker.price === 3){
                  var priceDollar =  '$$$'
              } else if (marker.price === 4){
                  var pricedollar =  '$$$$'
              }else if (marker.price === 5){
                  var priceDollar =  '$$$$$'
              }else {
                  var priceDollar = "No price information available for this restaurant"
              }

                $('html, body').animate({
                scrollTop: $("#infoRestaurant").offset().top
                }, 500);
                // infoWindow.setContent(`<h3>${marker.title}</h3>`);
                infoWindow.setContent(infoWindowContent[i][0]);
                zomatoApp.restoLatitude = marker.latitude;
                zomatoApp.restoLongitude = marker.longitude;
                $('#infoRestaurant').empty();
                $('#infoRestaurant').append(`<h2>${marker.title}</h2>`);
                $('#infoRestaurant').append(`<div class="restaurantImg"><img src="${marker.picture}" alt="${marker.title}"></div>`);
                $('#infoRestaurant').append(`<p><i class="fa fa-cutlery" aria-hidden="true"></i>
                     Cuisine: ${marker.cuisine}</p>`);
                $('#infoRestaurant').append(`<p><i class="fa fa-money" aria-hidden="true"></i> 
                    Price: ${priceDollar}</p>`);
                $('#infoRestaurant').append(`<p><i class="fa fa-location-arrow" aria-hidden="true"></i> 
                    Address: ${marker.address}</p>`);
                $('#infoRestaurant').append(`<button id="takeMe" class="button button__next">GET DIRECTIONS</button>`);
                zomatoApp.getDirections();
                infoWindow.open(zomatoApp.map, marker);

            }

        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        zomatoApp.map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((zomatoApp.map), 'bounds_changed', function(event) {
        this.setZoom(18);
        google.maps.event.removeListener(boundsListener);
    });   
}

zomatoApp.addMarkers = function(filteredTen){
    console.log("filtered ten", filteredTen)
    filteredTen.forEach(function(place){
        var oneMarker = [];
        oneMarker.push(place.name);
        oneMarker.push(place.location.latitude);
        oneMarker.push(place.location.longitude);
        zomatoApp.markers.push(oneMarker);
    });
}

zomatoApp.getRatingInput = function(number){
    var inputRatingVal = number/10; 
    var inputRatingFloor = Math.floor(inputRatingVal);
    if(inputRatingVal - inputRatingFloor > 0.5){
        var finalRatingResultCeiling = Math.ceil(inputRatingVal);
        return finalRatingResultCeiling;
    } else {
        var finalRatingResultFloor = Math.floor(inputRatingVal);
        return finalRatingResultFloor;
    }
}

zomatoApp.getUserInfo = function(){
    $('#formUserInfo').on('submit', function(e){
        e.preventDefault();
        $("#loadingMap").fadeIn();   
        $('html, body').animate({
            scrollTop: $("#loadingMap").offset().top
        }, 500);
        zomatoApp.inputUserRating = zomatoApp.getRatingInput($('#inputRating').val());
        zomatoApp.getRestaurants(zomatoApp.inputLatitude, zomatoApp.inputLongitude, zomatoApp.inputUserRating);
        zomatoApp.displayResults(zomatoApp.inputLocationName);
    });
}

zomatoApp.getDirections = function(userlat, userlong, restolat, restolong){
    $('#takeMe').on("click", function(){
        $("#renderedDirections").empty()
        $("#loadingDirections").fadeIn();        
        $('html, body').animate({
            scrollTop: $("#loadingDirections").offset().top
        }, 500);

        var googleKey = ' AIzaSyBCqhZj9r_-ng3j6qpWgoV9BisiNw7FDoM';
        var directionsUrl ='https://maps.googleapis.com/maps/api/directions/json?';
        var originUser = `${zomatoApp.inputLatitude}, ${zomatoApp.inputLongitude}`;
        var destinationResto = `${zomatoApp.restoLatitude}, ${zomatoApp.restoLongitude}`;

        $.ajax({
            url: 'http://proxy.hackeryou.com',
            dataType: 'json',
            method:'GET',
            data:{
                reqUrl: directionsUrl,
                params: {    
                key: googleKey,
                origin: originUser,
                destination: destinationResto,
                mode:'walking'
                },
                xmlToJSON:false
            }
        }).then(function(data){
            $("#loadingDirections").hide();
            $("#directions").fadeIn();   
            $('html, body').animate({
                scrollTop: $("#directions").offset().top
            }, 500);
            var directionResult = data.routes[0].legs[0].steps;
            console.log(directionResult);
            let distanceResult = data.routes[0].legs[0].distance.text;
            let durationResult = data.routes[0].legs[0].duration.text;
            console.log(directionResult, durationResult);
            $('#renderedDirections').append(`<i class="fa fa-street-view" aria-hidden="true"></i><h2>You are ${durationResult} (${distanceResult}) away from your pick!</h2>`);
            $('#renderedDirections').append(`<h3>Follow these directions:</h3>`);
            directionResult.forEach(function(step){
                $('#renderedDirections').append(`
                <p><i class="fa fa-circle" aria-hidden="true"></i></i> ${step.html_instructions}</p>`);
            });
        });
    });
}

zomatoApp.init = function(){
    zomatoApp.getUserLocation();
    zomatoApp.getUserInfo();
};

$(function(){
  zomatoApp.init();
});

