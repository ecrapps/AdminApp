AdminApp.controller('ToolbarController', ['$scope', 'IdSessionService', '$state', '$mdDialog', '$filter',
	function($scope, IdSessionService, $state, $mdDialog, $filter) {
	
		//Data
		$scope.user = IdSessionService.getIdSession();
		$scope.logout = logout;

		//METHOD

		function logout(ev){
			var title = "Logout";//$filter('translate')('TOOLBAR.DIALOG.TITLE');
			var textContent = "Are you sure you want to logout ?";//$filter('translate')('TOOLBAR.DIALOG.LOGOUT_CONFIRM_MESSAGE');
			var ok = "Logout";//$filter('translate')('TOOLBAR.DIALOG.CONFIRM_BUTTON');
			var cancel = "Cancel";//$filter('translate')('TOOLBAR.DIALOG.CANCEL_CONFIRM');
			var confirm = $mdDialog.confirm()
		          .title(title)
		          .textContent(textContent)
		          .ariaLabel('Logout')
		          .targetEvent(ev)
		          .ok(ok)
		          .cancel(cancel);

		    $mdDialog.show(confirm).then(function() {
		      IdSessionService.destroySession();
		      $state.go("login");
		    }, function() {
		      //Case if confirm dialog were canceled
		    });
		}
}]);