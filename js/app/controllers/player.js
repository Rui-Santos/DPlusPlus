(function(oDeezerpp)
{
	function PlayerController($scope, oDeezerPlayer)
	{
		var _lastStatus = null,
			_lastSeek	= null;
		
		$scope.current	= {
				seek: 0
			};
		$scope.paused	= false;	// is any track loaded
		$scope.playing	= false;	// are we shuffling now?
		$scope.position	= undefined;// current position on playlist
		
		$scope.artists	= {};		// artists list
		$scope.albums	= {};		// albums list
		$scope.playlist	= [];		// playlist array
		
// playlist operations

		/**
		 * Plays next track from playlist
		 * 
		 * @returns	{Undefined}
		 */
		$scope.playNext = function($event)
		{
			if($event)
			{
				$event.preventDefault();
			}
			
			// out of bound
			if($scope.position >= $scope.playlist.length - 1)
			{
				return;
			}
			
			$scope.position++;
			_playCurrent(true);
		};
		
		/**
		 * Plays previous track from playlist
		 * 
		 * @returns	{Undefined}
		 */
		$scope.playPrev = function($event)
		{
			if($event)
			{
				$event.preventDefault();
			}

			// out of bound
			if($scope.position < 1)
			{
				return;
			}
			
			$scope.position--;
			_playCurrent(true);
		};
		
		/**
		 * Plays selected track from playlist
		 * 
		 * @returns	{Undefined}
		 */
		$scope.playSelected = function(iPos, $event)
		{
			$event.preventDefault();
			
			if(iPos < 0 || iPos >= $scope.playlist.length)
			{
				return;
			}
			
			$scope.position = iPos;
			_playCurrent(true);
		};
		
// playback

		/**
		 * Plays/pauses current track
		 * 
		 * @returns	{Undefined}
		 */
		$scope.pause = function($event)
		{
			if($scope.playing)
			{
				oDeezerPlayer.pause();
			}
			
			$event.preventDefault();
		};

		/**
		 * Plays/pauses current track
		 * 
		 * @returns	{Undefined}
		 */
		$scope.play = function($event)
		{
			if($scope.paused)
			{
				oDeezerPlayer.play();
			}
			
			$event.preventDefault();
		};
		
// private methods
		
		/**
		 * "Constructor"
		 * 
		 * @returns	{Undefined}
		 */
		function _init()
		{
			// changing progressbar size
			oDeezerPlayer.bindProgress(_changeProgess);
			
			// play status change event
			$scope.$on('player-status', function(oEvent, sStatus)
			{
				switch(sStatus)
				{
					case 'paused':
						$scope.paused	= true;
						$scope.playing	= false;
						break;
					case 'playing':
						$scope.paused	= false;
						$scope.playing	= true;
						break;
					case 'stopped':
						$scope.paused	= false;
						$scope.playing	= false;
						break;
				}
				
				// last song was ended, playing next on playlist
				if(_lastStatus == 'playing' && sStatus == 'stopped')
				{
					$scope.playNext();
				}
				
				_lastStatus = sStatus;
			});
			
			// 
			$scope.$on('playlist-add-tracks', function(oEvent, oData)
			{
				_addArtists(oData.artists);
				_addAlbums(oData.albums);
				_addTracks(oData.tracks, false);
			});
			
			// 
			$scope.$on('playlist-play-tracks', function(oEvent, oData)
			{
				_addArtists(oData.artists);
				_addAlbums(oData.albums);
				_addTracks(oData.tracks, true);
				_playCurrent();
			});
		}
		
		/**
		 * Adds albums data to playlist
		 * 
		 * @param	{Array}	aAlbums
		 * @returns	{Undefined}
		 */
		function _addAlbums(aAlbums)
		{
			for(var i = 0; i < aAlbums.length; i++)
			{
				if($scope.albums[aAlbums[i].id])
				{
					continue;
				}
				
				$scope.albums[aAlbums[i].id] = {
					count:	0,
					image:	aAlbums[i].image,
					title:	aAlbums[i].title
				};
			}
		}

		/**
		 * Adds artists data to playlist
		 * 
		 * @param	{Array}	aArtists
		 * @returns	{Undefined}
		 */
		function _addArtists(aArtists)
		{
			for(var i = 0; i < aArtists.length; i++)
			{
				if($scope.artists[aArtists[i].id])
				{
					continue;
				}
				
				$scope.artists[aArtists[i].id] = {
					count:	0,
					image:	aArtists[i].image,
					name:	aArtists[i].name
				};
			}
		}
		
		/**
		 * Adds tracks to playlist and play (optional)
		 * 
		 * @param	{Array}	aTracks		array contains tracks objects
		 * @param	{Bool}	bOverride	(optional) start playback
		 * @returns	{Undefined}
		 */
		function _addTracks(aTracks, bOverride)
		{
			if(!angular.isArray(aTracks))
			{
				throw new Error('Incorrect ');
			}
			
			if(bOverride)
			{
				$scope.playlist = aTracks;
				$scope.position = 0;
			}
			else
			{
				$scope.playlist = $scope.playlist.concat(aTracks);
			}
			
			for(var i = 0; i < aTracks.length; i++)
			{
				$scope.artists[aTracks[i].artist].count++;
				$scope.albums[aTracks[i].album].count++;
			}
		};

		/**
		 * Changes track progress bar
		 * 
		 * @param	{Objest}	oData
		 * @returns	{Undefined}
		 */
		function _changeProgess(oData, bInside)
		{
			var iNow = (oData[0] / oData[1] * 100).toFixed(2);
			
			// nothing was changed
			if(iNow == _lastSeek)
			{
				return;
			}

			$scope.current.time = (oData[0] / 60).toFixed(2);
			$scope.current.seek = iNow;

			if(!bInside)
			{
				$scope.$apply();
			}
		}

		/**
		 * Plays active song
		 * 
		 * @returns	{Undefined}
		 */
		function _playCurrent(bChanged)
		{
			if($scope.playlist.length == 0)
			{
				return;
			}

			// we have paused song
			if($scope.paused && !bChanged)
			{
				oDeezerPlayer.play();
			}
			// new song
			else
			{
				var oCurrent = $scope.playlist[$scope.position];
				oDeezerPlayer.play(oCurrent.id);
			}
		}

		_init();
	}
	
	oDeezerpp.controller(
		'PlayerController',
		['$scope', 'DeezerPlayerService', PlayerController]
	);

})(oDeezerpp);