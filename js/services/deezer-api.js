(function(oDeezerpp)
{
	function DeezerApiService($http, $q)
	{
		var _sBaseUrl = 'https://api.deezer.com/2.0/';
		
		/**
		 * Wrapper for the search API
		 */
		this.search = function(sQuery, sOrder)
		{
			return _makeRequest('search', {q: sQuery});
		};
		
		/**
		 * Makes requests ;)
		 * 
		 * @param	{String}	sPath
		 * @param	{Object}	oData
		 * @returns	{Undefined}
		 */
		function _makeRequest(sPath, oData)
		{
			var oDeferred	= $q.defer(),
				oOptions	= {
					params: {
						output:		'jsonp',
						callback:	'JSON_CALLBACK'
					}
				};
				sPath		= _sBaseUrl + sPath;
			
			if(angular.isObject(oData))
			{
				oOptions.params = angular.extend(oData, oOptions.params);
			}
			
			$http.jsonp(sPath, oOptions)
				.success(function(oData)
				{
					oDeferred.resolve(oData);
				})
				.error(function(oData, status, headers, config)
				{
					oDeferred.reject({error: true});
				});
			
			return oDeferred.promise;
		}
	}
	
	oDeezerpp.service(
		'DeezerApiService',
		['$http', '$q', DeezerApiService]
	);
	
})(oDeezerpp);