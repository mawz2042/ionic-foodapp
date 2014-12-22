angular.module('starter.controllers', [])

    .controller('NavCtrl', function($scope, $rootScope, $state, $ionicViewService) {
        // Nav back history fix
        $scope.goBack = function() {
            var stateId = $rootScope.$viewHistory.currentView.stateId;
            // Go back to home if on login or register view
            if ((stateId == "tab.login") || (stateId == "tab.register")) {
                $state.go('tab.home', {});
            }
            // If view is in card list then remove history and set back to dash view
            if (stateId == "tab.friends") {
                // assign it as the current view (as far as history is concerned)
                $ionicViewService.setNavViews("008"); 
                $state.go('tab.dash', {});
            }
            // If view is in any of the tabbed pages, set back to card lsit
            if ((stateId == "tab.account") || (stateId == "tab.instagram") || (stateId == "tab.twitter")) {
                $state.go('tab.friends', {});
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

    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, $ionicPopup) {
        $scope.loginObj = {};
        $scope.login = function() {  
            $http({
                method: 'GET',
                url: 'http://cyberkronos.pythonanywhere.com/login?username=' + $scope.loginObj.username + '&password=' + $scope.loginObj.password
            }).success(function(data){
                console.log("successful database query");
                if (data == "username and password combination is incorrect") {
                    $ionicPopup.alert({
                        title: 'Sorry!',
                        template: data,
                        buttons: [
                            {
                                text: 'Close',
                                type: 'button-assertive'
                            }
                        ]
                    });
                }
                else if (data == "incorrect password entered") {
                    $ionicPopup.alert({
                        title: 'Sorry!',
                        template: data,
                        buttons: [
                            {
                                text: 'Close',
                                type: 'button-assertive'
                            }
                        ]
                    });
                } 
                else {
                    console.log(data);
                    $state.go('tab.dash', {});
                }
            }).error(function() {
                console.log("error");
            }); 
        };
    })

    .controller('RegisterCtrl', function($scope, $rootScope, $state, $http, $ionicPopup) {
        $scope.registerObj = {};
        $scope.register = function() {  
            var registerData = angular.toJson($scope.registerObj); 
            $http({
                method: 'POST',
                url: 'http://cyberkronos.pythonanywhere.com/register',
                data: registerData,
                headers: { 'Content-Type': 'application/json' }
            }).success(function(data){
                console.log("successful database query");
                console.log(registerData);
                if (data == "username is taken") {
                    $ionicPopup.alert({
                        title: 'Sorry!',
                        template: data,
                        buttons: [
                            {
                                text: 'Close',
                                type: 'button-assertive'
                            }
                        ]
                    });
                } else {
                    console.log(data);
                    $state.go('tab.dash', {});
                }
            }).error(function() {
                console.log("error");
            }); 
        };
    })

    .controller('DashCtrl', function($scope, $window, $http, $rootScope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, $ionicSwipeCardDelegate) {
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
            $http({
                method: 'GET',
                url: 'https://api.foursquare.com/v2/venues/categories?oauth_token=RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ&v=20141020'
            }).success(function(data){
                $rootScope.cuisines = data.response.categories[3].categories;
                // console.log($rootScope.cuisines);
            }).error(function(err) {
                console.log("failed");
            });

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
            $http({
                method: 'POST',
                url: 'http://www.gamehub.ca/foodapp/foursquare.php',
                data: $rootScope.searchCriteria,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                console.log("success");
                $rootScope.cardTypes = [];
                console.log(data);
                angular.forEach(data.response.groups[0].items, function(value, key) {
                    $rootScope.cardTypes.push(value.venue);
                });

                if($rootScope.cardTypes != "") {
                    console.log($rootScope.cardTypes);
                    $rootScope.searchCriteria['id'] = $rootScope.cardTypes[0].id;

                    $rootScope.cards = Array.prototype.slice.call($rootScope.cardTypes, 0, 0);

                    $rootScope.ranDemandTitle();
                    $scope.hide();
                    // Reset the saved index for new search
                    $rootScope.lastSavedIndex = null;
                    $state.go('tab.friends', {});
                } else {
                    $scope.hide();
                    var errorPopup = $ionicPopup.alert({
                        title: 'Sorry!',
                        template: "No results could be found",
                        buttons: [
                            {
                                text: 'Close',
                                type: 'button-assertive'
                            }
                        ]
                    });
                }
            }).error(function(err) {
                $scope.hide();
                // show error
                var errorPopup = $ionicPopup.alert({
                    title: 'Sorry!',
                    template: "Something has gone wrong! <br/> Could not establish connection",
                    buttons: [
                      {
                        text: 'Close',
                        type: 'button-assertive'
                      }
                    ]
                });
            });
        };

        $scope.selectCuisine = function() {
            $state.go('tab.friends', {});
        }
    })

    .controller('FriendsCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $ionicSwipeCardDelegate) {
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
                console.log($rootScope.searchCriteria['id']);
            }
            // save the index for reentry
            $rootScope.lastSavedIndex = $scope.counter;
        };

        // Removes an entry from cards array
        $scope.cardDestroyed = function(index) {
            $rootScope.cards.splice(index, 1);
        };

        $scope.restaurantSubmit = function() {
            $scope.show();
            $http({
                method: 'POST',
                url: 'http://www.gamehub.ca/foodapp/foursquareDetails.php',
                data: $rootScope.searchCriteria,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                $scope.hide();
                $rootScope.business = data.response.venue;
                console.log($rootScope.business);

                // All Photos
                $http({
                    method: 'POST',
                    url: 'http://www.gamehub.ca/foodapp/foursquarePhotoDetails.php',
                    data: $rootScope.searchCriteria,
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data){
                    $rootScope.photos = data;
                    console.log($rootScope.photos);
                }).error(function(data){
                    console.log("there is an error");
                });

                $state.go('tab.account', {});

                // Twitter API
                $rootScope.searchCriteria['name'] = $rootScope.business.name;
                $rootScope.searchCriteria['twitter'] = $rootScope.business.contact.twitter;
                $http({
                    method: 'POST',
                    url: 'http://www.gamehub.ca/foodapp/twitterApi.php',
                    data: $rootScope.searchCriteria,
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data){
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

    .controller('AccountCtrl', function($scope, $rootScope) {
        $scope.openWebsite = function(link) {
            console.log(link);
            window.open(link, '_blank', 'location=yes');
        }
    })

    .controller('TwitterCtrl', function($scope) {
    })

    .controller('InstagramCtrl', function($scope) {
    });
