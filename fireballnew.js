IMG_TYPE_NONE = 0;
IMG_TYPE_BALL = 1;
IMG_TYPE_PEDDLE = 10;
IMG_TYPE_NORMAL_BRICK = 100;

IMG_SHAPE_UNKNOWN = 0;
IMG_SHAPE_CIRCLE = 1;
IMG_SHAPE_RECT = 2;
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
    this.gameDirectEventImgArray = []; //二维数组 UP DOWN LEFT RIGHT.
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
    		if (img.imgType == IMG_TYPE_PEDDLE)
    		{
    			if (img.position.x < 0)
    			{
    				img.position.x = 0;
    			}
    			else
    			{
    				img.position.x = 300 - img.imgObj.width;
    			}
    		}
    		else
    		{
    			img.position.x -= img.speed.x;
    			img.speed.x = -img.speed.x;
    			img.position.x += img.speed.x;
    			isCollide = true;
    		}
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

	this.registerMoveEvent = function (img)
	{
		this.gameDirectEventImgArray.push(img);
	}

	this.moveEventLeftKey = function ()
	{
		console.log("move left key down");
		for (var idx in this.gameDirectEventImgArray)
		{
			var tempImg = this.gameDirectEventImgArray[idx];
			tempImg.leftKeyDown();
		}
	}

	this.moveEventRightKey = function ()
	{
		console.log("move right key down");
		for (var idx in this.gameDirectEventImgArray)
		{
			var tempImg = this.gameDirectEventImgArray[idx];
			tempImg.rightKeyDown();
		}
	}

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

	var ballRadius = ball.getRadius();

	var rect_center_pos = new Point2(rect.position.x + rect.imgObj.width / 2, rect.position.y + rect.imgObj.height / 2);
	var rect_right_top_pos = new Point2(rect.position.x + rect.imgObj.width, rect.position.y);

	//不用转换象限，都在第一象限
	var vec_rect_pos = new Vector2(rect.position.x, rect.position.y);
	var vec_ball_pos = new Vector2(ball.position.x + ballRadius, ball.position.y + ballRadius);

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

	if (ballRadius * ballRadius >= v_minus_vec_half_diag_rect.dot(v_minus_vec_half_diag_rect))
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
		//只至判断是否相撞，但是不判断撞到哪了。。。
		return isCircleRectCollide(img_move, img_any);
	}

	return false;
}

/*
	游戏的主函数

*/
function __main()
{
	var game = new Game();
	var img = new ImgPeddle("peddle.png");
	
	game.addImgToGame(img);
	game.addMoveImgToGame(img);
	game.registerMoveEvent(img);
	
	document.onkeydown = function (event){
		if (event.keyCode == 13)
		{
			var ballImg = new ImgBall("ball.png");
            ballImg.speed.y = -2;
            ballImg.speed.x = 1;
            game.addImgToGame(ballImg);
            game.addMoveImgToGame(ballImg);
		}
		if (event.keyCode == 37)
		{
			game.moveEventLeftKey();
		}
		if (event.keyCode == 39)
		{
			game.moveEventRightKey();
		}
	};
	game.startGame();
	
}

__main();

