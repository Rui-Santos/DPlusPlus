(function(oDeezerpp)
{
	function SearchController($scope, oDeezerApi)
	{
		$scope.search = function()
		{
			_search($scope.query);
		};
		
		function _parseResults(oData)
		{
			$scope.results = oData.data;
		}
		
		function _search(sQuery)
		{
			oDeezerApi
				.search(sQuery)
				.then(_parseResults);
		}
	}
	
	oDeezerpp.controller(
		'SearchController',
		['$scope', 'DeezerApiService', SearchController]
	);
	
})(oDeezerpp);