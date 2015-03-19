angular.module('starter.controllers', [])

    .controller('NavCtrl', function($scope, $rootScope, $state, $ionicViewService) {
        // Nav back history fix
        $scope.goBack = function() {
            var stateId = $rootScope.$viewHistory.currentView.stateId;
            console.log($rootScope.$viewHistory.currentView); 
            // Go back to home if on login or register view
            if ((stateId == "tab.login") || (stateId == "tab.register")) {
                $state.go('tab.home', {});
            }
            // If view is in card list then remove history and set back to dash view
            if (stateId == "tab.list" || stateId == "tab.profile" || stateId == "tab.favourites") { 
                // assign it as the current view (as far as history is concerned)
                $ionicViewService.setNavViews("008"); 
                $state.go('tab.dash', {});
            }
            // If view is in map, go back to details
            if (stateId == "tab.map") {
                $state.go('tab.details', {});
            }
            // If view is in any of the tabbed pages, set back to card list
            if ((stateId == "tab.details") || (stateId == "tab.instagram") || (stateId == "tab.twitter")) {
                if ($rootScope.lastViewHistory == "tab.favourites") {
                    $state.go('tab.favourites', {});
                } else {
                    $state.go('tab.list', {});
                }
            }
        };
    })

    .controller('HomeCtrl', function($scope, $rootScope, $state) {
        $scope.goToLoginView = function() {
            $state.go('tab.login', {});
        };

        $scope.goToRegisterView = function() {
            $state.go('tab.register', {});
        };
    })

    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, $localstorage, $cordovaFacebook, Alerts) {
        $scope.loginObj = {};
        $scope.standardLogin = function() {
            Parse.User.logIn($scope.loginObj.username, $scope.loginObj.password, {
                success: function(user) {
                    // Save to cache after successful login.
                    var profileInfo = {    
                        username: user.attributes.username,
                        firstname: user.attributes.firstname,
                        lastname: user.attributes.lastname,
                        email: user.attributes.email
                    };
                    $localstorage.setObject('profileInfo', profileInfo);
                    $state.go('tab.dash', {});
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                    console.log("error");
                    var message = 'Incorrect username and password combination';
                    Alerts.error(message);
                }
            }); 
        };

        // FB Login/Register
        $scope.facebookLogin = function() {
            console.log('Login');
            if (!window.cordova) {
                var appId = 1594340540779035;
                facebookConnectPlugin.browserInit(appId);
            }

            $cordovaFacebook.login(["public_profile", "email", "user_friends"])
            .then(function(response) {
                console.log(response);
                if (!response.authResponse){
                    console.log("Cannot find the authResponse");
                    return;
                }
                var expDate = new Date(
                    new Date().getTime() + response.authResponse.expiresIn * 1000
                ).toISOString();

                var authData = {
                    id: String(response.authResponse.userID),
                    access_token: response.authResponse.accessToken,
                    expiration_date: expDate
                }

                return Parse.FacebookUtils.logIn(authData, {
                    success: function(userObject) {
                        if (!userObject.existed()) {
                            $cordovaFacebook.api("/me", ["public_profile"])
                            .then(function(response) {
                                userObject.set('firstname', response.first_name);
                                userObject.set('lastname', response.last_name);
                                userObject.set('email', response.email);
                                userObject.save();
                            }, function(error) {
                                console.log(error);
                            });
                            var profilePicParams = {
                                "type": "square",
                                "height": "300",
                                "width": "300"
                            }
                            $cordovaFacebook.api("/me/picture", profilePicParams)
                            .then(function(response) {
                                userObject.set('fbPicture', response.data.url);
                                userObject.save();
                            }, function(error) {
                                console.log(error);
                            });

                            $state.go('tab.dash', {});
                            console.log("User signed up through Facebook!");
                        } else {
                            $state.go('tab.dash', {});
                            console.log("User logged in through Facebook!");
                        }

                        setTimeout( function() { 
                            console.log(userObject.attributes); 
                            // Save to cache after successful login.
                            var profileInfo = {   
                                email: userObject.attributes.email, 
                                fbPicture: userObject.attributes.fbPicture,
                                firstname: userObject.attributes.firstname,
                                lastname: userObject.attributes.lastname,
                                username: userObject.attributes.username 
                            };
                            $localstorage.setObject('profileInfo', profileInfo);
                        }, 2000);
                    },
                    error: function(userObject, error) {
                        console.log("User cancelled the Facebook login or did not fully authorize.");
                    }
                });
            }, function (error) {
                // error
                console.log(error);
            });
        };
    })

    .controller('RegisterCtrl', function($scope, $rootScope, $state, $http, $localstorage, $cordovaFacebook, Alerts) {
        $scope.registerObj = {};
        $scope.standardRegister = function() {
            // Register user 
            var user = new Parse.User();
            user.set("username", $scope.registerObj.username);
            user.set("firstname", $scope.registerObj.firstname);
            user.set("lastname", $scope.registerObj.lastname);
            user.set("password", $scope.registerObj.password);
            user.set("email", $scope.registerObj.email); 
            user.signUp(null, {
                success: function(user) {
                    // Hooray! Let them use the app now.
                    console.log(user);
                    $state.go('tab.intro', {});
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    var message = "Error: " + error.code + " " + error.message;
                    Alerts.error(message);
                }
            });
        };

        $scope.facebookRegister = function() {
            console.log('Facebook Register');
            if (!window.cordova) {
                var appId = 1594340540779035;
                facebookConnectPlugin.browserInit(appId);
            }

            $cordovaFacebook.login(["public_profile", "email", "user_friends"])
            .then(function(response) {
                console.log(response);
                if (!response.authResponse){
                    console.log("Cannot find the authResponse");
                    return;
                }
                var expDate = new Date(
                    new Date().getTime() + response.authResponse.expiresIn * 1000
                ).toISOString();

                var authData = {
                    id: String(response.authResponse.userID),
                    access_token: response.authResponse.accessToken,
                    expiration_date: expDate
                }

                return Parse.FacebookUtils.logIn(authData, {
                    success: function(userObject) {
                        if (!userObject.existed()) {
                            $cordovaFacebook.api("/me", ["public_profile"])
                            .then(function(response) {
                                userObject.set('firstname', response.first_name);
                                userObject.set('lastname', response.last_name);
                                userObject.set('email', response.email);
                                userObject.save();
                            }, function(error) {
                                console.log(error);
                            });
                            var profilePicParams = {
                                "type": "square",
                                "height": "300",
                                "width": "300"
                            }
                            $cordovaFacebook.api("/me/picture", profilePicParams)
                            .then(function(response) {
                                userObject.set('fbPicture', response.data.url);
                                userObject.save();
                            }, function(error) {
                                console.log(error);
                            });

                            $state.go('tab.intro', {});
                            console.log("User signed up through Facebook!");
                        } else {
                            $state.go('tab.intro', {});
                            console.log("User logged in through Facebook!");
                        }

                        setTimeout( function() { 
                            console.log(userObject.attributes); 
                            // Save to cache after successful login.
                            var profileInfo = {   
                                email: userObject.attributes.email, 
                                fbPicture: userObject.attributes.fbPicture,
                                firstname: userObject.attributes.firstname,
                                lastname: userObject.attributes.lastname,
                                username: userObject.attributes.username 
                            };
                            $localstorage.setObject('profileInfo', profileInfo);
                        }, 2000);
                    },
                    error: function(userObject, error) {
                        console.log("User cancelled the Facebook login or did not fully authorize.");
                    }
                });
            }, function (error) {
                // error
                console.log(error);
            });
        };
    })

    .controller('IntroCtrl', function($scope, $state) {
        // Called to navigate to the main app
        $scope.goToDashView = function() {
            $state.go('tab.dash', {});
        };
        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    })

    .controller('ProfileCtrl', function($scope, $rootScope, $state, $http, $ionicLoading, $ionicViewService, $ionicPopup, $localstorage, Loading, Alerts, Favourites, Foursquare, Twitter) {
        // Save profile stateId history
        $rootScope.lastViewHistory = $rootScope.$viewHistory.currentView.stateId;
        console.log($rootScope.lastViewHistory);

        // TODO: Right now using a hybrid of REST and JS SDK, 
        //       change just to JS SDK
        var currentUser = Parse.User.current();
        $rootScope.getFavouritesList = { 
            $relatedTo: {
                object: {
                    __type: "Pointer",
                    className: "_User",
                    objectId: currentUser.id
                },
                key: "favourites"
            }
        }
        $scope.favourites = function() { 
            Favourites.getAll($rootScope.getFavouritesList).success(function(data) {
                $rootScope.favouritePlaces = data['results'];
                $state.go('tab.favourites', {}); 
            }).error(function() {
                var message = 'Could not retrieve favourite list';
                Alerts.error(message);
            });
        };
        $scope.goToFavourite = function(restaurantId) {
            Loading.show('Getting Restaurant Details');
            $rootScope.searchCriteria['id'] = restaurantId;
            var favouriteId = {
                id: $rootScope.searchCriteria['id']
            };
            // TODO: Rewrite using JS promise functions
            Foursquare.details(favouriteId).success(function(data){
                $ionicLoading.hide();
                $rootScope.business = data.response.venue;
                console.log($rootScope.business);

                // All Photos
                Foursquare.photos(favouriteId).success(function(data){
                    $rootScope.photos = data;
                    console.log($rootScope.photos);
                }).error(function(data){
                    console.log("there is an error");
                });

                $state.go('tab.details', {});
            }).error(function(data){
                $ionicLoading.hide();
                var message = 'Could not retrieve restaurant details';
                Alerts.error(message);
            });
        };
        $scope.profile = function() { 
            // Retrieve from cache
            $rootScope.profileInfo = $localstorage.getObject('profileInfo');
            console.log('From cache: ' + $rootScope.profileInfo);
            $state.go('tab.profile', {});
        };
        $scope.logout = function() {
            $ionicPopup.show({
                template: 'Are you sure you want to logout?',
                title: 'Logout',
                scope: $scope,
                buttons: [
                  {
                    text: 'Cancel',
                    type: 'button-default'
                  },
                  {
                    text: 'Submit',
                    type: 'button-assertive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        Parse.User.logOut();
                        $localstorage.removeObject('profileInfo');
                        var currentUser = Parse.User.current();  // this will now be null
                        console.log(currentUser);
                        $state.go('tab.home', {});
                    }
                  },
                ]
            }); 
        };
    })

    .controller('DashCtrl', function($scope, $window, $http, $rootScope, $state, $ionicPopup, Alerts, $ionicPlatform, $ionicLoading, Loading, TDCardDelegate, Favourites, Foursquare, $cordovaGeolocation) {
        // List of demand headings
        $rootScope.demandTitles = [
            "Go To",
            "Indulge At",
            "Try",
            "You're Going To",
            "Stomach Is Calling",
            "It's Time 2 Go To"
        ];
        // Randomize the list of demands
        $rootScope.ranDemandTitle = function() {
            // Choose Random Demand Title
            $scope.randomNum = Math.floor((Math.random() * $rootScope.demandTitles.length));
            $rootScope.demandTitle = $rootScope.demandTitles[$scope.randomNum];
        };

        $scope.distanceList = {
            min:'0',
            max:'15',
            value:'0.5'
        }

        $scope.priceList = [
            { text: "$", value: "1" },
            { text: "$$", value: "2" },
            { text: "$$$", value: "3" },
            { text: "$$$$", value: "4" }
        ];

        // Default values
        $scope.data = {};
        $scope.data.distance = '500';

        $scope.updateDistance = function(item) {
            // $window.localStorage.setItem( 'distance', item.value );
            console.log(item);
            $rootScope.searchCriteria['distance'] = item * 1000;
            console.log( 'Distance: ' + $rootScope.searchCriteria['distance'] );
        };

        $scope.updatePrice = function(item) {
            // $window.localStorage.setItem( 'price', item.value );
            console.log(item.value);
            $rootScope.searchCriteria['price'] = item.value;
            console.log( 'Price: ' + $rootScope.searchCriteria['price'] );
        };

        $scope.selectCuisinesPopup = function() {
            $scope.cuisineId = {
                type: ''
            };
            // Select cuisine popup
            $ionicPopup.show({
                templateUrl: 'templates/popup-cuisines.html',
                title: 'Select Cuisines',
                scope: $scope,
                buttons: [
                  {
                    text: 'Cancel',
                    type: 'button-default'
                  },
                  {
                    text: 'Submit',
                    type: 'button-assertive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        $rootScope.searchCriteria['cuisineId'] =  $scope.cuisineId.type;;
                        console.log($rootScope.searchCriteria['cuisineId']);
                        $scope.searchRestaurants();
                    }
                  },
                ]
            });
        };

        // TODO: REFACTOR THE FKING LONG FUNCTION
        //       Call for getting list of restaurants
        $scope.searchRestaurants = function() {
            console.log($rootScope.searchCriteria);
            Loading.show('Finding the Best Locations');
            var restaurantList;

            Foursquare.list($rootScope.searchCriteria).success(function(data){
                console.log("success");
                console.log(data);
                restaurantList = data.response.groups[0].items;

                $rootScope.restaurantCards = [];
                var saveObject = [];
                angular.forEach(data.response.groups[0].items, function(value, key) {
                    var imageUrl;
                    if(value.venue.photos.groups[0]) {
                        imageUrl = value.venue.photos.groups[0].items[0].prefix + '500x500' + value.venue.photos.groups[0].items[0].suffix;
                    }
                    $rootScope.restaurantCards.push({ 
                        image: imageUrl, 
                        name: value.venue.name,
                        category: value.venue.categories[0].name,
                        rating: value.venue.rating,
                        id: value.venue.id
                    });

                    var point = new Parse.GeoPoint({latitude: value.venue.location.lat, longitude: value.venue.location.lng});

                    // TODO: Need to move this to parse cloud code for scraping
                    Parse.Cloud.run('saveRestaurants', { 
                        location: point, 
                        foursquareId: value.venue.id, 
                        restaurantName: value.venue.name,
                        phone: value.venue.contact.phone,
                        twitterId: value.venue.contact.twitter,
                        facebookId: value.venue.contact.facebook,
                        postalCode: value.venue.location.postalCode,
                        address: value.venue.location.address,
                        city: value.venue.location.city,
                        state: value.venue.location.state,
                        country: value.venue.location.country,
                        cc: value.venue.location.cc,
                        rating: value.venue.rating,
                        priceTier: value.venue.price.tier,
                        website: value.venue.url,
                        reservationUrl: ((value.venue.reservations) ? value.venue.reservations.url : ""),
                        menuUrl: ((value.venue.menu) ? value.venue.menu.mobileUrl : ""),
                        featuredImage: imageUrl
                    }, {
                        success: function(response) {
                            console.log(response);
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                });

                if($rootScope.restaurantCards != "") {
                    console.log($rootScope.restaurantCards);
                    $rootScope.searchCriteria['id'] = $rootScope.restaurantCards[0].id;
                    $rootScope.searchCriteria['restaurantName'] = $rootScope.restaurantCards[0].name;

                    // $rootScope.cards = Array.prototype.slice.call($rootScope.cardTypes, 0, 0);

                    $rootScope.ranDemandTitle();
                    // $ionicLoading.hide();
                    // Reset the saved index for new search
                    $rootScope.lastSavedIndex = null;

                    // Test
                    $scope.showCards = false;
                    var restaurantCardsIndexPosition = 0;

                    // Save list stateId history
                    $rootScope.lastViewHistory = $rootScope.$viewHistory.currentView.stateId;
                    console.log($rootScope.lastViewHistory);

                    $scope.cards = [];
                    // $scope.cards = $rootScope.restaurantCards;
             
                    $scope.addCard = function(restaurant) {
                        var newCard = { 
                            image: restaurant.image, 
                            name: restaurant.name,
                            category: restaurant.category,
                            rating: restaurant.rating,
                            id: restaurant.id
                        };
                        $scope.cards.unshift(angular.extend({}, newCard));
                    };

                    // Check if user was in the middle of card list, else push cards for new search
                    if ($rootScope.lastSavedIndex != null) {
                        restaurantCardsIndexPosition = $rootScope.lastSavedIndex;
                        $scope.addCard($rootScope.restaurantCards[restaurantCardsIndexPosition]);
                        $scope.addCard($rootScope.restaurantCards[restaurantCardsIndexPosition-1]);
                    } else {
                        if ($rootScope.restaurantCards[1]) {
                            $scope.addCard($rootScope.restaurantCards[1]);
                            restaurantCardsIndexPosition = 1;
                        }
                        $scope.addCard($rootScope.restaurantCards[0]);       
                    }
                    $scope.showCards = true;

                    // Should make into seperate function to call
                    Foursquare.details($rootScope.searchCriteria).success(function(data){
                        // $ionicLoading.hide();

                        $rootScope.business = data.response.venue;

                        // All Photos
                        Foursquare.photos($rootScope.searchCriteria).success(function(data){
                            $rootScope.photos = data;
                            console.log($rootScope.photos);
                        }).error(function(data){
                            console.log("there is an error");
                        });

                        $state.go('tab.details', {});
                    });
                    // End Test
                    setTimeout( function() { 
                        $state.go('tab.list', {});
                        $ionicLoading.hide();
                    }, 1500);
                } else {
                    $ionicLoading.hide();
                    var message = 'No results could be found';
                    Alerts.error(message);
                }
            }).error(function(err) {
                $ionicLoading.hide();
                // show error
                var message = 'Something has gone wrong! <br/> Could not establish connection';
                Alerts.error(message);
            });
        };
    })

    .controller('ListCtrl', function($scope, $http, $rootScope, $state, $ionicViewService, $ionicLoading, $ionicPopup, Loading, TDCardDelegate, Favourites, Foursquare, Twitter) {
        $scope.showCards = false;
        var restaurantCardsIndexPosition = 0;

        // Save list stateId history
        $rootScope.lastViewHistory = $rootScope.$viewHistory.currentView.stateId;
        console.log($rootScope.lastViewHistory);

        $scope.cards = [];
        // $scope.cards = $rootScope.restaurantCards;
 
        $scope.addCard = function(restaurant) {
            var newCard = { 
                image: restaurant.image, 
                name: restaurant.name,
                category: restaurant.category,
                rating: restaurant.rating,
                id: restaurant.id
            };
            $scope.cards.unshift(angular.extend({}, newCard));
        };

        // Check if user was in the middle of card list, else push cards for new search
        if ($rootScope.lastSavedIndex != null) {
            restaurantCardsIndexPosition = $rootScope.lastSavedIndex;
            $scope.addCard($rootScope.restaurantCards[restaurantCardsIndexPosition]);
            $scope.addCard($rootScope.restaurantCards[restaurantCardsIndexPosition-1]);
        } else {
            if ($rootScope.restaurantCards[1]) {
                $scope.addCard($rootScope.restaurantCards[1]);
                restaurantCardsIndexPosition = 1;
            }
            $scope.addCard($rootScope.restaurantCards[0]);       
        }
        $scope.showCards = true;

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);

            // Generate go to title
            $rootScope.ranDemandTitle();

            // Assign restaurant id and name to search query
            $rootScope.searchCriteria['id'] = $rootScope.restaurantCards[restaurantCardsIndexPosition].id;
            $rootScope.searchCriteria['restaurantName'] = $rootScope.restaurantCards[restaurantCardsIndexPosition].name;

            // Check if counter/array index has reached the end
            if((restaurantCardsIndexPosition + 1) < $rootScope.restaurantCards.length) {
                restaurantCardsIndexPosition = restaurantCardsIndexPosition + 1;
                $scope.addCard($rootScope.restaurantCards[restaurantCardsIndexPosition]);
            } else {
                $ionicPopup.show({
                    template: 'There are no more results in your search',
                    title: 'No More Results',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive',
                            onTap: function(e) {
                                // Returning a value will cause the promise to resolve with the given value.
                                $state.go('tab.dash', {});
                            }
                        }
                    ]
                }); 
                return;
            }

            console.log("card destroyed - add card");
            console.log($scope.cards);

            // save the index position for reentry - going back from details tab
            $rootScope.lastSavedIndex = restaurantCardsIndexPosition;
        };

        // $scope.cardSwipedLeft = function(index) {
        //     console.log('LEFT SWIPE');
        // };

        // $scope.cardSwipedRight = function(index) {
        //     console.log('RIGHT SWIPE');
        // };

        // $scope.transitionOut = function(card) {
        //     console.log('card transition out');
        // };

        // $scope.transitionRight = function(card) {
        //     console.log('card removed to the right');
        //     console.log(card);
        // };

        // $scope.transitionLeft = function(card) {
        //     console.log('card removed to the left');
        //     console.log(card);
        // };

        $scope.getRestaurantDetails = function() {
            Loading.show('Getting Restaurant Details');

            // TODO: Rewrite using JS promise functions
            Foursquare.details($rootScope.searchCriteria).success(function(data){
                $ionicLoading.hide();

                $rootScope.business = data.response.venue;
                console.log($rootScope.business);

                var attributes = data.response.venue.attributes.groups;
                var venueDetails = data.response.venue;

                var saveDetails = {  
                    foursquareId: venueDetails.id,
                    category: venueDetails.categories[0].shortName,
                    description: ((venueDetails.description) ? venueDetails.description : "")
                };

                angular.forEach(attributes, function(value, key) {
                    if (value.name == 'Menus') {
                        saveDetails['menus'] = value.summary
                    } 
                    if (value.name == 'Credit Cards') {
                        saveDetails['creditCards'] = value.items[0].displayValue
                    }
                    else {
                        saveDetails[value.type] = value.items[0].displayValue
                    }
                });

                console.log(venueDetails);
                console.log(saveDetails);

                // TODO: Need to create a loop that saves the details of a list of restuarants to parse
                Parse.Cloud.run('saveRestaurants', saveDetails, {
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });

                // All Photos
                Foursquare.photos($rootScope.searchCriteria).success(function(data){
                    $rootScope.photos = data;
                    console.log($rootScope.photos);
                }).error(function(data){
                    console.log("there is an error");
                });

                $state.go('tab.details', {});

                // Twitter API
                // $rootScope.searchCriteria['name'] = $rootScope.business.name;
                // $rootScope.searchCriteria['twitter'] = $rootScope.business.contact.twitter;

                // Twitter.tweets($rootScope.searchCriteria).success(function(data){
                //     $rootScope.twitter = data;
                //     console.log($rootScope.twitter);
                // }).error(function(data){
                //     console.log("there is an error");
                // });
            }).error(function(data){
                console.log("there is an error");
            });
        };
    })

    .controller('DetailsCtrl', function($scope, $rootScope, $state, $ionicPopup, Favourites) {
        $scope.openWebsite = function(link) {
            console.log(link);
            window.open(link, '_blank', 'location=yes');
        }

        // Check if the restaurant is favourited - SHOULD CHANGE TO A RELATIONAL QUERY
        var getFavouritePlace = { 
            foursquarePlaceId: $rootScope.searchCriteria['id'] ,
            username: Parse.User.current().getUsername()
        };
        Favourites.get(getFavouritePlace).success(function(data) {
            var favouritePlace = data['results'];
            console.log("test:" + favouritePlace[0]);
            if (favouritePlace[0] == undefined) {
                $scope.favouriteIcon = "icon ion-ios-star-outline"
            } else {
                $scope.favouriteIcon = "icon ion-ios-star"
                $scope.objectId = favouritePlace[0]['objectId'];
            }
        }).error(function() {
            console.log("could not get favourite place");
        });

        $scope.addToFavourites = function() {
            if ($scope.favouriteIcon == "icon ion-ios-star-outline") {
                // Add favourite restaurant to db
                var favouritePlace = {
                    foursquarePlaceId: $rootScope.searchCriteria['id'],
                    restaurantName: $rootScope.searchCriteria['restaurantName'],
                    username: Parse.User.current().getUsername(),
                    restaurantThumbnail: $rootScope.business.photos.groups[0].items[0].prefix + "100x100" + $rootScope.business.photos.groups[0].items[0].suffix
                };
                // TODO: Rewrite using JS promise functions
                Favourites.add(favouritePlace).success(function(data){
                    console.log(data);
                    
                    $scope.objectId = data['objectId'];
                    console.log($scope.objectId);

                    // TODO: Linking favourite restaurant to user,
                    //       rewrite in JS lib (its in REST right now)
                    var linkFavouritePlace = {
                        favourites: {
                            __op: "AddRelation",
                            objects: [{
                                __type: "Pointer",
                                className: "Favourites",
                                objectId: data['objectId']
                            }]
                        }
                    };
                    Favourites.link(Parse.User.current().getSessionToken(), Parse.User.current().id, linkFavouritePlace).success(function(data){
                        console.log(data);
                        $scope.favouriteIcon = "icon ion-ios-star";
                    }).error(function() {
                        console.log("Could not link favourite entry to user");
                    });
                }).error(function() {
                    console.log("Could not add favourite entry to database");
                });   
            } else {
                Favourites.delete($scope.objectId).success(function(data){
                    console.log(data);
                    $scope.favouriteIcon = "icon ion-ios-star-outline";
                }).error(function() {
                    console.log("Could not remove favourite restaurant");
                });
            }
        };

        $scope.goToMap = function() {
            $state.go('tab.map', {});
        }
    })

    .controller('MapCtrl', function($scope, $rootScope, $ionicLoading, $compile) {
        $scope.init = function() {
            var myLatlng = new google.maps.LatLng($rootScope.business.location.lat,$rootScope.business.location.lng);

            var mapOptions = {
              center: myLatlng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
              content: compiled[0]
            });

            var marker = new google.maps.Marker({
              position: myLatlng,
              map: map
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            });

            $scope.map = map;
        };
    })

    .controller('InstagramCtrl', function($scope) {
    })

    .controller('TwitterCtrl', function($scope) {
    });
