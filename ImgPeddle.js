function ImgPeddle(imgPath)
{
	Img.call(this, imgPath);
	if (this.imgSrc) //TODO:还要判断是否找得到这个图片
	{
		this.setImg(this.imgSrc);
	}
	this.imgType = IMG_TYPE_PEDDLE;
	this.imgShape = IMG_SHAPE_RECT;
}

ImgPeddle.prototype = new Img();
ImgPeddle.prototype.setImg = function (imgPath)
{
	this.imgObj = new Image();
	this.imgSrc = imgPath;
	this.imgObj.src = this.imgSrc;
	/* 注意 onload 是window调用的*/
	this.imgObj.onload = function ()
	{
	}
}
ImgPeddle.prototype.constructor = ImgPeddle;

/*
	注册 感知 左移，右移事件
*/