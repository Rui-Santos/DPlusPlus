(function(oDeezerpp)
{
	function PlaylistService($rootScope)
	{
		this.add = function(aTracks, aAlbums, aArtists)
		{
			$rootScope.$broadcast(
				'playlist-add-tracks',
				{tracks: aTracks, albums: aAlbums, artists: aArtists}
			);
		};

		this.play = function(aTracks, aAlbums, aArtists)
		{
			$rootScope.$broadcast(
				'playlist-play-tracks',
				{tracks: aTracks, albums: aAlbums, artists: aArtists}
			);
		};
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
			['$rootScope', PlaylistService]
		)
		.filter(
			'PlaylistAlbum',
			function()
			{
				return PlaylistAlbumFilter;
			}
		);
	
})(oDeezerpp);