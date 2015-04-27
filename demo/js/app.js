angular
	.module('app', ['ngRoute'])
	.directive('ngPrism',['$interpolate', function ($interpolate) {
        "use strict";
        return {
          restrict: 'E',
          template: '<pre><code ng-transclude></code></pre>',
          replace:true,
          transclude:true
        };
    }])
	.controller('HomeController', ['$scope', function($scope){
		
		bloobyGrid.container         = false,
		bloobyGrid.containerPosition = 'center',
		bloobyGrid.breaks = [
		    {
		        point : "(min-width: 1600px)",
		        container: 1200,
		        columns : 12,
		        gutters : 1/4,
		        baseLineHeight : 24
		    },
		    {
		        point : "(min-width: 1100px)",
		        container: 960,
		        columns : 12,
		        gutters : 1/4,
		        baseLineHeight : 24
		    },
		    {
		        point : "(min-width: 750px)",
		        container: 650,
		        columns : 6,
		        gutters : 1/4,
		        baseLineHeight : 24
		    },
		    {
		        point : "(min-width: 300px)",
		        container: 300,
		        columns : 3,
		        gutters : 1/4,
		        baseLineHeight : 24
		    }
		];
		bloobyGrid.gridInit();

	}])
	.config(function($routeProvider, $locationProvider) {

	  $routeProvider
	  .when('/', {
	    templateUrl: 'views/home.html',
	    controller: 'HomeController'
	  })
	  .when('/1', {
	    templateUrl: 'views/example1.html',
	    controller: 'OneController'
	  })
	  .when('/2', {
	    templateUrl: 'views/example2.html',
	    controller: 'TwoController'
	  })
	  .when('/3', {
	    templateUrl: 'views/example3.html',
	    controller: 'ThreeController'
	  })
	  .otherwise({redirectTo: '/'});

	  // configure html5 to get links working on jsfiddle
	  $locationProvider.html5Mode(true);

	});