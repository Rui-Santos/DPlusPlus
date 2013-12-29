(function(oDeezerpp)
{
	function ArtistController($scope, $routeParams, oDeezerApi, oPlaylist, AlbumFilter)
	{
		$scope.playNow = function(iId, $event)
		{
			$event.preventDefault();

			_addAlbum(iId, true);
		};

		$scope.playLast = function(iId, $event)
		{
			$event.preventDefault();

			_addAlbum(iId, false);
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
		
		function _addAlbum(iAlbumId, bReplace)
		{
			oDeezerApi
				.getAlbum(iAlbumId)
				.then(function(oAlbum)
				{
					var oTmp = AlbumFilter(oAlbum);
					
					if(bReplace)
					{
						oPlaylist.play(oTmp.tracks, oTmp.albums, oTmp.artists);
					}
					else
					{
						oPlaylist.add(oTmp.tracks, oTmp.albums, oTmp.artists);
					}
				});
		}
		
		_init();
	}
	
	oDeezerpp.controller(
		'ArtistController',
		[
			'$scope', '$routeParams', 'DeezerApiService', 'PlaylistService', 'PlaylistAlbumFilter',
			ArtistController
		]
	);
	
})(oDeezerpp);