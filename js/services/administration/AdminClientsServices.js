AdminApp.factory('AdminClientsServices', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {
    var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getClients = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getClients" 
	    });
    }

    factory.createClient = function(newClient) {
    	var data = {
            clientName : newClient.name,
	        clientAbreviation : newClient.abreviation
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createClient", 
        	data: data
	    });
    }

    factory.updateClient = function(client, idClient) {
        var data = {
            clientName : client.name,
            clientAbreviation : client.abreviation,
            idClient : idClient
        };
        return $http({
            method : "POST",
            url : url_api + "updateClient", 
            data: data
        });
    }

    factory.deleteClient = function(idClient) {
        var data = {
            idClient : idClient
        };
        return $http({
            method : "POST",
            url : url_api + "deleteClient", 
            data: data
        });
    }

    factory.getClientsInUser = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "GET",
            url : url_api + "getClientsInUser", 
            params: data
        });
    }

    return factory;
}]);