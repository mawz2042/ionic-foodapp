angular.module('starter.services', [])

.factory('Users', ['$http','PARSE_CREDENTIALS', function($http, PARSE_CREDENTIALS) {
  return {
    // getAll: function() {
    //   return $http.get('https://api.parse.com/1/classes/User', {
    //     headers: {
    //       'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
    //       'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
    //     }
    //   });
    // },
    login: function(username, password) {
      return $http.get('https://api.parse.com/1/login?username=' + username + '&password=' + password, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
        }
      });
    },
    register: function(data) {
      return $http.post('https://api.parse.com/1/users', data, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
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
