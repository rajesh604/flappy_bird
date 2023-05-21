//board
let board;
// let boardWidth = 360;
// let boardHeight = 640;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let image1 = new Image();
image1.src = "./1.png";
let image2 = new Image();
image2.src = "./2.png";
let image3 = new Image();
image3.src = "./3.png";

// bird data
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -1;
let velocityY = 0;
let gravity = 0.2;

let gameOver = false;
let score = 0;

const point = new Audio("./audio/point.ogg")
const wing = new Audio("./audio/wing.ogg")
const hit = new Audio("./audio/hit.ogg")
const die = new Audio("./audio/flappy_gameover.wav")
const start = new Audio("./audio/game_start.mp3")

const gameOverDiv = document.getElementById("close");
const gameDisplay = document.getElementById("board");
const gameStartDiv = document.getElementById("start");

window.onload = function () {
    start.play()
    gameStartDiv.addEventListener("click", () => {
        start.pause()
        gameStartDiv.style.display = "none";
        gameDisplay.style.display = "block";
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d"); //used for drawing on the board

        //load images
        birdImg = new Image();

        birdImg = image1;
        birdImg.onload = function () {
            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }

        topPipeImg = new Image();
        topPipeImg.src = "./toppipe.png";

        bottomPipeImg = new Image();
        bottomPipeImg.src = "./bottompipe.png";

        requestAnimationFrame(update);
        setInterval(placePipes, 2000); //every 1.5 seconds
        document.addEventListener("keydown", moveBird);
        document.addEventListener("click", handleClick);
    })
}

function opacityzero() {
    let value = window.getComputedStyle(gameDisplay).getPropertyValue("opacity")
    let time = 0
    for (let i = 0; i < 10; i++) {
        time += 25
        setTimeout(() => {
            value -= 0.1
            gameDisplay.style.opacity = value
        }, time);
    }
    setTimeout(() => {
        gameDisplay.style.display = "none"
    }, time);
}

function gameOverDisplay() {
    die.play()
    opacityzero();
    gameOverDiv.style.display = "block";
    setTimeout(() => {
        window.location.reload()
    }, 1000);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height - 90) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
            point.play();
        }

        if (detectCollision(bird, pipe)) {

            hit.play();
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        gameOverDisplay();
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.code == "KeyW") {
        wing.play();
        birdImg = image1;
        setTimeout(function () {
            birdImg = image2;
        }, 100);
        setTimeout(function () {
            birdImg = image3;
        }, 200);
        setTimeout(function () {
            birdImg = image2;
        }, 300);
        setTimeout(function () {
            birdImg = image1;
        }, 400);

        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function handleClick() {
    wing.play();
    birdImg = image1;
    setTimeout(function () {
        birdImg = image2;
    }, 100);
    setTimeout(function () {
        birdImg = image3;
    }, 200);
    setTimeout(function () {
        birdImg = image2;
    }, 300);
    setTimeout(function () {
        birdImg = image1;
    }, 400);

    velocityY = -6;
    // Reset game
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}