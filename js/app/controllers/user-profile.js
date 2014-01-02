(function(oDeezerpp)
{
	function UserProfileController($scope, $location, oPlaylist, oApi, oSdk)
	{
		$scope.playNow = function(iAlbumId, $event)
		{
			$event.preventDefault();
			
			oPlaylist.playAlbum(iAlbumId);
		};

		$scope.playLast = function(iAlbumId, $event)
		{
			$event.preventDefault();
			
			oPlaylist.addAlbum(iAlbumId);
		};
		
		/**
		 * "Constructor"
		 */
		function _init()
		{
			// only for logged users
			if(!oSdk.isLogged())
			{
				$location.path('/');

				return;
			}
console.log(oSdk.getUser());
			$scope.user = oSdk.getUser();
			
			oApi.getUserAlbums($scope.user.id, 5)
				.then(function(oData)
				{
					$scope.albums = oData;
				});
			
			oApi.getUserArtists($scope.user.id, 5)
				.then(function(oData)
				{
					$scope.artists = oData;
				});
		}
		
		_init();
	}
	
	oDeezerpp.controller(
		'UserProfileController',
		[
			'$scope', '$location', 'PlaylistService', 'DeezerApiService', 'DeezerSdkService',
			UserProfileController
		]
	);
	
})(oDeezerpp);