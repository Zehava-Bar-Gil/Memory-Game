class AudioController {
    constructor() {
        this.bgMusic = new Audio('XMen Theme song No Sound FX.mp3');
        this.flipSound = new Audio('img/Audio/Audio_flip.wav');
        this.matchSound = new Audio('img/Audio/Audio_match.wav');
        this.victorySound = new Audio('img/Audio/Audio_victory.wav');
        this.gameOverSound = new Audio('img/Audio/Audio_gameOver.wav');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class Xman {
constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining')
    this.ticker = document.getElementById('flips');
    this.audioController = new AudioController();
}

hideCards() {
this.cardsArray.forEach(card => {
    card.classList.remove('visible');
    card.classList.remove('matched');
});
}

shuffleCards(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        cardsArray[randIndex].style.order = i;
        cardsArray[i].style.order = randIndex;
    }
}


gameOver() {
    clearInterval(this.countdown);
    this.audioController.gameOver();
    document.getElementById('game-over-text').classList.add('visible');
    }
        victory() {
    clearInterval(this.countdown);
    this.audioController.victory();
    document.getElementById('victory-text').classList.add('visible');
    }
    
    
        cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

startCountdown() {
    return setInterval(() => {
        this.timeRemaining--;
        this.timer.innerText = this.timeRemaining;
        if(this.timeRemaining === 0)
            this.gameOver();
    }, 1000);
}

canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
}

cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
        card1.classList.remove('visible');
        card2.classList.remove('visible');
        this.busy = false;
    }, 1000);
}

getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
}

checkForCardMatch(card) {
    if(this.getCardType(card) === this.getCardType(this.cardToCheck))
        this.cardMatch(card, this.cardToCheck);
    else 
        this.cardMismatch(card, this.cardToCheck);
    
    this.cardToCheck = null;
    }

flipCard(card) {
    if(this.canFlipCard(card)) {
        this.audioController.flip();
        this.totalClicks++;
        this.ticker.innerText = this.totalClicks;
        card.classList.add('visible');
    
        if(this.cardToCheck) {
            this.checkForCardMatch(card);
        } else {
            this.cardToCheck = card;
        }
    }
    }

startGame(){
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
        this.audioController.startMusic();
        this.shuffleCards(this.cardsArray);
        this.countdown = this.startCountdown();
        this.busy = false;
    }, 500)
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
}
}



if (document.readyState == 'loading') {
document.addEventListener('DOMContentLoaded', ready);
} else {
ready();
}

function ready() {
let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let cards = Array.from(document.getElementsByClassName('card'));
let game = new Xman(100, cards);

overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        game.startGame();
    });
});

cards.forEach(card => {
    card.addEventListener('click', () => {
        game.flipCard(card);
    });
});
}