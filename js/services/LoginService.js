AdminApp.factory('LoginService', ['$http', 'URL_TRAIN_API', function($http, URL_TRAIN_API) {
	var fct = {};
	var url_api = URL_TRAIN_API.URL_API;

	fct.checkLogin = checkLogin;

	function checkLogin (user) {
		return $http({
		        method : "POST",
		        url : url_api + "checkLogin",
		        data : user
		    });
	};

	return fct;
}]);