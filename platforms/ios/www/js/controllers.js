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
        $scope.loginView = function() {
            $state.go('tab.login', {});
        };

        $scope.registerView = function() {
            $state.go('tab.register', {});
        };
    })

    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, $localstorage, Alerts) {
        $scope.loginObj = {};
        $scope.standardLogin = function() {
            Parse.User.logIn($scope.loginObj.username, $scope.loginObj.password, {
                success: function(user) {
                    // Do stuff after successful login.
                    console.log(user);
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
        var fbLogged = new Parse.Promise();
    
        var fbLoginSuccess = function(response) {
            if (!response.authResponse){
                fbLoginError("Cannot find the authResponse");
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
            fbLogged.resolve(authData);
            console.log(response);
        };

        var fbLoginError = function(error){
            fbLogged.reject(error);
        };

        $scope.login = function() {
            console.log('Login');
            if (!window.cordova) {
                facebookConnectPlugin.browserInit('1594340540779035');
            }
            facebookConnectPlugin.login(['email'], fbLoginSuccess, fbLoginError);

            fbLogged.then( function(authData) {
                console.log('Promised');
                return Parse.FacebookUtils.logIn(authData, {
                    success: function(userObject) {
                        if (!userObject.existed()) {
                            facebookConnectPlugin.api('/me', null, function(response) {
                                console.log(response);
                                console.log(userObject);
                                userObject.set('firstname', response.first_name);
                                userObject.set('lastname', response.last_name);
                                userObject.set('email', response.email);
                                userObject.save();
                            }, function(error) {
                                console.log(error);
                            });
                            $state.go('tab.dash', {});
                            console.log("User signed up and logged in through Facebook!");
                        } else {
                            $state.go('tab.dash', {});
                            console.log("User logged in through Facebook!");
                        }
                    },
                    error: function(userObject, error) {
                        console.log("User cancelled the Facebook login or did not fully authorize.");
                    }
                });
            });
        };
    })

    .controller('RegisterCtrl', function($scope, $rootScope, $state, $http, Alerts) {
        $scope.registerObj = {};
        $scope.register = function() {
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
    })

    .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
        // Called to navigate to the main app
        $scope.startApp = function() {
            $state.go('tab.dash', {});
        };
        // $scope.next = function() {
        //     $ionicSlideBoxDelegate.next();
        // };
        // $scope.previous = function() {
        //     $ionicSlideBoxDelegate.previous();
        // };
        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    })

    .controller('ProfileCtrl', function($scope, $rootScope, $state, $http, $ionicLoading, $ionicViewService, $ionicPopup, $localstorage, Loading, Alerts, Favourites, Foursquare, Twitter) {
        // Save profile stateId history
        $rootScope.lastViewHistory = $rootScope.$viewHistory.currentView.stateId;
        console.log($rootScope.lastViewHistory);

        // $scope.createNewList = function() {
        //     if ($scope.favouriteIcon == "icon ion-ios-star-outline") {
        //         // Add favourite restaurant to db
        //         var favouritePlace = {
        //             foursquarePlaceId: $rootScope.searchCriteria['id'],
        //             restaurantName: $rootScope.searchCriteria['restaurantName'],
        //             username: Parse.User.current().getUsername(),
        //             restaurantThumbnail: $rootScope.business.photos.groups[0].items[0].prefix + "100x100" + $rootScope.business.photos.groups[0].items[0].suffix
        //         };
        //         Favourites.add(favouritePlace).success(function(data){
        //             console.log(data);
                    
        //             $scope.objectId = data['objectId'];
        //             console.log($scope.objectId);

        //             // Link favourite restaurant to user
        //             var linkFavouritePlace = {
        //                 favourites: {
        //                     __op: "AddRelation",
        //                     objects: [{
        //                         __type: "Pointer",
        //                         className: "Favourites",
        //                         objectId: data['objectId']
        //                     }]
        //                 }
        //             };
        //             Favourites.link(Parse.User.current().getSessionToken(), Parse.User.current().id, linkFavouritePlace).success(function(data){
        //                 console.log(data);
        //                 $scope.favouriteIcon = "icon ion-ios-star";
        //             }).error(function() {
        //                 console.log("Could not link favourite entry to user");
        //             });
        //         }).error(function() {
        //             console.log("Could not add favourite entry to database");
        //         });   
        //     } else {
        //         Favourites.delete($scope.objectId).success(function(data){
        //             console.log(data);
        //             $scope.favouriteIcon = "icon ion-ios-star-outline";
        //         }).error(function() {
        //             console.log("Could not remove favourite restaurant");
        //         });
        //     }
        // };

        // Right now using a hybrid of REST and JS SDK - change just to JS SDK
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
            var profileInfo = $localstorage.getObject('profileInfo');
            // Check if profile info is in cache
            if (profileInfo.username == null) {
                // Not in cache so hit facebook api
                facebookConnectPlugin.api('/me/picture', null, function(response) {
                    $rootScope.profileInfo = {    
                        username: Parse.User.current().getUsername(),
                        firstname: Parse.User.current().get("firstname"),
                        lastname: Parse.User.current().get("lastname"),
                        email: Parse.User.current().get("email"),
                        picture: response.data.url
                    };
                    // Store info in cache
                    $localstorage.setObject('profileInfo', $rootScope.profileInfo);
                    $state.go('tab.profile', {});
                }, function(error) {
                    console.log(error);
                });
            } else {
                // Retrieve from cache
                $rootScope.profileInfo = $localstorage.getObject('profileInfo');
                console.log('From cache: ' + $rootScope.profileInfo);
                $state.go('tab.profile', {});
            }
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

    .controller('DashCtrl', function($scope, $window, $http, $rootScope, $state, $ionicPopup, Alerts, $ionicPlatform, $ionicLoading, Loading, $ionicSwipeCardDelegate, Favourites, Foursquare) {
        // Preload the foursquare cuisine types
        Foursquare.cuisines().success(function(data) {
            $rootScope.cuisines = data.response.categories[3].categories;
        }).error(function(err) {
            console.log("failed");
        });

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

        // Geolocation to get location position
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.position=position;
            $scope.$apply();
            $rootScope.searchCriteria = {
                counter: '',
                name: '',
                restaurantName: '',
                id: '',
                twitter: '',
                price: '',
                distance: '',
                cuisineId: '',
                latitude: $scope.position.coords.latitude,
                longitude: $scope.position.coords.longitude
            }
        },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });

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

        $scope.showPopup = function() {
            $scope.cuisineId = {
                type: ''
            };
            // Select cuisine popup
            var myPopup = $ionicPopup.show({
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
                        $scope.doSubmit();
                    }
                  },
                ]
            });
        };

        // AJAX call for getting list of restaurants
        $scope.doSubmit = function() {
            console.log($rootScope.searchCriteria);
            Loading.show('Finding the Best Locations');

            Favourites.getAll($rootScope.getFavouritesList).success(function(data) {
                console.log(data);
            }).error(function() {
                console.log("Could not retrieve favourite list");
            });

            Foursquare.list($rootScope.searchCriteria).success(function(data){
                console.log("success");
                $rootScope.cardTypes = [];
                console.log(data);
                angular.forEach(data.response.groups[0].items, function(value, key) {
                    $rootScope.cardTypes.push(value.venue);
                });

                if($rootScope.cardTypes != "") {
                    console.log($rootScope.cardTypes);
                    $rootScope.searchCriteria['id'] = $rootScope.cardTypes[0].id;
                    $rootScope.searchCriteria['restaurantName'] = $rootScope.cardTypes[0].name;

                    $rootScope.cards = Array.prototype.slice.call($rootScope.cardTypes, 0, 0);

                    $rootScope.ranDemandTitle();
                    $ionicLoading.hide();
                    // Reset the saved index for new search
                    $rootScope.lastSavedIndex = null;
                    $state.go('tab.list', {});
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

        $scope.selectCuisine = function() {
            $state.go('tab.list', {});
        }
    })

    .controller('ListCtrl', function($scope, $http, $rootScope, $state, $ionicViewService, $ionicLoading, Loading, $ionicSwipeCardDelegate, Favourites, Foursquare, Twitter) {
        // Save list stateId history
        $rootScope.lastViewHistory = $rootScope.$viewHistory.currentView.stateId;
        console.log($rootScope.lastViewHistory);

        // Initilization counter
        $scope.counter = 0;
        $scope.cardSwiped = function(index) {
            // Assign saved index to counter if there exists one
            if ($rootScope.lastSavedIndex != null) {
                $scope.counter = $rootScope.lastSavedIndex;
            }

            // Check if counter/array index has reached the end
            if($scope.counter == $rootScope.cardTypes.length) {
                $scope.counter = 0;
            } else {
                $scope.counter = $scope.counter + 1;
            }

            // Generate go to title
            $rootScope.ranDemandTitle();

            var newCard = $rootScope.cardTypes[$scope.counter];
            if (newCard != null) {
                $rootScope.cards.push(newCard);
                console.log(newCard);

                // Assign id to search query
                $rootScope.searchCriteria['id'] = newCard.id;
                $rootScope.searchCriteria['restaurantName'] = newCard.name;

                console.log($rootScope.searchCriteria['id']);
                console.log($rootScope.searchCriteria['restaurantName']);
            }
            // save the index for reentry - going back from details tab
            $rootScope.lastSavedIndex = $scope.counter;
        };

        // Removes an entry from cards array
        $scope.cardDestroyed = function(index) {
            $rootScope.cards.splice(index, 1);
        };

        $scope.restaurantSubmit = function() {
            Loading.show('Getting Restaurant Details');
            // Should make into seperate function to call
            Foursquare.details($rootScope.searchCriteria).success(function(data){
                $ionicLoading.hide();
                $rootScope.business = data.response.venue;
                console.log($rootScope.business);

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

        $scope.showLists = function() {
            // lists popup
            $ionicPopup.show({
                templateUrl: 'templates/popup-lists.html',
                title: 'Select lists to add to',
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
                        // $rootScope.searchCriteria['cuisineId'] =  $scope.cuisineId.type;;
                        // console.log($rootScope.searchCriteria['cuisineId']);
                        // $scope.doSubmit();
                    }
                  }
                ]
            });
        };
        $scope.addToLists = function() {

        };

        $scope.addToFavourites = function() {
            if ($scope.favouriteIcon == "icon ion-ios-star-outline") {
                // Add favourite restaurant to db
                var favouritePlace = {
                    foursquarePlaceId: $rootScope.searchCriteria['id'],
                    restaurantName: $rootScope.searchCriteria['restaurantName'],
                    username: Parse.User.current().getUsername(),
                    restaurantThumbnail: $rootScope.business.photos.groups[0].items[0].prefix + "100x100" + $rootScope.business.photos.groups[0].items[0].suffix
                };
                Favourites.add(favouritePlace).success(function(data){
                    console.log(data);
                    
                    $scope.objectId = data['objectId'];
                    console.log($scope.objectId);

                    // Link favourite restaurant to user
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
