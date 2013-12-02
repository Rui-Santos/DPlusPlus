
oDeezerpp = angular.module('deezerpp', ['ngRoute']);

// routing config
oDeezerpp.config([
	'$routeProvider', '$logProvider', 'AppSettings',
	function($routeProvider, $logProvider, oAppSettings)
	{
		$routeProvider
			.when(
				'/album/:id',
				{
					controller:	 'AlbumController',
					templateUrl: '/templates/album.html'
				}
			)
			.when(
				'/artist/:id',
				{
					controller:	 'ArtistController',
					templateUrl: '/templates/artist.html'
				}
			)
			.when(
				'/search',
				{
					controller:	 'SearchController',
					templateUrl: '/templates/search.html'
				}
			);
		
		// debugging settings
		$logProvider.debugEnabled(
			angular.isUndefined(oAppSettings.debug) ? false : oAppSettings.debug
		);
	}
]);