AdminApp.factory('AdminStructuresServices', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {
    var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getStructures = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getStructures" 
	    });
    }

    factory.createStructure = function(newStructure) {
    	var data = {
            structureName : newStructure.name,
	        structureAbreviation : newStructure.abreviation
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createStructure", 
        	data: data
	    });
    }

    factory.updateStructure = function(structure, idStructure) {
        var data = {
            structureName : structure.name,
            structureAbreviation : structure.abreviation,
            idStructure : idStructure
        };
        return $http({
            method : "POST",
            url : url_api + "updateStructure", 
            data: data
        });
    }

    factory.deleteStructure = function(idStructure) {
        var data = {
            idStructure : idStructure
        };
        return $http({
            method : "POST",
            url : url_api + "deleteStructure", 
            data: data
        });
    }

    factory.associateStructureUser = function(idStructure, idUser) {
        var data = {
            idStructure : idStructure,
            idUser : idUser
        };
        return $http({
            method : "POST",
            url : url_api + "associateStructureUser", 
            data: data
        });
    }

    factory.deleteStructureUser = function(idStructure, idUser) {
        var data = {
            idStructure : idStructure,
            idUser : idUser
        };
        return $http({
            method : "POST",
            url : url_api + "deleteStructureUser", 
            data: data
        });
    }

    factory.associateStructureClient = function(idStructure, idClient) {
        var data = {
            idStructure : idStructure,
            idClient : idClient
        };
        return $http({
            method : "POST",
            url : url_api + "associateStructureClient", 
            data: data
        });
    }

    factory.getStructuresInClient = function(idClient) {
        var data = {
            idClient : idClient
        };
        return $http({
            method : "GET",
            url : url_api + "getStructuresInClient", 
            params: data
        });
    }

    factory.deleteStructureClient = function(idStructure, idClient) {
        var data = {
            idStructure : idStructure,
            idClient : idClient
        };
        return $http({
            method : "POST",
            url : url_api + "deleteStructureClient", 
            data: data
        });
    }

    factory.getStructuresInUser = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "GET",
            url : url_api + "getStructuresInUser", 
            params: data
        });
    }

    return factory;
}]);