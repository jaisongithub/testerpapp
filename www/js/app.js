// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var version = "1.0.0";

var app = angular.module('starter', [ 'ionic', 'starter.controllers', 'ngResource','ngCordova','LocalStorageModule', 'plug.ionic-segment','ksSwiper'])

.run(function($rootScope, $injector, $ionicPlatform,$location, $cordovaAppVersion, $ionicPopup,authService,localStorageService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
    }
	if (window.cordova) {
		
		$cordovaAppVersion.getVersionNumber().then(function (version) {
		  var appVersion = version;
		});
	 
	
	  $cordovaAppVersion.getVersionCode().then(function (build) {
		var appBuild = build;
	  });


	  $cordovaAppVersion.getAppName().then(function (name) {
		var appName = name;
	  });


	  $cordovaAppVersion.getPackageName().then(function (package) {
		var appPackage = package;
	  });
		}
  });
    
 
    $rootScope.global = localStorageService.get('authorizationData');
  
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
 $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


      .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
 .state('app.company', {
      url: '/company',
      views: {
        'menuContent': {
          templateUrl: 'templates/company.html',
          controller: 'companyController'
        }
      }
    })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.companymodules', {
      url: '/companymodules/:code',
      views: {
        'menuContent': {
          templateUrl: 'templates/companymodules.html',
          controller: 'companyController'
        }
      }
    })
      .state('app.modulereport', {
      url: '/modules',
      views: {
        'menuContent': {
          templateUrl: 'templates/reports.html',
          controller: 'companyController'
        }
      }
    })
   .state('app.reportmodules', {
      url: '/reportmodules/:code',
      views: {
        'menuContent': {
          templateUrl: 'templates/reportmodules.html',
          controller: 'companyController'
        }
      }
    })
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlistsmain.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  .state('app.chats', {
      url: '/chats',
      views: {
        'tab-chat': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
  
	.state('login', {
      url: '/login',
   
          templateUrl: 'templates/login.html',
    })

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-account.html',
        controller: 'userController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/home');
  
  
    //$stateProvider.interceptors.push('authInterceptorService');
});

var serviceBase = 'http://localhost:51858/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(["$httpProvider", function($httpProvider){
                $httpProvider.interceptors.push('authInterceptorService');

       }]);

