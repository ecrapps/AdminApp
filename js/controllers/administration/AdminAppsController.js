AdminApp.controller('AdminAppsController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminAppsServices', 'ToastService', 
		function ($rootScope, $scope, $log, $state, $mdDialog, AdminAppsServices, ToastService){

	var vm = this;

	// Datas
	vm.apps = [];
	vm.selectedApps = [];
	vm.getApps = getApps;
	vm.dialogCreateApp = dialogCreateApp;
	vm.dialogEditApp = dialogEditApp;
	vm.dialogDeleteApp = dialogDeleteApp;
	vm.dialogAssociateAppToUsers = dialogAssociateAppToUsers;
	vm.exists = exists;
	$scope.onFilterChanged = onFilterChanged;
	vm.removeItem = removeItem;
	vm.setWidthAndHeight = setWidthAndHeight;
	vm.toggle = toggle;

	// ag-grid data
	vm.sortReverse = false;
	vm.sortType = 'Name';

    var columnDefs = [
	   {headerName: "", field: "checked", width: 80, cellRenderer: checkedCellRendererFunc, suppressSizeToFit: true, suppressFilter: true},
	   {headerName: "Name", field: "name", cellRenderer: nameCellRendererFunc}
	];

	$scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        angularCompileRows: true,
        enableColResize : true,
        enableSorting : true,
	    onGridReady: function(params) {
	    	//using setTimeout because 
	    	//gridReady get's called before data is bound
            setTimeout(function(){
             	params.api.sizeColumnsToFit();
            }, 1000);
	    }
    };
    // end ag-grid data

    var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	var contentElement = document.querySelector('#contentElement');
	var myGrid = document.querySelector('#myGrid');

	// Methods
	function setWidthAndHeight(width, height, element) {
    	if (width != '' && element !== null) {
    		element.style.width = width;
    	}
    	if (height != '' && element !== null) {
    		element.style.height = height;
    	}
	}

	if (y > 870) {
		setWidthAndHeight('', '89%', contentElement);
	} else {
		setWidthAndHeight('', '85%', contentElement);
	}

	if (y > 870) {
		setWidthAndHeight('', '78%', myGrid);
	} else {
		setWidthAndHeight('', '70%', myGrid);
	}

    function checkedCellRendererFunc() {
		return '<md-checkbox class="mdCheckboxAgGrid" ng-check="exists(app, vm.selectedApps)" ng-model="data.checked" aria-label="Selected app" ng-click="vm.toggle(data, vm.selectedApps); vm.showSelectedApps()"></md-checkbox>';
	}

    function nameCellRendererFunc() {
		return '<span style="display: block;" ng-click="vm.dialogAssociateAppToUsers($event, data)">{{ data.name }}</span>';
	}

    function onFilterChanged(value) {
	    $scope.gridOptions.api.setQuickFilter(value);
	}

	vm.getApps();

	function getApps() {
		AdminAppsServices.getApps()
			.then(function mySuccess(response) {
				$scope.gridOptions.api.setRowData(response.data);
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
					ToastService.displayToast("App created")
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
	      			ToastService.displayToast("App edited")
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
	               		vm.selectedApps = [];
				        vm.getApps();
	               		ToastService.displayToast("App deleted");
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

	function exists (item, list) {
		return list.indexOf(item) > -1;
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