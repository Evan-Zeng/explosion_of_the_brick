function ImgBall(imgPath) 
{
	Img.call(this, imgPath);
    if (this.imgSrc) //TODO:还要判断是否找得到这个图片
	{
		this.setImg(this.imgSrc);
	}
	this.imgType = IMG_TYPE_BALL;
	this.imgShape = IMG_SHAPE_CIRCLE;
}

ImgBall.prototype = new Img();
/*
    创建一个Image对象：var a=new Image();    定义Image对象的src: a.src=”xxx.gif”;    这样做就相当于给浏览器缓存了一张图片。
    不过既然它不显示在文档中，以下属性：lowsrc, width, height, vspace, hspace, border 就没有什么用途了。
*/
ImgBall.prototype.setImg = function (imgPath)
{
	this.imgObj = new Image();
	this.imgSrc = imgPath;
	this.imgObj.src = this.imgSrc;
	that = this;
	/* 注意 onload 是window调用的*/
	this.imgObj.onload = function ()
	{
		that.imgBallRadius = that.imgObj.width / 2;
	}
}
ImgBall.prototype.constructor = ImgBall;
ImgBall.prototype.collideWithRectPeddle = function(img)
{
	var imgBallCenter = new Point2(this.position.x + this.imgBallRadius / 2, this.position.y + this.imgBallRadius / 2);
	if ((imgBallCenter.x < img.position.x) || (imgBallCenter.x > img.position.x + img.imgObj.width))
	{
		//碰到左右两边，x轴速度变
		this.speed.x = -this.speed.x;
	}
	else
	{
		//碰到上下，y轴速度变
		this.speed.y = -this.speed.y;
	}
}

ImgBall.prototype.getRadius = function()
{
	return this.imgBallRadius;
}