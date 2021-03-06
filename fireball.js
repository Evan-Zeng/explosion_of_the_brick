IMG_TYPE_NONE = 0;
IMG_TYPE_BALL = 1;
IMG_TYPE_PEDDLE = 10;
IMG_TYPE_NORMAL_BRICK = 100;

IMG_SHAPE_UNKNOWN = 0;
IMG_SHAPE_CIRCLE = 1;
IMG_SHAPE_RECT = 2;

/* miloyip */
function Point2(x, y) { this.x = x; this.y = y; }

function Vector2(x, y)
{
	Point2.call(this, x, y);
}

Vector2.prototype = new Point2(0, 0);
Vector2.constructor = Vector2;

Vector2.prototype.copy = function() {};
Vector2.prototype.substract = function (u) { return new Vector2(this.x - u.x, this.y - u.y); }
Vector2.prototype.dot = function (u) { return this.x * u.x + this.y * u.y; }

/*
	Class Name: Game

	应该是个单例
*/
function Game()
{
    //game bkg
    this.gameCanvasBkg;
    this.gameCanvasBkgContext2D;
    this.gameCanvasBkgRightTopPosX = 0;
    this.gameCanvasBkgRightTopPosY = 0;
    this.gameCanvasBkgHeight = 200;
    this.gameCanvasBkgWidth = 300;
    
    this.gameImagesArray = [];
    this.gameMoveImagesArray = [];
    this.gameStartFlag = false;

	//update 函数
	this.gameInit = function ()
	{
		this.gameCanvasBkg = document.getElementById('canvas_gamebkg');
		this.gameCanvasBkg.width = this.gameCanvasBkgWidth;
		this.gameCanvasBkg.height = this.gameCanvasBkgHeight;
		this.gameCanvasBkgContext2D = this.gameCanvasBkg.getContext('2d');

		console.log('Game init ok');
	};

	this.drawAllImage = function()
	{
		for (idx in this.gameMoveImagesArray) //img是下标
		{
			var img = this.gameMoveImagesArray[idx];
			
			img.move();

			this.CollideTest(img);

			this.gameCanvasBkgContext2D.drawImage(img.imgObj, img.position.x, img.position.y);

		}
	};

	/* 游戏的主逻辑 */
	this.updateGame = function ()
	{
		if (true === this.gameStartFlag)
		{
			this.gameCanvasBkgContext2D.clearRect(this.gameCanvasBkgRightTopPosX, this.gameCanvasBkgRightTopPosY, this.gameCanvasBkgWidth, this.gameCanvasBkgHeight);

			this.drawAllImage();
		}
	};

	this.isCollideWithWall = function(img)
	{
		var isCollide = false;
    	img.position.x += img.speed.x;
    	img.position.y += img.speed.y;

    	if ((img.position.x < 0) || (img.position.x > (300 - img.imgObj.width)))
    	{
    		// 恢复
    		img.position.x -= img.speed.x;
    		img.speed.x = -img.speed.x;
    		img.position.x += img.speed.x;
    		isCollide = true;
    	}

    	if ((img.position.y < 0) || (img.position.y > (200 - img.imgObj.height / 2)))
    	{
    		img.position.y -= img.speed.y;
    		img.speed.y = -img.speed.y;
    		img.position.y += img.speed.y;
    		isCollide = true;
    	}
    	
    	return isCollide;
	};

	this.isCollideWithOthers = function(img_move)
	{
		for (idx in this.gameImagesArray)
		{
			var imgAny = this.gameImagesArray[idx];
			var isCollide = imgIsCollide(img_move, imgAny);
			if (isCollide)
			{
				img_move.collideWith(imgAny);
				//每个img都有一个collide函数，通过另一个img的类型和圆心，判断自己的变化
				console.log("img1 pos is " + img_move.position.x + "," + img_move.position.y + " img2 pos is " + imgAny.position.x + "," + imgAny.position.y);
			}
			else
			{
				//console.log("NOT COLLIDE img1 pos is " + img_move.position.x + "," + img_move.position.y + " img2 pos is " + imgAny.position.x + "," + imgAny.position.y);
			}
		}
	}

    this.CollideTest = function (img) 
    {
    	this.isCollideWithWall(img);

    	this.isCollideWithOthers(img);
    };

	this.startGame = function()
	{
		this.gameStartFlag = true;
		console.log('game start true, flag is ' + this.gameStartFlag);
	};

	this.stopGame = function()
	{
		this.gameStartFlag = false;
	};

	this.addImgToGame = function (img)
	{
		this.gameImagesArray.push(img);
		console.log('add img to game, img ' + img);
	};

	this.addMoveImgToGame = function (img)
	{
		this.gameMoveImagesArray.push(img);
		console.log('add move img to game, img ' + img);
	};

	this.gameInit();
	setInterval(this.updateGame.bind(this), 1000/30);   //挖槽，这个this，是window

	console.log('Game obj ok');
}

function isCircleRectCollide(img_one, img_two)
{
	var ball, rect;
	if (IMG_SHAPE_CIRCLE === img_one.imgShape)
	{
		ball = img_one;
		rect = img_two;
	}
	else
	{
		ball = img_two;
		rect = img_one;
	}
	var rect_center_pos = new Point2(rect.position.x + rect.imgObj.width / 2, rect.position.y + rect.imgObj.height / 2);
	var rect_right_top_pos = new Point2(rect.position.x + rect.imgObj.width, rect.position.y);

	//不用转换象限，都在第一象限
	var vec_rect_pos = new Vector2(rect.position.x, rect.position.y);
	var vec_ball_pos = new Vector2(ball.position.x + ball.imgRadius / 2, ball.position.y + ball.imgRadius / 2);

	var v = vec_ball_pos.substract(vec_rect_pos);
	v.x = Math.abs(v.x);
	v.y = Math.abs(v.y);

	var vec_half_diag_rect = new Vector2(Math.abs(rect_right_top_pos.x - rect_center_pos.x), Math.abs(rect_right_top_pos.y - rect_center_pos.y)); 
	var v_minus_vec_half_diag_rect = v.substract(vec_half_diag_rect);
	if (v_minus_vec_half_diag_rect.x < 0)
	{
		v_minus_vec_half_diag_rect.x = 0;
	}
	if (v_minus_vec_half_diag_rect.y < 0)
	{
		v_minus_vec_half_diag_rect.y = 0;
	}

	if (ball.imgRadius * ball.imgRadius >= v_minus_vec_half_diag_rect.dot(v_minus_vec_half_diag_rect))
	{
		return true;
	}

	return false;
}

function imgIsCollide(img_move, img_any)
{
	if((IMG_SHAPE_CIRCLE === img_move.imgShape && IMG_SHAPE_RECT === img_any.imgShape) ||
		(IMG_SHAPE_RECT === img_move.imgShape && IMG_SHAPE_CIRCLE === img_any.imgShape))
	{
		//只至判断是否相撞，但是不判断撞到哪了
		return isCircleRectCollide(img_move, img_any);
	}

	return false;
}

/*
	Class    : Img

	Describe : All images like balls, peddle, bricks etc. are from this class
*/
function Img(imgPath, type, shape)
{
	this.imgObj = null;
	this.imgSrc = imgPath;
	this.speed = new Vector2(0, 0);
	//position 都是 image的左上角
	this.position = new Point2(150, 146);
	this.imgType = type;
	this.imgShape = shape;

	if (this.imgSrc)
	{
		this.setImg(this.imgSrc);
	}
}

/*
    创建一个Image对象：var a=new Image();    定义Image对象的src: a.src=”xxx.gif”;    这样做就相当于给浏览器缓存了一张图片。
    不过既然它不显示在文档中，以下属性：lowsrc, width, height, vspace, hspace, border 就没有什么用途了。
*/
Img.prototype.setImg = function (imgPath)
{
	this.imgObj = new Image();
	this.imgSrc = imgPath;
	this.imgObj.src = this.imgSrc;
	imgInstance = this;
	this.imgObj.onload = function ()
	{
		if ((IMG_SHAPE_CIRCLE === imgInstance.imgShape) && (imgInstance.imgObj != null))
		{
			imgInstance.imgRadius = imgInstance.imgObj.width / 2;
			console.log("imgRadius is " + imgInstance.imgRadius);
		}
		else
		{
			console.log("load!!!, shape is " + imgInstance.imgShape);
		}
	};
}


Img.prototype.move = function  ()
{
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
};

Img.prototype.collideWith = function(img)
{
	if (IMG_SHAPE_CIRCLE === this.imgShape)
	{
		var ball_center = new Point2(this.position.x + this.imgRadius / 2, this.position.y + this.imgRadius / 2);
		if (IMG_SHAPE_RECT === img.imgShape)
		{
			if(IMG_TYPE_PEDDLE === img.imgType)
			{
				//应该是用this img的移动前比较
				if ((ball_center.x < img.position.x) || (ball_center.x > img.position.x + img.imgObj.width))
				{
					this.speed.x = -this.speed.x;
				}
				else
				{
					this.speed.y = -this.speed.y;
				}

				console.log("speed changed");
			}
		}
	}
};

/*
	游戏的主函数

*/
function __main()
{
	var game = new Game();
	var img = new Img("peddle.png", IMG_TYPE_PEDDLE, IMG_SHAPE_RECT);
	
	game.addImgToGame(img);
	game.addMoveImgToGame(img);
	
	document.onkeydown = function (event){
		if (event.keyCode == 13)
		{
			var ballImg = new Img("ball.png", IMG_TYPE_BALL, IMG_SHAPE_CIRCLE);
            ballImg.speed.y = -2;
            ballImg.speed.x = 1;
            game.addImgToGame(ballImg);
            game.addMoveImgToGame(ballImg);
		}
		if (event.keyCode == 37)
		{
			console.log('key down left'); 
			if (img.position.x >= 3){
				img.position.x -= 3;
			}

		}
		if (event.keyCode == 39)
		{
			console.log('key down right'); 
			if (img.position.x <= 280){
				img.position.x += 3;
			}
		}
	};
	game.startGame();
	
}

__main();