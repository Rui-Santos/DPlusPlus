(function(oDeezerpp)
{
	function filterSubstr(sStr, iCount)
	{
		if(sStr.length <= iCount)
		{
			return sStr;
		}
		
		return sStr.substr(0, iCount) +'...';
	}
	
	function filterSecToMin(iInput)
	{
		var iMin = Math.floor(iInput / 60),
			iSec = iInput % 60;
		
		return iMin +':'+ (iSec < 9 ? '0' : '') + iSec;
	}
	
	oDeezerpp.filter('substr', function()
	{
		return filterSubstr;
	});
	
	oDeezerpp.filter('secToMin', function()
	{
		return filterSecToMin;
	});
	
})(oDeezerpp);