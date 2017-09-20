var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  $scope.$on('$ionicView.afterEnter', function(){
    setTimeout(function(){
      document.getElementById("custom-overlay").style.display = "none";      
    }, 3000);
  });  
});

app.controller('PlaylistsCtrl',['$scope', '$rootScope' , '$filter', 'localStorageService', function($scope , $rootScope, $filter, localStorageService) {
	
	
  $rootScope.playlists = [
    { title: 'Finance', id: 1 },
    { title: 'Assets', id: 2 },
    { title: 'CRM', id: 3 },
    { title: 'HR', id: 4 },
    { title: 'Payroll', id: 5 },
    { title: 'Procurement', id: 6 }
  ];
  
  $rootScope.modulename=function(id){
		 $rootScope.modulenametit= null;
		var x =  $filter('filter')(  $rootScope.playlists, { 'id': id }, true);
		  $rootScope.modulenametit = x[0].title;
		
	}
	
	$scope.userData =localStorageService.get('authorizationData');
	
	console.log($scope.userData);
}]);

app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {
 
    $scope.savedSuccessfully = false;
    $scope.message = "";
 
    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: ""
    };
 
    $scope.signUp = function () {
 
        authService.saveRegistration($scope.registration).then(function (response) {
 
            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
            startTimer();
 
        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed to register user due to:" + errors.join(' ');
         });
    };
 
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }
 
}]);
app.controller('PlaylistCtrl', function($scope, $stateParams) {
});
app.controller('loginController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.loginData = {
        username: "",
        password: ""
    };
 
    $scope.message = "";
     
    $scope.loginfun = function () {
 
        authService.login($scope.loginData).then(function (response) {
			console.log(response);
            $scope.closeLogin(); 
            $location.path('app/home');
           
        },
		
		
         function (err) {
             $scope.message = err.error_description;
         });
    };
 
}]);
app.controller('userController',['$scope', '$location', 'authService', 'userservice', function ($scope, $location, authService, userservice){
	
	$scope.userData = {
		userName:authService.username
	};
	
	      userservice.getServices($scope.userData).then(function(response){
			  console.log(response);
			  $scope.userDetail = response;
		  },
		  function (err) {
             $scope.message = err.error_description;
         });
		  
	    
}]);
app.controller('companyController',['$scope', '$location', 'authService', 'companyModelservice', function ($scope, $location, authService, companyModelservice){
	
	$scope.companyData={companyCode: "dev"};
	
	      userservice.getServices($scope.companyData).then(function(response){
			  console.log(response);
			  $scope.companyData = response;
		  },
		  function (err) {
             $scope.message = err.error_description;
         });
		  
	    
}]);
app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

app.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
app.controller('indexController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
 
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/login');
    }
 
    $scope.authentication = authService.authentication;
	
       console.log($scope.authentication);
}]);
app.controller('associateController', ['$scope', '$location','$timeout','authService', function ($scope, $location,$timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registerData = {
        userName: authService.externalAuthData.userName,
        provider: authService.externalAuthData.provider,
        externalAccessToken: authService.externalAuthData.externalAccessToken
    };

    $scope.registerExternal = function () {

        authService.registerExternal($scope.registerData).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully, you will be redicted to orders page in 2 seconds.";
            startTimer();

        },
          function (response) {
              var errors = [];
              for (var key in response.modelState) {
                  errors.push(response.modelState[key]);
              }
              $scope.message = "Failed to register user due to:" + errors.join(' ');
          });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/modules');
        }, 2000);
    }

}]);