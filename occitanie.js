// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//Personnage
let persoWidth = 88;
let persoHeight = 94;
let persoX = 50;
let persoY = boardHeight - persoHeight;
let persoImg1 = new Image();
let persoImg2 = new Image () ;
let persoImg3= new Image () ;
let persoImg4 = new Image () ;
persoImg1.src = "./img+/1.png";
persoImg2.src = "./img+/2.png";
persoImg3.src = "./img+/3.png";
persoImg4.src = "./img+/4.png";
let persoArray = [persoImg1, persoImg2, persoImg3, persoImg4]
let persoIndex = 0 ;
let currentPersoImg = persoArray[persoIndex]
let perso = {
   x : persoX,
   y : persoY,
   width : persoWidth,
   height : persoHeight
};

// Obstacle
let obstacleArray = []
let chateauHeight = 40;
let chateauWidth = 40;
let swordWidth = 40;
let swordHeight = 40;
let pontWidth = 40;
let pontHeight= 40;

let chateauX = boardWidth;
let chateauY = boardHeight - chateauHeight;
let swordX = boardWidth;
let swordY = boardHeight - swordHeight;
let pontX = boardWidth;
let pontY = boardHeight - pontHeight;

let chateauImg = new Image();
chateauImg.src = "./img/chateau1.png";
let swordImg = new Image();
swordImg.src = "./img/sword.png"
let pontImg = new Image ();
pontImg.src = "./img/pont.png";

//physics
let velocityX = -8 // obstacle moving left speed
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // On récupère le record enregistré

window.onload = function(){
   board = this.document.getElementById("board");
   board.height = boardHeight;
   board.width = boardWidth;
   context = board.getContext("2d");//used for drawing on the board

    persoImg1.onload = function(){
    context.drawImage(persoImg1,perso.x,perso.y,perso.width,perso.height);
    }

    requestAnimationFrame(update);
    setInterval(placeobstacle,1500); // 1000 milliseconds = 1 second
    setInterval(changePersoImg1, 100); // 100 milliseconds
    document.addEventListener("keydown",movePerso)
}
/*
function update(){

    if (gameOver){
     // On affiche le message et on arrête l'exécution de cette frame
        context.fillStyle = "red";
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", boardWidth / 3, boardHeight / 2);
        return; 
    }   
    
   requestAnimationFrame(update);
   context.clearRect(0,0,board.width,board.height);

   // obstacle
   console.log(obstacleArray.length)
   for (let i = 0; i < obstacleArray.length; i++){
       let obstacle = obstacleArray[i];
       obstacle.x += velocityX;
       context.drawImage(obstacle.img,obstacle.x,obstacle.y,obstacle.width,obstacle.height);
       
       //Vérification de la collision
       if (detectCollision(perso,obstacle)){
           gameOver = true;
           persoImg1.onload = function(){
               context.drawImage(persoImg1,perso.x,perso.y,perso.width,perso.height);
           }
       }
   }

   if (gameOver) return; // Arrête le dessin si Game Over
    
    // Physique du personnage
    velocityY += gravity;
    perso.y = Math.min(perso.y + velocityY, persoY); 

    // 2. Animation (Changement d'image)
    // On utilise le modulo (%) pour boucler sur l'index de 0 à 3
    frameCount++;
    if (frameCount % 10 === 0) { // Change d'image toutes les 10 frames
        persoIndex = (persoIndex + 1) % persoArray.length;
        currentPersoImg = persoArray[persoIndex];
    }

    // 3. DESSIN DU PERSONNAGE
    // IMPORTANT : On utilise currentPersoImg et perso.y
    context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);
}

*/

function update() {
    if (gameOver) {
        // MISE À JOUR DU RECORD 
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        // --- DESIGN DE L'ÉCRAN DE FIN ---
        context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Fond sombre semi-transparent
        context.fillRect(0, 0, boardWidth, boardHeight);

        context.textAlign = "center";
        context.font = "bold 60px sans-serif";
        
        // Ombre portée du texte
        context.fillStyle = "black";
        context.fillText("GAME OVER", boardWidth / 2 + 4, boardHeight / 2);
        // Texte rouge
        context.fillStyle = "#FF3131"; 
        context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 4);

        // Sous-texte
        context.font = "bold 20px sans-serif";
        context.fillStyle = "white";
        context.fillText("Score Final : " + score, boardWidth / 2, boardHeight / 2 + 50);
        context.fillStyle = "#FFD700"; // Or
        context.fillText("Meilleur Record : " + highScore, boardWidth / 2, boardHeight / 2 + 80);
        
        context.font = "italic 16px sans-serif";
        context.fillStyle = "#ccc";
        context.fillText("Appuyez sur une touche pour recommencer", boardWidth / 2, boardHeight / 2 + 115);
        
        return;
    } // <--- IL MANQUAIT CETTE ACCOULADE POUR FERMER LE IF

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Obstacles
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (detectCollision(perso, obstacle)) {
            gameOver = true;
        }
    }

    // Physique
    velocityY += gravity;
    perso.y = Math.min(perso.y + velocityY, persoY); 

    // Dessin perso
    context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);
    
    // Score
    context.fillStyle = "black";
    context.font = "20px sans-serif";
    score++;

    if (score % 500 == 0) {
        velocityX -= 0.2; 
    }
    context.fillText("Score: " + score, 5, 20);
    context.fillText("Best: " + highScore, 5, 45); 
}

/*
function movePerso(e){
   console.log('executing the miovePerso function outside for loop')
   if (gameOver){
       return;
   }
   if((e.code == "Space" || e.code == "ArrowUp") && perso.y == persoY){
       //jump
       console.log('executing the miovePerso function')
       velocityY = -10
   }
}

*/
function movePerso(e) {
    if (gameOver) {
        // Relance le jeu si on appuie sur une touche après un Game Over
        location.reload(); 
        return;
    }
    
    if ((e.code == "Space" || e.code == "ArrowUp") && perso.y == persoY) {
        velocityY = -10;
    }
}

function placeobstacle() {
    if (gameOver) return;

    let obstacle = {
        img: null,
        x: boardWidth,
        y: 0,
        width: 40,
        height: 40
    };

    let r = Math.random(); // Génère un nombre entre 0 et 1

    // On définit quel obstacle apparaît selon le score ou la chance
    if (r > 0.85) { // 15% de chance
        obstacle.img = pontImg;
        obstacle.y = boardHeight - pontHeight;
    } else if (r > 0.60) { // 25% de chance
        obstacle.img = swordImg;
        obstacle.y = boardHeight - swordHeight;
    } else { // 60% de chance (le plus commun)
        obstacle.img = chateauImg;
        obstacle.y = boardHeight - chateauHeight;
    }

    obstacleArray.push(obstacle);

    // Nettoyage : on ne garde que les obstacles utiles
    if (obstacleArray.length > 10) {
        obstacleArray.shift();
    }
}


function changePersoImg1(){
    if (gameOver){ 
         return;
    }

    // NOUVELLE RÈGLE : On n'anime que si le personnage est AU SOL (pour éviter bug)
    // perso.y == persoY signifie qu'il est sur sa position de base (le sol)
    if (perso.y === persoY) {
        persoIndex++;

        if (persoIndex >= persoArray.length){
            persoIndex = 0;
        }
        currentPersoImg = persoArray[persoIndex];
    } else {
        // Si il est en l'air, on force l'image de saut
        currentPersoImg = persoArray[0]; 
    }
}

function detectCollision(a, b) {
    // On réduit la zone de collision de 10 pixels de chaque côté
    let padding = 10; 
    
    return a.x + padding < b.x + b.width - padding &&   // Le nez du perso touche l'arrière de l'obstacle
           a.x + a.width - padding > b.x + padding &&   // L'arrière du perso touche le nez de l'obstacle
           a.y + padding < b.y + b.height - padding &&  // Le haut du perso touche le bas
           a.y + a.height - padding > b.y + padding;    // Le bas du perso touche le haut 
           }
