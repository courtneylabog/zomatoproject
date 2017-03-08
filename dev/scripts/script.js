zomatoApp = {};

zomatoApp.inputLocationName = "";
zomatoApp.inputLatitude = "";
zomatoApp.inputLongitude = "";
zomatoApp.restaurantsNearby = [];

//helper function that displays variables
zomatoApp.displayResults = function(a, b, c){
	$('main').append(`<h3>Name:${a}</h3>`);
	$('main').append(`<h3>Latitude:${b}</h3>`);
	$('main').append(`<h3>Longitude:${c}</h3>`);
	// console.log('display results printed');
};

zomatoApp.getUserLocation = function(){
    var input = $('#location')[0];
    // google.maps.event.addDomListener(input, 'keydown', function(e) { 
    // if (e.keyCode == 13) { 
    //     e.preventDefault(); 
    // } 
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        zomatoApp.inputLocationName = place.name;
        zomatoApp.inputLatitude = place.geometry.location.lat();
        zomatoApp.inputLongitude = place.geometry.location.lng();
        
        zomatoApp.displayResults(zomatoApp.inputLocationName, zomatoApp.inputLatitude, zomatoApp.inputLongitude); // this can be removed...it was just displaying the info
        zomatoApp.getRestaurants(zomatoApp.inputLatitude, zomatoApp.inputLongitude);    
    });
    var a = $('#location').val();
    console.log(a);
};

//on submit, grab input value of #location
//pass value into geolocation api
//store lat and lon variables 


zomatoApp.getRestaurants = function(latitude,longitude){
     $.ajax({
        async: true,
        crossDomain: true,
        url: "https://developers.zomato.com/api/v2.1/search",
        method: "GET",
        format: "json",
        data: {
            lat: latitude,
            lon: longitude,
            count: 30,
            sort: "real_distance"
        },
        headers: {
        "user-key": "7a5271a9bcd39c98815f81510b921ec4"
        }
            }).then(function(data) {
                console.log(data);
            var results = data.restaurants;
                console.log(results);
            var userChoiceRating = "3";
            var filteredByRating = results.forEach(function(item){
                var restaurantRating = item.restaurant.user_rating.aggregate_rating;
                var restaurantName = item.restaurant.name;
                if (restaurantRating >= userChoiceRating){
                    console.log(restaurantName, restaurantRating);
                    //storing filtered results
                    zomatoApp.restaurantsNearby.push(item);
                } else {
                    console.log("we broken");
                }
            });
            console.log(zomatoApp.inputLatitude, zomatoApp.inputLongitude);
            console.log(zomatoApp.restaurantsNearby);


// function that returns an ajax call that accepts a paramater
// put that into $when 4 times

        });
}


zomatoApp.init = function(){
	google.maps.event.addDomListener(window, 'load', zomatoApp.getUserLocation());

};

$(function(){
  zomatoApp.init();
});

