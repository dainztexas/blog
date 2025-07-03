/**
 * Game Loader Module
 * Handles loading and routing of different games
 */

import { GuessNumberGame } from '../games/guessNumber.js';
import { StoryTimeGame } from '../games/storyTime.js';
import { AnimalSoundsGame } from '../games/animalSounds.js';
import { ColoringGame } from '../games/coloring.js';
import { MusicMakerGame } from '../games/musicMaker.js';
import { ShapeSorterGame } from '../games/shapeSorter.js';
import { MemoryMatchGame } from '../games/memoryMatch.js';
import { NumberExplorerGame } from '../games/numberExplorer.js';
import { ThemeSelector } from '../games/themeSelector.js';
import { Calendar } from '../games/calendar.js';

export class GameLoader {
    constructor(messageBoxTitle, gameContentArea, themeManager) {
        this.messageBoxTitle = messageBoxTitle;
        this.gameContentArea = gameContentArea;
        this.themeManager = themeManager;
        this.currentGame = null;
        
        // Register available games
        this.games = new Map([
            ['guess-the-number', GuessNumberGame],
            ['story-time-adventures', StoryTimeGame],
            ['animal-sounds', AnimalSoundsGame],
            ['coloring-fun', ColoringGame],
            ['music-maker', MusicMakerGame],
            ['shape-sorter', ShapeSorterGame],
            ['memory-match', MemoryMatchGame],
            ['number-explorer', NumberExplorerGame],
            ['calendar', Calendar],
            ['theme-selector', ThemeSelector]
        ]);
    }

    /**
     * Load a specific game by ID
     * @param {string} gameId - The unique ID of the game to load
     */
    async loadGame(gameId) {
        try {
            // Cleanup previous game if exists
            this.cleanupCurrentGame();

            // Clear game content area
            this.gameContentArea.innerHTML = '';

            // Validate game ID
            if (!this.validateGameId(gameId)) {
                throw new Error(`Invalid game ID: ${gameId}`);
            }

            // Get game class
            const GameClass = this.games.get(gameId);
            
            // Special handling for theme selector
            if (gameId === 'theme-selector') {
                this.currentGame = new GameClass(this.themeManager);
            } else {
                this.currentGame = new GameClass();
            }

            // Initialize the game
            await this.currentGame.init(this.gameContentArea, this.messageBoxTitle);
            
        } catch (error) {
            console.error('Failed to load game:', error);
            this.showErrorMessage(`Game "${gameId}" could not be loaded. Please try again.`);
        }
    }

    /**
     * Validate if the game ID is supported
     * @param {string} gameId - The game ID to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateGameId(gameId) {
        return this.games.has(gameId);
    }

    /**
     * Show error message in the game content area
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        this.gameContentArea.innerHTML = `
            <div class="text-center p-6">
                <div class="text-red-500 text-xl mb-4">⚠️ Oops!</div>
                <p class="text-red-600 text-lg">${message}</p>
                <button class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200" 
                        onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }

    /**
     * Cleanup the current game instance
     */
    cleanupCurrentGame() {
        if (this.currentGame && typeof this.currentGame.cleanup === 'function') {
            this.currentGame.cleanup();
        }
        this.currentGame = null;

        // Stop any ongoing music sequences when switching games
        if (window.Tone && window.Tone.Transport) {
            Tone.Transport.stop();
            Tone.Transport.cancel();
        }
    }

    /**
     * Get list of available games
     * @returns {Array} Array of game IDs
     */
    getAvailableGames() {
        return Array.from(this.games.keys());
    }

    /**
     * Clear game content area
     */
    clearContent() {
        this.cleanupCurrentGame();
        this.gameContentArea.innerHTML = '';
        this.messageBoxTitle.textContent = '';
    }
}