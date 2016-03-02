/*
* Front-End Lab's - v0.0.1
*
* Application Core (Scripts)
*
*/
angular
  .module('app', [
    'ui.router',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.models',
    'app.services'
  ])

  // Config Application
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('app', {
        url: '/',
        views: {
          '' : {
            templateUrl: "js/templates/home.html"
          }
        }
      })
      .state('otherPage', {
        url: '/other-page',
        views: {
          '' : {
            templateUrl: "js/templates/otherPage.html"
          }
        }
      })
      $urlRouterProvider.otherwise('/');
  });
