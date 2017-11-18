function BrickImg(src, x, y)
{
	
	var img = new Image();
	img.src = src;
	this.imgObj = img;
	this.posx = x;
	this.posy = y;
}

BrickImg.prototype.width = 60;
BrickImg.prototype.height = 20;

function PeddleImg(src, x, y)
{
	var img = new Image();
	img.src = src;
	this.imgObj	= img;
	this.posx = x;
	this.posy = y;
}

PeddleImg.prototype.width = 120;
PeddleImg.prototype.height = 20;

function BallImg(src, x, y)
{
	var img = new Image();
	img.src = src;
	this.imgObj	= img;
	this.posx = x;
	this.posy = y;

	this.speedx = 0;
	this.speedy = 0;

    this.middlex = x + this.radius;
    this.middley = y + this.radius;
}

PeddleImg.prototype.radius = 5;

var g_currentStage = 1;
var STAGE_MAP_STR_PREFIX = "stage_";
var MAP_SERVER_NAME = "mapserver.php"; //temp name
var PEDDLE_IMG_NAME = "peddle.png";
var BALL_IMG_NAME = "ball.png";

var g_canvas = null;
var g_canvas_ctx = null;

var g_map_rows = 20;
var g_map_column = 22;

var g_mapinfo = "";
var g_arrBrickImgs = [];
var g_peddleImg = null;
var g_ballImg = null;

var MAP_TABLE = { 
	"0" : "null",
	"1" : "normal_brick4.png"
};

function initTheDocumentObj()
{
	console.log("In function InitTheDocumentObj");

	//init and init the bkg div.
	var div_bkg = document.createElement("div");
	div_bkg.style.border = "1px solid black";
	//长宽和mapeditor是一样的，看看有没有办法放到公共的地方，不然可能一边改了，另一边没改
	div_bkg.style.width = "1320px";
	div_bkg.style.height = "600px";
	div_bkg.style.margin = "0 auto";

    //append to the body tag.
	var bodytag = document.getElementById("body_html");
	bodytag.appendChild(div_bkg);

	//set row div of imgs.
	//height = 20px width = 1320px, row number is 20
	//set imgs.
	
	//create canvas
	g_canvas = document.createElement("canvas");
	div_bkg.append(g_canvas);
	//长宽和mapeditor是一样的，看看有没有办法放到公共的地方，不然可能一边改了，另一边没改
	g_canvas.width = 1320;
	g_canvas.height = 600;
	g_canvas_ctx = g_canvas.getContext('2d');

	//init the peddle and ball. (No ctrl board like map editor)

	return;
}

function readMapFromDatabase(stageNo)
{
	if (window.XMLHttpRequest)
	{
		var readReq = new XMLHttpRequest();

		readReq.onreadystatechange = function ()
		{
			if (readReq.readyState == 4 && readReq.status == 200)
			{
				var mapdata = readReq.responseText;
				console.log("map data is :" + mapdata);
				g_mapinfo = mapdata.substring(mapdata.indexOf("=") + 1, mapdata.length);
				console.log("map info is :" + g_mapinfo);

				//set to stage mode. draw the peddle, ball, bricks on canvas
				initAllImages();
				return;
			}
		}

		var mapname = STAGE_MAP_STR_PREFIX + stageNo;

		//read data from map server
		readReq.open("post", "../MapEditor/mapserver.php", true);
		readReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		readReq.send("operation=get&MapName=" + mapname);
	}
	else
	{
		alert("Your browser not support ajax.");
		return;
	}

    
}



function initAllImages()
{
	//init the img, add to an array
	for (var row = 0; row < g_map_rows; row++)
	{
		for (var col = 0; col < g_map_column; col++)
		{
			console.log("g_mapinfo is : " + g_mapinfo[row * g_map_column + col]);
			if ("1" == g_mapinfo[row * g_map_column + col])
			{
				// img name is brick.png;
				console.log("MAP_TABLE[1] is :" + MAP_TABLE["1"] + ", x is " + col * 60 + ", y is " + row * 20);
				//prototype 的 值
				var brickImg = new BrickImg(MAP_TABLE["1"], col * 60, row * 20);
				g_arrBrickImgs.push(brickImg);

				//draw map in the array
				g_canvas_ctx.drawImage(brickImg.imgObj, brickImg.posx, brickImg.posy);
			}
		}
	}

    //draw peddle
	g_peddleImg = new PeddleImg(PEDDLE_IMG_NAME, 1320 / 2 - 60, 540);
	g_canvas_ctx.drawImage(g_peddleImg.imgObj, g_peddleImg.posx, g_peddleImg.posy);

	//draw ball
	g_ballImg = new BallImg(BALL_IMG_NAME, 1320 / 2 - 5, 530);
	g_canvas_ctx.drawImage(g_ballImg.imgObj, g_ballImg.posx, g_ballImg.posy);
}

function prepareToStart()
{

}

function initStageGame()
{
	//check if the window is big enough for the game.
	//should I support window size change?

	//init the div etc.
	initTheDocumentObj();

	//read map from database.
	readMapFromDatabase(g_currentStage);

	//wait player to start game.
	prepareToStart();
	return;
}


function gameloop()
{
	console.log("hi");
}

initStageGame();

//in game loop
setInterval(gameloop, 1000/30);