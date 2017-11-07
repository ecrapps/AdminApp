AdminApp.factory('AdminFeaturesServices', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {
	var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getFeatures = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getFeatures" 
	    });
    }

    factory.getFeaturesByApps = function() {
        return $http({
            method : "GET",
            url : url_api + "getFeaturesByApps" 
        });
    }

    factory.getFeaturesInGroup = function(idGroup) {
        var data = {
            idGroup : idGroup
        };
        return $http({
            method : "GET",
            url : url_api + "getFeaturesInGroup",
            params: data
        });
    }

    factory.createFeature = function(newFeature) {
    	var data = {
            idApp : newFeature.app,
	        featureName : newFeature.name
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createFeature", 
        	data: data
	    });
    }

    factory.updateFeature = function(featureName, idFeature) {
        var data = {
            featureName : featureName,
            idFeature : idFeature
        };
        return $http({
            method : "POST",
            url : url_api + "updateFeature", 
            data: data
        });
    }

    factory.deleteFeature = function(idFeature) {
        var data = {
            idFeature : idFeature
        };
        return $http({
            method : "POST",
            url : url_api + "deleteFeature", 
            data: data
        });
    }

    factory.deleteFeatureGroup = function(idFeature, idGroup) {
        var data = {
            idFeature : idFeature,
            idGroup : idGroup
        };
        return $http({
            method : "POST",
            url : url_api + "deleteFeatureGroup", 
            data: data
        });
    }

    factory.associateFeatureGroup = function(idFeature, idGroup) {
        var data = {
            idFeature : idFeature,
            idGroup : idGroup
        };
        return $http({
            method : "POST",
            url : url_api + "associateFeatureGroup", 
            data: data
        });
    }

    return factory;
}]);