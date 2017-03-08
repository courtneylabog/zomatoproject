zomatoApp = {};

zomatoApp.inputLocationName = "";
zomatoApp.inputLatitude = "";
zomatoApp.inputLongitude = "";
zomatoApp.restaurantsNearby = [];
zomatoApp.allRestaurants = [];

//helper function that displays variables
zomatoApp.displayResults = function(a, b, c){
    $(".userInput").empty();
	$('.userInput').append(`<h3>Name:${a}</h3>`);
	$('.userInput').append(`<h3>Latitude:${b}</h3>`);
	$('.userInput').append(`<h3>Longitude:${c}</h3>`);
	console.log('display results printed');
};


zomatoApp.getUserLocation = function(){
    var input = $('#location')[0];

    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        zomatoApp.inputLocationName = place.name;
        zomatoApp.inputLatitude = place.geometry.location.lat();
        zomatoApp.inputLongitude = place.geometry.location.lng();
        
        zomatoApp.displayResults(zomatoApp.inputLocationName, zomatoApp.inputLatitude, zomatoApp.inputLongitude); // this can be removed...it was just displaying the info
        zomatoApp.getRestaurants(zomatoApp.inputLatitude, zomatoApp.inputLongitude);    
    });

    google.maps.event.addDomListener(input, 'keydown', function(e) { 
    if (e.keyCode == 13) { 
        e.preventDefault(); 
     } 
    });

    console.log('get user location printed');
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
        zomatoApp.allRestaurants.push(allRestaurantsResults);
        console.log(zomatoApp.allRestaurants);

        zomatoApp.allRestaurants[0].forEach(function(item){
            console.log(item);
        });
    });


//whatthefaaaa
        // var results = zomatoApp.allRestaurants.restaurants; 

        //     console.log(results);
        // var userChoiceRating = "3"; //needs to be changed for user input rating
        // var filteredByRating = results.forEach(function(item){
        //     var restaurantRating = item.restaurant.user_rating.aggregate_rating;
        //     var restaurantName = item.restaurant.name;
        //     if (restaurantRating >= userChoiceRating){
        //         console.log(restaurantName, restaurantRating);
        //         //storing filtered results
        //         zomatoApp.restaurantsNearby.push(item);
        //     } else {
        //         console.log("we broken");
        //     }
        // });
        // console.log(zomatoApp.inputLatitude, zomatoApp.inputLongitude);
        // console.log(zomatoApp.restaurantsNearby);

        // });
// }
    

};


zomatoApp.init = function(){
	google.maps.event.addDomListener(window, 'load', zomatoApp.getUserLocation());

};

$(function(){
  zomatoApp.init();
});

