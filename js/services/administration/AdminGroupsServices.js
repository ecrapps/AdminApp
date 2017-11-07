AdminApp.factory('AdminGroupsServices', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {
    var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getGroups = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getGroups" 
	    });
    }

    factory.createGroup = function(groupName) {
    	var data = {
	        groupName : groupName
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createGroup", 
        	data: data
	    });
    }

    factory.updateGroup = function(groupName, idGroup) {
        var data = {
            groupName : groupName,
            idGroup : idGroup
        };
        return $http({
            method : "POST",
            url : url_api + "updateGroup", 
            data: data
        });
    }

    factory.deleteGroup = function(idGroup) {
        var data = {
            idGroup : idGroup
        };
        return $http({
            method : "POST",
            url : url_api + "deleteGroup", 
            data: data
        });
    }

    factory.deleteGroupUser = function(idGroup, idUser) {
        var data = {
            idGroup : idGroup,
            idUser : idUser
        };
        return $http({
            method : "POST",
            url : url_api + "deleteGroupUser", 
            data: data
        });
    }

    factory.associateGroupUser = function(idGroup, idUser) {
        var data = {
            idGroup : idGroup,
            idUser : idUser
        };
        return $http({
            method : "POST",
            url : url_api + "associateGroupUser", 
            data: data
        });
    }

    factory.getGroupsInUser = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "GET",
            url : url_api + "getGroupsInUser",
            params: data
        });
    }

    return factory;
}]);