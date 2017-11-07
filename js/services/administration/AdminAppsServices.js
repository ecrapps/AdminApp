AdminApp.factory('AdminAppsServices', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {
    var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getApps = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getApps" 
	    });
    }

    factory.createApp = function(appName) {
    	var data = {
	        appName : appName
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createApp", 
        	data: data
	    });
    }

    factory.updateApp = function(appName, idApp) {
        var data = {
            appName : appName,
            idApp : idApp
        };
        return $http({
            method : "POST",
            url : url_api + "updateApp", 
            data: data
        });
    }

    factory.deleteApp = function(idApp) {
        var data = {
            idApp : idApp
        };
        return $http({
            method : "POST",
            url : url_api + "deleteApp", 
            data: data
        });
    }

    factory.getAppsInUser = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "GET",
            url : url_api + "getAppsInUser", 
            params: data
        });
    }

    return factory;
}]);