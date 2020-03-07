
	// Dhruvang Jayswal
	// IT-202 Project-3
	// University of Illinois at Chicago
	// March 1, 2020

	// variables to be used for functionality
	let context, controller, rectangle, loop, life, score, level, fallRate;
	let player = {x:50, y:50, radius:7};
	let harmer = {x:50, y:50, radius:7};

	// set life and score default values.
	life = 5;
	score = 0;
  level = 1;
	fallRate = 1;

	c = document.querySelector("canvas");
	context = c.getContext("2d");
	c.height = 180;
	c.width = 320;
	
	context.font = "15px Arial";
  context.fillText("Press SPACE to start the game!", c.width/7, c.height/2);

	// show canvas background image.
	let backgroundImage = new Image();
	backgroundImage.src = "https://png.pngtree.com/thumb_back/fw800/background/20190222/ourmid/pngtree-two-color-gradient-universal-background-material-color-matching-backgroundtwo-tone-image_51848.jpg";

	// user moveable object. 
	rectangle = {
		height:15,
		width:15,
		x:144, // center of the canvas
		x_velocity:0,
		y:0,
		y_velocity:0
	};
	

	// controls the movement of the object.
	controller = {
		left:false,
		right:false,
		keyListener:function(event) 
		{
			let key_state = (event.type == "keydown")?true:false;
			switch(event.keyCode) 
			{
				case 37:// left key
					controller.left = key_state;
				break;
				case 39:// right key
					controller.right = key_state;
				break;
			}
		}
	};
	 

  // collision detection function
	function collision(obj1, obj2) 
	{
		let result = false;
		
		let dx = obj1.x - obj2.x;
		let dy = obj1.y - obj2.y;
		let distance = Math.sqrt((dx * dx) + (dy * dy));

		if(distance <= ((obj1.height/2) + (obj2.radius)))
		{
			result = true;
		}
		return result;
	}

	// loop that makes the game playable. 
	loop = () => 
	{
		// clear screen
		context.clearRect(0,0, c.width, c.height);		
		
		// update values
		player["y"] += fallRate;
		harmer["y"] += fallRate;
		
		
		if (controller.left) {
			rectangle.x_velocity -= 0.5;
		}

		if (controller.right) {
			rectangle.x_velocity += 0.5;
		}

		rectangle.y_velocity += 1.5;// gravity
		rectangle.x += rectangle.x_velocity;
		rectangle.y += rectangle.y_velocity;
		rectangle.x_velocity *= 0.9;// friction

		
		// handle edge conditions

		// handle edge condition for falling object
		if (player["y"] > c.height + player["radius"]) {
			player["x"] = Math.floor(Math.random() * c.width);
			player["y"] = -player["radius"];
		}	
		
		if (harmer["y"] > c.height + harmer["radius"]) {
			harmer["x"] = Math.floor(Math.random() * c.width);
			harmer["y"] = -harmer["radius"];
		}	

		if (rectangle.y > 210 - 16 - 32) 
		{
			rectangle.y = 210 - 16 - 32;
		}

		// if rectangle is going off the left of the screen
		if (rectangle.x < -32) 
		{
			rectangle.x = 320;
		} 
		// if rectangle goes past right boundary
		else if (rectangle.x > 320) 
		{
			rectangle.x = -32;
		}
	
		// make the background and objects appear.
		if(life >= 0)
		{
			context.drawImage(backgroundImage, 0, 0, backgroundImage.naturalWidth * 0.5, backgroundImage.naturalHeight * 0.5);
		}
		else
		{
			context.fillRect(0, 0, c.width, c.height);
			context.fillStyle = "black";
			context.font = "15px Helvetica";
			context.textAlign = "center";
			context.fillText("GAME OVER! Reload Page", c.width/2, c.height/2);
		}
		
		// benifit object 
		context.beginPath();
		context.arc(player["x"],player["y"],player["radius"],0, Math.PI*2);
		context.closePath();
		context.fillStyle = "white";
		context.fill();
		
		// harmer object
		context.beginPath();
		context.arc(harmer["x"],harmer["y"],harmer["radius"],0, Math.PI*2);
		context.closePath();
		context.fillStyle = "red";
		context.fill();

		context.fillStyle = "#ffffff";
		context.beginPath();
		context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
		context.fill();

    // do collicion detection for the circle and object by comparing x-coordinate and y-coordinate values.
		if(collision(rectangle, player))
		{
			score++; 
			if(score > 5)
		  {
				 fallRate = 2;
			   level++;
		  }
			if(score > 10)
		  {
				 fallRate = 2.5;
		  }
			if(score > 20)
		  {
				 fallRate = 3;
		  }
			player["x"] = Math.floor(Math.random() * c.width);
			player["y"] = -player["radius"];
		} 
		else if(collision(rectangle, harmer))
		{
			life--;
			harmer["x"] = Math.floor(Math.random() * c.width);
			harmer["y"] = -harmer["radius"];
		}
		
		// Text on display
		context.font = 'bold 15px Open Sans';
		context.fillText('Lives: ' + life, 250, 20);
		context.fillText('Score: ' + score, 250, 35);
		context.fillText('Level: ' + level, 25, 20);
		
		// call update when the browser is ready to draw again
		window.requestAnimationFrame(loop);	
	};

	window.addEventListener("keydown", controller.keyListener)
	window.addEventListener("keyup", controller.keyListener);


  // play the game after space is pressed. 
  document.addEventListener('keyup', event => {
		if (event.code === 'Space') 
		{
			window.requestAnimationFrame(loop);
		}
	})
