(function(oDeezerpp)
{
	function AlbumController($scope, $routeParams, oDeezerApi)
	{
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
		['$scope', '$routeParams', 'DeezerApiService', AlbumController]
	);
	
})(oDeezerpp);