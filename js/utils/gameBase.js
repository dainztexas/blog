/**
 * Base Game Class
 * Provides common functionality for all games
 */

export class Game {
    constructor(gameId, title) {
        this.gameId = gameId;
        this.title = title;
        this.isActive = false;
        this.gameContentArea = null;
        this.messageBoxTitle = null;
    }

    /**
     * Initialize the game
     * @param {HTMLElement} gameContentArea - The content area to render the game
     * @param {HTMLElement} messageBoxTitle - The title element
     */
    async init(gameContentArea, messageBoxTitle) {
        this.gameContentArea = gameContentArea;
        this.messageBoxTitle = messageBoxTitle;
        this.isActive = true;
        
        // Set the title
        this.messageBoxTitle.textContent = this.title;
        
        // Render the game
        await this.render();
        
        // Bind events
        this.bindEvents();
    }

    /**
     * Render the game UI - Override in subclasses
     */
    render() {
        throw new Error('render() method must be implemented by subclass');
    }

    /**
     * Bind event listeners - Override in subclasses
     */
    bindEvents() {
        // Default implementation - subclasses can override
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        this.isActive = false;
        // Subclasses can override to add specific cleanup
    }

    /**
     * Utility method to create HTML elements
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Attributes to set
     * @param {string} content - Inner content
     * @returns {HTMLElement}
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Utility method to show feedback messages
     * @param {string} message - Message to show
     * @param {string} type - Type of message ('success', 'error', 'info')
     * @param {HTMLElement} targetElement - Element to show message in
     */
    showFeedback(message, type = 'info', targetElement = null) {
        if (!targetElement) {
            // Create or find feedback element
            targetElement = this.gameContentArea.querySelector('.game-feedback') || 
                          this.gameContentArea.querySelector('#gameFeedback');
        }
        
        if (targetElement) {
            targetElement.textContent = message;
            
            // Apply styling based on type
            targetElement.className = 'game-feedback';
            switch (type) {
                case 'success':
                    targetElement.style.color = '#16a34a';
                    break;
                case 'error':
                    targetElement.style.color = '#dc2626';
                    break;
                default:
                    targetElement.style.color = '#374151';
            }
        }
    }

    /**
     * Utility method to shuffle an array
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Utility method to generate random number
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Utility method to debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility method to validate user input
     * @param {string} input - Input to validate
     * @param {string} type - Type of validation ('number', 'text', 'email')
     * @returns {Object} Validation result {isValid: boolean, message: string}
     */
    validateInput(input, type = 'text') {
        const trimmed = input.trim();
        
        if (!trimmed) {
            return { isValid: false, message: 'Please enter a value.' };
        }
        
        switch (type) {
            case 'number':
                const num = parseFloat(trimmed);
                if (isNaN(num)) {
                    return { isValid: false, message: 'Please enter a valid number.' };
                }
                return { isValid: true, value: num };
                
            case 'integer':
                const int = parseInt(trimmed);
                if (isNaN(int) || !Number.isInteger(Number(trimmed))) {
                    return { isValid: false, message: 'Please enter a whole number.' };
                }
                return { isValid: true, value: int };
                
            default:
                return { isValid: true, value: trimmed };
        }
    }
}