(function(oDeezerpp)
{
	/**
	 * Controls deezer player
	 * 
	 * @param	{Object}	$rootScope
	 */
	function DeezerSdkService($rootScope, $q, $log, $document, oAppSettings)
	{
		var _bReady		= false,
			_oUser		= null,
			_sToken		= null;

	// user methods
		
		/**
		 * Is user logged in?
		 * 
		 * @returns	{Boolean}
		 */
		this.isLogged = function()
		{
			return (_oUser !== null);
		};
		
		/**
		 * Starts login action
		 * 
		 * @returns	{promise}
		 */
		this.login = function()
		{
			_isReady();
			
			var oDeferred = $q.defer();
			
			DZ.login(
				function(oResponse)
				{
					if(oResponse.authResponse)
					{
						_sToken = oResponse.authResponse.accessToken;
						
						DZ.api('/user/me', function(oUser)
						{
							_oUser = oUser;
							_oUser.id = oResponse.userID;
							
							$rootScope.$broadcast('user-logged-in', _oUser);

							oDeferred.resolve(_oUser);
						});
					}
					else
					{
						oDeferred.reject();
					}

					$rootScope.$apply();
				},
				{perms: oAppSettings.dz.perms}
			);
			
			return oDeferred.promise;
		};
		
		/**
		 * Logout action
		 * 
		 * @returns	{Undefined}
		 */
		this.logout = function()
		{
			_isReady();
			
			DZ.logout();

			$rootScope.$broadcast('user-logged-out');
		};

	// private methods

		/**
		 * "Constructor"
		 * 
		 * @returns	{Undefined}
		 */
		function _init()
		{
			DZ.init({
				appId:		oAppSettings.dz.appid,
				channelUrl: oAppSettings.dz.channel,
				player:	{
					onload: function()
					{
						_bReady = true;

$log.debug('player-ready');
						$rootScope.$broadcast('deezer-sdk-ready');
						$rootScope.$apply();
					}
				}
			});
		}

		/**
		 * Is SDK loaded?
		 * 
		 * @throws	{Error}
		 * @returns	{Undefined}
		 */
		function _isReady()
		{
			if(!_bReady)
			{
				throw new Error('Deezer SDK is not loaded');
			}
		}

		$document.ready(_init);
	}
	
	oDeezerpp.service(
		'DeezerSdkService',
		['$rootScope', '$q', '$log', '$document', 'AppSettings', DeezerSdkService]
	);
	
})(oDeezerpp);
