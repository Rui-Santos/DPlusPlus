(function(oDeezerpp)
{
	function AlbumController($scope, $routeParams, oDeezerApi, oPlaylist, AlbumFilter)
	{
		/**
		 * Add album at end of a playlist
		 */
		$scope.playLast = function($event)
		{
			$event.preventDefault();
			
			var oTmp = AlbumFilter($scope.album);
			oPlaylist.add(oTmp.tracks, oTmp.albums, oTmp.artists);
		};
		
		/**
		 * Plays all albums track instantly
		 */
		$scope.playNow = function($event)
		{
			$event.preventDefault();
			
			var oTmp = AlbumFilter($scope.album);
			oPlaylist.play(oTmp.tracks, oTmp.albums, oTmp.artists);
		};
		
		/**
		 * "Constructor"
		 */
		function _init()
		{
			oDeezerApi
				.getAlbum($routeParams.id)
				.then(function(oData)
				{
					$scope.album = oData;
				});
		}
		
		_init();
	}
	
	oDeezerpp.controller(
		'AlbumController',
		[
			'$scope', '$routeParams', 'DeezerApiService', 'PlaylistService', 'PlaylistAlbumFilter',
			AlbumController
		]
	);
	
})(oDeezerpp);