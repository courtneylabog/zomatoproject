const zomatoApp = {};

zomatoApp.inputLocationName = "";
zomatoApp.inputLatitude = "";
zomatoApp.inputLongitude = "";
zomatoApp.allRestaurants = [];
zomatoApp.inputUserRating = 0;
zomatoApp.tenRestaurants = [];
//helper function that displays variables
zomatoApp.displayResults = function(a, b, c){
    $(".userInput").empty();
	$('.userInput').append(`<h3>Name:${a}</h3>`);
	$('.userInput').append(`<h3>Latitude:${b}</h3>`);
	$('.userInput').append(`<h3>Longitude:${c}</h3>`);
};

zomatoApp.getUserLocation = function(){
    var input = $('#location')[0];

    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        zomatoApp.inputLocationName = place.name;
        zomatoApp.inputLatitude = place.geometry.location.lat();
        zomatoApp.inputLongitude = place.geometry.location.lng();

        zomatoApp.displayResults(zomatoApp.inputLocationName, zomatoApp.inputLatitude, zomatoApp.inputLongitude);
    });
    google.maps.event.addDomListener(input, 'keydown', function(e) { 
    if (e.keyCode == 13) { 
        e.preventDefault(); 
     } 
    });
};

zomatoApp.getRestaurants = function(latitude,longitude){
    zomatoApp.ajaxRestaurantsOne = $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search",
        method: "GET",
        format: "json",
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
        format: "json",
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
        format: "json",
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
        var allRestaurantsOne = dataOne[0].restaurants;
        var allRestaurantsTwo = dataTwo[0].restaurants;
        var allRestaurantsThree = dataThree[0].restaurants;
        var allRestaurantsResults = allRestaurantsOne.concat(allRestaurantsTwo, allRestaurantsThree);
        zomatoApp.allRestaurants.push(allRestaurantsResults); //allRestaurantsResults is a global var
        
        // console.log(zomatoApp.allRestaurants);
        
        var results = allRestaurantsResults; 

        var userChoiceRating = zomatoApp.inputUserRating; 
        
        results.forEach(function(item){
            var restaurantRating = item.restaurant.user_rating.aggregate_rating;
            var restaurantName = item.restaurant.name;
            if (restaurantRating >= userChoiceRating){
                if(zomatoApp.tenRestaurants.length < 10){
                    zomatoApp.tenRestaurants.push(item);
                    console.log('this is one restaurant');
                }else{
                    console.log('error');
                }
            }
        });
    });
};

// ATTEMPTING MAPS

zomatoApp.displayMarker = function() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

    // Multiple Markers
    var markers = [
        ['London Eye, London', 51.503454,-0.119562],
        ['Palace of Westminster, London', 51.499633,-0.124755]
    ];

    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>London Eye</h3>' +
        '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Palace of Westminster</h3>' +
        '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
        '</div>']
    ];
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
    
}

zomatoApp.getUserInfo = function(){
    $('#formUserInfo').on('submit', function(e){
        e.preventDefault();
        zomatoApp.inputUserRating = $('#inputRating').val();
        zomatoApp.getRestaurants(zomatoApp.inputLatitude, zomatoApp.inputLongitude); 
    });
}


// CHANGE THIS UP ---AFTER

zomatoApp.init = function(){
    google.maps.event.addDomListener(window, 'load', zomatoApp.getUserLocation());
    zomatoApp.getUserInfo();
    google.maps.event.addDomListener(window, 'load', zomatoApp.displayMarker());
};


$(function(){
  zomatoApp.init();
});

