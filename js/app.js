
oDeezerpp = angular.module('deezerpp', ['ngRoute']);

// routing config
oDeezerpp.config([
	'$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider)
	{
		$routeProvider.when(
			'/artist/:id',
			{
				controller:	 'ArtistController',
				templateUrl: '/templates/artist.html'
			}
		);
		
		$routeProvider.when(
			'/search',
			{
				controller:	 'SearchController',
				templateUrl: '/templates/search.html'
			}
		);
	}
]);