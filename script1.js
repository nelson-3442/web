/* js pc game version*/

/* inicio script 1 */ 
var myGamePiece;
var myObstacles = [];
var mySound;
var myMusic;
var gameOver = false;
// 🔹 Global score
var score = 0;

var myGameArea = {
    canvas: document.getElementById("gamecanvas73j42kj33"),
    start: function() {
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function() {
     clearInterval(this.interval);
    document.getElementById("startbutton23k44n23").disabled = false;
    document.getElementById("pause3button934nr3").disabled = true; // 🔹 disable pause when game ends
    gameOver = true;

    },
    clear: function() {
      
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function startGame() {

document.getElementById("pause3button934nr3").disabled = false;
document.getElementById("pause3button934nr3").innerText = "Pause";


    // Reset state
    document.getElementById("startbutton23k44n23").disabled = true;
    myObstacles = [];
    gameOver = false;

    // 🔹 Reset score
    score = 0;

    // Create player + sounds
    myGamePiece = new component(30, 30, "#FFC900", 10, 120);
    mySound = new sound("bounce.mp3");
    myMusic = new sound("gametheme2.mp3");
    myMusic.sound.loop = true;
    myMusic.play();

    // Start game area
    myGameArea.start();
}

// Player & Obstacles
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        // keep inside canvas
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > myGameArea.canvas.width) {
            this.x = myGameArea.canvas.width - this.width;
        }
        if (this.y + this.height > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.height;
        }
    }    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || 
            (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// Update loop
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    // Check crash
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            drawGameOver();
            return;
        } 
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;
// 🔹 Increase score
    score++;
    // Add obstacles
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "#85EF47", x, 0));
        myObstacles.push(new component(10, x - height - gap, "#85EF47", x, height + gap));
    }

    // Move obstacles
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 0.8;
        myObstacles[i].update();
    }

    myGamePiece.newPos();
    myGamePiece.update();
    // 🔹 Draw score
    drawScore();
}


// Draw Score
function drawScore() {
    let ctx = myGameArea.context;
    ctx.font = "500 25px 'Nunito', serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 14, 34);
}


// Draw Game Over text
function drawGameOver() {
    let ctx = myGameArea.context;
    ctx.font = "700 30px 'Nunito'";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);

// 🔹 Also show final score
    ctx.font = "500 20px 'Nunito'";
    ctx.fillText("Final Score: " + score, myGameArea.canvas.width / 2, myGameArea.canvas.height / 2 + 40);


}

// Sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls834n43mn3", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){ this.sound.play(); }
    this.stop = function(){ this.sound.pause(); this.sound.currentTime = 0; }
}

// Helpers
function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}

// Controls
function moveup() { myGamePiece.speedY = -1.3; }
function movedown() { myGamePiece.speedY = 1.3; }
function moveleft() { myGamePiece.speedX = -1.3; }
function moveright() { myGamePiece.speedX = 1.3; }
function clearmove() { myGamePiece.speedX = 0; myGamePiece.speedY = 0; }

/* final script 1 */ 




/* inicio script 2 */

var isPaused = false;

function togglePause() {
    if (isPaused) {
        // Resume
        myGameArea.interval = setInterval(updateGameArea, 20);
        document.getElementById("pause3button934nr3").innerText = "Pause";
        isPaused = false;
        if (myMusic) myMusic.play();
    } else {
        // Pause
        clearInterval(myGameArea.interval);
        document.getElementById("pause3button934nr3").innerText = "Resume";
        isPaused = true;
        if (myMusic) myMusic.sound.pause();
    }
}



/* final script 2 */


/* inicio script 3 */

function bindButton(id, onPress) {
  const btn = document.getElementById(id);

  // Start movement (mouse or touch)
  btn.addEventListener("mousedown", onPress);
  btn.addEventListener("touchstart", onPress);

  // Stop movement (release anywhere on screen)
  document.addEventListener("mouseup", clearmove);
  document.addEventListener("touchend", clearmove);
}

bindButton("button39op439jfn", moveup);
bindButton("button93down832", movedown);
bindButton("button34left4ji5", moveleft);
bindButton("button84right48j", moveright);


/* final script 3 */

/* inicio script 4 */


document.querySelectorAll(
  ".button38nrm4rf, .buttton29n39mo43, .start34kn23jk34, .pause82jn920nu39"
).forEach(btn => {
  btn.addEventListener("dragstart", e => e.preventDefault());
});

/* final script 4 */


/* juego version pc (final js) */

