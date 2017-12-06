AdminApp.controller('AdminClientsController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminClientsServices', 'ToastService', 
		function ($rootScope, $scope, $log, $state, $mdDialog, AdminClientsServices, ToastService){

	var vm = this;

	// Datas
	vm.clients = [];
	vm.selectedClients = [];
	vm.getClients = getClients;
	vm.dialogCreateClient = dialogCreateClient;
	vm.dialogEditClient = dialogEditClient;
	vm.dialogDeleteClient = dialogDeleteClient;
	vm.dialogAssociateClientToStructures = dialogAssociateClientToStructures;
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
		return '<md-checkbox class="mdCheckboxAgGrid" ng-check="exists(client, vm.selectedClients)" ng-model="data.checked" aria-label="Selected client" ng-click="vm.toggle(data, vm.selectedClients); vm.showSelectedClients()"></md-checkbox>';
	}

    function nameCellRendererFunc() {
		return '<span style="display: block;" ng-click="vm.dialogAssociateClientToStructures($event, data)">{{ data.name }}</span>';
	}

    function onFilterChanged(value) {
	    $scope.gridOptions.api.setQuickFilter(value);
	}

	vm.getClients();

	function getClients() {
		AdminClientsServices.getClients()
			.then(function mySuccess(response) {
				$scope.gridOptions.api.setRowData(response.data);
		    }, function myError(response) {
		        $log.log("Get clients failed");
		    });
	};

	function dialogCreateClient(ev) {
	    $mdDialog.show({
	      controller: modalClientController,
	      templateUrl: 'views/dialogs/CreateClient.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Create",
	      	client: null
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedClients = [];
	      	vm.getClients();
	      	ToastService.displayToast("Client created")
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogEditClient(ev) {
		client = vm.selectedClients[0];
	    $mdDialog.show({
	      controller: modalClientController,
	      templateUrl: 'views/dialogs/CreateClient.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Edit",
	      	client: client
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedClients = [];
	      	vm.getClients();
	      	ToastService.displayToast("Client edited")
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogDeleteClient(ev) {
		if(vm.selectedClients.length === 1){
	         sentence = "Are you sure you want to delete this client ?"
	    }else{
	         sentence = "Are you sure you want to delete " + vm.selectedClients.length + " clients ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('This action is definitive.')
	        .ariaLabel('Delete client')
	        .targetEvent(ev)
	        .ok('Confirm')
	        .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedClients.length - 1; i >= 0; i--) {
	            AdminClientsServices.deleteClient(vm.selectedClients[i].id)
	               	.then(function(response){
	               		vm.selectedClients = [];
	      				vm.getClients();
	               		ToastService.displayToast("Client deleted");
	               	}, function(error){
	                  	$log.error("Error when trying to delete clients : ", error);
	            	});
	            removeItem(vm.selectedClients[i]);
	        }
	        vm.selectedClients = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(client) {
        var index = vm.clients.indexOf(client);
        if (index !== -1) {
            vm.clients.splice(index, 1);
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

    function dialogAssociateClientToStructures(ev, client) {
	    $mdDialog.show({
	      controller: AssociateUsersToClientController,
	      templateUrl: 'views/dialogs/EditingClient.html',
	      parent: angular.element(document.body),
	      locals: {
	      	client: client
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

	//Modal controllers to associate structures to client
   	function AssociateUsersToClientController($scope, $log, $mdToast, $mdDialog, AdminStructuresServices, client) {

   		// Datas
   		$scope.client = client;
   		$scope.modal = {
   			filterStructure: "structures",
   			title: "Structures for " + client.name
   		}
   		$scope.structures = [];
   		$scope.selectedStructures = [];
   		$scope.initializedSelectedStructures = [];

   		// Methods
   		$scope.apply = apply;
   		$scope.cancel = cancel;
   		$scope.exists = exists;
   		$scope.hide = hide;
   		$scope.getStructures = getStructures;
   		$scope.getStructuresInClient = getStructuresInClient;
   		$scope.toggle = toggle;

   		function apply() {
   			var tmpDeleteStructure = $scope.initializedSelectedStructures;
   			var tmpAddStructure = $scope.selectedStructures;
   			var idx = -1;
	      	for (var i = tmpDeleteStructure.length - 1; i >= 0; i--) {
	      		notFound = true;
	      		for (var j = tmpAddStructure.length - 1; j >= 0 && notFound; j--) {
	    			if (tmpDeleteStructure[i].id == tmpAddStructure[j].id) {
	    				tmpDeleteStructure.splice(i, 1);
	    				tmpAddStructure.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDeleteStructure.length - 1; i >= 0; i--) {
   				AdminStructuresServices.deleteStructureClient(tmpDeleteStructure[i].id, client.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Delete structures by client failed");
				    });
   			}
   			for (var i = tmpAddStructure.length - 1; i >= 0; i--) {
   				AdminStructuresServices.associateStructureClient(tmpAddStructure[i].id, client.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Associate structures by client failed");
				    });
   			}

   			$scope.hide();
   		}

	   	function toggle (item, list) {
	      	var idx = -1;
	      	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].id == item.id)
	    			idx = i;
	    	}
	      	if (idx > -1) {
				list.splice(idx, 1);
	      	}
	      	else {
	         	list.push({id: item.id});
	      	}
	    }

	    function exists (item, list) {
	    	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].id == item.id)
	    			return true;
	    	}
	    	return false;
	      	// return list.indexOf(item.id) > -1;
	   	}

   		function getStructures() {
			AdminStructuresServices.getStructures()
				.then(function mySuccess(response) {
					$scope.structures = response.data;
			    }, function myError(response) {
			        $log.log("Get structures failed");
			    });
		}

		function getStructuresInClient() {
			AdminStructuresServices.getStructuresInClient(client.id)
				.then(function mySuccess(response) {
					$scope.selectedStructures = angular.copy(response.data);
					$scope.initializedSelectedStructures = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get structures in client failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getStructures();
		$scope.getStructuresInClient();
   	}

   	//Modal controllers to create client
   	function modalClientController($scope, $log, $mdToast, $mdDialog, AdminClientsServices, type, client) {

   		// Datas
   		$scope.newClient = angular.copy(client);
   		$scope.type = type;

   		// Methods
   		$scope.cancel = cancel;
   		$scope.save = save;

   		function cancel() {
	       	$mdDialog.cancel();
	    }

	    function save(newClient) {
	    	if (type == "Create") {
		    	AdminClientsServices.createClient(newClient)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create client failed");
				    });
			}
			else {
				AdminClientsServices.updateClient(newClient, client.id)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create client failed");
				    });
			}
	    }
   	}
}]);