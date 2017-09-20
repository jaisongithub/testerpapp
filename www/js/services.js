

'use strict';
app.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
app.factory('authInterceptorService', ['$q', '$injector','$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
       
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer' + ' '+ authData.token;
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    $location.path('/home');
                    return $q.reject(rejection);
                }
            }
            authService.logOut();
            $location.path('/login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
app.factory('authService', ['$http', '$rootScope','$q', 'localStorageService','companyModelservice', function ($http, $rootScope, $q, localStorageService, companyModelservice) {
 
 var serviceBase = 'http://192.168.30.1:90/api/oauth/login';
    var authServiceFactory = {};
 
    var _authentication = {
        isAuth: false
    };
 
    var _saveRegistration = function (registration) {
 
        _logOut();
 
        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });
 
    };
 
    var _login = function (loginData) {
 
        var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password;
 
        var deferred = $q.defer();
		var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        $http.post(serviceBase, data, config).success(function (response) {
 
    
			 localStorageService.set('authorizationData', { userName: response.userName,
             
            
        token: response.access_token});
                
            _authentication.isAuth = true;
            _authentication.userName = loginData.username;
            _authentication.token = "";
            deferred.resolve(response);

            
                
            }).error(function (error, status) {
                _logOut();
                deferred.reject(error);
              
            });
 
        return deferred.promise;
 
    };
 
    var _logOut = function () {
 
        localStorageService.remove('authorizationData');
 
        _authentication.isAuth = false;
        _authentication.userName = "";
 
    };
  
  console.log(localStorageService.get('authorizationData'));
    var _fillAuthData = function () {
 
        var authData = localStorageService.get('authorizationData');
         
        if (authData)
        {
         
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
             _authentication.token = authData.token;
		
        }
           
    };



    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
 
    
    return authServiceFactory;
}]);

app.factory('userservice', [ '$http', '$q', 'localStorageService', 'authService', function ( $http, $q, localStorageService, authService) {
 
    var serviceBase = 'http://192.168.30.1:90';
    var usersServiceFactory = {};

    var _getServices= function (userName) {
 
        return $http.get(serviceBase+'/api/user/profile?userName='+userName).then(function (results) {
            return results.data;
        });
    };
 
  
 
    usersServiceFactory.getServices = _getServices;
  
    return usersServiceFactory;
 
}]);

app.factory('companyModelservice', [ '$http', '$q', 'localStorageService',  function ( $http, $q, localStorageService) {
    

    var urlservBase = 'http://192.168.30.1:90/api/company/settings';
      var token ="";
      var deferred = $q.defer();
         return{
            getServices:function(companyData){
                    alert("inner");
                    var config = {
                            headers : {
                                'Authorization':token                }
                        } 

                   return $http.post(urlservBase, {companyCode: companyData}, config).success(function (response) {
                        console.log(response);
                        return response;
                    }).error(function (err, status) {
                    
                        deferred.reject(err);
                    });
         }
       
    };
    
   return companyModelservice;
   
 
}]);


app.factory('loadService', ['$http', function($http){

  var Service = {};

  Service.requestingSomeURL = function(){
    for (var i = http.pendingRequests.length - 1; i >= 0; i--) {
      if($http.pendingRequests[i].url === ('/someURL')) return true;
    }
    return false;
  }

  return Service;
}]);