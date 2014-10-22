angular.module('starter.controllers', [])

.controller('PopupCtrl',function($scope, $rootScope, $ionicPopup, $timeout, $http) {
    // Triggered on a button click, or some other target
    $scope.showPopup = function() {
        $scope.value = { text: "text" };
        $http({
            method: 'GET',
            url: 'https://api.foursquare.com/v2/venues/categories?oauth_token=RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ&v=20141020'
        }).success(function(data){
            $rootScope.cuisines = data.response.categories[3].categories;
        }).error(function(err) {
            console.log("failed");
        });

        // An elaborate, custom popup
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
                type: 'button-positive',
                onTap: function(e) {
                    // Returning a value will cause the promise to resolve with the given value.
                    alert($scope.value.text);
                    return 'ok button';
                }
              },
            ]
        });
        myPopup.then(function(res) {
           alert("you tapped: "+res);
        });
    };

    // A confirm dialog
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Consume Ice Cream',
            template: 'Are you sure you want to eat this ice cream?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };

    // An alert dialog
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
             title: 'Don\'t eat that!',
             template: 'It might taste good'
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
})

.controller('DashCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $ionicSwipeCardDelegate) {
	navigator.geolocation.getCurrentPosition(function(position) {
        $scope.position=position;
        $scope.$apply();
        $rootScope.searchCriteria = {
            counter: '',
            name: '',
            id: '',
            latitude: $scope.position.coords.latitude,
            longitude: $scope.position.coords.longitude
        }
    },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Finding the Best Locations'
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $rootScope.demandTitles = [
        "Go To",
        "Get Fat At",
        "Indulge At",
        "Calorie Binge At",
        "Get Your Butt To",
        "Pig Out",
        "Try",
        "Gorge At",
        "Stuff Your Face At",
        "It's Decided You're Going",
        "Your Stomach Is Calling", 
        "It's Time 2 Go To"
    ];

    $rootScope.ranDemandTitle = function() {
        // Choose Random Demand Title
        $scope.randomNum = Math.floor((Math.random() * 11));
        $rootScope.demandTitle = $rootScope.demandTitles[$scope.randomNum];
    };

	$scope.doSubmit = function() {
        console.log($rootScope.searchCriteria);
        $scope.show();
		$http({
            method: 'POST',
            // url: 'http://www.gamehub.ca/foodapp/sample.php',
            url: 'http://www.gamehub.ca/foodapp/foursquare.php',
            data: $rootScope.searchCriteria,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
	        console.log("success");
            $rootScope.cardTypes = [];
            angular.forEach(data.response.groups[0].items, function(value, key) {
                $rootScope.cardTypes.push(value.venue);
            });

            console.log($rootScope.cardTypes);
            $rootScope.searchCriteria['id'] = $rootScope.cardTypes[0].id;

            $rootScope.cards = Array.prototype.slice.call($rootScope.cardTypes, 0, 0);

            $rootScope.ranDemandTitle();
            $scope.hide();
			$state.go('tab.friends', {});
	    }).error(function(err) {
	        console.log("failed");
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

    $scope.counter = 0;
    $scope.cardSwiped = function(index) {
        if($scope.counter == $rootScope.cardTypes.length) {
            $scope.counter = 0;
        } else {
            $scope.counter = $scope.counter + 1;
        }
        $rootScope.ranDemandTitle();

        var newCard = $rootScope.cardTypes[$scope.counter];
        $rootScope.cards.push(newCard);
        console.log(newCard);

        $rootScope.searchCriteria['id'] = newCard.id;
        console.log($rootScope.searchCriteria['id']);
    };

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
            $state.go('tab.account', {});

            $http({
                method: 'POST',
                url: 'http://www.gamehub.ca/foodapp/foursquarePhotoDetails.php',
                data: $rootScope.searchCriteria,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                $rootScope.instagram = data;
                console.log($rootScope.instagram);
            }).error(function(data){
                console.log("there is an error");
            });

            // $rootScope.searchCriteria['name'] = $rootScope.business.name;
            // $http({
            //     method: 'POST',
            //     url: 'http://www.gamehub.ca/foodapp/twitterApi.php',
            //     data: $rootScope.searchCriteria,
            //     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            // }).success(function(data){
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

.controller('AccountCtrl', function($scope) {
})

.controller('TwitterCtrl', function($scope) {
})

.controller('InstagramCtrl', function($scope) {
});
