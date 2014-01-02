(function(oDeezerpp)
{
	function DeezerApiService($q, oSdk)
	{
		/**
		 * Returns album object
		 * 
		 * @param	{Int}		iId		album ID
		 * @returns	{Promise}
		 */
		this.getAlbum = function(iId)
		{
			return oSdk.request('album/'+ iId);
		};
		
		/**
		 * Returns artist object
		 * 
		 * @param	{Int}		iId		artist ID
		 * @returns	{Promise}
		 */
		this.getArtist = function(iId)
		{
			return oSdk.request('artist/'+ iId);
		};

		/**
		 * Returns array of artist albums
		 * 
		 * @param	{Int}		iId		artist ID
		 * @returns	{Promise}
		 */
		this.getArtistAlbums = function(iId)
		{
			return oSdk.request('artist/'+ iId +'/albums');
		};

		/**
		 * Returns user favorite albums
		 * 
		 * @param	{Int}		iId		user ID
		 * @returns	{Promise}
		 */
		this.getUserAlbums = function(iId, iCount)
		{
			return getMultipage(
					'user/'+ iId +'/albums',
					(iCount ? iCount : 50)
				);
		};

		/**
		 * Returns user favorite artists
		 * 
		 * @param	{Int}		iId		user ID
		 * @returns	{Promise}
		 */
		this.getUserArtists = function(iId, iCount)
		{
			return getMultipage(
					'user/'+ iId +'/artists',
					(iCount ? iCount : 50)
				);
		};
		
		/**
		 * Wrapper for the search API
		 */
		this.search = function(sQuery, sOrder)
		{
			return oSdk.request('search', 'GET', {q: sQuery});
		};
		
		function getMultipage(sQuery, iCount)
		{
			var oDeferred	= $q.defer();

			oSdk.request(sQuery)
				.then(function(oResult)
				{
					var aTmp = (angular.isArray(oResult) ? oResult : oResult.data);
					
					if(iCount)
					{
						aTmp = aTmp.slice(0, iCount);
					}
	
					oDeferred.resolve(aTmp);
				});
			
			return oDeferred.promise;
		}
	}
	
	oDeezerpp.service(
		'DeezerApiService',
		['$q', 'DeezerSdkService', DeezerApiService]
	);
	
})(oDeezerpp);