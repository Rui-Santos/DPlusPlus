(function(oDeezerpp)
{
	function MenuController($scope, $rootScope, oSdk)
	{
		$scope.login = function($event)
		{
			$event.preventDefault();
			
			if(!$scope.logged)
			{
				oSdk.login().then(function(oUser)
				{
					$scope.logged = true;
					$scope.name = oUser.name;
				});
			}
		};
		
		$scope.logout = function($event)
		{
			$event.preventDefault();

			$scope.logged = false;
			$scope.name = null;
		};
		
		/**
		 * "Constructor"
		 */
		function _init()
		{
			$scope.logged = oSdk.isLogged();
		}
		
		_init();
	}
	
	oDeezerpp.controller(
		'MenuController',
		['$scope', '$rootScope', 'DeezerSdkService', MenuController]
	);
	
})(oDeezerpp);