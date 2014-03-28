// JavaScript Document
var canvas 	= document.getElementById('micanvas');
var c 		= canvas.getContext('2d');

var playAnimation = true;
var gameOver=true;
var audio=false;

var bg 			= new Image();	// Background 	layer Image
var ele			= new Image();	// Elements 	layer Image
var ll 			= new Image();	// Foreground 	layer Image

var NewScript = document.createElement('script');

var msgHighScore 	= "HIGHEST";
var msgScore 		= "SCORE";
var msgLines		= "000";
var msgLevel		= 1;
var message = "starting up";
var pts = 0;
var totLines = 0;

var irows = 0;
var tempLines = 0;

var debug = "hola";

var currentFigure	= 0;
var nextFigure = Math.floor(Math.random() * 7);

var orientation 	= 0; 		// 0 - 3
var velocity = 100;
var temp = 100;
var color = 0;

var lastY = 610;
var lastLine = 26; 		//Max bottom line 

var clickX = 0;
var clickY = 0;

var xPos = 	4;
var yPos = -1;

var xPosNext = 0;
var yPosNext = 0;

var maxBottomLocal	= 0;
var timer = -1;

var col = 10;		// 0 - 	24
var row = 25; 	    // 0 -	09
var mainVel = 1;
var checkFigure = true;
var collision = false;
var save = false;
var drawNext = false;
var animation = false;
var boardCollision = null;
var boardColor = null;
var sound = $('#sonido')[0];


// Main Cicle
function mainCicle()
{
	animate();
	//if (gameOver)
	//{
	  if(playAnimation)
	      setTimeout(mainCicle, mainVel);
	//}
	timer++;
}

//Initializer
function init() {	
    boardInitializer();
    loadExternalJS();
    Reset();
	loadImages();
	window.onkeydown = keydownControl;
	mainCicle();
}
//Keydown control
function keydownControl(e) {
    if(playAnimation)
	{
	    switch(e.keyCode)
	    {
		    case 37:
		       LEFT();
		       break;
		    case 38:
		       UP();
		       break;
		    case 39:
		       RIGHT();
		       break;
            case 40:
              DOWN();
              break; 
            case 32:
			  if (gameOver== true)
			  {
			    if (sound.paused==false)
		        {
			      audio=true;
		          sound.pause();
		        }
			    else
			    {
			      audio=false;
			    }
	            sound.hidden= true;
                PAUSE();
			  } 
               break;
	    case 13:
		audio=false;
		msgLevel=1;
               	pts = 0;
                totLines = 0;
               
                			 
                sound.pause();
                sound.currentTime = 0;
		Reset();
		
                
               break;
            case 77:
			   if (sound.paused==true)
		        {
		          sound.play();
		        }
			    else
			    {
			      sound.pause();
			    }
               break;			
        }
	}	
    else
	{
	    sound.hidden= false;
	    //sound.duration > 0 && sound.paused para saber duracion y si esta en pausa
		if (audio==true)
		{
		 sound.play();
		}
        PAUSE();
	}	
}
//Load Images			
function loadImages()
{	
	bg.src = "img/bg.jpg";
	ele.src = "img/ele.png";
	ll.src = "img/ll.png";
}
//Load mouse event handlers extentions
function loadMouseEventHandlers()
{
//**************MOUSE EVENTS*****************	
	NewScript.src = "js/mouseClick.js";
	document.body.appendChild(NewScript);
	
	NewScript = document.createElement('script');
	NewScript.src = "js/mouseup.js";
	document.body.appendChild(NewScript);
	
	NewScript = document.createElement('script');
	NewScript.src = "js/mouseOver.js";
	document.body.appendChild(NewScript);
	
	NewScript = document.createElement('script');
	NewScript.src = "js/mouseOut.js";
	document.body.appendChild(NewScript);
	
	NewScript = document.createElement('script');
	NewScript.src = "js/mouseMoved.js";
	document.body.appendChild(NewScript);
		
	NewScript = document.createElement('script');
	NewScript.src = "js/mouseDown.js";
	document.body.appendChild(NewScript);
//**************MOUSE EVENTS*****************
}
//Load external files
function loadExternalJS()
{
	loadMouseEventHandlers();//**************MOUSE EVENTS*****************
	
	NewScript = document.createElement('script');
	NewScript.src = "js/vrb.js";
	document.body.appendChild(NewScript);
	
	NewScript = document.createElement('script');
	NewScript.src = "js/Util.js";
	document.body.appendChild(NewScript);
}
//Handle mouse events
function handleEvent(oEvent) {
	//message = " at : X = " + event.x + " Y = " + event.y;	
	clickX = event.x;
	clickY = event.y;
	
    switch (oEvent.type)
    {	
	case "mousedown":
        	 mouseDown();
        break;		
    }
}
//Dibuja en el canvas un cubo con posici�n X,Y dentro del grid 
// del tablero
function drawBlock(xP, yP, color) {
 
    if (checkFigure) {
        if (boardCollision[xP][yP] == 1 || maxBottomLocal + yPos > 24) {
            collision = true;
        }
    }
    else {
        if (!save) {

            if (drawNext)
                drawNextBlock(xP, yP, color);
            else {
                var rX = 285 + xP * 21; 	    //21 = width size
                var rY = 110 + (20 * (yP + 1)); // 20 = height size

                c.drawImage(ele,
	                21 * color, 0, 		//sx, sy	crop origin
	                21, 25, 			//sw, sh	crop size
	                rX, rY, 			//dx, dy   	pos
	                21, 25); 			//dw, dh	size
            }
        }
        else {
            boardCollision[xP][yP] = 1;
            boardColor[xP][yP] = color;
        }
    }
	//Game over
	if (boardCollision[xP][yP] == 1 && yP <= 0)
    {
	 sound.hidden= true;
	 sound.pause();
     sound.currentTime = 0;
     gameOver = !gameOver;
    }
	
}

function drawBoardBlock(xP,yP,color) {

        var rX = 285 + xP * 21; 	    // 21 = width size
        var rY = 110 + (20 * (yP + 1)); // 20 = height size

        c.drawImage(ele,
	        21 * color, 0, 		//sx, sy	crop origin
	        21, 25, 			//sw, sh	crop size
	        rX, rY, 			//dx, dy   	pos
	        21, 25); 			//dw, dh	size
}

function drawNextBlock(xP, yP, color) {

    var nX = 75 + xP * 21; 	        // 21 = width size
    var nY = 150 + (20 * (yP + 1)); // 20 = height size

    c.drawImage(ele,
	            21 * color, 0, 		//sx, sy	crop origin
	            21, 25, 			//sw, sh	crop size
	            nX, nY, 			//dx, dy   	pos
	            21, 25); 			//dw, dh	size
}

//Clean canvas
function cleanCanvas()
{
	canvas.width = canvas.width;
	c.save();
	c.drawImage(bg, 29, 0);
}

//Animate loop
function animate() {
	cleanCanvas();	
	update();		
	draw();	
}

//Update Function
function update() {

    if (velocity == 0) {
        yPos++;
        yPos %= (lastLine - maxBottomLocal);
    }
    else {
        if (timer % velocity == 0) {
            yPos++;
            yPos %= (lastLine - maxBottomLocal);   
        } 
    }
	message = "Figure : " + currentFigure + " Bottom : " + maxBottomLocal;
}

function Reset() {
    currentFigure = nextFigure;     
    maxBottomLocal = 0;
    orientation = 0;
    xPos = 4;
    yPos = 0;
    nextFigure = Math.floor(Math.random() * 7);
    CheckLines();

    velocity = 100 - (11 * ( msgLevel ) );
}

function CheckLines() {
    var tmpTotal = 0;
    var linesPTS = 0;
	
    for (row = 0; row < boardCollision[0].length; ++row) {
        tmpTotal = 0;
	
        for (col = 0; col < boardCollision.length; ++col) {
            tmpTotal += boardCollision[col][row];
        }
        if (tmpTotal > 9) {
            irows = 24 - row;
            linesPTS++;
            totLines++;
            tempLines++;
            for (row2 = 24 - row; row2 < boardCollision[0].length; ++row2) {
                for (col2 = 0; col2 < boardCollision.length; ++col2) {
                    boardCollision[col2][24-row2] = boardCollision[col2][23-row2];
                    boardColor[col2][24 - row2] = boardColor[col2][23 - row2];
                }               
            }
            row--;
            animation = true;
        }
    }

    if (animation)
        if (totLines % 10 == 0) {
            msgLevel++;
        }

    debug = linesPTS;
    switch (linesPTS) {
        case 1:
            pts += 40 * (msgLevel + 1);
            break;
        case 2:
            pts += 100 * (msgLevel + 1);
            break;
        case 3:
            pts += 300 * (msgLevel + 1);
            break;
        case 4:
            pts += 1200 * (msgLevel + 1);
            break;
    }	
}
// Draws an animation for the Y position asked
function cleanLineAnimate(yPosIndicated) {
    var colorCicle = timer;   
    for (lineAnimation = 0; lineAnimation < 10; ++lineAnimation) {
        colorCicle %= 9;
        drawBoardBlock(lineAnimation, yPosIndicated, colorCicle);
    }
    
}

//Board management
function boardInitializer()
{
    boardCollision = new Array(col);
    boardColor = new Array(col);
    for (col = 0; col < boardCollision.length; ++col) {
        boardCollision[col] = new Array(row);
        boardColor[col] = new Array(row);
	}
    
	for (col = 0; col < boardCollision.length; ++col)
	{
	    for (row = 0; row < boardCollision[col].length; ++row) {
	        boardCollision[col][row] = 0;
	        boardColor[col][row] = -1;
	    }
	}	
}

function boardManager()
{
	if(yPos<=lastLine)
		return;
}

// HERE WE HAVE TO DRAW THE DISPLAY BOARD
function drawBoard()
{
	for (col = 0; col < boardCollision.length; ++ col){	
		for (row = 0; row < boardCollision[col] . length; ++ row)
		    drawBoardBlock(col, row, boardColor[col][row]);
   }

    var tempX = xPos;
    var tempY = yPos;
    var tmpOr = orientation;
    xPos = 4;
    yPos = 0;
    orientation = 0;
    drawNext = true;
        drawFigures();
        drawNext = false;
        xPos = tempX;
        yPos = tempY;
        orientation = tmpOr;
}

//Main draw function
function draw() {

	if(!playAnimation){
	    c.font = "45px Comic Sans MS";
		c.fillStyle = "rgb(250, 250, 250)"; 
		c.fillText("P A U S E" , 290, 370);
	}
	//document.write(collision+":"+yPos+"\n")
	else if (!gameOver){
	   	c.font = "45px Comic Sans MS";
		c.fillStyle = "rgb(250, 250, 250)"; 
		c.fillText("G A M E" , 300, 370);
		c.fillStyle = "rgb(250, 250, 250)"; 
		c.fillText("O V E R" , 308, 420);		
	}
	else
	{
		drawBoard(); 							// Board Update
	
		c.font = "24px Comic Sans MS";
		c.fillStyle = "rgb(250, 250, 250)"; //score
	 
    		//c.fillText("Timer: " + timer + " 	" + message+" "+velocity, 100, 30);	
    		//c.fillText(msgHighScore, 450, 70);    	
		c.fillText(" "+ pts, 370, 90);
		c.fillText(" " + totLines, 210, 595);
		c.font = "45px Comic Sans MS";
		c.fillText(msgLevel, 172, 365);
	
		

	if (!animation) {
	    checkFigures(); 							// Figure
	    if (collision) {
	        yPos--;
	        saveFigures();	        
	        Reset();
	    }
	    else {
	        drawFigures();
	    }
	}
	else {
	        cleanLineAnimate(25 - tempLines);
        if(tempLines<3)
            animation = false; //*/
        tempLines--;
	}
		
	collision = false;
}	
}
function checkFigures() {// O I Z S T L J
    checkFigure = true;

    drawFigure(currentFigure);
    checkFigure = false;
}
function saveFigures() {// O I Z S T L J
    save = true;
    drawFigure(currentFigure);
    save = false;
}
//Switch to drawFigures 
function drawFigures() {// O I Z S T L J
    if (!drawNext)
        drawFigure(currentFigure);
    else 
        drawFigure(nextFigure);
}

function drawFigure(figure)
{
        switch (figure) {
            case 0:
                generateO();
                break;
            case 1:
                generateI();
                break;
            case 2:
                generateZ();
                break;
            case 3:
                generateS();
                break;
            case 4:
                generateT();
                break;
            case 5:
                generateL();
                break;
            case 6:
                generateJ();
                break;
        }
}


function generateO()
{
	color = 0;
	maxBottomLocal = 1;
	
	for(var i = 0; i<2; i++)
	{
		if(xPos >8)
			xPos = 8;
		if(xPos < 0)
			xPos = 0;
			
			drawBlock( xPos+i,yPos+1,color);
			drawBlock( xPos+i,yPos,color);
	}
}
//I  ocuupies 1 column or 4 columns
function generateI()
{
	color = 1;

	if(orientation == 0 || orientation == 2)
	{
		if(xPos<1)
			xPos = 1;
		if(xPos > 7)
			xPos = 7;		
		maxBottomLocal = 0;	
		for(var i = 0; i<4; i++)
			drawBlock( xPos+i-1,yPos,color);
	}
	else 
	{
		if(xPos<0)
			xPos = 0;
		if(xPos > 9)
			xPos = 9;
		
		maxBottomLocal = 2;		
		for(var i = 0; i<4; i++)
			drawBlock( xPos,yPos-1+i,color);
	}	
}
//Z  ocuupies 4 columns or 3 columns
function generateZ()
{
	color =	 2;
	
	if(orientation == 0 || orientation == 2)
	{
		if(xPos>7)
			xPos = 7;
		if(xPos<0)
				xPos = 0;
		maxBottomLocal = 1;	
		for(var i = 0; i<2; i++)
		{
			drawBlock( xPos+i+1,yPos+1,color);
			drawBlock( xPos+i,yPos,color);
		}
	}
	else
	{
		if(xPos>8)
			xPos = 8;
		if(xPos<0)
				xPos = 0;
		maxBottomLocal = 1;
		for(var i = 0; i<2; i++)
		{
			drawBlock( xPos+1,yPos+i-1,color);
			drawBlock( xPos,yPos+i,color);
		}
	}
}
//S  ocuupies 4 columns or 3 columns
function generateS()
{
	color = 3;
	maxBottomLocal = 1;
	if(xPos>7)
			xPos = 7;
			
	if(orientation == 0 || orientation == 2)
	{
		if(xPos<0)
				xPos = 0;
		for(i = 0; i<2; i++)
		{
			drawBlock(1+xPos+i,yPos,color);
			drawBlock(xPos+i,yPos+1,color);
		}
	}
	else
	{		
		for(i = 0; i<2; i++)
		{
			drawBlock(xPos+1,yPos+i-1,color);
			drawBlock(xPos+2,yPos+i,color);
		}
	}
}
//T  ocuupies 3 columns
function generateT()
{
	color = 4;
			 			 
	switch(orientation)
	{
		case 0:
			if(xPos>7)
				xPos = 7;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 1;

			for(var i = 0; i<3; i++)
			{
				drawBlock( xPos+i,yPos,color);		
			}drawBlock( xPos+1,yPos+1,color);
		break;
		case 1:
			if(xPos>8)
				xPos = 8;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 2;
			for(var i = 0; i<3; i++)
			{
				drawBlock( xPos+1,yPos+i,color);		
			}drawBlock( xPos,yPos+1,color);
		break;
		case 2:
			if(xPos>7)
				xPos = 7;			
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 1;			
			for(var i = 0; i<3; i++)
			{
				drawBlock( xPos+i,yPos+1,color);		
			}drawBlock( xPos+1,yPos,color);
		break;
		case 3:
			if(xPos>7)
				xPos = 7;
			maxBottomLocal = 2;
			for(var i = 0; i<3; i++)
			{
				drawBlock( xPos+1,yPos+i,color);		
			}drawBlock( xPos+2,yPos+1,color);
		break;
	}
}
//L  ocuupies 2 columns or 3 columns 
function generateL()
{
	color = 5;

	switch(orientation)
	{
		case 0:
			if(xPos>8)
				xPos = 8;
			if(xPos<0)
				xPos = 0;

			maxBottomLocal = 2;
			for(var i = -1; i<2; i++)
			{
				drawBlock( xPos,yPos+i+1,color);		
			}drawBlock( xPos+1,yPos+2,color);
		break;
		case 1:
			if(xPos>7)
				xPos = 7;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 1;
			for(var i = -1; i<2; i++)
			{
				drawBlock( xPos+i+1,yPos,color);		
			}drawBlock( xPos,yPos+1,color);
		break;
		case 2:
			if(xPos>7)
				xPos = 7;
			maxBottomLocal = 1;
			for(var i = -1; i<2; i++)
			{
				drawBlock( xPos+2,yPos+i,color);		
			}drawBlock( xPos+1,yPos-1,color);
		break;
		case 3:
			if(xPos>7)
				xPos = 7;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 0;
			for(var i = -1; i<2; i++)
			{
				drawBlock(1+ xPos+i,yPos,color);		
			}drawBlock(1+ xPos+1,yPos-1,color);
		break;
	}
}
//J  ocuupies 2 columns or 3 columns
function generateJ()
{
	color = 6;

	switch(orientation)
	{
		case 0:
			if(xPos>8)
				xPos = 8;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 2;
			for(var i = -1; i<2; i++)
			{
				drawBlock( xPos+1,yPos+i+1,color);		
			}drawBlock( xPos,yPos+2,color);
		break;
		case 1:
			if(xPos>7)
				xPos = 7;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 0;			
			for(var i = -1; i<2; i++)
			{
				drawBlock( xPos+i+1,yPos,color);		
			}drawBlock( xPos,yPos-1,color);
		break;
		case 2:
			if(xPos>8)
				xPos = 8;
			if(xPos<0)
				xPos = 0;
			maxBottomLocal = 1;					
			for(var i = -1; i<2; i++)
			{
				drawBlock( xPos,yPos+i,color);		
			}drawBlock( xPos+1,yPos-1,color);
		break;
		case 3:
			if(xPos>7)
				xPos = 7;
			if(xPos<0)
				xPos = 0;	
			maxBottomLocal = 0;				
			for(var i = -1; i<2; i++)
			{
				drawBlock(xPos+i+1,yPos-1,color);		
			}drawBlock(xPos+2,yPos,color);
		break;
	}
}

// O I Z S T L J
