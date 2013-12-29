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
	
	oDeezerpp.filter('substr', function()
	{
		return filterSubstr;
	});
	
})(oDeezerpp);