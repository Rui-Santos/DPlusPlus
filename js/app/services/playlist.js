(function(oDeezerpp)
{
	function PlaylistService($rootScope)
	{
		this.add = function(aTracks)
		{
			$rootScope.$broadcast('playlist-add', aTracks);
		};

		this.play = function(aTracks)
		{
			$rootScope.$broadcast('playlist-play', aTracks);
		};
	}
	
	oDeezerpp.service(
		'PlaylistService',
		['$rootScope', PlaylistService]
	);
	
})(oDeezerpp);