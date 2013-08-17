(function(oDeezerpp)
{
	function ArtistController($scope, $routeParams, oDeezerApi)
	{
		function _init()
		{
			oDeezerApi
				.getArtist($routeParams.id)
				.then(function(oData)
				{
					$scope.artist = oData;
				});
			
			oDeezerApi
				.getArtistAlbums($routeParams.id)
				.then(function(oData)
				{
					$scope.albums = oData.data;
				});
		}
		
		_init();
	}
	
	oDeezerpp.controller(
		'ArtistController',
		['$scope', '$routeParams', 'DeezerApiService', ArtistController]
	);
	
})(oDeezerpp);