AdminApp.controller('AdminUsersController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminUsersServices', 'ToastService', 
		function ($rootScope, $scope, $log, $state, $mdDialog, AdminUsersServices, ToastService){

	var vm = this;

	// Datas
	vm.users = [];
	vm.selectedUsers = [];

	// Methods
	vm.getUsers = getUsers;
	vm.dialogUserInfos = dialogUserInfos;
	vm.dialogCreateUser = dialogCreateUser;
	vm.dialogEditUser = dialogEditUser;
	vm.dialogDeleteUser = dialogDeleteUser;
	vm.dialogAssociateUserToGroups = dialogAssociateUserToGroups;
	vm.removeItem = removeItem;
	vm.toggle = toggle;
	vm.exists = exists;

	vm.getUsers();

	function getUsers() {
		AdminUsersServices.getUsers()
			.then(function mySuccess(response) {
				vm.users = response.data;
		    }, function myError(response) {
		        $log.log("Get users failed");
		    });
	};

	function dialogUserInfos(ev) {
		user = vm.selectedUsers[0];
	    $mdDialog.show({
	      controller: userInfosController,
	      templateUrl: 'views/dialogs/UserInfos.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	user: user
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {

	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogCreateUser(ev) {
	    $mdDialog.show({
	      controller: modalUserController,
	      templateUrl: 'views/dialogs/CreateUser.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Créer",
	      	user: null
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	// vm.selectedUsers = null;
	      	vm.getUsers();
	      	vm.selectedUsers = [];
	      	ToastService.displayToast("User created")
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogEditUser(ev) {
		user = vm.selectedUsers[0];
	    $mdDialog.show({
	      controller: modalUserController,
	      templateUrl: 'views/dialogs/CreateUser.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Edit",
	      	user: user
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	// vm.selectedUsers = null;
	      	vm.getUsers();
	      	ToastService.displayToast("User edited")
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogDeleteUser(ev) {
		if(vm.selectedUsers.length === 1){
	         sentence = "Are you sure you want to delete this user ?"
	    }else{
	         sentence = "Are you sure you want to delete " + vm.selectedUsers.length + " users ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('This action is definitive.')
	        .ariaLabel('Delete user')
	        .targetEvent(ev)
	        .ok('Confirm')
	        .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedUsers.length - 1; i >= 0; i--) {
	            AdminUsersServices.deleteUser(vm.selectedUsers[i].id)
	               	.then(function(response){
	               		ToastService.displayToast("User deleted");
	               	}, function(error){
	                  	$log.error("Error when trying to delete users : ", error);
	            	});
	            removeItem(vm.selectedUsers[i]);
	        }
	        vm.getUsers();
	        vm.selectedUsers = [];
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(user) {
        var index = vm.users.indexOf(user);
        if (index !== -1) {
            vm.users.splice(index, 1);
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

    function dialogAssociateUserToGroups(ev, user) {
	    $mdDialog.show({
	      controller: AssociateGroupsToUserController,
	      templateUrl: 'views/dialogs/GenericModalAssociate.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	user: user
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

	//Modal controllers to associate users to user
   	function AssociateGroupsToUserController($scope, $log, $mdToast, $mdDialog, AdminGroupsServices, user) {

   		// Datas
   		$scope.user = user;
   		$scope.modal = {
   			filter: "groups",
   			title: "Groups for " + user.name
   		}
   		$scope.rowCollection = [];
   		$scope.selectedList = [];
   		$scope.initializedSelectedList = [];

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		$scope.getGroups = getGroups;
   		$scope.getGroupsInUser = getGroupsInUser;
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
	    			if (tmpDelete[i].idGroup == tmpAdd[j].idGroup) {
	    				tmpDelete.splice(i, 1);
	    				tmpAdd.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDelete.length - 1; i >= 0; i--) {
   				AdminGroupsServices.deleteGroupUser(tmpDelete[i].idGroup, user.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get users by users failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminGroupsServices.associateGroupUser(tmpAdd[i].idGroup, user.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get users by users failed");
				    });
   			}

   			$scope.hide();
   		}

	   	function toggle (item, list) {
	      	var idx = -1;
	      	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idGroup == item.id)
	    			idx = i;
	    	}
	      	if (idx > -1) {
				list.splice(idx, 1);
	      	}
	      	else {
	         	list.push({idGroup: item.id});
	      	}
	    }

	    function exists (item, list) {
	    	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idGroup == item.id)
	    			return true;
	    	}
	    	return false;
	      	// return list.indexOf(item.id) > -1;
	   	}

   		function getGroups() {
			AdminGroupsServices.getGroups()
				.then(function mySuccess(response) {
					$scope.rowCollection = response.data;
			    }, function myError(response) {
			        $log.log("Get groups failed");
			    });
		}

		function getGroupsInUser() {
			AdminGroupsServices.getGroupsInUser(user.id)
				.then(function mySuccess(response) {
					$scope.selectedList = angular.copy(response.data);
					$scope.initializedSelectedList = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get groups in user failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getGroups();
		$scope.getGroupsInUser();
   	}

   	//Modal controllers to create user
   	function modalUserController($scope, $log, $mdToast, $mdDialog, AdminUsersServices, type, user) {

   		// Datas
   		$scope.newUser = angular.copy(user);
   		$scope.type = type;

   		// Methods
   		$scope.cancel = cancel;
   		$scope.save = save;

   		initUserStatus();

   		function cancel() {
	       	$mdDialog.cancel();
	    }

	    function initUserStatus() {
	    	if (!$scope.newUser) {
	    		$scope.newUser = {};
	    		$scope.newUser.status = 0;
	    	}
	    }

	    function save(newUser) {
	    	if (type == "Créer") {
		    	AdminUsersServices.createUser(newUser)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create user failed");
				    });
			}
			else {
				AdminUsersServices.updateUser(newUser)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Update user failed");
				    });
			}
	    }
   	}

   	function userInfosController($scope, AdminUsersServices, AdminGroupsServices, AdminAppsServices, AdminStructuresServices, user) {

   		// Datas
   		$scope.user = user;
   		$scope.groups = [];
   		$scope.apps = [];
   		$scope.structures = [];
   		$scope.userFeatures = [];

   		// Methods
   		$scope.cancel = cancel;
   		$scope.getGroupsInUser = getGroupsInUser;
   		$scope.getAppsInUser = getAppsInUser;
   		$scope.getStructuresInUser = getStructuresInUser;
   		$scope.getUserFeatures = getUserFeatures;

   		getGroupsInUser();
   		getAppsInUser();
   		getStructuresInUser();
   		getUserFeatures();

   		function getGroupsInUser() {
			AdminGroupsServices.getGroupsInUser(user.id)
				.then(function mySuccess(response) {
					$scope.groups = response.data;
			    }, function myError(response) {
			        $log.log("Get groups in user failed");
			    });
		}

		function getAppsInUser() {
			AdminAppsServices.getAppsInUser(user.id)
				.then(function mySuccess(response) {
					$scope.apps = response.data;
			    }, function myError(response) {
			        $log.log("Get apps in user failed");
			    });
		}

		function getStructuresInUser() {
			AdminStructuresServices.getStructuresInUser(user.id)
				.then(function mySuccess(response) {
					$scope.structures = response.data;
			    }, function myError(response) {
			        $log.log("Get structures in user failed");
			    });
		}

		function getUserFeatures() {
			AdminUsersServices.getUserFeatures(user.id)
				.then(function mySuccess(response) {
					$scope.userFeatures = response.data;
			    }, function myError(response) {
			        $log.log("Get user features failed");
			    });
		}

   		function cancel() {
	       	$mdDialog.cancel();
	    }
   	}
}]);