agGrid.initialiseAgGridWithAngular1(angular);

var AdminApp = angular.module('AdminApp', 
    [
        'ngMaterial', 
        'ui.router', 
        'smart-table', 
        'ngMdIcons',
        'agGrid'
    ]
);

AdminApp.constant('URL_TRAIN_API', (function() {
  var url = "http://localhost/Ecr_api/public/index.php/Admin/";
  return {
    URL_API: url
  }
})());



AdminApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {

    // use the HTML5 History API
    // $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/login");
            

        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    '': { 
                        templateUrl: 'views/Home.html' 
                    },
                    'toolbar@home': { 
                        templateUrl: 'views/Toolbar.html'
                    },
                    'sidenav@home': { 
                        templateUrl: 'views/Sidenav.html'
                    }
                }
            })
            .state('home.apps', {
                url: 'apps',
                templateUrl: 'views/content/Apps.html'
            })
            .state('home.features', {
                url: 'features',
                templateUrl: 'views/content/Features.html'
            })
            .state('home.groups', {
                url: 'groups',
                templateUrl: 'views/content/Groups.html',
            })
            .state('home.structures', {
                url: 'structures',
                templateUrl: 'views/content/Structures.html',
            })
            .state('home.users', {
                url: 'users',
                templateUrl: 'views/content/Users.html',
            })
            .state('home.clients', {
                url: 'clients',
                templateUrl: 'views/content/Clients.html',
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/Login.html'
            })
});


