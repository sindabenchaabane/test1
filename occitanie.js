// Variables Globales
let board;
let boardWidth = 750;
let boardHeight = 450;
let context;
let currentBg = "";

// Personnage
let persoWidth = 88;
let persoHeight = 94;
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

// Violette (Le Bonus)
let violetteImg = new Image(); violetteImg.src = "./img/violette.png";
let violetteWidth = 70;
let violetteHeight = 70;
let violette = null;
let violetteActive = false;
let shieldCount = 0; // Tes esquives

// Physics & Game State
let velocityX = -8;
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let frameCount = 0; // Indispensable pour l'animation
let shakeTime = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    requestAnimationFrame(update);
    setInterval(placeobstacle, 1500);
    setInterval(changePersoImg1, 100);
    document.addEventListener("keydown", movePerso);
}

// Background
let backgroundImg = new Image();
backgroundImg.src = "./img/tls.png"; // Your seamless Toulouse city
let bgX = 0;
let bgSpeed = 2;

function update() {
    if (gameOver) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        // Écran de Game Over
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
        context.drawImage(violetteImg, violette.x, violette.y, violette.width, violette.height);
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

    // 3. Perso & Physique
    velocityY += gravity;
    perso.y = Math.min(perso.y + velocityY, boardHeight - persoHeight);
    context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);

    // 4. UI & Score
    score++;
    updateBackground(); // Ta fonction actuelle reste inchangée
    if (score % 500 == 0) velocityX -= 0.2;

    // --- STYLE DU TEXTE ---
    context.textAlign = "left";
    context.font = "bold 22px sans-serif";
    context.lineWidth = 4; // L'épaisseur du contour noir
    context.lineJoin = "round"; // Pour un contour bien propre

    // Affichage du SCORE
    context.strokeStyle = "black";
    context.strokeText("Score: " + score, 15, 35); // On dessine le contour
    context.fillStyle = "white";
    context.fillText("Score: " + score, 15, 35);   // On remplit l'intérieur

    // Affichage du RECORD
    context.strokeStyle = "black";
    context.strokeText("Best: " + highScore, 15, 65);
    context.fillStyle = "#FFD700"; // Couleur Or
    context.fillText("Best: " + highScore, 15, 65);

    // Affichage des ESQUIVES
    context.strokeStyle = "black";
    context.strokeText("🌸 Esquives: " + shieldCount, 15, 95);
    context.fillStyle = "#FF69B4"; // Couleur Rose
    context.fillText("🌸 Esquives: " + shieldCount, 15, 95);

}


function movePerso(e) {
    if (gameOver) { location.reload(); return; }
    if ((e.code == "Space" || e.code == "ArrowUp") && perso.y >= boardHeight - persoHeight) {
        velocityY = -10;
    }
}

function placeobstacle() {
    if (gameOver) return;
    let r = Math.random();
    let ob = { x: boardWidth, width: 40, height: 40 };
    if (r > 0.90) { ob.img = pontImg; ob.y = boardHeight - 40; }
    else if (r > 0.70) { ob.img = swordImg; ob.y = boardHeight - 40; }
    else { ob.img = chateauImg; ob.y = boardHeight - 40; }
    obstacleArray.push(ob);
    if (obstacleArray.length > 5) obstacleArray.shift();

    if (!violetteActive && Math.random() < 0.20) {
        violette = { x: boardWidth, y: boardHeight - 150 - Math.random() * 100, width: 70, height: 70 };
        violetteActive = true;
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

function updateBackground() {
    // 1. Calcul de l'index (1, 2, ou 3)
    let bgIndex = (Math.floor(score / 300) % 3) + 1; 
    
    // 2. Choix de l'extension
    let extension = ".jpg"; 
    if (bgIndex === 3) {
        extension = ".jpeg"; // On force le .jpeg pour la 3ème image
    }

    let bg = "url('./img/fond" + bgIndex + extension + "')";

    // 3. Application du changement
    if (bg !== currentBg) {
        board.style.backgroundImage = bg;
        board.style.backgroundSize = "cover";
        board.style.backgroundPosition = "center";
        currentBg = bg; 
        console.log("Nouveau fond chargé : " + bg);
    }
}