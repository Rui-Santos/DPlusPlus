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
			$scope.$on('playlist-add', function(oEvent, aTracks)
			{
				_addTracks(aTracks, false);
			});
			
			// 
			$scope.$on('playlist-play', function(oEvent, aTracks)
			{
				_addTracks(aTracks, true);
				_playCurrent();
			});
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