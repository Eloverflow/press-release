'use strict';

angular.module('starter.controllers')

.controller('PostsCtrl', function($scope, getReq, delReq, $location, $sce) {


  $scope.deletePost = function (id) {

      var $url = 'http://localhost/api/post/' + id;

      var $callbackFunction = function (response) {
        $scope.posts.splice(id, 1);
        console.log(response);
        //$location.path("#!/posts");
      };

      if(confirm('Are you sure you want to delete this Post ?'))
      delReq.send($url, null, $callbackFunction);

  };


    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    }

  $scope.editPost = function (post_id) {
    $location.path('/post-edit/'+post_id)
  };
  
  $scope.getPosts = function () {

      var $url = 'http://localhost/api/post';
    /*
       $callbackPath = '/cloth/type/' + $stateParams.type;*/

      var $callbackFunction = function (response) {
        //$location.path("/");
        //$rootScope.updatePostList();
        console.log(response);
        $scope.posts = response;
      };

      getReq.send($url, null, $callbackFunction);
    };
  $scope.getPosts();
  

  })


    .factory('postReq', function ($http, $location) {

      return {
        send: function($url, $data, $callbackPath, $callbackFunction) {
          $http({
            url: $url,
            method: "POST",
            data: $data
          }).success(function (data) {/*
           console.log(data);*/

            if($callbackPath)
              $location.path($callbackPath);

            if($callbackFunction)
              $callbackFunction();

          })
              .error(function (data) {
                console.log('Error: ' + data);
              });
        }
      }
    })

    .factory('putReq', function ($http, $location) {

      return {
        send: function($url, $data, $callbackPath, $callbackFunction) {
          $http({
            url: $url,
            method: "PUT",
            data: $data
          }).success(function (data) {/*
           console.log(data);*/

            if($callbackPath)
              $location.path($callbackPath);

            if($callbackFunction)
              $callbackFunction();

          })
              .error(function (data) {
                console.log('Error: ' + data);
              });
        }
      }
    })

    .factory('getReq', function ($http, $location) {

      return {
        send: function($url, $callbackPath, $callbackFunction) {
          $http({
            method: "GET",
            crossDomain: true,
            url: $url
          }).success(function (response) {/*
           console.log(response);*/

            if($callbackPath)
              $location.path($callbackPath);

            if($callbackFunction)
              $callbackFunction(response);

          })
              .error(function (response) {
                console.log('Error: ' + response);
              });
        }
      }
    })

    .factory('delReq', function ($http, $location) {

      return {
        send: function($url, $callbackPath, $callbackFunction) {
          $http({
            method: "DELETE",
            crossDomain: true,
            url: $url
          }).success(function (response) {/*
           console.log(response);*/

            if($callbackPath)
              $location.path($callbackPath);

            if($callbackFunction)
              $callbackFunction(response);

          })
              .error(function (response) {
                console.log('Error: ' + response);
              });
        }
      }
    })