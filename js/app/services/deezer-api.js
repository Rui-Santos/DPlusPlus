(function(oDeezerpp)
{
	function DeezerApiService(oSdk)
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
		 * Wrapper for the search API
		 */
		this.search = function(sQuery, sOrder)
		{
			return oSdk.request('search', 'GET', {q: sQuery});
		};
	}
	
	oDeezerpp.service(
		'DeezerApiService',
		['DeezerSdkService', DeezerApiService]
	);
	
})(oDeezerpp);