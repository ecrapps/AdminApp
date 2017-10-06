AdminApp.controller('AdminClientsController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminClientsServices', 'ToastService', function ($rootScope, $scope, $log, $state, $mdDialog, AdminClientsServices, ToastService){

	var vm = this;

	// Datas
	vm.clients = [];
	vm.selectedClients = [];

	// Methods
	vm.getClients = getClients;
	vm.dialogCreateClient = dialogCreateClient;
	vm.dialogEditClient = dialogEditClient;
	vm.dialogDeleteClient = dialogDeleteClient;
	vm.dialogAssociateClientToUsers = dialogAssociateClientToUsers;
	vm.removeItem = removeItem;
	vm.toggle = toggle;

	vm.getClients();

	function getClients() {
		AdminClientsServices.getClients()
			.then(function mySuccess(response) {
				vm.clients = response.data;
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
	               		ToastServices.displayToast("Client deleted");
	                  	
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

    function dialogAssociateClientToUsers(ev, client) {
	    $mdDialog.show({
	      controller: AssociateUsersToClientController,
	      templateUrl: 'views/dialogs/GenericModalAssociate.html',
	      windowClass: 'large-Modal',
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

	//Modal controllers to associate clients to client
   	function AssociateUsersToClientController($scope, $log, $mdToast, $mdDialog, AdminUsersServices, client) {

   		// Datas
   		$scope.client = client;
   		$scope.modal = {
   			filter: "users",
   			title: "Users for "+client.name
   		}
   		$scope.rowCollection = [];
   		$scope.selectedList = [];
   		$scope.initializedSelectedList = [];

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		$scope.getUsers = getUsers;
   		$scope.getUsersInClient = getUsersInClient;
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
   				AdminUsersServices.deleteUserClient(tmpDelete[i].idUser, client.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get clients by clients failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminUsersServices.associateUserClient(tmpAdd[i].idUser, client.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get clients by clients failed");
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

		function getUsersInClient() {
			AdminUsersServices.getUsersInClient(client.id)
				.then(function mySuccess(response) {
					$scope.selectedList = angular.copy(response.data);
					$scope.initializedSelectedList = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get users in client failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getUsers();
		$scope.getUsersInClient();
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