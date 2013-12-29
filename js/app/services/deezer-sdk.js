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
			_oUser		= null;

	// user methods

		/**
		 * Returns user object or NULL
		 * 
		 * @returns	{Object|Null}
		 */
		this.getUser = function()
		{
			return _oUser;
		};
		
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

		/**
		 * Perform API request
		 * 
		 * @param	{String}	relative API URL
		 * @param	{String}	GET|POST
		 * @param	{Object}	additional data
		 * @returns	{$q}
		 */
		this.request = function(sUrl, sMethod, oData)
		{
			_isReady();
			
			var oDeferred	= $q.defer();
				sMethod		= (sMethod ? sMethod : 'GET');
			
			DZ.api(sUrl, sMethod, oData, function(oData)
			{
				oDeferred.resolve(oData);
				$rootScope.$apply();
			});

			return oDeferred.promise;
		};

		/**
		 * Resolver
		 * 
		 * @returns	{$q}
		 */
		this.resolve = function()
		{
			var oDeferred = $q.defer();
			
			if(_bReady)
			{
				oDeferred.resolve();
			}
			else
			{
				$rootScope.$on('deezer-sdk-ready', function()
				{
					oDeferred.resolve();
				});
			}

			return oDeferred.promise;
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
