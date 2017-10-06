AdminApp.controller('ContentController', ['$scope', 'TaskService', '$mdDialog' , function ($scope, TaskService, $mdDialog) {
    
    // Data
    $scope.addComment = addComment;
    $scope.createComment = false;
    $scope.openMenu = openMenu;
    $scope.showAdvanced = showAdvanced;
    $scope.tasks = getTasks();

    // Methods
	function addComment (){
      	$scope.createComment = !$scope.createComment;
    }

    function getTasks (){
    	return TaskService.getTasks();
    }

    function openMenu ($mdOpenMenu, ev){
      	$mdOpenMenu(ev);	
    }

	function showAdvanced(task, ev) {
		$mdDialog.show({
		  autoWrap: true,
		  controller : CommentsDialogController,
		  templateUrl: 'views/dialogs/CommentsDialog.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true,
		  locals: {
		  	task: task
		  },
		  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {
		  console.log('You said the information was "' + answer + '".');
		}, function() {
		  console.log('You cancelled the dialog.');
		});
	}


	function CommentsDialogController($scope, $mdDialog, task){
		$scope.task = task;

		$scope.hide = function() {
		  $mdDialog.hide();
		};

		$scope.cancel = function() {
		  $mdDialog.cancel();
		};

		$scope.answer = function(answer) {
		  $mdDialog.hide(answer);
		};
	}

}]);