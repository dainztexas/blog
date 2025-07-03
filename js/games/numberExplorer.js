/**
 * Number Explorer Game
 * Counting, addition, and subtraction activities with visual aids
 */

import { Game } from '../utils/gameBase.js';

export class NumberExplorerGame extends Game {
    constructor() {
        super('number-explorer', 'Number Explorer!');
        
        this.currentNumberToCount = 0;
        this.currentProblemType = 'count'; // 'count', 'addition', 'subtraction'
        this.currentAnswer = 0;
    }

    /**
     * Render the number explorer game
     */
    render() {
        this.gameContentArea.innerHTML = `
            <div class="number-explorer-game">
                <p class="text-gray-700 text-lg mb-4">Choose a number game!</p>
                <div class="number-game-options">
                    <button id="countItemsBtn" class="number-game-option-btn">Count Items</button>
                    <button id="additionGameBtn" class="number-game-option-btn">Addition Game</button>
                    <button id="subtractionGameBtn" class="number-game-option-btn">Subtraction Game</button>
                </div>

                <div id="numberGameContent" class="w-full text-center">
                    <!-- Game content will be loaded here -->
                </div>
            </div>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        document.getElementById('countItemsBtn').addEventListener('click', () => {
            this.currentProblemType = 'count';
            this.displayCountingGame();
        });
        document.getElementById('additionGameBtn').addEventListener('click', () => {
            this.currentProblemType = 'addition';
            this.displayAdditionGame();
        });
        document.getElementById('subtractionGameBtn').addEventListener('click', () => {
            this.currentProblemType = 'subtraction';
            this.displaySubtractionGame();
        });

        // Start with counting game by default
        this.displayCountingGame();
    }

    /**
     * Display the counting game interface
     */
    displayCountingGame() {
        const numberGameContent = document.getElementById('numberGameContent');
        numberGameContent.innerHTML = `
            <p class="text-gray-700 text-lg mb-4">Count the items and type the number!</p>
            <div id="numberDisplayArea" class="number-display-area">
                <!-- Items to count will be rendered here -->
            </div>
            <div class="number-input-section">
                <input type="number" id="numberGuessInput" class="game-input" placeholder="How many items?">
                <button id="checkNumberButton" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200">Check</button>
                <p id="numberFeedback" class="game-message mt-4"></p>
                <button id="nextNumberButton" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 mt-4 hidden">Next Number</button>
            </div>
        `;
        this.bindNumberGameEvents();
        this.generateNewNumber();
    }

    /**
     * Display the addition game interface
     */
    displayAdditionGame() {
        const numberGameContent = document.getElementById('numberGameContent');
        numberGameContent.innerHTML = `
            <p class="text-gray-700 text-lg mb-4">Solve the addition problem!</p>
            <div id="numberProblemDisplay" class="number-problem-display"></div>
            <div id="numberDisplayArea" class="number-display-area"></div>
            <div class="number-input-section">
                <input type="number" id="numberGuessInput" class="game-input" placeholder="Your answer">
                <button id="checkNumberButton" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200">Check</button>
                <p id="numberFeedback" class="game-message mt-4"></p>
                <button id="nextNumberButton" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 mt-4 hidden">Next Problem</button>
            </div>
        `;
        this.bindNumberGameEvents();
        this.generateNewNumber();
    }

    /**
     * Display the subtraction game interface
     */
    displaySubtractionGame() {
        const numberGameContent = document.getElementById('numberGameContent');
        numberGameContent.innerHTML = `
            <p class="text-gray-700 text-lg mb-4">Solve the subtraction problem!</p>
            <div id="numberProblemDisplay" class="number-problem-display"></div>
            <div id="numberDisplayArea" class="number-display-area"></div>
            <div class="number-input-section">
                <input type="number" id="numberGuessInput" class="game-input" placeholder="Your answer">
                <button id="checkNumberButton" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200">Check</button>
                <p id="numberFeedback" class="game-message mt-4"></p>
                <button id="nextNumberButton" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 mt-4 hidden">Next Problem</button>
            </div>
        `;
        this.bindNumberGameEvents();
        this.generateNewNumber();
    }

    /**
     * Bind events for number game elements
     */
    bindNumberGameEvents() {
        document.getElementById('checkNumberButton').addEventListener('click', () => this.checkNumberGuess());
        document.getElementById('numberGuessInput').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.checkNumberGuess();
            }
        });
        document.getElementById('nextNumberButton').addEventListener('click', () => this.generateNewNumber());
    }

    /**
     * Generate a new problem based on current problem type
     */
    generateNewNumber() {
        const numberDisplayArea = document.getElementById('numberDisplayArea');
        const numberProblemDisplay = document.getElementById('numberProblemDisplay');
        const numberGuessInput = document.getElementById('numberGuessInput');
        const numberFeedback = document.getElementById('numberFeedback');
        const checkNumberButton = document.getElementById('checkNumberButton');
        const nextNumberButton = document.getElementById('nextNumberButton');

        // Clear content
        if (numberDisplayArea) numberDisplayArea.innerHTML = '';
        if (numberProblemDisplay) numberProblemDisplay.textContent = '';

        numberGuessInput.value = '';
        numberFeedback.textContent = '';
        numberGuessInput.disabled = false;
        checkNumberButton.disabled = false;
        nextNumberButton.classList.add('hidden');

        let num1, num2;

        switch (this.currentProblemType) {
            case 'count':
                this.currentNumberToCount = this.getRandomNumber(1, 10);
                this.currentAnswer = this.currentNumberToCount;
                for (let i = 0; i < this.currentNumberToCount; i++) {
                    if (numberDisplayArea) numberDisplayArea.innerHTML += this.getBananaSVG();
                }
                break;
                
            case 'addition':
                num1 = this.getRandomNumber(1, 5);
                num2 = this.getRandomNumber(1, 5);
                this.currentAnswer = num1 + num2;
                if (numberProblemDisplay) numberProblemDisplay.textContent = `${num1} + ${num2} = ?`;
                if (numberDisplayArea) {
                    for (let i = 0; i < num1; i++) numberDisplayArea.innerHTML += this.getBananaSVG();
                    numberDisplayArea.innerHTML += this.getOperatorSVG('+');
                    for (let i = 0; i < num2; i++) numberDisplayArea.innerHTML += this.getBananaSVG();
                    numberDisplayArea.innerHTML += this.getOperatorSVG('=');
                    numberDisplayArea.innerHTML += `<span class="number-problem-display text-gray-700">?</span>`;
                }
                break;
                
            case 'subtraction':
                num1 = this.getRandomNumber(1, 10);
                num2 = this.getRandomNumber(1, num1);
                this.currentAnswer = num1 - num2;
                if (numberProblemDisplay) numberProblemDisplay.textContent = `${num1} - ${num2} = ?`;
                if (numberDisplayArea) {
                    for (let i = 0; i < num1; i++) numberDisplayArea.innerHTML += this.getBananaSVG();
                    numberDisplayArea.innerHTML += this.getOperatorSVG('-');
                    for (let i = 0; i < num2; i++) numberDisplayArea.innerHTML += this.getBananaSVG();
                    numberDisplayArea.innerHTML += this.getOperatorSVG('=');
                    numberDisplayArea.innerHTML += `<span class="number-problem-display text-gray-700">?</span>`;
                }
                break;
        }
    }

    /**
     * Check the user's number guess
     */
    checkNumberGuess() {
        const numberGuessInput = document.getElementById('numberGuessInput');
        const numberFeedback = document.getElementById('numberFeedback');
        const checkNumberButton = document.getElementById('checkNumberButton');
        const nextNumberButton = document.getElementById('nextNumberButton');

        const validation = this.validateInput(numberGuessInput.value, 'integer');
        if (!validation.isValid) {
            this.showFeedback(validation.message, 'error', numberFeedback);
            return;
        }

        const userGuess = validation.value;

        if (userGuess === this.currentAnswer) {
            this.showFeedback(`🎉 Correct! The answer is ${this.currentAnswer}!`, 'success', numberFeedback);
        } else {
            this.showFeedback(`😔 Not quite! The correct answer is ${this.currentAnswer}. Try again on the next round!`, 'error', numberFeedback);
        }

        numberGuessInput.disabled = true;
        checkNumberButton.disabled = true;
        nextNumberButton.classList.remove('hidden');
    }

    /**
     * Get SVG for banana shape
     * @returns {string} SVG string
     */
    getBananaSVG() {
        return `<svg class="number-item-banana-svg" viewBox="0 0 100 100">
                    <path d="M20,90 C10,70 10,30 50,10 C90,30 90,70 80,90 C70,95 30,95 20,90 Z" />
                </svg>`;
    }

    /**
     * Get SVG for operator symbols
     * @param {string} operator - The operator (+, -, =)
     * @returns {string} SVG string
     */
    getOperatorSVG(operator) {
        let path = '';
        if (operator === '+') {
            path = `M10,50 H90 M50,10 V90`;
        } else if (operator === '-') {
            path = `M10,50 H90`;
        } else if (operator === '=') {
            path = `M10,40 H90 M10,60 H90`;
        }
        return `<svg class="operator-svg" viewBox="0 0 100 100" stroke="currentColor" stroke-width="10" fill="none">
                    <path d="${path}" />
                </svg>`;
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        this.currentNumberToCount = 0;
        this.currentAnswer = 0;
    }
}