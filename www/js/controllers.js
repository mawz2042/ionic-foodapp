angular.module('starter.controllers', [])

    .controller('NavCtrl', function($scope, $rootScope, $state, $ionicViewService) {
        // Nav back history fix
        $scope.goBack = function() {
            var stateId = $rootScope.$viewHistory.currentView.stateId;
            var backViewId = $rootScope.$viewHistory.currentView.backViewId;
            console.log($rootScope.$viewHistory.currentView);
            // Go back to home if on login or register view
            if ((stateId == "tab.login") || (stateId == "tab.register")) {
                $state.go('tab.home', {});
            }
            // If view is in card list then remove history and set back to dash view
            if (stateId == "tab.friends" || stateId == "tab.profile") {
                // assign it as the current view (as far as history is concerned)
                $ionicViewService.setNavViews("008"); 
                $state.go('tab.dash', {});
            }
            // If view is in any of the tabbed pages, set back to card list
            if ((stateId == "tab.account") || (stateId == "tab.instagram") || (stateId == "tab.twitter")) {
                if ((stateId == "tab.account") && (backViewId == "00E")) {
                    $state.go('tab.profile', {});
                } else {
                    $state.go('tab.friends', {});
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

    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, Alerts, Users) {
        $scope.loginObj = {};
        $scope.login = function() {
            Users.login($scope.loginObj.username, $scope.loginObj.password)
            .success(function(data){
                $rootScope.currentUser = data;
                console.log($rootScope.currentUser);
                $state.go('tab.dash', {});
            }).error(function() {
                console.log("error");
                var message = 'Incorrect username and password combination';
                Alerts.error(message);
            });  
        };
    })

    .controller('RegisterCtrl', function($scope, $rootScope, $state, $http, Alerts, Users) {
        $scope.registerObj = {};
        $scope.register = function() {  
            Users.register($scope.registerObj)
            .success(function(data){
                console.log(data);
                $state.go('tab.dash', {});
            }).error(function() {
                var message = 'Username is taken';
                Alerts.error(message);
            });
        };
    })

    .controller('ProfileCtrl', function($scope, $rootScope, $state, $http, Alerts, Favourites, Foursquare, Twitter) {
        $rootScope.getFavouritesList = { 
            $relatedTo: {
                object: {
                    __type: "Pointer",
                    className: "_User",
                    objectId: $rootScope.currentUser['objectId']
                },
                key: "favourites"
            }
        }
        $scope.profile = function() { 
            Favourites.getAll($rootScope.getFavouritesList).success(function(data) {
                $rootScope.favouritePlaces = data['results'];
                $state.go('tab.profile', {}); 
            }).error(function() {
                var message = 'Could not retrieve favourite list';
                Alerts.error(message);
            });
        };
        $scope.goToFavourite = function(restaurantId) {
            $rootScope.searchCriteria['id'] = restaurantId;
            var favouriteId = {
                id: $rootScope.searchCriteria['id']
            };
            Foursquare.details(favouriteId).success(function(data){
                $rootScope.business = data.response.venue;
                console.log($rootScope.business);

                // All Photos
                Foursquare.photos(favouriteId).success(function(data){
                    $rootScope.photos = data;
                    console.log($rootScope.photos);
                }).error(function(data){
                    console.log("there is an error");
                });

                $state.go('tab.account', {});
            }).error(function(data){
                var message = 'Could not retrieve restaurant details';
                Alerts.error(message);
            });
        };
    })

    .controller('DashCtrl', function($scope, $window, $http, $rootScope, $state, $ionicPopup, Alerts, $ionicPlatform, $ionicLoading, $ionicSwipeCardDelegate, Favourites, Foursquare) {
        // Preload the foursquare cuisine types
        Foursquare.cuisines().success(function(data){
            $rootScope.cuisines = data.response.categories[3].categories;
        }).error(function(err) {
            console.log("failed");
        });

        // Show and Hide Loading Overlay
        $scope.show = function() {
            $ionicLoading.show({
                template: 'Finding the Best Locations'
            });
        };
        $scope.hide = function() {
            $ionicLoading.hide();
        };
        // List of demand headings
        $rootScope.demandTitles = [
            "Go To",
            "Indulge At",
            "Try",
            "You're Going To",
            "Your Stomach Is Calling",
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

        // $ionicPlatform.ready(function() {
        //     if ( ! $window.localStorage.getItem( 'distance' ) ) {
        //         $window.localStorage.setItem( 'distance', '500' );
        //     }

        //     if ( ! $window.localStorage.getItem( 'price' ) ) {
        //         $window.localStorage.setItem( 'price', '2' );
        //     }
        // });

        // $scope.distanceList = [
        //     { text: "0.5km", value: "500" },
        //     { text: "2km", value: "2000" },
        //     { text: "10km", value: "10000" },
        //     { text: "15km", value: "15000" }
        // ];

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
            $scope.show();

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
                    $scope.hide();
                    // Reset the saved index for new search
                    $rootScope.lastSavedIndex = null;
                    $state.go('tab.friends', {});
                } else {
                    $scope.hide();
                    var message = 'No results could be found';
                    Alerts.error(message);
                }
            }).error(function(err) {
                $scope.hide();
                // show error
                var message = 'Something has gone wrong! <br/> Could not establish connection';
                Alerts.error(message);
            });
        };

        $scope.selectCuisine = function() {
            $state.go('tab.friends', {});
        }
    })

    .controller('FriendsCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $ionicSwipeCardDelegate, Favourites, Foursquare, Twitter) {
        $scope.show = function() {
            $ionicLoading.show({
                template: 'Getting Restaurant Details'
            });
        };

        $scope.hide = function() {
            $ionicLoading.hide();
        };

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
            $scope.show();
            // Should make into seperate function to call
            Foursquare.details($rootScope.searchCriteria).success(function(data){
                $scope.hide();
                $rootScope.business = data.response.venue;
                console.log($rootScope.business);

                // All Photos
                Foursquare.photos($rootScope.searchCriteria).success(function(data){
                    $rootScope.photos = data;
                    console.log($rootScope.photos);
                }).error(function(data){
                    console.log("there is an error");
                });

                $state.go('tab.account', {});

                // Twitter API
                $rootScope.searchCriteria['name'] = $rootScope.business.name;
                $rootScope.searchCriteria['twitter'] = $rootScope.business.contact.twitter;

                Twitter.tweets($rootScope.searchCriteria).success(function(data){
                    $rootScope.twitter = data;
                    console.log($rootScope.twitter);
                }).error(function(data){
                    console.log("there is an error");
                });
            }).error(function(data){
                console.log("there is an error");
            });
        };
    })

    .controller('AccountCtrl', function($scope, $rootScope, Favourites) {
        $scope.openWebsite = function(link) {
            console.log(link);
            window.open(link, '_blank', 'location=yes');
        }

        // Check if the restaurant is favourited - SHOULD CHANGE TO A RELATIONAL QUERY
        var getFavouritePlace = { 
            foursquarePlaceId: $rootScope.searchCriteria['id'] ,
            username: $rootScope.currentUser['username']
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
                    username: $rootScope.currentUser['username'],
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
                    Favourites.link($rootScope.currentUser['sessionToken'], $rootScope.currentUser['objectId'], linkFavouritePlace).success(function(data){
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
    })

    .controller('InstagramCtrl', function($scope) {
    })

    .controller('TwitterCtrl', function($scope) {
    });
