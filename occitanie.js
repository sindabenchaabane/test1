// Global Variables
let board;
let boardWidth = 750;
let boardHeight = 450;
let context;
let currentBg = "";

// Character
let persoWidth = 120;
let persoHeight = 158;
let persoX = 50;
let persoY = boardHeight - persoHeight;
let persoImg1 = new Image(); persoImg1.src = "./img+/1.png";
let persoImg2 = new Image(); persoImg2.src = "./img+/2.png";
let persoImg3 = new Image(); persoImg3.src = "./img+/3.png";
let persoImg4 = new Image(); persoImg4.src = "./img+/4.png";
let persoArray = [persoImg1, persoImg2, persoImg3, persoImg4];
let persoIndex = 0;
let currentPersoImg = persoArray[0];
let perso = { x: persoX, y: persoY, width: persoWidth, height: persoHeight };

// Obstacles
let obstacleArray = [];
let chateauImg = new Image(); chateauImg.src = "./img/chateau1.png";
let swordImg = new Image(); swordImg.src = "./img/sword.png";
let pontImg = new Image(); pontImg.src = "./img/pont.png";

// Violette (Bonus addition)
let violetteImg = new Image(); violetteImg.src = "./img/violette.png";
let violetteWidth = 160;
let violetteHeight = 160;
let violette = null;
let violetteActive = false;
let shieldCount = 0; // Tes esquives

//bombe
let bombeImg    = new Image(); bombeImg.src = "./img/bombe.png";
let bombeWidth  = 60;
let bombeHeight = 60;
let bombe       = null;
let bombeActive = false;

// Physics & Game State
let velocityX = -8;
let velocityY = 0;
let gravity = 0.3;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let frameCount = 0; // For animation
let shakeTime = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    requestAnimationFrame(update);
    setInterval(placeObstacle, 1500);
    setInterval(changePersoImg1, 100);
    document.addEventListener("keydown", movePerso);
}

// Background management
let backgroundImg = new Image();

// On récupère le fond choisi dans le localStorage - We retrieve the chosen background from localStorage
let savedBg = localStorage.getItem("selectedBackground");

// Si on a trouvé un fond, on l'utilise - If we found a background, we use it
if (savedBg) {
    backgroundImg.src = savedBg;
} else {
    backgroundImg.src = "./img/tls.png"; 
}


let bgX = 0;
let bgSpeed = 2; // Background scroll speed

//function bombe
function drawBombe(x, y, w, h) {
    let cx = x + w / 2;
    let cy = y + h / 2;
    let r  = w / 2 - 4;
    let gradient = context.createRadialGradient(cx - r*0.3, cy - r*0.3, 2, cx, cy, r);
    gradient.addColorStop(0, "#555");
    gradient.addColorStop(1, "#111");
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    context.beginPath();
    context.moveTo(cx + r*0.6, cy - r*0.6);
    context.quadraticCurveTo(cx + r, cy - r*1.4, cx + r*0.3, cy - r*1.6);
    context.strokeStyle = "#cc6600";
    context.lineWidth   = 3;
    context.stroke();
    context.beginPath();
    context.arc(cx + r*0.3, cy - r*1.6, 4, 0, Math.PI * 2);
    context.fillStyle = "#FFD700";
    context.fill();
}

function update() {
    if (gameOver) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        // Game Over bgr
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, boardWidth, boardHeight);
        context.textAlign = "center";
        context.font = "bold 60px sans-serif";
        context.fillStyle = "black";
        context.fillText("GAME OVER", boardWidth / 2 + 4, boardHeight / 2);
        context.fillStyle = "#FF3131"; 
        context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 4);
        
        context.font = "bold 20px sans-serif";
        context.fillStyle = "white";
        context.fillText("Score Final : " + score, boardWidth / 2, boardHeight / 2 + 50);
        context.fillStyle = "#FFD700";
        context.fillText("Record : " + highScore, boardWidth / 2, boardHeight / 2 + 80);
        return; 
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);




    // 1.1 City background
    bgX -= bgSpeed;
    if (bgX <= -boardWidth) { bgX = 0; }
    context.drawImage(backgroundImg, bgX, 0, boardWidth, boardHeight);
    context.drawImage(backgroundImg, bgX + boardWidth, 0, boardWidth, boardHeight);

    // 1.2 Obstacles
    for (let i = 0; i < obstacleArray.length; i++) {
        let ob = obstacleArray[i];
        ob.x += velocityX;
        context.drawImage(ob.img, ob.x, ob.y, ob.width, ob.height);

        if (detectCollision(perso, ob)) {
            if (shieldCount > 0) {
                shieldCount--;
                obstacleArray.splice(i, 1);
                i--;
            } else {
                gameOver = true;
            }
        }
    }


    // 2. La Violette
    if (violetteActive && violette) {
        violette.x += velocityX;
        context.drawImage(violetteImg, violette.x, violette.y, violetteWidth, violetteHeight);
        if (detectCollision(perso, violette)) {
            if (shieldCount < 2) shieldCount++;
            violetteActive = false;
            violette = null;
        }
        if (violette && violette.x + violette.width < 0) {
            violetteActive = false;
            violette = null;
        }
    }


    // 3. Bombe
    if (bombeActive && bombe) {
        bombe.x += velocityX;
        if (bombeImg.complete && bombeImg.naturalWidth > 0) {
            context.drawImage(bombeImg, bombe.x, bombe.y, bombeWidth, bombeHeight);
        } else {
            drawBombe(bombe.x, bombe.y, bombeWidth, bombeHeight);
        }
        if (detectCollision(perso, bombe)) {
            gameOver = true;
        }
        if (bombe.x + bombeWidth < 0) {
            bombeActive = false;
            bombe       = null;
        }
    }


    // 4. Perso & Physique
    velocityY += gravity;
    perso.y = Math.min(perso.y + velocityY, boardHeight - persoHeight);
    context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);


    // 5. UI & Score
    score++;
    if ((score % 200 == 0) && (score <= 5000)) velocityX -= 1;




// ----- Text Styling -----
    context.textAlign = "left";
    context.font = "bold 22px sans-serif";
    context.lineWidth = 4; // L'épaisseur du contour noir
    context.lineJoin = "round"; // Pour un contour bien propre

    // 1. "SCORE"
    context.strokeStyle = "black";
    context.strokeText("Score: " + score, 15, 35); // On dessine le contour
    context.fillStyle = "white";
    context.fillText("Score: " + score, 15, 35);   // On remplit l'intérieur

    // 2. "RECORD"
    context.strokeStyle = "black";
    context.strokeText("Best: " + highScore, 15, 65);
    context.fillStyle = "#FFD700";
    context.fillText("Best: " + highScore, 15, 65);

    // 3. "VIOLETTES"
    context.strokeStyle = "black";
    context.strokeText("🌸 Violettes : " + shieldCount, 15, 95);
    context.fillStyle = "#FF69B4";
    context.fillText("🌸 Violettes : " + shieldCount, 15, 95);
}





// ----- Game functions -----

function movePerso(e) {
    if (gameOver) { location.reload(); return; }
    if ((e.code == "Space" || e.code == "ArrowUp") && perso.y >= boardHeight - persoHeight) {
        velocityY = -10;
    }
}

    function placeObstacle() {
    if (gameOver) return;

    let r = Math.random();
    
        // Obstacle sizes and spawning probabilities
    let chateauSize = 105; 
    let swordSize = 110;   
    let pontWidth = 100;
    let pontHeight = 120;

    let ob = { x: boardWidth, width: chateauSize, height: chateauSize, y: boardHeight - chateauSize };

        if (r > 0.70) { // 30% chance for the bridge (0.70 to 1.0)
        ob.img = pontImg; 
        ob.width = pontWidth; ob.height = pontHeight; ob.y = boardHeight - pontHeight;
    } 
        else if (r > 0.40) { // 30% chance for the sword (0.40 to 0.70)
        ob.img = swordImg; 
        ob.width = swordSize; ob.height = swordSize; ob.y = boardHeight - swordSize;
    } 
        else if (r > 0.10) { // 30% chance for the castle (0.10 to 0.40)
        ob.img = chateauImg; 
            // Note: ob a déjà les dimensions du château par défaut dans ton code - obstacle size is alr set to castle dimensions by default 
    } 
    else { 
            // Only 10% chance (if r < 0.10) that nothing happens
        return; 
    }

    obstacleArray.push(ob);
    if (obstacleArray.length > 7) obstacleArray.shift();

        // Violette (bonus addition)- 20% chance for a violet if there isn't one alr
    if (!violetteActive && Math.random() < 0.20) {
        violette = { x: boardWidth, y: boardHeight - 275 - Math.random() * 100, width: 70, height: 70 };
        violetteActive = true;
    }

        // Bombe - 30% chance for a bomb if there isn't one alr
    if (!bombeActive && Math.random() < 0.30) {
        bombe = {
            x:      boardWidth + 100 + Math.random() * 150, // Décalée APRÈS l'obstacle actuel
            y:      boardHeight - bombeHeight,               // Posée sur le sol
            width:  bombeWidth,
            height: bombeHeight
        };
        bombeActive = true;
    }
}

function changePersoImg1() {
    if (gameOver) return;
    if (perso.y >= boardHeight - persoHeight) {
        persoIndex = (persoIndex + 1) % persoArray.length;
        currentPersoImg = persoArray[persoIndex];
    } else {
        currentPersoImg = persoArray[0];
    }
}

function detectCollision(a, b) {
    let p = 10;
    return a.x + p < b.x + b.width - p && a.x + a.width - p > b.x + p &&
           a.y + p < b.y + b.height - p && a.y + a.height - p > b.y + p;
}
