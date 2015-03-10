
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

var Restaurants = Parse.Object.extend("Restaurants");

Parse.Cloud.beforeSave("Restaurants", function(request, response) {
    if (!request.object.get("foursquareId")) {
        response.error('Restaurant must have a foursquareId.');
    } else {
        var query = new Parse.Query(Restaurants);
        query.equalTo("foursquareId", request.object.get("foursquareId"));
        query.first({
            success: function(object) {
                if (object) {
                    response.error("A restaurant with this foursquareId already exists.");
                } else {
                    response.success();
                }
            },
            error: function(error) {
                response.error("Could not validate uniqueness for this foursquare restaurant object.");
            }
        });
    }
});