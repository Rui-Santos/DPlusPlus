(function(oDeezerpp)
{
	/**
	 * Controls deezer player
	 * 
	 * @param	{Object}	$rootScope
	 */
	function DeezerPlayerService($rootScope, $log, oAppSettings)
	{
		var _bPaused	= false,
			_bPlaying	= false,
			_bReady		= false,
			_iCurrent	= null,
			_aBindProgress	= [];
		
		/**
		 * Direct progress binding (cpu saving)
		 * 
		 * @param	{Function}	fFunction
		 * @returns	{Undefined}
		 */
		this.bindProgress = function(fFunction)
		{
			_aBindProgress.push(fFunction);
		};

		/**
		 * Pauses current song
		 * 
		 * @returns	{Undefined}
		 */
		this.pause = function()
		{
			_checkPlayer();

			DZ.player.pause();
		};

		/**
		 * Plays new song or resume loaded
		 * 
		 * @param	{Int|Null}	iTrackId	deezer track ID
		 * @returns	{Undefined}
		 */
		this.play = function(iTrackId)
		{
			_checkPlayer();

			// let's play new song
			if(iTrackId)
			{
				DZ.player.playTracks([iTrackId]);
			}
			// stopped song
			else if(_bPaused)
			{
				DZ.player.play();
			}
		};

	// private methods

		/**
		 * "Constructor"
		 * 
		 * @returns	{Undefined}
		 */
		function _init()
		{
			DZ.init({
				appId:		oAppSettings.dz.appid,
				channelUrl: oAppSettings.dz.channel,
				player:	{
					onload: function()
					{
						_bReady = true;

$log.debug('player-ready');
						$rootScope.$broadcast('player-ready');
						$rootScope.$apply();
					}
				}
			});
			
			// player starts play a song
			DZ.Event.subscribe('player_play', function()
			{
$log.debug('DZ: player_play');
				_bPlaying	= true;
				_bPaused	= false;
				_sendStatus();
			});

			// player is paused
			DZ.Event.subscribe('player_paused', function()
			{
$log.debug('DZ: player_paused');
				_bPlaying	= false;
				_bPaused	= true;
				_sendStatus();
			});

			// player plays a song
			DZ.Event.subscribe('player_position', function(aData)
			{
$log.debug('DZ: player_position', aData[0], aData[1], _iCurrent);
				// new song
				if(aData[0] > 0 && _iCurrent === null)
				{
					_iCurrent = 1;
				}
				// end of a song
				else if(aData[0] == 0 && _iCurrent !== null)
				{
					_iCurrent	= null;
					_bPaused	= false;
					_bPlaying	= false;
					_sendStatus();
				}
				
				for(var i = 0; i < _aBindProgress.length; i++)
				{
					_aBindProgress[i](aData);
				}
			});

			// current track is changing
			DZ.Event.subscribe('current_track', function(oData)
			{
				_iCurrent = null;
$log.debug('DZ: current_track', _iCurrent);
			});
		}

		/**
		 * Is player loaded?
		 * 
		 * @throws	{Error}
		 * @returns	{Undefined}
		 */
		function _checkPlayer()
		{
			if(!_bReady)
			{
				throw new Error('Player not loaded');
			}
		}

		/**
		 * Sends player status broadcast
		 * 
		 * @returns	{Undefined}
		 */
		function _sendStatus(bOutside)
		{
			var sStatus = 'stopped';
				bOutside = (bOutside == undefined ? true : bOutside);
			
			if(_bPlaying)
			{
				sStatus = 'playing';
			}
			else if(_bPaused)
			{
				sStatus = 'paused';
			}
$log.debug('player-status: '+ sStatus);
			$rootScope.$broadcast('player-status', sStatus);
			
			if(bOutside)
			{
				$rootScope.$apply();
			}
		}
		
		angular.element(document).ready(_init);
	}
	
	oDeezerpp.service(
		'DeezerPlayerService',
		['$rootScope', '$log', 'AppSettings', DeezerPlayerService]
	);
	
})(oDeezerpp);