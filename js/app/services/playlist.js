(function(oDeezerpp)
{
	function PlaylistService($rootScope, oDeezerApi)
	{
		var oPlaylist = this;
		
		/**
		 * Adds tracks to playlist
		 */
		this.add = function(aTracks, aAlbums, aArtists)
		{
			$rootScope.$broadcast(
				'playlist-add-tracks',
				{tracks: aTracks, albums: aAlbums, artists: aArtists}
			);
		};

		/**
		 * Adds antire album to playlist
		 * 
		 * @param	{Int}	iAlbumId	album ID
		 * @returns	{Undefined}
		 */
		this.addAlbum = function(iAlbumId)
		{
			manageAlbum(iAlbumId, false);
		};

		/**
		 * Plays given tracks
		 */
		this.play = function(aTracks, aAlbums, aArtists)
		{
			$rootScope.$broadcast(
				'playlist-play-tracks',
				{tracks: aTracks, albums: aAlbums, artists: aArtists}
			);
		};

		/**
		 * Plays entire album
		 * 
		 * @param	{Int}	iAlbumId	album ID
		 * @returns	{Undefined}
		 */
		this.playAlbum = function(iAlbumId)
		{
			manageAlbum(iAlbumId, true);
		};
		
		function manageAlbum(iAlbumId, bReplace)
		{
			oDeezerApi
				.getAlbum(iAlbumId)
				.then(function(oAlbum)
				{
					var oTmp = PlaylistAlbumFilter(oAlbum);
					
					if(bReplace)
					{
						oPlaylist.play(oTmp.tracks, oTmp.albums, oTmp.artists);
					}
					else
					{
						oPlaylist.add(oTmp.tracks, oTmp.albums, oTmp.artists);
					}
				});
		}
	}
	
	/**
	 * Filter for full album data
	 * 
	 * @param	{Object}	oAlbum	full album data
	 * @returns	{Object}
	 */
	function PlaylistAlbumFilter(oAlbum)
	{
		var aTracks = [];

		for(var i = 0; i < oAlbum.tracks.data.length; i++)
		{
			var oData = oAlbum.tracks.data[i];
			
			aTracks.push({
				id:		oData.id,
				title:	oData.title,
				album:	oAlbum.id,
				artist:	oAlbum.artist.id
			});
		}
		
		return {
			albums:	 [{
				id:		oAlbum.id,
				image:	oAlbum.image,
				title:	oAlbum.title
			}],
			artists: [{
				id:		oAlbum.artist.id,
				image:	oAlbum.artist.image,
				name:	oAlbum.artist.name
			}],
			tracks: aTracks
		};
	}
	
	oDeezerpp
		.service(
			'PlaylistService',
			['$rootScope', 'DeezerApiService', PlaylistService]
		)
		.filter(
			'PlaylistAlbum',
			function()
			{
				return PlaylistAlbumFilter;
			}
		);
	
})(oDeezerpp);