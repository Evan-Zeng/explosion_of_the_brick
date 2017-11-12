dataString = {'data':[[1,2,332233],[2,3,4]]};// array?
var jsonString1 = JSON.stringify(dataString);
dataString2 = [[1,2,332233],[2,3,4]];
var jsonString2 = JSON.stringify(dataString2);
dataString['ppp'] = [22,33,44];
jsonString = (function(obj){ // 转成post需要的字符串.  
    var str = "";  
   
    for(var prop in obj){  
        str += prop + "=" + obj[prop] + "&";
    }
    return str;  
})(dataString);  

console.log("dataString is :" + jsonString);
console.log("jsonString1 is :" + jsonString1);

var parsjson = JSON.parse(jsonString1);

console.log("parsjson is :" + parsjson['data']);

if (window.XMLHttpRequest)
{
	console.log("yes , the web support ajax");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function()
	{
		if (req.readyState == 4 && req.status == 200)
		{
			console.log("asdf");
		}
	}
	req.open("POST", "serverpage.php?t=" + Math.random(), true);
	req.setRequestHeader("cache-control","no-cache");
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
	req.send("data="+jsonString2);
}