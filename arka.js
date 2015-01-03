
/**
*represent a coordonate in 2 dimensional plan
*/
Coord2D = function(){
	var x;
	var y;
	
	this.getX = function(){
		 return x;
	};
	
	this.getY = function(){
		 return y;
	};
	
	this.setX = function(xParameter){
		x = xParameter;
	};
	
	this.setY = function(yParameter){
		y = yParameter;
	};
};

/**
* the tray, define by its coordinates and its lenght;
*/
Tray = function(){
	/**
	* coordinate of the tray
	*/
	var position;
	
	/**
	* size of the tray
	*/
	var size;
	
	/**
	* is the ball attached to the tray: i.e.:
	waiting for un gamer click to move
	*/
	var isBallAttached;
	
	/**
	* set the position of the tray.
	*/
	this.setPosition = function(xCoordinate, ball, canvasElement){
		position.setX(xCoordinate - canvasElement.offsetLeft);
		if(isBallAttached){
			ball.getPosition().setX(position.getX());
		}
	};
	/**
	* initialize the tray position and lenght
	*/
	this.initialize = function(x,y, width, height){
		position = new Coord2D();
		position.setX(x);
		position.setY(y);
		size = new Coord2D();
		size.setX(width);
		size.setY(height);
		isBallAttached = true;
	};
	
	this.getPosition = function(){
		return position;
	};
	
	this.getSize = function(){
		return size;
	};
	
	this.draw = function(canvas){
		var context = canvas.getContext('2d');      
		context.fillStyle = "rgb(150,29,28)";
		context.fillRect (position.getX(),canvas.height - position.getY(),size.getX(),size.getY());
		console.log("draw the tray at position ("+position.getX() +","+position.getY() +")");
	};
	
	/**
	* attach the ball to the tray
	*/
	this.attachBall = function(){
		isBallAttached = true;
	}
	
	/**
	* unattach the ball to the tray
	*/
	this.unattachBall = function(){
		isBallAttached = false;
	}
	
	/**
	* return true if the ball is attached to the tray, else false
	*/
	this.isBallAttached=function(){
		return isBallAttached;
	}
};

Level = function(){
	
	/**
	* the level canvcas
	*/	
	var canvas;
	
	/**
	* the original canvcas
	*/	
	var originalCanvasSave;
	
	/**
	* the brick border width
	*/
	var brickBorderWidth = 1;
	/**
	* the width of the brick
	*/
	var brickWidth;
	/**
	* the height of the brick
	*/
	var brickHeight;
	
	/**
	* the brick pixel value
	*/
	var brickRedColorValue=0;
	var brickGreenColorValue=255;
	var brickBlueColorValue=255;
	
	/**
	* the brick border color value
	*/
	var brickBorderRedColorValue=0;
	var brickBorderGreenColorValue=255;
	var brickBorderBlueColorValue=0;

	/**
	* initialize a level canvas
	*/	
	this.initializeRandom = function(brickWidth, brickHeight){
		//draw the bricks
		for(var x = 0; x < canvas.width; x+=brickWidth){
			//starting verticaly from middle height
			for(var y = canvas.height/2; y < canvas.height; y+=brickHeight){
				context = canvas.getContext('2d');
				context.beginPath();
				context.rect(x, canvas.height -y,  brickWidth,-brickHeight);
				context.fillStyle = 'rgb('+brickRedColorValue+','+brickGreenColorValue+','+brickBlueColorValue+')';
				context.fill();
				context.lineWidth = brickBorderWidth;
				context.strokeStyle ='rgb('+brickBorderRedColorValue+','+brickBorderGreenColorValue+','+brickBorderBlueColorValue+')';
				context.stroke();
			}	
		}
	};


	/**
	* initialize the level
	*/
	this.initialize=function(canvasForCalcul,brickWidthparameter, brickHeightParameter){
		originalCanvasSave =createBufferCanvasFronDisplayCanvas(canvasForCalcul);
		canvas= canvasForCalcul;
		brickWidth = brickWidthparameter;
		brickHeight = brickHeightParameter;
		this.initializeRandom(brickWidth, brickHeight);
	};
	
	
	
	//remove a brick from the canvas
	this.removeBrick= function(x,y){
		context = canvas.getContext('2d');
		var pixel = context.getImageData(x,canvas.height-y,1,1).data;
		var tempPixel;
		var minX;
		var minY;
		for(minX = x; minX >= 0 ; minX--){
			tempPixel = context.getImageData(minX,canvas.height- y,1,1).data;
			if(tempPixel[0] != pixel[0] || tempPixel[1] != pixel[1] || tempPixel[2] != pixel[2]){
				break;
			}
		}
		for(minY = y; minY <= canvas.height ; minY++){
			tempPixel = context.getImageData(x,canvas.height- minY,1,1).data;
			if(tempPixel[0] != pixel[0] || tempPixel[1] != pixel[1] || tempPixel[2] != pixel[2]){
				break;
			}
		}
		context.drawImage(originalCanvasSave,minX, canvas.height - minY,brickWidth,brickHeight,minX, canvas.height - minY,brickWidth,brickHeight);
	};

	/**
	* detect colision with brick
	*/
	this.detectColisionWithBrick = function(tempNextPosition){
		var result = false;
		context = canvas.getContext('2d');
		var pixel = context.getImageData(tempNextPosition.getX(),canvas.height-tempNextPosition.getY(),1,1).data;
		if(pixel[0] ==  brickBorderRedColorValue && pixel[1] == brickBorderGreenColorValue && pixel[2] == brickBorderBlueColorValue){
			result = true;
		}
		return result;
	};

	this.calculateRebondWithBrick = function(tempNextPosition, ball){
		var emptyLeft;
		var emptyRight;
		var emptyTop;
		var emptyBottom;		
		var tempPixel = context.getImageData(tempNextPosition.getX()-1,canvas.height-tempNextPosition.getY(),1,1).data;	
		if(tempPixel[0] ==  brickBorderRedColorValue && tempPixel[1] == brickBorderGreenColorValue && tempPixel[2] == brickBorderBlueColorValue){
			emptyLeft = false;
		}else{
			emptyLeft = true;
		}
		tempPixel = context.getImageData(tempNextPosition.getX()+1,canvas.height-tempNextPosition.getY(),1,1).data;	
		if(tempPixel[0] ==  brickBorderRedColorValue && tempPixel[1] == brickBorderGreenColorValue && tempPixel[2] == brickBorderBlueColorValue){
			emptyRight = false;
		}else{
			emptyRight = true;
		}
		tempPixel = context.getImageData(tempNextPosition.getX(),canvas.height-tempNextPosition.getY()-1,1,1).data;	
		if(tempPixel[0] ==  brickBorderRedColorValue && tempPixel[1] == brickBorderGreenColorValue && tempPixel[2] == brickBorderBlueColorValue){
			emptyTop = false;
		}else{
			emptyTop = true;
		}
		tempPixel = context.getImageData(tempNextPosition.getX()+1,canvas.height-tempNextPosition.getY()+1,1,1).data;	
		if(tempPixel[0] ==  brickBorderRedColorValue && tempPixel[1] == brickBorderGreenColorValue && tempPixel[2] == brickBorderBlueColorValue){
			emptyBottom = false;
		}else{
			emptyBottom = true;
		}
		if(emptyLeft){
			if(emptyTop){
				//left-top corner
				ball.setAngle(315);
			}else if(emptyBottom){
				//left-bottom corner
				ball.setAngle(225);
			}else{
				//left side
				if(ball.getAngle() < 90){
					ball.setAngle(360 - (90 - ball.getAngle()));
				}else{
					ball.setAngle(270 - (ball.getAngle() -90));
				}
			}
		}else if(emptyRight){
			if(emptyTop){
				//right-top corner
				ball.setAngle(45);
			}else if(emptyBottom){
				//right-bottom corner
				ball.setAngle(135);
			}else{
				//right side
				if(ball.getAngle() > 270){
					ball.setAngle(90 - (ball.getAngle() -270));
				}else{
					ball.setAngle(90 + (270 -ball.getAngle()));
				}
			}
		}else if(emptyTop){
			//top side
			if(ball.getAngle() > 180){
				ball.setAngle(360-(ball.getAngle()-180));
			}else{
				ball.setAngle(180 - ball.getAngle());
			}
		}else if(emptyBottom){
			//bottom side
			if(ball.getAngle() < 90){
				ball.setAngle(180 - ball.getAngle());
			}else{
				ball.setAngle(180 + (360 - ball.getAngle()));
			}
		}
		this.removeBrick(tempNextPosition.getX(),tempNextPosition.getY());

	};

};

/**
* the representation of the ball, with its position and move vectore
*/
Ball = function(){
	
	/**
	* the coordinate of the ball
	*/
	var position;
	
	/**
	* the angle of the ball from the normal (in degree)
	*/
	var angle;
	
	/**
	* the ball speed
	*/
	var speed;
	
	/**
	* the radius of the ball
	*/
	var size;
	/**
	* instantiate ther ball vector and position
	*/
	this.initialize = function(x,y,radius, angleParameter,speedParameter){
		position=new Coord2D();
		position.setX(x);
		position.setY(y);
		size = radius;
		angle=angleParameter;		
		speed = speedParameter;
	};
	
	/**
	* return the ball 2D vector
	*/
	this.getAngle = function(){
		return angle;
	};
	
	/**
	* return the ball position
	*/
	this.getPosition = function(){
		return position;
	};
	
	/**
	* draw the ball on the canvas
	*/
	this.draw = function(canvas){
		var context = canvas.getContext('2d');
		context.fillStyle = "rgb(29,150,28)";
		context.fillRect (position.getX()-size,canvas.height - position.getY()-size,size,size);
		console.log("draw the ball at position: ("+position.getX() +","+position.getY() +")");
	};
	
	/**
	* return the ball speed
	*/
	this.getSpeed = function(){
		return speed;
	}

	/**
	* set the angle
	*/
	this.setAngle = function(angleParameter){
		angle = angleParameter;
	};
	
	/**
	* set the ball position
	*/
	this.setPosition = function(x, y){
		position.setX(x);
		position.setY(y);
	}
};

/**
* representation of the ball
*/
game = function(canvas){

	/**
	* the ball
	*/
	var ball;
	
	/**
	* the tray
	**/
	var tray;
	
	/**
	* the level containing the bricks
	*/
	var level;
	
	/**
	* the background canvas use for game logic
	*/
	var backgroudCanvas;
	
	/**
	* the canvas used for displaying
	*/
	var displayCanvas;
	
	/**
	* define uf the player loose the party
	*/
	var loose = false;
	
	/**
	* define uf the player win the party
	*/
	var win = false;
	
	/**
	* move the ball to its next atomic position.
	*/
	moveBall = function(canvasForCalcul){
		//var approximationError =0;
		var cumulDistance = 0;
		var fromX;
		var fromY;
		var distanceX;
		var distanceY;
		var tempNextPosition;
		var approximationError;
		while(cumulDistance < ball.getSpeed()){
			//the temp next position for detecting colision
			fromX = ball.getPosition().getX();
			fromY = ball.getPosition().getY();
			distanceX = Math.sin(ball.getAngle()* Math.PI / 180)* ball.getSpeed();
			distanceY = Math.cos(ball.getAngle()* Math.PI / 180)* ball.getSpeed();
			tempNextPosition = new Coord2D();
			approximationError = 0;			
			if(Math.abs(distanceX) > Math.abs(distanceY)){
				if(distanceX > 0){
					tempNextPosition.setX(fromX+1);		
				}else{
					tempNextPosition.setX(fromX-1);	
				}
				approximationError += Math.abs(distanceY) / Math.abs(distanceX);
				if(distanceY > 0){
					tempNextPosition.setY(Math.round(fromY+approximationError));		
				}else{
					tempNextPosition.setY(Math.round(fromY-approximationError));	
				}
			}else{
				if(distanceY > 0){
					tempNextPosition.setY(fromY+1);		
				}else{
					tempNextPosition.setY(fromY-1);	
				}
				approximationError += Math.abs(distanceX) / Math.abs(distanceY);
				if(distanceX > 0){
					tempNextPosition.setX(Math.round(fromX+approximationError));		
				}else{
					tempNextPosition.setX(Math.round(fromX-approximationError));	
				}
			}
			//the real next position of the ball to calculate	
			if(detectColisionWithTray(tempNextPosition, tray)){
				calculateRebonbWithTray(tempNextPosition, tray);
			}else if(detectColisionWithBorder(tempNextPosition, canvasForCalcul)){
				caculateRebondWithBorder(tempNextPosition, canvasForCalcul);		
			}else if(detectColisionWithBrick(tempNextPosition, canvasForCalcul)){
				calculateRebondWithBrick(tempNextPosition, canvasForCalcul);		
			}else{
				cumulDistance++;
				ball.setPosition(tempNextPosition.getX(), tempNextPosition.getY());
			}
			checkLoose();
			checkWin();
		}
	};
	

	/**
	* detect a collision with the tray
	*/
	detectColisionWithTray=function(tempNextPosition,tray){
		var result = false;
		if(ball.getAngle() > 90 && ball.getAngle() < 270 && Math.floor(tempNextPosition.getY()) == tray.getPosition().getY() && tempNextPosition.getX() >= tray.getPosition().getX()  && tempNextPosition.getX() <= tray.getPosition().getX()+tray.getSize().getX()){
			result = true;
		}
		return result;
	};
	
	/**
	* calcul and actualize the ball position and angle after a colision with the tray
	*/
	calculateRebonbWithTray=function(tempNextPosition, tray){
			var ballFract = (ball.getPosition().getX() - tray.getPosition().getX())+1;
			var fractAngle = 160 / tray.getSize().getX();
			var newAngle = ((ballFract * fractAngle) +270) % 360;
			ball.setAngle(newAngle);
	};

	/**
	* detect collision with the border
	*/
	detectColisionWithBorder=function(tempNextPosition, canvasForCalcul){
		var result = false;
		if(tempNextPosition.getX() <= 0  || tempNextPosition.getX() >= canvasForCalcul.width || tempNextPosition.getY()  >= canvasForCalcul.height ){
			result = true;
		}
		return result;
	};

	/**
	* calcul and actualize the ball position and angle after a colision with the border
	*/	
	caculateRebondWithBorder=function(tempNextPosition, canvasForCalcul){
		//collision with left border
		if(tempNextPosition.getX() <= 0){
			//180 < angle < 360
			if(ball.getAngle() > 270){
				ball.setAngle(90 - (ball.getAngle() -270));
			}else{
				ball.setAngle(90 + (270 -ball.getAngle()));
			}
		
		} //collision with right border
		else if(tempNextPosition.getX() >= canvasForCalcul.width){
			// 0 < angle < 180
			if(ball.getAngle() < 90){
				ball.setAngle(360 - (90 - ball.getAngle()));
			}else{
				ball.setAngle(270 - (ball.getAngle() -90));
			}
		}//collision with top
		else if(tempNextPosition.getY() >= canvasForCalcul.height){
			// 270 < angle <360 ou 0 < angle < 90
			if(ball.getAngle() < 90){
				ball.setAngle(180 - ball.getAngle());
			}else{
				ball.setAngle(180 + (360 - ball.getAngle()));
			}
		}
		
	};

	/**
	* detect colision with brick
	*/
	detectColisionWithBrick= function(tempNextPosition, canvasForCalcul){
		return level.detectColisionWithBrick(tempNextPosition);
	};	

	/**
	* calcul and actualize the ball position and angle after a colision with a brick
	*/
	calculateRebondWithBrick= function(tempNextPosition, canvasForCalcul){
		return level.calculateRebondWithBrick(tempNextPosition,ball);
	};

	/**
	*move the ball to its next displayPosition
	*/
	animate = function(backgroundCanvas,displayCanvas){
		if(tray.isBallAttached() == false){
			moveBall(backgroundCanvas);
		}
		refreshCanvasForDisplay(backgroundCanvas,displayCanvas);
	};
	
	/**
	* verify if the use has lost
	*/
	checkLoose = function(){
	};
	
	/**
	* verify if the user won
	*/
	checkWin = function(){
	};
	
	/**
	* display the canvasForCalcul in the canvas for display, and add
	* the ball and the tray by using their position
	*/
	refreshCanvasForDisplay = function(backgroundCanvas,displayCanvas){
		//draw the environment
		displayCanvas.getContext("2d").drawImage(backgroundCanvas,0,0,displayCanvas.width,displayCanvas.height);
		//draw the tray
		tray.draw(displayCanvas);
		//draw the ball
		ball.draw(displayCanvas);
	};
	
	initialize = function(backgroundCanvas,displayCanvas){
		setMouseListenerOnCanvas(displayCanvas);
	};
	
	/**
	* initialize the environment
	* move the ball and refresh the canvas
	*/
	mainLoop = function(backgroundCanvas,displayCanvas, refreshPeriod){
		initialize(backgroundCanvas,displayCanvas);		
		myVar=setInterval(function(){animate(backgroundCanvas,displayCanvas);},refreshPeriod);
		
	};
	
	/**
	* listen to the mouse move on the canvas 
	*/
	setMouseListenerOnCanvas = function(displayCanvas){
		displayCanvas.onmousemove = function(event){
			//modify the position of the tray according to the mouse position
			tray.setPosition(event.clientX, ball, displayCanvas);			
		}
		displayCanvas.onclick = function(event){
			//modify the position of the tray according to the mouse position
			tray.unattachBall();			
		}
	};
	
	/**
	* create the buffer canvas from the size of the original canvas used for display
	*/
	createBufferCanvasFronDisplayCanvas = function(displayCanvas){
		var backgroundCanvas = document.createElement('canvas');
		backgroundCanvas.width = displayCanvas.width;
		backgroundCanvas.height = displayCanvas.height;
		backgroundCanvas.getContext("2d").fillStyle = "rgb(70,29,234)";
		backgroundCanvas.getContext("2d").fillRect (0,0,backgroundCanvas.width,backgroundCanvas.height );
		return backgroundCanvas;
	}
	
	
	displayCanvas = canvas;
	backgroundCanvas = createBufferCanvasFronDisplayCanvas(displayCanvas);	
	level = new Level();
	level.initialize(backgroundCanvas,15,10);
	tray = new Tray();
	tray.initialize(displayCanvas.width / 2, 30, 40,5);
	ball = new Ball();
	ball.initialize(tray.getPosition().getX()+(tray.getSize()/2),tray.getPosition().getY(), 5,45,5);
	mainLoop(backgroundCanvas, displayCanvas,50);
}

