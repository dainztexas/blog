/**
 * Theme Manager Module
 * Handles theme selection, application, and persistence
 */

export class ThemeManager {
    constructor() {
        this.themes = {
            'default': { 
                name: 'Default Fun', 
                bodyClass: '', 
                headerGradient: 'purple-600 to-indigo-700', 
                previewColor: '#8b5cf6' 
            },
            'rainbow': { 
                name: 'Rainbow Blast', 
                bodyClass: 'theme-rainbow', 
                headerGradient: 'red-500, #f97316, #eab308, #22c55e, #3b82f6, #6366f1, #9333ea', 
                previewColor: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #6366f1, #9400D3)' 
            },
            'unicorn': { 
                name: 'Unicorn Dream', 
                bodyClass: 'theme-unicorn', 
                headerGradient: 'pink-300 to-purple-400', 
                previewColor: 'linear-gradient(to bottom right, #fbcfe8, #f0abfc, #d8b4fe)' 
            },
            'chocolate': { 
                name: 'Chocolate Delight', 
                bodyClass: 'theme-chocolate', 
                headerGradient: 'amber-800 to-yellow-800', 
                previewColor: 'linear-gradient(to bottom right, #7c2d12, #9a3412, #b45309)' 
            },
            'carracing': { 
                name: 'Car Racing', 
                bodyClass: 'theme-carracing', 
                headerGradient: 'gray-800 to-gray-600', 
                previewColor: 'linear-gradient(to bottom right, #1f2937, #374151, #4b5563)' 
            },
        };
    }

    /**
     * Apply the selected theme to the page
     * @param {string} themeId - The ID of the theme to apply
     */
    applyTheme(themeId) {
        const body = document.body;
        const header = document.querySelector('header');
        
        // Remove all existing theme classes from body
        for (const key in this.themes) {
            if (this.themes[key].bodyClass) {
                body.classList.remove(this.themes[key].bodyClass);
            }
        }

        // Apply the selected theme class to body
        const selectedTheme = this.themes[themeId];
        if (selectedTheme && selectedTheme.bodyClass) {
            body.classList.add(selectedTheme.bodyClass);
        }

        // Apply header gradient
        if (header && selectedTheme && selectedTheme.headerGradient) {
            header.style.backgroundImage = `linear-gradient(to right, ${selectedTheme.headerGradient})`;
        } else if (header) {
            // Default gradient if no specific one
            header.style.backgroundImage = `linear-gradient(to right, #8b5cf6, #6366f1)`;
        }

        // Store theme preference in localStorage
        this.saveTheme(themeId);
    }

    /**
     * Save theme preference to localStorage
     * @param {string} themeId - The theme ID to save
     */
    saveTheme(themeId) {
        localStorage.setItem('kidsFunZoneTheme', themeId);
    }

    /**
     * Load saved theme from localStorage
     * @returns {string} The saved theme ID or 'default'
     */
    loadSavedTheme() {
        return localStorage.getItem('kidsFunZoneTheme') || 'default';
    }

    /**
     * Initialize theme manager and apply saved theme
     */
    init() {
        const savedTheme = this.loadSavedTheme();
        this.applyTheme(savedTheme);
    }

    /**
     * Get all available themes
     * @returns {Object} Themes object
     */
    getThemes() {
        return this.themes;
    }

    /**
     * Generate theme selector HTML
     * @returns {string} HTML string for theme selection
     */
    generateThemeSelectorHTML() {
        let themeGalleryHtml = `
            <p class="text-gray-700 text-lg mb-4">Select a theme to change the look of the Fun Zone:</p>
            <div class="theme-selection-grid">
        `;
        
        for (const themeId in this.themes) {
            const theme = this.themes[themeId];
            themeGalleryHtml += `
                <div class="theme-option-card" data-theme-id="${themeId}">
                    <div class="theme-preview-box" style="background: ${theme.previewColor};"></div>
                    <span>${theme.name}</span>
                </div>
            `;
        }
        
        themeGalleryHtml += `</div>`;
        return themeGalleryHtml;
    }
}