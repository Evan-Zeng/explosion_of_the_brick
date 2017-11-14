/*

*/
var DEFAULT_BRICK_ID = 0;
var NORMAL_BRICK_ID  = 1;

var NORMAL_IMG = 0;
var TRANSPARENT_IMG = 1;

var g_brick_array = [
	["default_brick.png", "default_brick.png"],
	["normal_brick4.png", "normal_brick4_transparent.png"]
];

var g_select_choice = 1;

/*首先创建一个png*/

g_valueOfImg = { "default_brick.png" : 0, "normal_brick4.png" : 1};

var gamemap = document.getElementById('div_game_map');
var subDivWidth = 1320;
var subDivHeight = 20;
var bricksWidth = 60;
var subDivNum = 20;

var bricks_per_row = subDivWidth / bricksWidth;
var rows_of_bricks = subDivNum;

/*
	创建一个全局的div

	里面创建20个1320x20的子div

	每个子div有20个img

*/

/*
	这里不用关心一个子div的高度，反正我们只是生成地图供游戏读取
*/
function CreateChildrenDiv()
{
	var position = { x: 0, y: 0 };
	for (var idx = 0; idx < subDivNum; idx++)
	{
		position.y = idx * subDivHeight;
		var subDiv = document.createElement("div");
		subDiv.id = "subDiv_" + idx.toString();
		subDiv.style.display = "block";
		subDiv.style.top = position.y.toString() + "px";
		subDiv.style.width = subDivWidth.toString() + "px";
		subDiv.style.height = subDivHeight.toString() + "px";

		for (var imgIdx = 0; imgIdx < bricks_per_row; imgIdx++)
		{
			var img = document.createElement("img");
			img.src = g_brick_array[DEFAULT_BRICK_ID][NORMAL_IMG];
			img.currentImg = g_brick_array[DEFAULT_BRICK_ID][NORMAL_IMG];

			img.onmouseover = function()
			{
				this.src = g_brick_array[g_select_choice][TRANSPARENT_IMG];
			}

			img.onmouseout = function()
			{
				this.src = this.currentImg;
			}

			img.onclick = function()
			{
				this.currentImg = g_brick_array[g_select_choice][NORMAL_IMG];
			}

			subDiv.appendChild(img);
		}

		gamemap.appendChild(subDiv);
	}
}

function traverseTheImg(doSth)
{
	for(var i = 0; i < subDivNum; i++)
	{
		var subDivName = "subDiv_" + i.toString();
		var subDiv = document.getElementById(subDivName);
		var tempImgs = subDiv.getElementsByTagName("img");
		for (var n = 0; n < tempImgs.length; n++)
		{
			var tempImg = tempImgs[n];
			doSth(tempImg);
		}
	}
}

function PostGetMapInfo (mapname) 
{
	if (window.XMLHttpRequest)
	{
		var getmapinforeq = new XMLHttpRequest();
		getmapinforeq.onreadystatechange = function()
		{
			if (getmapinforeq.readyState == 4 && getmapinforeq.status == 200)
			{
				var responsetxt = getmapinforeq.responseText;
				var mapinfo = responsetxt.substring(responsetxt.indexOf("=") + 1);
				console.log("Map Info is:" + mapinfo + "map info len is :" + mapinfo.length);
				
				//change img
				var index = 0;
				traverseTheImg(function(img){
					img.src = g_brick_array[Number(mapinfo[index++])][NORMAL_IMG];
				});
			}	
		}

		//post mapname 到server
		getmapinforeq.open("POST", "mapserver.php?t=" + Math.random(), true);
		getmapinforeq.setRequestHeader("cache-control", "no-cache");
		getmapinforeq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var getstring = "MapName=" + mapname + "&operation=get";
		console.log("Get map info string is:" + getstring);
		getmapinforeq.send(getstring);
	}
	else
	{
		alert("Your browser does not support the ajax.");
		return null;
	}
}

function PostAndSaveMapToServer(mapName, mapWidth, mapHeight, mapArray)
{
	if(window.XMLHttpRequest)
	{
		var saveMapReq = new XMLHttpRequest();
		saveMapReq.onreadystatechange = function ()
		{
			//"Ok, you save the map successfully." 并且圆圈成了一个勾勾.png
			//提示和勾勾.png 在下一次点击save按钮或者换地图的时候会消失
			//在等待响应的时候save旁边有一个圆圈在转
			if(saveMapReq.readyState == 4 && saveMapReq.status == 200)
			{
				console.log("The response msg is :" + saveMapReq.responseText);
			}
		}

		//
		var mapName = "MapName=" + mapName;
		var strMapWidth = "MapWidth=" + mapWidth.toString();
		var strMapHeight = "MapHeight=" + mapHeight.toString();
		var postData = "data=" + JSON.stringify(mapArray);
		var operation = "operation=save"; 
		var postData = mapName + "&" + strMapHeight + "&" + strMapWidth + "&" + postData + "&" + operation;

		console.log("The post Data is :" + postData);

		saveMapReq.open("POST", "mapserver.php?t=" + Math.random(), true); //true 就是异步的
		saveMapReq.setRequestHeader("cache-control","no-cache");
		saveMapReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		saveMapReq.send(postData);
	}
	else
	{
		alert("Sorry, your browser is not support ajax.");
	}
}

function Init()
{
	var selectElement = document.getElementById("select_brick");
	g_select_choice = Number(selectElement.value);
	selectElement.onchange = function ()  //也可以用addEventListener实现
	{
		g_select_choice = Number(this.value);
	}

	var btnResetMap = document.getElementById("btn_resetmap");
	btn_resetmap.onclick = function ()
	{
		traverseTheImg(function (img){
			img.src = g_brick_array[DEFAULT_BRICK_ID][NORMAL_IMG];
		});
	};

	var btn_save = document.getElementById("input_save_map");
	btn_save.onclick = function()
	{
		var savearray = [];
		var idx = 0;

		//traverse the img, get the two-dimensional array value
		traverseTheImg(function (img){
			var filename=img.src.substring(img.src.lastIndexOf("/")+1,img.src.length);
			savearray[idx++] = g_valueOfImg[filename];
			console.log(savearray[idx - 1]);
		});

		//get the map name
		var select_mapname = document.getElementById("select_stage");
		var mapName = select_mapname.options[select_mapname.selectedIndex].text;

		//post to the server
		PostAndSaveMapToServer(mapName, bricks_per_row, rows_of_bricks, savearray);
	}

	var btn_getmap = document.getElementById("btn_getmap");
	btn_getmap.onclick = function()
	{
		//判断text如果不为空
		var input_mapname = document.getElementById("input_getmap");
		if (!input_getmap.value)
		{
			alert("Map name can not be null!");
			return;
		}
		console.log("Button getmap clicked.");
		PostGetMapInfo(input_mapname.value);
	}
}

Init();
CreateChildrenDiv();
