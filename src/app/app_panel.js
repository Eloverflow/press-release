'use strict';
// Declare app level module which depends on views, and components
var app  = angular.module('starter', ['starter.templates', 'starter.controllers','starter.services','starter.constants','ngRoute', 'permission', 'permission.ng']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  // End main template ---

  $routeProvider.when('/sign-in', {
    templateUrl: 'templates/view_user/sign_in.html',
    controller: 'UserCtrl'
  });

  $routeProvider.when('/sign-up', {
    templateUrl: 'templates/view_user/sign_up.html',
    controller: 'UserCtrl'
  });

  $routeProvider.when('/new-user', {
    templateUrl: 'templates/view_user/create-new.html',
    controller: 'UserCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.when('/edit-user/:id', {
    templateUrl: 'templates/view_user/edit.html',
    controller: 'UserCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.when('/forgot-password', {
    templateUrl: 'templates/view_user/forgot_pass.html',
    controller: 'UserCtrl'
  });

  $routeProvider.when('/new-password/:token', {
    templateUrl: 'templates/view_user/new_pass.html',
    controller: 'UserCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.when('/user-list', {
    templateUrl: 'templates/view_user/list.html',
    controller: 'UserListCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.when('/profile/:id', {
    templateUrl: 'templates/view_profile/profile.html',
    controller: 'ProfileCtrl'
  });


  $routeProvider.when('/press-release/:id', {
    templateUrl: 'templates/view_press_release/press_release.html',
    controller: 'PressReleaseCtrl'
  });

  $routeProvider.when('/press-release-create', {
    templateUrl: 'templates/view_press_release/create.html',
    controller: 'PressReleaseCreateCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.when('/press-release-edit/:id', {
    templateUrl: 'templates/view_press_release/edit.html',
    controller: 'PressReleaseEditCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.when('/press-releases', {
    templateUrl: 'templates/view_press_releases/press_releases.html',
    controller: 'PressReleasesCtrl',
    data: {
      permissions: {
        only: 'isAuthorized',
        redirectTo: 'sign-in'
      }
    }
  });

  $routeProvider.otherwise({redirectTo: '/sign-in'});
}]);


app.run(function($rootScope,$http, API_ENDPOINT, AuthService, $sce, DEBUG, $location, Fullscreen, $translate, PermPermissionStore) {

  $rootScope.changeLanguage = function (langKey) {
    $translate.use(langKey);
    setTimeout(function () {
      localStorage.setItem("language", langKey);
      initMsgInteractive();
    }, 100)
  };


  $rootScope.msgInteractive = [''];
  function initMsgInteractive() {
    $rootScope.msgInteractive = [''];
    $translate(['MSG-INTERATIVE-1', 'MSG-INTERATIVE-2']).then(function (translations) {


      $.each(translations, function(title, currentTranslation) {
        $rootScope.msgInteractive.push(currentTranslation);
      });

      $rootScope.msgInteractiveStart = Math.random();
    })

  }
  initMsgInteractive();


  openFB.init({appId: '1112318545481460'});

  PermPermissionStore
  // Define user permission calling back-end
      .definePermission('isAuthorized', /*@ngInject*/function () {
        // Let's assume that Session service calls backend API via $http and return promise:
        // -- $q.resolve() means that session is active
        // -- $q.reject() means that session expired
        return AuthService.isAuthenticated();
      });
  

  $rootScope.getInfo = function () {
    $http.get(API_ENDPOINT.url + '/auth/memberinfo').then(function (result) {

      if(result.data.success){
        $rootScope.sesUser = result.data.user;
      }

      if(DEBUG.isEnabled){
        console.log('User:');
        console.log(result);
      }
    },function (result, status) {
      if(status == 403){
        if(DEBUG.isEnabled) {
          console.log('Emptying the token and redirecting to login')
        }
        AuthService.logout();
        $location.path('/sign-in');
      }
    });

  };


  AuthService.startupAuthenticate();

  if(AuthService.isAuthenticated()){
    if(DEBUG.isEnabled)
      console.log('Doing profile information retrieval');

    $rootScope.getInfo();
  }
  
  $rootScope.toTrustedHTML = function( html ){
    return $sce.trustAsHtml( html );
  };

  $rootScope.getCurrentLanguage = function () {
    return $translate.use();
  };

  $rootScope.listenMenuButton = function () {
    $('.navbar-toggle').on('click', function () {
      document.body.addEventListener('click', bodyClickFn, true);
    })
  };
  $rootScope.listenMenuButton()

  function bodyClickFn() {
    closeMenu();
    removeBodyClickFn();
  }

  function removeBodyClickFn() {
    document.body.removeEventListener('click', bodyClickFn, true)
  }

  function closeMenu(  ){
    $('.navbar-toggle').click();
  };

  $rootScope.$on('$viewContentLoaded', function() {
    $('.img-responsive').on('click', function () {

        $rootScope.lastImage = $(this);
    });

  });

  var removeFullscreenHandler = Fullscreen.$on('FBFullscreen.change', function(evt, isFullscreenEnabled){
    if(!isFullscreenEnabled){
      $rootScope.$evalAsync(function(){
        $rootScope.lastImage.addClass('img-responsive');
        $rootScope.lastImage.off('click', fullscreenCancel)
      });
    }
    else {
      $rootScope.$evalAsync(function(){
        $rootScope.lastImage.removeClass('img-responsive');
        $rootScope.lastImage.on('click', fullscreenCancel)

      });
    }
  });

  function fullscreenCancel() {
    Fullscreen.cancel();
  }

  $rootScope.profile = function(){
    $location.path('/profile/' + $rootScope.sesUser._id);
  };

  $rootScope.afterLogin = function () {
    $location.path('/')
  };

  $rootScope.showLogOutMenu = function() {
    bootbox.dialog({
      message: "Are you sure?",
      title: "Log off",
      backdrop: true,
      buttons: {
        cancel: {
          label: "No",
          className: "btn-danger",
          callback: function() {
          }
        },
        logoff: {
          label: "Yes!",
          className: "btn-success",
          callback: function() {

            AuthService.logout();

            $rootScope.$apply(function() {
              $rootScope.sesUser = null;
              $location.path('/sign-in');
            });

          }
        }
      }
    });
  };

  $rootScope.logOut = function() {
    $rootScope.showLogOutMenu();

  };

  $rootScope.isActive = function (viewLocation) {
    var path;
    var splitted = $location.path().split("/");
    if(splitted.length > 2){
      path = '/'+splitted[1];
    }
    else {
      path = $location.path();
    }

    return viewLocation === path;
  };

});

function errorHandler(error) {
  console.log(error.message);
}

app.directive('onErrorSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.onErrorSrc) {
          attrs.$set('src', attrs.onErrorSrc);
        }
      });
    }
  }
});

app.directive('myOnKeyUpCall', function () {
  return function (scope, element, attrs) {
    element.bind("keyup", function (event) {
      if(element.val().length >= 3){
        scope.$apply(function (){
          scope.$eval(attrs.myOnKeyUpCall);
        });
        //event.preventDefault();
      }
      else if (element.val().length == 0){
        scope.$apply(function (){
          scope.getPosts();
        });
      }
    });
  };
});