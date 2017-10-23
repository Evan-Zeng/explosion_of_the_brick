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
