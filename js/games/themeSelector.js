/**
 * Theme Selector Game
 * Allows users to change the theme of the website
 */

import { Game } from '../utils/gameBase.js';

export class ThemeSelector extends Game {
    constructor(themeManager) {
        super('theme-selector', 'Choose Your Theme!');
        this.themeManager = themeManager;
    }

    /**
     * Render the theme selector UI
     */
    render() {
        const themesHTML = this.themeManager.generateThemeSelectorHTML();
        this.gameContentArea.innerHTML = themesHTML;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const themeCards = this.gameContentArea.querySelectorAll('.theme-option-card');
        
        themeCards.forEach(card => {
            card.addEventListener('click', (event) => {
                const themeId = event.currentTarget.dataset.themeId;
                this.selectTheme(themeId);
            });
        });
    }

    /**
     * Handle theme selection
     * @param {string} themeId - Selected theme ID
     */
    selectTheme(themeId) {
        // Apply the theme
        this.themeManager.applyTheme(themeId);
        
        // Show feedback
        const themeName = this.themeManager.getThemes()[themeId].name;
        this.showFeedback(
            `🎨 Theme changed to "${themeName}"! Enjoy your new look!`, 
            'success'
        );
        
        // Close the modal after a brief delay
        setTimeout(() => {
            // Trigger the close event (assuming there's a close function in parent scope)
            const closeButton = document.getElementById('closeMessageBox');
            if (closeButton) {
                closeButton.click();
            }
        }, 1500);
    }

    /**
     * Cleanup - no specific cleanup needed for theme selector
     */
    cleanup() {
        super.cleanup();
    }
}