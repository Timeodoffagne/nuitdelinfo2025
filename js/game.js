let gameArea;
let player;
let score = 0;
let lives = 3;
let isGameOver = false;
let gameInterval;
let objectGenerationInterval;
const playerSpeed = 15;
const gameWidth = 620;

const messages = {
    resource: [
        "COLLECTÉ ! Linux à l'école, c'est l'autonomie et l'apprentissage de l'informatique.",
        "RÉCUPÉRÉ ! Le recyclage allonge la vie du matériel. Pensez au NIRD!",
        "OUVERT ! L'Open Source favorise la collaboration et l'adaptation du logiciel.",
        "BON CHOIX ! Un PC recyclé est parfait pour l'école, de la maternelle à l'université."
    ],
    waste: [
        "OUPS ! Le gaspillage numérique, c'est l'épuisement des ressources. Recyclons !",
        "DÉCHET ! Les vieux ordis jetés = pollution. Un geste NIRD, c'est la durabilité.",
        "PROPRIÉTAIRE ! Le verrouillage logiciel freine l'éducation. Vive l'Open Source !"
    ],
    nird: [
        "N.I.R.D. = Numérique Inclusif, Responsable et Durable. C'est l'objectif !",
        "Le NIRD s'applique à tout, des éco-gestes au choix des logiciels !"
    ]
};

function quitGame() {
    clearInterval(gameInterval);
    clearInterval(objectGenerationInterval);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
    isGameOver = true;
    document.removeEventListener('keydown', handleInput);
}

function startByteCollector() {
    clearInterval(gameInterval);
    clearInterval(objectGenerationInterval);
    
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';

    gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    score = 0;
    lives = 3;
    isGameOver = false;
    updateDisplay();

    player = document.createElement('div');
    player.className = 'player';
    gameArea.appendChild(player);

    gameInterval = setInterval(gameLoop, 50);
    objectGenerationInterval = setInterval(generateObject, 1500);
    
    document.addEventListener('keydown', handleInput);
}

function restartGame() {
    startByteCollector();
}

function updateDisplay() {
    document.getElementById('score-display').textContent = score;
    document.getElementById('lives-display').textContent = lives;
}

function handleInput(event) {
    if (isGameOver) return;
    
    if (event.key === 'Escape') {
        quitGame();
        return;
    }

    let playerPos = player.offsetLeft;
    
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'q') {
        playerPos = Math.max(0, playerPos - playerSpeed);
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        playerPos = Math.min(gameArea.offsetWidth - player.offsetWidth, playerPos + playerSpeed);
    }
    
    player.style.left = playerPos + 'px';
}

function generateObject() {
    if (isGameOver) return;
    
    const isWaste = Math.random() < 0.4;
    const object = document.createElement('div');
    
    object.className = 'game-object ' + (isWaste ? 'waste' : 'resource');
    object.textContent = isWaste ? '❌' : '💾';
    object.dataset.type = isWaste ? 'waste' : 'resource';

    const maxLeft = gameArea.offsetWidth - 15;
    object.style.left = Math.floor(Math.random() * maxLeft) + 'px';
    object.style.top = '0px';
    object.dataset.speed = (Math.random() * 2) + 1;

    gameArea.appendChild(object);
}

function gameLoop() {
    if (isGameOver) return;

    const objects = document.querySelectorAll('.game-object');
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    objects.forEach(obj => {
        let currentTop = parseFloat(obj.style.top);
        let speed = parseFloat(obj.dataset.speed);
        obj.style.top = (currentTop + speed) + 'px';

        const objRect = obj.getBoundingClientRect();
        
        if (
            objRect.left < playerRect.right &&
            objRect.right > playerRect.left &&
            objRect.top < playerRect.bottom &&
            objRect.bottom > playerRect.top
        ) {
            handleCollision(obj);
        }
        
        if (currentTop > gameArea.offsetHeight) {
            if (obj.dataset.type === 'resource') {
                lives--;
                showMessage('MISSED! Une ressource à recycler perdue.', 'waste');
            }
            obj.remove();
            checkGameOver();
        }
    });
}

function handleCollision(obj) {
    const type = obj.dataset.type;
    obj.remove();

    if (type === 'resource') {
        score += 10;
        showMessage(messages.resource[Math.floor(Math.random() * messages.resource.length)], 'resource');
    } else if (type === 'waste') {
        lives--;
        showMessage(messages.waste[Math.floor(Math.random() * messages.waste.length)], 'waste');
    }

    if (Math.random() < 0.15) {
        showMessage(messages.nird[Math.floor(Math.random() * messages.nird.length)], 'nird');
    }

    updateDisplay();
    checkGameOver();
}

function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.className = `game-message ${type}`;
    
    msg.style.position = 'absolute';
    msg.style.top = '10px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.zIndex = '100';
    msg.style.padding = '5px 10px';
    msg.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    msg.style.border = '2px solid';
    msg.style.borderColor = type === 'resource' ? 'var(--color-accent)' : 'var(--color-border)';

    gameArea.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 3000);
}

function checkGameOver() {
    if (lives <= 0) {
        isGameOver = true;
        clearInterval(gameInterval);
        clearInterval(objectGenerationInterval);
        
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over-screen';
        gameOverScreen.innerHTML = `
            <h2>GAME OVER</h2>
            <p>Score Final : ${score}</p>
            <p>Le Numérique Inclusif, Responsable et Durable (NIRD) est vital !</p>
            <p>Continuez à recycler, à explorer l'Open Source (Linux) et à former l'avenir.</p>
            <a href="#" class="button" onclick="restartGame()">REJOUER</a>
        `;
        gameArea.appendChild(gameOverScreen);
    }
}