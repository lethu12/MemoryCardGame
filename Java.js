function createCard(id, image) {
  return {
    id,
    image,
    isFlipped: false,
    isMatched: false
  };
}

function initializeGame() {
  const images = [
    'Apple.jpg', 
    'B.jpg', 
    'C.jpg',
    'D.jpg',
    'E.jpg',
    'F.jpg',
    'G.jpg',
    'H.jpg',
  ];
  const cardPairs = [...images, ...images];
  return cardPairs
    .sort(() => Math.random() - 0.5)
    .map((image, index) => createCard(index, image));
}

class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.isChecking = false;
    this.moves = 0;
    this.gameWon = false;
    
    // Audio files for correct and incorrect matches
    this.correctSound = new Audio('True.mp3');
    this.incorrectSound = new Audio('False.mp3');
    this.winSound = new Audio('Win.wav');
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.cards = initializeGame();
    this.flippedCards = [];
    this.moves = 0;
    this.gameWon = false;
    this.render();
  }

  playSound(isCorrect) {
    if (isCorrect) {
      this.correctSound.currentTime = 0;
      this.correctSound.play();
    } else {
      this.incorrectSound.currentTime = 0;
      this.incorrectSound.play();
    }
  }

  handleCardClick(id) {
    if (
      this.isChecking ||
      this.flippedCards.length === 2 ||
      this.cards[id].isFlipped ||
      this.cards[id].isMatched
    ) {
      return;
    }

    this.cards[id].isFlipped = true;
    this.flippedCards.push(id);
    this.render();

    if (this.flippedCards.length === 2) {
      this.isChecking = true;
      this.moves++;

      const [firstCard, secondCard] = this.flippedCards;
      if (this.cards[firstCard].image === this.cards[secondCard].image) {

        // Match found
        this.cards[firstCard].isMatched = true;
        this.cards[secondCard].isMatched = true;
        this.flippedCards = [];
        this.isChecking = false;
        
        // Play correct match sound and show alert
        this.playSound(true);

        // Check if game is won
        if (this.cards.every(card => card.isMatched)) {
          this.gameWon = true;
          this.winSound.currentTime = 0;
      this.winSound.play();
        }
        this.render();
      } else {

        // No match
        // Play incorrect match sound and show alert
        this.playSound(false);
        
        setTimeout(() => {
          this.cards[firstCard].isFlipped = false;
          this.cards[secondCard].isFlipped = false;
          this.flippedCards = [];
          this.isChecking = false;
          this.render();
        }, 1000);
      }
    }
  }

  setupEventListeners() {
    document.getElementById('resetButton').addEventListener('click', () => this.init());
    
    document.getElementById('gameBoard').addEventListener('click', (event) => {
      const cardElement = event.target.closest('.card');
      if (cardElement) {
        const cardId = parseInt(cardElement.dataset.id);
        this.handleCardClick(cardId);
      }
    });
  }

  render() {
    const gameBoard = document.getElementById('gameBoard');
    const movesCounter = document.getElementById('moves');
    const winMessage = document.getElementById('winMessage');

    // Update moves on counter
    movesCounter.textContent = this.moves;

    // card rendering
    gameBoard.innerHTML = this.cards.map(card => `
      <button
        class="card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}"
        data-id="${card.id}"
        ${card.isMatched ? 'disabled' : ''}
      >
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">
            <img src="${card.image}" alt="letters" class="card-image">
          </div>
        </div>
      </button>
    `).join('');

    // Show or hide win messages
    winMessage.style.display = this.gameWon ? 'block' : 'none';
    if (this.gameWon) {
      winMessage.innerHTML = `
        <h2>Congratulations! 🎉</h2>
        <p>You won in ${this.moves} moves! Click Reset to play again.</p>
      `;
    }
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});