/**
 * Guess the Number Game
 * A simple number guessing game for kids
 */

import { Game } from '../utils/gameBase.js';

export class GuessNumberGame extends Game {
    constructor() {
        super('guess-the-number', 'Guess the Number!');
        this.secretNumber = null;
        this.attempts = 0;
        this.maxAttempts = 10;
        this.minNumber = 1;
        this.maxNumber = 100;
    }

    /**
     * Render the game UI
     */
    render() {
        this.gameContentArea.innerHTML = `
            <div class="text-center">
                <p class="text-gray-700 text-lg mb-6">
                    I'm thinking of a number between ${this.minNumber} and ${this.maxNumber}.<br>
                    Can you guess it in ${this.maxAttempts} tries?
                </p>
                
                <div class="mb-6">
                    <input type="number" 
                           id="guessInput" 
                           class="game-input" 
                           placeholder="Enter your guess..."
                           min="${this.minNumber}" 
                           max="${this.maxNumber}">
                </div>
                
                <button id="submitGuessButton" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-colors duration-200 mb-4">
                    Make Guess
                </button>
                
                <div id="gameInfo" class="mb-4">
                    <p class="text-gray-600">Attempts: <span id="attemptCount">0</span> / ${this.maxAttempts}</p>
                </div>
                
                <div id="gameFeedback" class="game-feedback min-h-[2rem]"></div>
                
                <button id="newGameButton" 
                        class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 mt-4 hidden">
                    New Game
                </button>
            </div>
        `;

        this.startNewGame();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const guessInput = document.getElementById('guessInput');
        const submitButton = document.getElementById('submitGuessButton');
        const newGameButton = document.getElementById('newGameButton');

        // Submit guess on button click
        submitButton.addEventListener('click', () => this.handleGuess());

        // Submit guess on Enter key
        guessInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleGuess();
            }
        });

        // New game button
        newGameButton.addEventListener('click', () => this.startNewGame());

        // Focus on input
        guessInput.focus();
    }

    /**
     * Start a new game
     */
    startNewGame() {
        this.secretNumber = this.getRandomNumber(this.minNumber, this.maxNumber);
        this.attempts = 0;
        
        // Reset UI
        document.getElementById('guessInput').value = '';
        document.getElementById('guessInput').disabled = false;
        document.getElementById('submitGuessButton').disabled = false;
        document.getElementById('newGameButton').classList.add('hidden');
        document.getElementById('attemptCount').textContent = '0';
        document.getElementById('gameFeedback').textContent = '';
        
        // Focus on input
        document.getElementById('guessInput').focus();
    }

    /**
     * Handle a guess attempt
     */
    handleGuess() {
        const guessInput = document.getElementById('guessInput');
        const feedbackElement = document.getElementById('gameFeedback');
        const attemptElement = document.getElementById('attemptCount');
        
        // Validate input
        const validation = this.validateInput(guessInput.value, 'integer');
        if (!validation.isValid) {
            this.showFeedback(validation.message, 'error', feedbackElement);
            return;
        }

        const guess = validation.value;

        // Check if guess is in valid range
        if (guess < this.minNumber || guess > this.maxNumber) {
            this.showFeedback(
                `Please enter a number between ${this.minNumber} and ${this.maxNumber}.`, 
                'error', 
                feedbackElement
            );
            return;
        }

        this.attempts++;
        attemptElement.textContent = this.attempts;

        // Check the guess
        if (guess === this.secretNumber) {
            this.handleWin();
        } else if (this.attempts >= this.maxAttempts) {
            this.handleLoss();
        } else {
            this.handleIncorrectGuess(guess);
        }

        // Clear input
        guessInput.value = '';
        guessInput.focus();
    }

    /**
     * Handle a winning guess
     */
    handleWin() {
        const feedbackElement = document.getElementById('gameFeedback');
        let message = `🎉 Congratulations! You guessed it in ${this.attempts} ${this.attempts === 1 ? 'try' : 'tries'}!`;
        
        if (this.attempts === 1) {
            message += ' Amazing first guess!';
        } else if (this.attempts <= 3) {
            message += ' Excellent guessing!';
        } else if (this.attempts <= 6) {
            message += ' Good job!';
        }

        this.showFeedback(message, 'success', feedbackElement);
        this.endGame();
    }

    /**
     * Handle game loss
     */
    handleLoss() {
        const feedbackElement = document.getElementById('gameFeedback');
        this.showFeedback(
            `😔 Game over! The number was ${this.secretNumber}. Better luck next time!`, 
            'error', 
            feedbackElement
        );
        this.endGame();
    }

    /**
     * Handle an incorrect guess
     */
    handleIncorrectGuess(guess) {
        const feedbackElement = document.getElementById('gameFeedback');
        const remaining = this.maxAttempts - this.attempts;
        
        let hint = '';
        if (guess < this.secretNumber) {
            hint = 'Too low! Try a higher number.';
        } else {
            hint = 'Too high! Try a lower number.';
        }

        // Add additional hints based on how close they are
        const difference = Math.abs(guess - this.secretNumber);
        if (difference <= 5) {
            hint += ' 🔥 You\'re very close!';
        } else if (difference <= 15) {
            hint += ' 🌡️ Getting warmer!';
        } else {
            hint += ' ❄️ Still quite far away.';
        }

        hint += ` (${remaining} ${remaining === 1 ? 'try' : 'tries'} left)`;

        this.showFeedback(hint, 'info', feedbackElement);
    }

    /**
     * End the current game
     */
    endGame() {
        document.getElementById('guessInput').disabled = true;
        document.getElementById('submitGuessButton').disabled = true;
        document.getElementById('newGameButton').classList.remove('hidden');
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        // Any specific cleanup for this game
    }
}