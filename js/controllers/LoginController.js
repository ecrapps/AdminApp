AdminApp.controller('LoginController', ['$scope', '$state', 'LoginService', 'ToastService', '$log', function($scope, $state, LoginService, ToastService, $log) {
	
	//Data
	$scope.user = {};

	//Method
	$scope.login = function (user) {
		if(LoginService.checkLogin(user) === "success"){
			$state.go("home");
		}

		//TODO when setting
		/*LoginService.checkLogin(user)
			.then(function mySuccess(response) {
		        if (response.data) {			        			
        			$state.go("home");
        			ToastService.displayToast('Login correct !');
        		} else {
        			ToastService.displayToast("Identifiant ou mot de passe incorrect !");
        		}
		    }, function myError(response) {
		    	$log.error("response error :", response);
			});*/
	}
}]);