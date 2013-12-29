
oDeezerpp = angular.module('deezerpp', ['ngRoute']);

// routing config
oDeezerpp.config([
	'$routeProvider', '$logProvider', 'AppSettings',
	function($routeProvider, $logProvider, oAppSettings)
	{
		var oResolve = {
				dzSdkReady: ['DeezerSdkService', function(oSdk) {
					return oSdk.resolve();
				}]
			};
		
		$routeProvider
			.when(
				'/album/:id',
				{
					controller:	 'AlbumController',
					templateUrl: 'templates/album.html',
					resolve:	 oResolve
				}
			)
			.when(
				'/artist/:id',
				{
					controller:	 'ArtistController',
					templateUrl: 'templates/artist.html',
					resolve:	 oResolve
				}
			)
			.when(
				'/profile',
				{
					controller:	 'UserProfileController',
					templateUrl: 'templates/userprofile.html',
					resolve:	 oResolve
				}
			)
			.when(
				'/search',
				{
					controller:	 'SearchController',
					templateUrl: 'templates/search.html',
					resolve:	 oResolve
				}
			);
		
		// debugging settings
		$logProvider.debugEnabled(
			angular.isUndefined(oAppSettings.debug) ? false : oAppSettings.debug
		);
	}
]);
