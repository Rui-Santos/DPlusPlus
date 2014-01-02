(function(oDeezerpp)
{
	function ArtistController($scope, $routeParams, oDeezerApi, oPlaylist)
	{
		$scope.playNow = function(iId, $event)
		{
			$event.preventDefault();

			oPlaylist.playAlbum(iId);
		};

		$scope.playLast = function(iId, $event)
		{
			$event.preventDefault();

			oPlaylist.addAlbum(iId);
		};
		
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
		['$scope', '$routeParams', 'DeezerApiService', 'PlaylistService', ArtistController]
	);
	
})(oDeezerpp);