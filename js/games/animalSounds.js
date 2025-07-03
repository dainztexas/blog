/**
 * Animal Sounds Game
 * Learn about animals and their sounds with interactive games
 */

import { Game } from '../utils/gameBase.js';

export class AnimalSoundsGame extends Game {
    constructor() {
        super('animal-sounds', 'Animal Sounds Fun!');
        
        // Animal data
        this.animals = [
            { name: "Lion", image: "resources/images/lion_sound.png", soundText: "Roar!" },
            { name: "Cow", image: "resources/images/cow_sound.png", soundText: "Mooo!" },
            { name: "Dog", image: "resources/images/puppy_sound.png", soundText: "Woof!" },
            { name: "Cat", image: "resources/images/cat_sound.png", soundText: "Meow!" },
            { name: "Duck", image: "resources/images/duck_sound.png", soundText: "Quack!" },
            { name: "Sheep", image: "resources/images/sheep_sound.png", soundText: "Baa!" },
            { name: "Elephant", image: "resources/images/ele.png", soundText: "Trumpet!" },
            { name: "Pig", image: "resources/images/pig_sound.png", soundText: "Oink!" },
        ];
        
        this.currentQuizAnimal = null;
        this.quizScore = 0;
        this.totalQuizRounds = 0;
    }

    /**
     * Render the main animal sounds interface
     */
    render() {
        this.gameContentArea.innerHTML = `
            <div class="flex justify-center mb-6 space-x-4">
                <button id="learnAnimalsBtn" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">Learn Animals</button>
                <button id="guessSoundGameBtn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">Guess the Sound Game</button>
            </div>
            <div id="animalAppContent" class="w-full text-center">
                <!-- Content will be loaded here -->
            </div>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        document.getElementById('learnAnimalsBtn').addEventListener('click', () => this.displayLearnAnimals());
        document.getElementById('guessSoundGameBtn').addEventListener('click', () => this.displayGuessSoundGame());

        // Default to showing learn animals section
        this.displayLearnAnimals();
    }

    /**
     * Display the "Learn Animals" section
     */
    displayLearnAnimals() {
        const appContentDiv = document.getElementById('animalAppContent');
        let animalGridHtml = '<h4 class="text-xl font-bold text-gray-800 mb-4">Click an animal to hear its sound!</h4>';
        animalGridHtml += '<div class="animal-grid">';
        
        this.animals.forEach(animal => {
            animalGridHtml += `
                <div class="animal-tile-small" data-animal-name="${animal.name}" data-animal-sound="${animal.soundText}">
                    <img src="${animal.image}" alt="${animal.name}">
                    <span>${animal.name}</span>
                </div>
            `;
        });
        
        animalGridHtml += '</div>';
        appContentDiv.innerHTML = animalGridHtml;

        // Add click listeners to animal tiles
        document.querySelectorAll('.animal-tile-small').forEach(tile => {
            tile.addEventListener('click', (event) => {
                const animalName = event.currentTarget.dataset.animalName;
                const animalSound = event.currentTarget.dataset.animalSound;
                
                // Show sound feedback
                const soundFeedback = document.createElement('p');
                soundFeedback.className = 'game-message mt-2 text-purple-700';
                soundFeedback.textContent = `"${animalName}" says "${animalSound}"!`;
                appContentDiv.appendChild(soundFeedback);

                // Remove feedback after a short delay
                setTimeout(() => {
                    if (soundFeedback.parentElement) {
                        appContentDiv.removeChild(soundFeedback);
                    }
                }, 2000);
            });
        });
    }

    /**
     * Display the "Guess the Sound Game" section
     */
    displayGuessSoundGame() {
        const appContentDiv = document.getElementById('animalAppContent');
        appContentDiv.innerHTML = `
            <h4 class="text-xl font-bold text-gray-800 mb-4">Guess which animal makes this sound!</h4>
            <p id="quizSoundPrompt" class="game-message text-3xl font-extrabold text-indigo-700 mb-6">-</p>
            <div id="quizOptions" class="animal-game-options">
                <!-- Options will be loaded here -->
            </div>
            <p id="quizFeedback" class="game-message mt-4"></p>
            <div class="mt-6 flex justify-center space-x-4">
                <button id="playQuizSound" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors duration-200">Play Sound</button>
                <button id="nextQuizRound" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 hidden">Next Round</button>
            </div>
            <p class="game-message mt-4 text-lg">Score: <span id="quizScore">0</span> / <span id="totalQuizRounds">0</span></p>
        `;

        // Reset game state
        this.quizScore = 0;
        this.totalQuizRounds = 0;
        this.updateScoreDisplay();

        // Bind events
        document.getElementById('playQuizSound').addEventListener('click', () => this.startQuizRound());
        document.getElementById('nextQuizRound').addEventListener('click', () => this.startQuizRound());

        // Start first round
        this.startQuizRound();
    }

    /**
     * Start a new quiz round
     */
    startQuizRound() {
        const quizSoundPrompt = document.getElementById('quizSoundPrompt');
        const quizOptionsDiv = document.getElementById('quizOptions');
        const quizFeedback = document.getElementById('quizFeedback');
        const playQuizSoundBtn = document.getElementById('playQuizSound');
        const nextQuizRoundBtn = document.getElementById('nextQuizRound');

        // Reset UI
        quizFeedback.textContent = '';
        nextQuizRoundBtn.classList.add('hidden');
        playQuizSoundBtn.classList.remove('hidden');

        // Select random animal
        const correctAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
        this.currentQuizAnimal = correctAnimal;
        this.totalQuizRounds++;
        this.updateScoreDisplay();

        // Get 2 incorrect options
        const incorrectAnimals = this.animals.filter(animal => animal.name !== correctAnimal.name);
        const shuffledIncorrect = this.shuffleArray([...incorrectAnimals]);
        const selectedIncorrect = shuffledIncorrect.slice(0, 2);

        // Combine and shuffle options
        const options = this.shuffleArray([...selectedIncorrect, correctAnimal]);

        quizSoundPrompt.textContent = 'Click "Play Sound" to hear!';
        quizOptionsDiv.innerHTML = '';

        // Create option elements
        options.forEach(animal => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'animal-game-option';
            optionDiv.dataset.animalName = animal.name;
            optionDiv.innerHTML = `<img src="${animal.image}" alt="${animal.name}" class="w-16 h-16 rounded-lg mb-2 border border-gray-400"><span>${animal.name}</span>`;
            optionDiv.addEventListener('click', (event) => this.handleQuizGuess(event));
            quizOptionsDiv.appendChild(optionDiv);
        });

        // Play sound button functionality
        playQuizSoundBtn.addEventListener('click', () => {
            if (this.currentQuizAnimal) {
                quizSoundPrompt.textContent = `"${this.currentQuizAnimal.soundText}"!`;
            }
        });
    }

    /**
     * Handle quiz guess
     */
    handleQuizGuess(event) {
        if (!this.currentQuizAnimal) return;

        const guessedAnimalName = event.currentTarget.dataset.animalName;
        const allOptions = document.getElementById('quizOptions').querySelectorAll('.animal-game-option');
        const quizFeedback = document.getElementById('quizFeedback');
        const playQuizSoundBtn = document.getElementById('playQuizSound');
        const nextQuizRoundBtn = document.getElementById('nextQuizRound');

        // Disable all options
        allOptions.forEach(option => {
            option.style.pointerEvents = 'none';
            if (option.dataset.animalName === this.currentQuizAnimal.name) {
                option.classList.add('correct');
            } else if (option.dataset.animalName === guessedAnimalName) {
                option.classList.add('incorrect');
            }
        });

        if (guessedAnimalName === this.currentQuizAnimal.name) {
            this.quizScore++;
            this.showFeedback(`🥳 Correct! That's a "${this.currentQuizAnimal.name}"!`, 'success', quizFeedback);
        } else {
            this.showFeedback(`😔 Not quite! That was a "${this.currentQuizAnimal.soundText}" from a "${this.currentQuizAnimal.name}".`, 'error', quizFeedback);
        }

        this.updateScoreDisplay();
        playQuizSoundBtn.classList.add('hidden');
        nextQuizRoundBtn.classList.remove('hidden');
    }

    /**
     * Update score display
     */
    updateScoreDisplay() {
        const quizScoreSpan = document.getElementById('quizScore');
        const totalQuizRoundsSpan = document.getElementById('totalQuizRounds');
        
        if (quizScoreSpan) quizScoreSpan.textContent = this.quizScore;
        if (totalQuizRoundsSpan) totalQuizRoundsSpan.textContent = this.totalQuizRounds;
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        this.currentQuizAnimal = null;
        this.quizScore = 0;
        this.totalQuizRounds = 0;
    }
}