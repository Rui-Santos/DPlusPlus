(function(oDeezerpp)
{
	function AlbumController($scope, $routeParams, oDeezerApi, oPlaylist)
	{
		/**
		 * Formatted album tracks
		 */
		var _aTracks;
		
		/**
		 * Add album at end of a playlist
		 */
		$scope.playLast = function($event)
		{
			$event.preventDefault();

			oPlaylist.add(_getTracks());
		};
		
		/**
		 * Plays all albums track instantly
		 */
		$scope.playNow = function($event)
		{
			$event.preventDefault();

			oPlaylist.play(_getTracks());
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
		 * Get array of formatted tracks objects
		 * 
		 * @returns	{Array}
		 */
		function _getTracks()
		{
			if(angular.isArray(_aTracks))
			{
				return _aTracks;
			}
			
			var _aTracks = [],
				aData	 = $scope.album.tracks.data;

			for(var i = 0; i < aData.length; i++)
			{
				var oTrack = aData[i];
				
				_aTracks.push({
					id:		oTrack.id,
					title:	oTrack.title,
					artist:	$scope.album.artist
				});
			}

			return _aTracks;
		}
		
		_init();
	}
	
	oDeezerpp.controller(
		'AlbumController',
		['$scope', '$routeParams', 'DeezerApiService', 'PlaylistService', AlbumController]
	);
	
})(oDeezerpp);