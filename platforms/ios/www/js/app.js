// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic.contrib.ui.cards', 'ion-google-place'])

.run(function($rootScope, $ionicPlatform, $localstorage, $state) {
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView(true);
      StatusBar.styleLightContent();
      // StatusBar.styleDefault();
    }
    // Checks if user is already logged in
    if (!Parse.User.current()) {
      console.log('Please Login');
    } else {
      console.log('Restore current user');
      $state.go('tab.dash', {});
    }
  });
})

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // User login/register
    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.login', {
      url: '/home/login',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('tab.register', {
      url: '/home/register',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-register.html',
          controller: 'RegisterCtrl'
        }
      }
    })

    .state('tab.intro', {
      url: '/intro',
      views: {
        'tab-intro': {
          templateUrl: 'templates/tab-intro.html',
          controller: 'IntroCtrl'
        }
      }
    })

    // Each tab has its own nav history stack:
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.profile', {
      url: '/dash/profile',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('tab.favourites', {
      url: '/dash/favourites',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-favourites.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('tab.list', {
      url: '/dash/list',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-list.html',
          controller: 'ListCtrl'
        }
      }
    })
    .state('tab.details', {
      url: '/dash/list/details',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-details.html',
          controller: 'DetailsCtrl'
        }
      }
    })
    .state('tab.map', {
      url: '/dash/list/details/map',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('tab.twitter', {
      url: '/dash/list/twitter',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-twitter.html',
          controller: 'TwitterCtrl'
        }
      }
    })
    .state('tab.instagram', {
      url: '/dash/list/instagram',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-instagram.html',
          controller: 'InstagramCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

