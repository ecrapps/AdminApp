AdminApp.controller('AdminAppsController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminAppsServices', 'ToastService', function ($rootScope, $scope, $log, $state, $mdDialog, AdminAppsServices, ToastService){

	var vm = this;

	// Datas
	vm.apps = [];
	vm.selectedApps = [];

	// Methods
	vm.getApps = getApps;
	vm.dialogCreateApp = dialogCreateApp;
	vm.dialogEditApp = dialogEditApp;
	vm.dialogDeleteApp = dialogDeleteApp;
	vm.dialogAssociateAppToUsers = dialogAssociateAppToUsers;
	vm.removeItem = removeItem;
	vm.toggle = toggle;

	vm.getApps();

	function getApps() {
		AdminAppsServices.getApps()
			.then(function mySuccess(response) {
				vm.apps = response.data;
		    }, function myError(response) {
		        $log.log("Get apps failed");
		    });
	};

	function dialogCreateApp(ev) {
	    var confirm = $mdDialog.prompt()
	      .title('Add application')
	      .placeholder('Name')
	      .ariaLabel('Name')
	      .targetEvent(ev)
	      .ok('Save')
	      .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(result) {
	    	AdminAppsServices.createApp(result)
		    	.then(function mySuccess(response) {
					vm.getApps();
			    }, function myError(response) {
			        $log.log("Create app failed");
			    });
	      
	    }, function() {
	      ;
	    });
	};

	function dialogEditApp(ev) {
		app = vm.selectedApps[0];
	    var confirm = $mdDialog.prompt()
	      .title('Edit application name')
	      .placeholder('Application')
	      .ariaLabel('Application')
	      .initialValue(app.name)
	      .targetEvent(ev)
	      .ok('Save')
	      .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(result) {
		    AdminAppsServices.updateApp(result, app.id)
		    	.then(function mySuccess(response) {
					app.name = result;
			    }, function myError(response) {
			        $log.log("Edit app failed");
			    });
	    }, function() {
	      ;
	    });
	};

	function dialogDeleteApp(ev) {
		if(vm.selectedApps.length === 1){
	         sentence = "Are you sure you want to delete this application ?"
	    }else{
	         sentence = "Are you sure you want to delete " + vm.selectedApps.length + " applications ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('This action is definitive.')
	        .ariaLabel('Delete application')
	        .targetEvent(ev)
	        .ok('Confirm')
	        .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedApps.length - 1; i >= 0; i--) {
	            AdminAppsServices.deleteApp(vm.selectedApps[i].id)
	               	.then(function(response){
	               		ToastServices.displayToast("App deleted");
	                  	
	               	}, function(error){
	                  	$log.error("Error when trying to delete apps : ", error);
	            	});
	            removeItem(vm.selectedApps[i]);
	        }
	        vm.selectedApps = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(app) {
        var index = vm.apps.indexOf(app);
        if (index !== -1) {
            vm.apps.splice(index, 1);
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

    function dialogAssociateAppToUsers(ev, app) {
	    $mdDialog.show({
	      controller: AssociateUsersToAppController,
	      templateUrl: 'views/dialogs/GenericModalAssociate.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	app: app
	      },
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	      
	    }, function() {
	      // Dialog closed
	    });
	};

	//Modal controllers to associate features to app
   	function AssociateUsersToAppController($scope, $log, $mdToast, $mdDialog, AdminUsersServices, app) {

   		// Datas
   		$scope.app = app;
   		$scope.modal = {
   			filter: "utilisateurs",
   			title: "Users for " + app.name
   		}
   		$scope.rowCollection = [];
   		$scope.selectedList = [];
   		$scope.initializedSelectedList = [];

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		$scope.getUsers = getUsers;
   		$scope.getUsersInApp = getUsersInApp;
   		$scope.hide = hide;
   		$scope.cancel = cancel;
   		$scope.apply = apply;

   		function apply() {
   			var tmpDelete = $scope.initializedSelectedList;
   			var tmpAdd = $scope.selectedList;
   			var idx = -1;
	      	for (var i = tmpDelete.length - 1; i >= 0; i--) {
	      		notFound = true;
	      		for (var j = tmpAdd.length - 1; j >= 0 && notFound; j--) {
	    			if (tmpDelete[i].idUser == tmpAdd[j].idUser) {
	    				tmpDelete.splice(i, 1);
	    				tmpAdd.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDelete.length - 1; i >= 0; i--) {
   				AdminUsersServices.deleteUserApp(tmpDelete[i].idUser, app.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get features by apps failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminUsersServices.associateUserApp(tmpAdd[i].idUser, app.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get features by apps failed");
				    });
   			}

   			$scope.hide();
   		}

	   	function toggle (item, list) {
	      	var idx = -1;
	      	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idUser == item.id)
	    			idx = i;
	    	}
	      	if (idx > -1) {
				list.splice(idx, 1);
	      	}
	      	else {
	         	list.push({idUser: item.id});
	      	}
	    }

	    function exists (item, list) {
	    	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idUser == item.id)
	    			return true;
	    	}
	    	return false;
	      	// return list.indexOf(item.id) > -1;
	   	}

   		function getUsers() {
			AdminUsersServices.getUsers()
				.then(function mySuccess(response) {
					$scope.rowCollection = response.data;
			    }, function myError(response) {
			        $log.log("Get users failed");
			    });
		}

		function getUsersInApp() {
			AdminUsersServices.getUsersInApp(app.id)
				.then(function mySuccess(response) {
					$scope.selectedList = angular.copy(response.data);
					$scope.initializedSelectedList = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get users in app failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getUsers();
		$scope.getUsersInApp();
   	}
}]);