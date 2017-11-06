/*

*/
var DEFAULT_BRICK_ID = 0;
var NORMAL_BRICK_ID  = 1;

var g_brick_array = [
	["default_brick.png", "default_brick.png"],
	["normal_brick4.png", "normal_brick4_transparent.png"]
];

var g_select_choice = 1;

/*首先创建一个png*/

var gamemap = document.getElementById('div_game_map');
var subDivWidth = 1320;
var subDivHeight = 20;
var subDivNum = 20;
var bricksWidth = 60;

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
	var bricks_per_row = subDivWidth / bricksWidth;
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
			img.src = "default_brick.png";
			img.currentImg = "default_brick.png";

			img.onmouseover = function()
			{
				this.src = g_brick_array[g_select_choice][1];
			}

			img.onmouseout = function()
			{
				this.src = this.currentImg;
			}

			img.onclick = function()
			{
				this.currentImg = g_brick_array[g_select_choice][0];
			}

			subDiv.appendChild(img);
		}

		gamemap.appendChild(subDiv);
	}
}

function Init()
{
	var selectElement = document.getElementById("select_brick");
	g_select_choice = Number(selectElement.value);
	selectElement.onchange = function ()
	{
		g_select_choice = Number(this.value);
	}
}

Init();
CreateChildrenDiv();
