
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var Restaurants = Parse.Object.extend("Restaurants");

Parse.Cloud.define("saveRestaurants", function(request, response) {
    var query = new Parse.Query(Restaurants);
    // Add query filters to check for uniqueness
    query.equalTo("foursquareId", request.params.foursquareId);
    query.first().then(function(existingObject) {
      	if (existingObject) {
        	// Existing object, stop initial save
        	response.success("Existing object");
        	for (var key in request.params){
				existingObject.set(key, request.params[key]);
			}
			return existingObject.save();
      	} else {
        	// New object, let the save go through
        	response.success("new object!");
        	var restaurant = new Restaurants();
			for (var key in request.params){
				restaurant.set(key, request.params[key]);
			}
			return restaurant.save();
      	}	
    }, function (error) {
    	response.error("Error performing checks or saves.");
    });
});