AdminApp.controller('AdminGroupsController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminGroupsServices', 'ToastService', 
		function ($rootScope, $scope, $log, $state, $mdDialog, AdminGroupsServices, ToastService){

	var vm = this;

	// Datas
	vm.groups = [];
	vm.selectedGroups = [];
	vm.getGroups = getGroups;
	vm.dialogCreateGroup = dialogCreateGroup;
	vm.dialogEditGroup = dialogEditGroup;
	vm.dialogDeleteGroup = dialogDeleteGroup;
	vm.dialogAssociateGroupToFeatures = dialogAssociateGroupToFeatures;
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
		return '<md-checkbox class="mdCheckboxAgGrid" ng-check="exists(group, vm.selectedGroups)" ng-model="data.checked" aria-label="Selected group" ng-click="vm.toggle(data, vm.selectedGroups); vm.showSelectedGroups()"></md-checkbox>';
	}

    function nameCellRendererFunc() {
		return '<span style="display: block;" ng-click="vm.dialogAssociateGroupToFeatures($event, data)">{{ data.name }}</span>';
	}

    function onFilterChanged(value) {
	    $scope.gridOptions.api.setQuickFilter(value);
	}

	vm.getGroups();

	function getGroups() {
		AdminGroupsServices.getGroups()
			.then(function mySuccess(response) {
				$scope.gridOptions.api.setRowData(response.data);
		    }, function myError(response) {
		        $log.log("Get groups failed");
		    });
	};

	function dialogCreateGroup(ev) {
	    var confirm = $mdDialog.prompt()
	      .title('Add group')
	      .placeholder('Name')
	      .ariaLabel('Name')
	      .targetEvent(ev)
	      .ok('Save')
	      .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(result) {
	    	AdminGroupsServices.createGroup(result)
		    	.then(function mySuccess(response) {
					vm.getGroups();
	      			ToastService.displayToast("Group created")
			    }, function myError(response) {
			        $log.log("Create group failed");
			    });
	      
	    }, function() {
	      ;
	    });
	};

	function dialogEditGroup(ev) {
		group = vm.selectedGroups[0];
	    var confirm = $mdDialog.prompt()
	      .title('Edit group name')
	      .placeholder('Group')
	      .ariaLabel('Group')
	      .initialValue(group.name)
	      .targetEvent(ev)
	      .ok('Save')
	      .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(result) {
		    AdminGroupsServices.updateGroup(result, group.id)
		    	.then(function mySuccess(response) {
					group.name = result;
	      			ToastService.displayToast("Group edited")
			    }, function myError(response) {
			        $log.log("Edit group failed");
			    });
	    }, function() {
	      ;
	    });
	};

	function dialogDeleteGroup(ev) {
		if(vm.selectedGroups.length === 1){
	         sentence = "Are you sure you want to delete this group ?"
	    }else{
	         sentence = "Are you sure you want to delete " + vm.selectedGroups.length + " groups ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('This action is definitive .')
	        .ariaLabel('Delete groupe')
	        .targetEvent(ev)
	        .ok('Confirm')
	        .cancel('Cancel');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedGroups.length - 1; i >= 0; i--) {
	            AdminGroupsServices.deleteGroup(vm.selectedGroups[i].id)
	               	.then(function(response){
	               		vm.selectedGroups = [];
				        vm.getGroups();
	               		ToastService.displayToast("Group deleted");
	               	}, function(error){
	                  	$log.error("Error when trying to delete groups : ", error);
	            	});
	            removeItem(vm.selectedGroups[i]);
	        }
	        vm.selectedGroups = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(group) {
        var index = vm.groups.indexOf(group);
        if (index !== -1) {
            vm.groups.splice(index, 1);
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

    function dialogAssociateGroupToFeatures(ev, group) {
	    $mdDialog.show({
	      controller: AssociateFeaturesToGroupController,
	      templateUrl: 'views/dialogs/AssociateFeaturesToGroup.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	group: group
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

	//Modal controllers to associate features to group
   	function AssociateFeaturesToGroupController($scope, $log, $mdToast, $mdDialog, AdminFeaturesServices, group) {

   		// Datas
   		$scope.group = group;
   		$scope.apps = [];
   		$scope.selectedFeatures = [];
   		$scope.initializedSelectedFeatures = [];

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		$scope.getFeaturesByApps = getFeaturesByApps;
   		$scope.getFeaturesInGroup = getFeaturesInGroup;
   		$scope.hide = hide;
   		$scope.cancel = cancel;
   		$scope.apply = apply;

   		function apply() {
   			var tmpDelete = $scope.initializedSelectedFeatures;
   			var tmpAdd = $scope.selectedFeatures;
   			var idx = -1;
	      	for (var i = tmpDelete.length - 1; i >= 0; i--) {
	      		notFound = true;
	      		for (var j = tmpAdd.length - 1; j >= 0 && notFound; j--) {
	    			if (tmpDelete[i].idFeature == tmpAdd[j].idFeature) {
	    				tmpDelete.splice(i, 1);
	    				tmpAdd.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDelete.length - 1; i >= 0; i--) {
   				AdminFeaturesServices.deleteFeatureGroup(tmpDelete[i].idFeature, group.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get features by apps failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminFeaturesServices.associateFeatureGroup(tmpAdd[i].idFeature, group.id)
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
	    		if (list[i].idFeature == item.id)
	    			idx = i;
	    	}
	      	if (idx > -1) {
				list.splice(idx, 1);
	      	}
	      	else {
	         	list.push({idFeature: item.id});
	      	}
	    }

	    function exists (item, list) {
	    	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idFeature == item.id)
	    			return true;
	    	}
	    	return false;
	      	// return list.indexOf(item.id) > -1;
	   	}

   		function getFeaturesByApps() {
			AdminFeaturesServices.getFeaturesByApps()
				.then(function mySuccess(response) {
					$scope.apps = response.data;
			    }, function myError(response) {
			        $log.log("Get features by apps failed");
			    });
		}

		function getFeaturesInGroup() {
			AdminFeaturesServices.getFeaturesInGroup(group.id)
				.then(function mySuccess(response) {
					$scope.selectedFeatures = angular.copy(response.data);
					$scope.initializedSelectedFeatures = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get features in group failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getFeaturesByApps();
		$scope.getFeaturesInGroup();
   	}
}]);