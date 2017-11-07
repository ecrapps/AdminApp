AdminApp.controller('HomeController', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {	

	$scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.menus = [

        {
            name  : 'Users',
            title : 'manage users',
            state : 'home.users'
        },        
        {
            name  : 'Groups',
            title : 'manage groups',
            state : 'home.groups'
        },
        {
            name  : 'Features',
            title : 'feature\'s access',
            state : 'home.features'
        },
    	{
    		name  : 'Applications',
    		title : 'application\'s access',
            state : 'home.apps'
    	},
    	{
    		name  : 'Structures',
    		title : 'manage structures',
            state : 'home.structures'
    	},
        {
            name  : 'Clients',
            title : 'manage clients',
            state : 'home.clients'
        }
    ];

}]);