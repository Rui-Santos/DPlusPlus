(function(oDeezerpp)
{
	function AlbumController($scope, $routeParams, oDeezerApi, oPlaylist, AlbumFilter)
	{
		var _oFiltered = null;
		
		/**
		 * Add album at end of a playlist
		 */
		$scope.playLast = function($event)
		{
			$event.preventDefault();
			
			var oTmp = _getFiltered();
			oPlaylist.add(oTmp.tracks, oTmp.albums, oTmp.artists);
		};
		
		/**
		 * Plays all albums track instantly
		 */
		$scope.playNow = function($event)
		{
			$event.preventDefault();
			
			var oTmp = _getFiltered();
			oPlaylist.play(oTmp.tracks, oTmp.albums, oTmp.artists);
		};
		
		/**
		 * Add song at end of a playlist
		 */
		$scope.playSingleLast = function(iPos, $event)
		{
			$event.preventDefault();
			
			var oTmp = _getFiltered();
			
			if(!oTmp.tracks[iPos])
			{
				return;
			}

			oPlaylist.add([oTmp.tracks[iPos]], oTmp.albums, oTmp.artists);
		};
		
		/**
		 * Plays track instantly
		 */
		$scope.playSingleNow = function(iPos, $event)
		{
			$event.preventDefault();

			var oTmp = _getFiltered();

			if(!oTmp.tracks[iPos])
			{
				return;
			}

			oPlaylist.play([oTmp.tracks[iPos]], oTmp.albums, oTmp.artists);
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
		
		/**
		 * Returns data prepared for playlist service
		 * 
		 * @returns	{Object}
		 */
		function _getFiltered()
		{
			if(_oFiltered === null)
			{
				_oFiltered = AlbumFilter($scope.album);
			}
			
			return _oFiltered;
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