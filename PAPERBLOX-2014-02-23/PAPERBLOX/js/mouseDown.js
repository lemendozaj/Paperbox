// JavaScript Document
function mouseDown()
{
	//c.fillText("mouseDown "+message, 10, 10);
	//message = "mouseDown : "+message;
	if(clickX>1000 && clickX<1066 && clickY <710 && clickY>640)
		UP();

	if(clickX>1068 && clickX<1180 && clickY <710 && clickY>640)
		RIGHT();
		
	if(clickX>770 && clickX<890 && clickY <710 && clickY>640)
		LEFT();

	if(clickX>900 && clickX<990 && clickY <710 && clickY>640)
		DOWN();
		
	if(clickX>750 && clickX<888 && clickY <588 && clickY>430)
		PAUSE();
}
//750,430 - 888,588 
function PAUSE()
{
	playAnimation = !playAnimation;
	message = "PAUSE : "+message;
	mainCicle();
}
//1000,640-1066,710
function UP()
{
	orientation++;
	orientation %= 4;
}
//900,640- 990,710
function DOWN()
{
	//message = "DOWN : "+message;
	yPos = lastLine-maxBottomLocal-1;
}
//770,640- 890,710
function LEFT()
{
	//message = "LEFT : "+message;
	if(xPos>=0)
		xPos --;
}
//1068,640-1180,710
function RIGHT()
{
	//message = "RIGHT : "+message;
	if(xPos<=8)
		xPos ++;
}