/**
 * Memory Match Game
 * Find matching pairs of cards by flipping them over
 */

import { Game } from '../utils/gameBase.js';

export class MemoryMatchGame extends Game {
    constructor() {
        super('memory-match', 'Memory Match!');
        
        this.memoryCardEmojis = ['🍎', '🍌', '🍇', '🍓', '🍍', '🍉', '🥝', '🥭'];
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
    }

    /**
     * Render the memory match game
     */
    render() {
        this.gameContentArea.innerHTML = `
            <p class="text-gray-700 text-lg mb-4">Find all the matching pairs!</p>
            <div id="memoryGrid" class="memory-grid">
                <!-- Memory cards will be rendered here -->
            </div>
            <p id="memoryScore" class="score-display">Pairs Found: 0 / ${this.memoryCardEmojis.length}</p>
            <p id="memoryFeedback" class="game-feedback"></p>
            <button id="resetMemoryGameButton" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 mt-6">Play Again</button>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        document.getElementById('resetMemoryGameButton').addEventListener('click', () => this.resetGame());
        this.resetGame(); // Start the first game
    }

    /**
     * Reset the memory game
     */
    resetGame() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        
        document.getElementById('memoryScore').textContent = `Pairs Found: 0 / ${this.memoryCardEmojis.length}`;
        document.getElementById('memoryFeedback').textContent = '';
        document.getElementById('resetMemoryGameButton').classList.add('hidden');

        // Create pairs and shuffle
        this.memoryCards = [...this.memoryCardEmojis, ...this.memoryCardEmojis];
        this.shuffleArray(this.memoryCards);

        this.renderMemoryGrid();
    }

    /**
     * Render the memory game grid
     */
    renderMemoryGrid() {
        const memoryGrid = document.getElementById('memoryGrid');
        memoryGrid.innerHTML = '';

        this.memoryCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="memory-card-inner memory-card-back">?</div>
                <div class="memory-card-inner memory-card-front">
                    ${emoji}
                    <span class="memory-card-matched-indicator">✅</span>
                </div>
            `;

            card.addEventListener('click', (event) => this.handleCardClick(event));
            memoryGrid.appendChild(card);
        });
    }

    /**
     * Handle card click
     * @param {Event} event - Click event
     */
    handleCardClick(event) {
        const clickedCard = event.currentTarget;

        // Do nothing if not allowed to flip or card is already flipped/matched
        if (!this.canFlip || clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) {
            return;
        }

        clickedCard.classList.add('flipped');
        this.flippedCards.push(clickedCard);

        if (this.flippedCards.length === 2) {
            this.canFlip = false; // Prevent further flips
            const [card1, card2] = this.flippedCards;

            if (card1.dataset.emoji === card2.dataset.emoji) {
                // Match found!
                this.matchedPairs++;
                document.getElementById('memoryScore').textContent = `Pairs Found: ${this.matchedPairs} / ${this.memoryCardEmojis.length}`;
                this.showFeedback(`🎉 Match! You found a pair of ${card1.dataset.emoji}!`, 'success');

                card1.classList.add('matched');
                card2.classList.add('matched');

                this.flippedCards = [];
                this.canFlip = true;

                if (this.matchedPairs === this.memoryCardEmojis.length) {
                    this.showFeedback(`🏆 Congratulations! You found all the pairs!`, 'success');
                    document.getElementById('resetMemoryGameButton').classList.remove('hidden');
                }

            } else {
                // No match, flip back after delay
                this.showFeedback(`😔 No match. Try again!`, 'error');

                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    this.flippedCards = [];
                    this.canFlip = true;
                    document.getElementById('memoryFeedback').textContent = '';
                }, 1000);
            }
        }
    }

    /**
     * Show feedback message
     * @param {string} message - Message to display
     * @param {string} type - Type of message (success/error)
     */
    showFeedback(message, type) {
        const feedbackElement = document.getElementById('memoryFeedback');
        if (feedbackElement) {
            super.showFeedback(message, type, feedbackElement);
        }
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
    }
}