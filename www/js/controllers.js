var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $location, $ionicModal, $timeout,authService, loadService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};


 ionic.Platform.ready(function(){
    // will execute when device is ready, or immediately if the device is already ready.
  });

  var deviceInformation = ionic.Platform.device();

  var isWebView = ionic.Platform.isWebView();
  var isIPad = ionic.Platform.isIPad();
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
  var isWindowsPhone = ionic.Platform.isWindowsPhone();

  var currentPlatform = ionic.Platform.platform();
  var currentPlatformVersion = ionic.Platform.version();

  ionic.Platform.exitApp(); // stops the app
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
   

    $scope.pendingRequests = function(){
    return loadService.requestingSomeURL();
  }

 if(!authService.authentication.isAuth){
      $location.path('/app/login');
      console.log("not logged in");
 }else{
       $location.path('/app/home');
       console.log("logged in");
 }
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    //$scope.modal.hide();
      $location.path('/home');
  };

  // Open the login modal
  $scope.login = function() {
   // $scope.modal.show();
    $location.path('/login');
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
  tabsPlacement: "bottom" 
  console.log(authService.authServiceFactory+"authservice");
});

app.controller('PlaylistsCtrl',['$scope', '$rootScope' , '$filter', '$ionicPlatform', 'localStorageService', function($scope , $rootScope, $filter, $ionicPlatform, localStorageService) {
	
	
  $rootScope.playlists = [
    { title: 'Companies', id: 1, class:'ion-android-globe' },
    { title: 'Models', id: 2, class:'ion-android-apps' },
    { title: 'Reports', id: 3, class:'ion-android-document' },
    { title: 'Account', id: 4, class:'ion-calculator' },
    { title: 'News', id: 5, class:'ion-document-text' },
    { title: 'Help', id: 6, class:'ion-help-circled' }
  ];
  
  $rootScope.modulename=function(id){
		 $rootScope.modulenametit= null;
		var x =  $filter('filter')(  $rootScope.playlists, { 'id': id }, true);
		  $rootScope.modulenametit = x[0].title;
		
	}
	$rootScope.userData={
        userName:"",
        token:""
    }
	$rootScope.userData =localStorageService.get('authorizationData');
	
	console.log($rootScope.userData.token+"first");
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
app.controller('loginController', ['$scope', '$rootScope', '$location', '$ionicModal', 'authService', function ($scope, $rootScope, $location, $ionicModal, authService) {


    $scope.loginData = {
        username: "",
        password: ""
    };
 
    $scope.message = "";
     
    $scope.loginfun = function () {
            $scope.loading = true;
        authService.login($scope.loginData).then(function (response) {
			console.log(response);
            $scope.closeLogin(); 
            $location.path('app/home');
           
        },
		
		
      //company Detials
           
         function (error) {
             $scope.message = error.error_description;
               // $scope.data.error = { message: error, status: status};
                console.log( $scope.message+"error message");
         }).finally(function () {
      $scope.loading = false;
    });

    };

  
    $scope.pendingRequests = function(){
    return loadService.requestingSomeURL();
  }
 
}]);
app.controller('userController',['$scope','$rootScope', '$location', 'authService','authInterceptorService', 'userservice', '$cordovaProgress', function ($scope,$rootScope, $location, authService, authInterceptorService, userservice,  $cordovaProgress){
	
	$scope.userData = {
		userName:authService.userName
	};
	$scope.userFullDetails = function(){
	      userservice.getServices($rootScope.userData.username).then(function(response){
			  console.log(response);
			  $scope.userDetail = response;
		  },
		  function (err) {
             $scope.message = err.error_description;
         });
		  
    };
    $scope.userFullDetails();
}]);
app.controller('companyController',['$scope', '$rootScope','$filter', '$location',  '$ionicPlatform','$ionicSlideBoxDelegate', '$ionicModal', 'authService', 'companyModelservice', '$cordovaProgress', function ($scope, $rootScope, $filter, $location, $ionicPlatform, $ionicSlideBoxDelegate, $ionicModal, authService, companyModelservice,  $cordovaProgress) {
  
 

         $scope.CompanyDet =null;
       
    $scope.CompanyfullDet = function(){
        
            companyModelservice.getServices($rootScope.userData.userName).then(function(response){
                $scope.CompanyDet = response.data;             
               
                console.log($scope.CompanyDet)
            });


$rootScope.setcompanymodulename=function(id){

		var x =  $filter('filter')($scope.CompanyDet.companyMasterDetails, { 'code':  id}, true);
		  $rootScope.modulenametit =x[0].cmModule;   
$rootScope.modulenametitt = {
           'modulelist':[]
     };
     
        angular.forEach($scope.modulenametit, function (obj, index) {
              $rootScope.modulenametitt.modulelist.push(obj) ;
            });
		console.log( $scope.modulenametitt);
	}

 };
$rootScope.updateReport=function(id){
     $scope.reportmodule=[];
    angular.forEach($scope.CompanyDet.companyMasterDetails,function(obj){
               angular.forEach(obj.cmModule,function(report){
                        $scope.reportmodule.push(report);
               });
                  
    });
			var x =  $filter('filter')( $scope.reportmodule, { 'code':  id}, true);
		  $rootScope.reportnametit =x[0].cmReports;  
          $rootScope.formnametit =x[0].cmfNames;  
          var obj2,obj3;
            
          //$rootScope.reportDet = JSON.stringify($rootScope.reportnametit); 
       angular.forEach($rootScope.reportnametit, function (obj2, index) {
                    $rootScope.mainreport = $rootScope.reportnametit[index]
                   // mainreport.havefavouritereports = false;
                    if ($rootScope.mainreport.subrpt.length > 0)
                        angular.forEach($rootScope.mainreport.subrpt, function (obj3, index) {
                            var subreport = $rootScope.mainreport.subrpt[index];
                            var itemid = subreport.id

                            /**angular.forEach(favrpts, function (obj, index) {
                                var parentid = obj.parentreportId;
                                favRptsublist = $filter('filter')(favrpts, { parentreportId: itemid }, true);
                                subreport.favouriteRpt = favRptsublist;

                                if (favRptsublist.length > 0) {
                                    if (parentid = itemid) {
                                        subreport.havefavouritereports = true;
                                    }
                                    cmpRpts.havefavouritereports = true;
                                }**/

                        })
                })
                
 console.log($rootScope.mainreport+"suxsssbrpt");
		//console.log( $rootScope.subreportmodule+"subrpt");
	};
//authService.getCompanyDetials();
	    $scope.CompanyfullDet();
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

