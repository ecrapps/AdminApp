AdminApp.controller('AdminStructuresController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminStructuresServices', 'ToastService', 
		function ($rootScope, $scope, $log, $state, $mdDialog, AdminStructuresServices, ToastService){

	var vm = this;

	// Datas
	vm.structures = [];
	vm.selectedStructures = [];
	vm.getStructures = getStructures;
	vm.dialogCreateStructure = dialogCreateStructure;
	vm.dialogEditStructure = dialogEditStructure;
	vm.dialogDeleteStructure = dialogDeleteStructure;
	vm.dialogAssociateStructureToUsers = dialogAssociateStructureToUsers;
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
		return '<md-checkbox class="mdCheckboxAgGrid" ng-check="exists(structure, vm.selectedStructures)" ng-model="data.checked" aria-label="Selected structure" ng-click="vm.toggle(data, vm.selectedStructures); vm.showSelectedStrctures()"></md-checkbox>';
	}

    function nameCellRendererFunc() {
		return '<span style="display: block;" ng-click="vm.dialogAssociateStructureToUsers($event, data)">{{ data.name }}</span>';
	}

    function onFilterChanged(value) {
	    $scope.gridOptions.api.setQuickFilter(value);
	}

	vm.getStructures();

	function getStructures() {
		AdminStructuresServices.getStructures()
			.then(function mySuccess(response) {
				$scope.gridOptions.api.setRowData(response.data);
		    }, function myError(response) {
		        $log.log("Get structures failed");
		    });
	};

	function dialogCreateStructure(ev) {
	    $mdDialog.show({
	      controller: modalStructureController,
	      templateUrl: 'views/dialogs/CreateStructure.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	type: "Create",
	      	structure: null
	      },
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedStructures = [];
	      	vm.getStructures();
	      	ToastService.displayToast("Structure created")
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogEditStructure(ev) {
		structure = vm.selectedStructures[0];
	    $mdDialog.show({
	      controller: modalStructureController,
	      templateUrl: 'views/dialogs/CreateStructure.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	type: "Edit",
	      	structure: structure
	      },
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedStructures = [];
	      	vm.getStructures();
	      	ToastService.displayToast("Structure edited")
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogDeleteStructure(ev) {
		if(vm.selectedStructures.length === 1){
	         sentence = "Are you sure you want to delete this structure ?"
	    }else{
	         sentence = "Are you sure you want to delete " + vm.selectedStructures.length + " structures ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('This action is definitive.')
	        .ariaLabel('Delete structure')
	        .targetEvent(ev)
	        .ok('Confirm')
	        .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedStructures.length - 1; i >= 0; i--) {
	            AdminStructuresServices.deleteStructure(vm.selectedStructures[i].id)
	               	.then(function(response){
	               		vm.selectedStructures = [];
	               		vm.getStructures();
	               		ToastService.displayToast("Structure deleted");
	                  	
	               	}, function(error){
	                  	$log.error("Error when trying to delete structures : ", error);
	            	});
	            removeItem(vm.selectedStructures[i]);
	        }
	        vm.selectedStructures = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(structure) {
        var index = vm.structures.indexOf(structure);
        if (index !== -1) {
            vm.structures.splice(index, 1);
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

    function dialogAssociateStructureToUsers(ev, structure) {
	    $mdDialog.show({
	      controller: AssociateUsersToStructureController,
	      templateUrl: 'views/dialogs/GenericModalAssociate.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	structure: structure
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

	//Modal controllers to associate structures to structure
   	function AssociateUsersToStructureController($scope, $log, $mdToast, $mdDialog, AdminUsersServices, structure) {

   		// Datas
   		$scope.structure = structure;
   		$scope.modal = {
   			filter: "users",
   			title: "Users for  " + structure.name
   		}
   		$scope.rowCollection = [];
   		$scope.selectedList = [];
   		$scope.initializedSelectedList = [];

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		$scope.getUsers = getUsers;
   		$scope.getUsersInStructure = getUsersInStructure;
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
   				AdminUsersServices.deleteUserStructure(tmpDelete[i].idUser, structure.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get structures by structures failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminUsersServices.associateUserStructure(tmpAdd[i].idUser, structure.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get structures by structures failed");
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

		function getUsersInStructure() {
			AdminUsersServices.getUsersInStructure(structure.id)
				.then(function mySuccess(response) {
					$scope.selectedList = angular.copy(response.data);
					$scope.initializedSelectedList = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get users in structure failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getUsers();
		$scope.getUsersInStructure();
   	}

   	//Modal controllers to create structure
   	function modalStructureController($scope, $log, $mdToast, $mdDialog, AdminStructuresServices, type, structure) {

   		// Datas
   		$scope.newStructure = angular.copy(structure);
   		$scope.type = type;

   		// Methods
   		$scope.cancel = cancel;
   		$scope.save = save;

   		function cancel() {
	       	$mdDialog.cancel();
	    }

	    function save(newStructure) {
	    	if (type == "Create") {
		    	AdminStructuresServices.createStructure(newStructure)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create structure failed");
				    });
			}
			else {
				AdminStructuresServices.updateStructure(newStructure, structure.id)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Edit structure failed");
				    });
			}
	    }
   	}
}]);