angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeObject: function(key) {
      $window.localStorage[key] = '';
    }
  }
}])

.factory('Favourites', ['$http','PARSE_CREDENTIALS', function($http, PARSE_CREDENTIALS) {
  return {
    getAll: function(data) {
      return $http.get('https://api.parse.com/1/classes/Favourites?where=' + encodeURI(JSON.stringify(data)), {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
        }
      });
    },
    get: function(data) {
      return $http.get('https://api.parse.com/1/classes/Favourites?where=' + encodeURI(JSON.stringify(data)), {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
        }
      });
    },
    add: function(data) {
      return $http.post('https://api.parse.com/1/classes/Favourites', data, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    },
    link: function(sessionToken, id, data) {
      return $http.put('https://api.parse.com/1/users/' + id, data, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'X-Parse-Session-Token': sessionToken,
          'Content-Type':'application/json'
        }
      });
    },
    delete: function(id) {
      return $http.delete('https://api.parse.com/1/classes/Favourites/' + id, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    }
  }
}])

.factory('Foursquare', ['$http', function($http) {
  return {
    cuisines: function() {
      return $http.get('https://api.foursquare.com/v2/venues/categories?oauth_token=RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ&v=20141020');
    },
    list: function(data) {
      return $http.post('http://www.gamehub.ca/foodapp/foursquare.php', data, {
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        }
      });
    },
    details: function(data) {
      return $http.post('http://www.gamehub.ca/foodapp/foursquareDetails.php', data, {
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        }
      });
    },
    photos: function(data) {
      return $http.post('http://www.gamehub.ca/foodapp/foursquarePhotoDetails.php', data, {
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        }
      });
    }
  }
}])

.factory('Twitter', ['$http', function($http) {
  return {
    tweets: function(data) {
      return $http.post('http://www.gamehub.ca/foodapp/twitterApi.php', data, {
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        }
      });
    }
  }
}])

.factory('Alerts', ['$ionicPopup', function($ionicPopup) {
  return {
    error: function(message) {
      return $ionicPopup.alert({
        title: 'Sorry!',
        template: message,
        buttons: [
          {
            text: 'Close',
            type: 'button-assertive'
          }
        ]
      });
    }
  }
}])

.factory('Loading', ['$ionicLoading', function($ionicLoading) {
  return {
    show: function(message) {
      return $ionicLoading.show({
        template: message
      });
    }
  }
}])

.value('PARSE_CREDENTIALS', {
  APP_ID: 'g3pJuFTV11d3QNG1zSGsn0Ea6b8OiYEve5gCXQWp',
  REST_API_KEY: 'HUctvqL7aK11lHmkJJMTlYUO95FiXRUmRGEj31tm'
});
