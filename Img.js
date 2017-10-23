/*
	Class    : |-Img
			   |------ImgBall
			   |------ImgPeddle

	Describe : All images like balls, peddle, bricks etc. are from this class
*/
function Img(imgPath)
{
	this.imgObj = null;
	this.imgSrc = imgPath;
	this.speed = new Vector2(0, 0);
	this.position = new Point2(150, 146); 	//position都是的image的左上角
    this.imgObj = null;
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