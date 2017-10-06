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