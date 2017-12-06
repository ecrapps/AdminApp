AdminApp.controller('AdminFeaturesController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminFeaturesServices', 'ToastService', function ($rootScope, $scope, $log, $state, $mdDialog, AdminFeaturesServices, ToastService){

	var vm = this;

	// Datas
	vm.apps = [];
	vm.selectedFeatures = [];

	// Methods
	vm.getFeaturesByApps = getFeaturesByApps;
	vm.dialogCreateFeature = dialogCreateFeature;
	vm.dialogEditFeature = dialogEditFeature;
	vm.dialogDeleteFeature = dialogDeleteFeature;
	vm.removeItem = removeItem;
	vm.toggle = toggle;
	vm.exists = exists;

	vm.getFeaturesByApps();

	function getFeaturesByApps() {
		AdminFeaturesServices.getFeaturesByApps()
			.then(function mySuccess(response) {
				vm.apps = response.data;
		    }, function myError(response) {
		        $log.log("Get features by apps failed");
		    });
	}

	function dialogCreateFeature(ev) {
	    $mdDialog.show({
	      controller: createFeatureController,
	      templateUrl: 'views/dialogs/CreateFeature.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	      vm.getFeaturesByApps();
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogEditFeature(ev) {
		feature = vm.selectedFeatures[0];
	    var confirm = $mdDialog.prompt()
	      .title('Edit feature')
	      .placeholder('Feature')
	      .ariaLabel('Feature')
	      .initialValue(feature.name)
	      .targetEvent(ev)
	      .ok('Save')
	      .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(result) {
		    AdminFeaturesServices.updateFeature(result, feature.id)
		    	.then(function mySuccess(response) {
					feature.name = result;
			    }, function myError(response) {
			        $log.log("Edit feature failed");
			    });
	    }, function() {
	      ;
	    });
	};

	function dialogDeleteFeature(ev) {
		if(vm.selectedFeatures.length === 1){
	         sentence = "Are you sure you want to delete this feature ?"
	    }else{
	         sentence = "Are you sure you want to delete " + vm.selectedFeatures.length + " features ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('This action is definitive .')
	        .ariaLabel('Delete fonctionnalité')
	        .targetEvent(ev)
	        .ok('Confirm')
	        .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedFeatures.length - 1; i >= 0; i--) {
	            AdminFeaturesServices.deleteFeature(vm.selectedFeatures[i].id)
	               	.then(function(response){
	               		ToastService.displayToast("Feature deleted");
	                  	
	               	}, function(error){
	                  	$log.error("Error when trying to delete features : ", error);
	            	});
	            removeItem(vm.selectedFeatures[i]);
	        }
	        vm.selectedFeatures = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(feature) {
    	for (var i = vm.apps.length - 1; i >= 0; i--) {
	        var index = vm.apps[i].features.indexOf(feature);
	        if (index !== -1) {
	            vm.apps[i].features.splice(index, 1);
	        }
    	}
    };

    function toggle (item, list) {
	  	var idx = list.indexOf(item);
	  	if (idx > -1) {
			list.splice(idx, 1);
	  	}
	  	else {
			list.push(item);
	  	}
	}

	function exists (item, list) {
      	return list.indexOf(item) > -1;
   	}

	//Modal controllers to create feature
   	function createFeatureController($scope, $log, $mdToast, $mdDialog, AdminFeaturesServices, AdminAppsServices) {
   		// Datas
   		$scope.apps = [];
   		$scope.newFeature = {};

   		// Methods
   		$scope.cancel = cancel;
   		$scope.save = save;
   		$scope.getApps = getApps;

   		$scope.getApps();

		function getApps() {
			AdminAppsServices.getApps()
				.then(function mySuccess(response) {
					$scope.apps = response.data;
			    }, function myError(response) {
			        $log.log("Get apps failed");
			    });
		};

   		function cancel() {
	       	$mdDialog.cancel();
	    }

	    function save(newFeature) {
	    	AdminFeaturesServices.createFeature(newFeature)
				.then(function mySuccess(response) {
					$mdDialog.hide();
			    }, function myError(response) {
			        $log.log("Create feature failed");
			    });
	    }
   	}
}]);