(function(oDeezerpp)
{
	function MenuController($scope, $rootScope, $location, oSdk)
	{
		$scope.login = function($event)
		{
			$event.preventDefault();
			
			if(!$scope.logged)
			{
				oSdk.login().then(function(oUser)
				{
					$scope.logged	= true;
					$scope.name		= oUser.name;

					$location.path('profile');
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
		['$scope', '$rootScope', '$location', 'DeezerSdkService', MenuController]
	);
	
})(oDeezerpp);