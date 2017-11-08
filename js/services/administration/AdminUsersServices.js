AdminApp.factory('AdminUsersServices', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {
    var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getUsers = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getUsers", 
	    });
    }

    factory.createUser = function(user) {
    	return $http({
        	method : "POST",
        	url : url_api + "createUser", 
        	data: user
	    });
    }

    factory.updateUser = function(userRaw) {
        var user = {
            id : userRaw.id,
            name : userRaw.name,
            username : userRaw.username,
            email : userRaw.email,
            status : userRaw.status,
        }

        return $http({
            method : "POST",
            url : url_api + "updateUser", 
            data: user
        });
    }

    factory.deleteUser = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "POST",
            url : url_api + "deleteUser", 
            data: data
        });
    }

    factory.deleteUserApp = function(idUser, idApp) {
        var data = {
            idUser : idUser,
            idApp : idApp
        };
        return $http({
            method : "POST",
            url : url_api + "deleteUserApp", 
            data: data
        });
    }

    factory.associateUserApp = function(idUser, idApp) {
        var data = {
            idUser : idUser,
            idApp : idApp
        };
        return $http({
            method : "POST",
            url : url_api + "associateUserApp", 
            data: data
        });
    }

    factory.getUsersInApp = function(idApp) {
        var data = {
            idApp : idApp
        };
        return $http({
            method : "GET",
            url : url_api + "getUsersInApp",
            params: data
        });
    }

    factory.deleteUserClient = function(idUser, idClient) {
        var data = {
            idUser : idUser,
            idClient : idClient
        };
        return $http({
            method : "POST",
            url : url_api + "deleteUserClient", 
            data: data
        });
    }

    factory.associateUserClient = function(idUser, idClient) {
        var data = {
            idUser : idUser,
            idClient : idClient
        };
        return $http({
            method : "POST",
            url : url_api + "associateUserClient", 
            data: data
        });
    }

    factory.getUsersInClient = function(idClient) {
        var data = {
            idClient : idClient
        };
        return $http({
            method : "GET",
            url : url_api + "getUsersInClient",
            params: data
        });
    }

    factory.deleteUserStructure = function(idUser, idStructure) {
        var data = {
            idUser : idUser,
            idStructure : idStructure
        };
        return $http({
            method : "POST",
            url : url_api + "deleteUserStructure", 
            data: data
        });
    }

    factory.associateUserStructure = function(idUser, idStructure) {
        var data = {
            idUser : idUser,
            idStructure : idStructure
        };
        return $http({
            method : "POST",
            url : url_api + "associateUserStructure", 
            data: data
        });
    }

    factory.getUsersInStructure = function(idStructure) {
        var data = {
            idStructure : idStructure
        };
        return $http({
            method : "GET",
            url : url_api + "getUsersInStructure",
            params: data
        });
    }

    factory.getUserFeatures = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "GET",
            url : url_api + "getUserFeatures",
            params: data
        });
    }

    return factory;
}]);