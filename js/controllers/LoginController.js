AdminApp.controller('LoginController', ['$scope', '$state', 'LoginService', 'ToastService', '$log', 'IdSessionService', 
	function($scope, $state, LoginService, ToastService, $log, IdSessionService) {
	
		//Data
		$scope.user = {};

		//Methods
		$scope.login = function (user) {
			LoginService.checkLogin(user)
				.then(function mySuccess(response) {
			        if (response.data.loginSucceed) {
	        			$state.go("home");
	        			ToastService.displayToast('Login successful !');
	        			IdSessionService.setIdSession(response.data.user);
	        		} else {
	        			ToastService.displayToast("Incorrect username or password !");
	        		}
			    }, function myError(response) {
			    	$log.error("response error :", response);
				});
		}
}]);