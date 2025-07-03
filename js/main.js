/**
 * Main Application Entry Point
 * Kids' Fun Zone - Modular Version
 */

import { ThemeManager } from './utils/themeManager.js';
import { GameLoader } from './utils/gameLoader.js';

class KidsFunZoneApp {
    constructor() {
        this.themeManager = null;
        this.gameLoader = null;
        this.messageBoxContainer = null;
        this.messageBoxTitle = null;
        this.gameContentArea = null;
        this.closeMessageBoxButton = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupApp());
            } else {
                this.setupApp();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Application failed to load. Please refresh the page.');
        }
    }

    /**
     * Setup the application after DOM is ready
     */
    setupApp() {
        // Get DOM elements
        this.messageBoxContainer = document.getElementById('messageBoxContainer');
        this.messageBoxTitle = document.getElementById('messageBoxTitle');
        this.gameContentArea = document.getElementById('gameContentArea');
        this.closeMessageBoxButton = document.getElementById('closeMessageBox');

        if (!this.validateRequiredElements()) {
            this.showError('Required elements not found. Please check the HTML structure.');
            return;
        }

        // Initialize managers
        this.themeManager = new ThemeManager();
        this.gameLoader = new GameLoader(
            this.messageBoxTitle, 
            this.gameContentArea, 
            this.themeManager
        );

        // Initialize theme
        this.themeManager.init();

        // Setup event listeners
        this.setupEventListeners();

        console.log('Kids Fun Zone App initialized successfully!');
    }

    /**
     * Validate that all required DOM elements exist
     */
    validateRequiredElements() {
        const required = [
            this.messageBoxContainer,
            this.messageBoxTitle,
            this.gameContentArea,
            this.closeMessageBoxButton
        ];

        return required.every(element => element !== null);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Game tile click events
        const gameTiles = document.querySelectorAll('.game-tile');
        gameTiles.forEach(tile => {
            tile.addEventListener('click', (event) => this.handleGameTileClick(event));
        });

        // Close button event
        this.closeMessageBoxButton.addEventListener('click', () => this.hideMessageBox());

        // Click outside modal to close
        this.messageBoxContainer.addEventListener('click', (event) => {
            if (event.target === this.messageBoxContainer) {
                this.hideMessageBox();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    /**
     * Handle game tile clicks
     */
    handleGameTileClick(event) {
        const tile = event.currentTarget;
        const title = tile.dataset.title;
        const description = tile.dataset.description;
        const gameId = tile.dataset.gameId;

        console.log(`Loading game: ${gameId}`);
        this.showMessageBox(title, description, gameId);
    }

    /**
     * Handle keyboard events
     */
    handleKeyDown(event) {
        // Close modal on Escape key
        if (event.key === 'Escape' && this.isMessageBoxVisible()) {
            this.hideMessageBox();
        }
    }

    /**
     * Show the message box with game content
     */
    async showMessageBox(title, description, gameId) {
        try {
            // Clear previous content
            this.clearMessageBoxContent();

            if (gameId) {
                // Load the specific game
                await this.gameLoader.loadGame(gameId);
            } else {
                // Show placeholder content
                this.messageBoxTitle.textContent = title;
                this.gameContentArea.innerHTML = `
                    <p class="text-gray-600 text-lg">${description}</p>
                    <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <p class="text-yellow-700">This feature is coming soon!</p>
                    </div>
                `;
            }

            // Show the modal
            this.messageBoxContainer.classList.add('show');
            
            // Focus management for accessibility
            this.messageBoxContainer.focus();

        } catch (error) {
            console.error('Error showing message box:', error);
            this.showError('Failed to load content. Please try again.');
        }
    }

    /**
     * Hide the message box
     */
    hideMessageBox() {
        this.messageBoxContainer.classList.remove('show');
        this.clearMessageBoxContent();
        
        // Return focus to the last focused element or first game tile
        const firstGameTile = document.querySelector('.game-tile');
        if (firstGameTile) {
            firstGameTile.focus();
        }
    }

    /**
     * Clear message box content
     */
    clearMessageBoxContent() {
        this.gameLoader.clearContent();
    }

    /**
     * Check if message box is currently visible
     */
    isMessageBoxVisible() {
        return this.messageBoxContainer.classList.contains('show');
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);
        
        // Create a simple error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <p class="font-semibold">Error</p>
            <p>${message}</p>
            <button class="mt-2 underline" onclick="this.parentElement.remove()">Close</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the app when the script loads
const app = new KidsFunZoneApp();
app.init();