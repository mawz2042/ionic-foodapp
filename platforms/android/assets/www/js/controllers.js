angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $rootScope, $state, $ionicLoading) {
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
    }

	$scope.doSubmit = function() {
        // $scope.loading = true;
        console.log($rootScope.searchCriteria);

        $scope.show();
		$http({
            method: 'POST',
            url: 'http://www.gamehub.ca/foodapp/sample.php',
            data: $rootScope.searchCriteria,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
	    	$scope.hide();
	        console.log("success");
	        $rootScope.business = data.businesses[0];
            console.log($rootScope.business);

            $rootScope.businesses = data;
            console.log($rootScope.businesses);

            $rootScope.ranDemandTitle();

			$state.go('tab.friends', {});
	    }).error(function(err) {
	        console.log("failed");
	    });
    }
})

.controller('FriendsCtrl', function($scope, $http, $rootScope, $state, $ionicLoading) {
    $scope.show = function() {
        $ionicLoading.show({
            template: 'Getting Restaurant Details'
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.counter = 0;
    $scope.cancel = function() {
        if($scope.counter == 19) {
            $scope.counter = 0;
        } else {
            $scope.counter = $scope.counter + 1;
        }
        console.log($scope.counter);
        $rootScope.ranDemandTitle();
        $rootScope.business = $rootScope.businesses.businesses[$scope.counter];
        console.log($rootScope.business);
    }

     $scope.restaurantSubmit = function() {
        $rootScope.searchCriteria['counter'] = $scope.counter;
        $scope.show();
        $http({
            method: 'POST',
            url: 'http://www.gamehub.ca/foodapp/restaurantDetails.php',
            data: $rootScope.searchCriteria,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            $scope.hide();
            $rootScope.business = data;
            $rootScope.searchCriteria['id'] = data.id;
            console.log($rootScope.searchCriteria['id']);
            console.log($rootScope.business);
            $state.go('tab.account', {});

            $http({
                method: 'POST',
                url: 'http://www.gamehub.ca/foodapp/photoDetails.php',
                data: $rootScope.searchCriteria,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                $rootScope.instagram = data;
                console.log($rootScope.instagram);
            }).error(function(data){
                console.log("there is an error");
            });

            $rootScope.searchCriteria['name'] = data.name;
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
    }
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('TwitterCtrl', function($scope) {
})

.controller('InstagramCtrl', function($scope) {
});
