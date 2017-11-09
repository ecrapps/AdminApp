AdminApp.factory('IdSessionService',
	function() {
		var fct = {};

		fct.setIdSession = setIdSession;
		fct.getIdSession = getIdSession;
		fct.destroySession = destroySession;
		
		function setIdSession (idSession) {
			localStorage.setItem('idSession', JSON.stringify(idSession));
		};

		function getIdSession () {
			return JSON.parse(localStorage.getItem('idSession'));
		};

		function destroySession(){
			localStorage.removeItem('idSession'); 
		}

		return fct;
	}
);