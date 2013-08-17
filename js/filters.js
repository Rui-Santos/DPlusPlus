(function(oDeezerpp)
{
	function filterSubstr(sStr, iCount)
	{
		if(sStr.lenght <= iCount)
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