AdminApp.factory('ToastService', function($mdToast) {
	var fct = {};

	fct.displayToast = displayToast;
	

	function displayToast(text){
		$mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right" )
	        .hideDelay(3000)
	    );
	}

	return fct;
});