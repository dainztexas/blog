/**
 * Coloring Fun Game
 * Digital coloring book with pixel art canvas
 */

import { Game } from '../utils/gameBase.js';

export class ColoringGame extends Game {
    constructor() {
        super('coloring-fun', 'Coloring Fun!');
        
        // Coloring pages data
        this.coloringPages = [
            { id: "rainbow-unicorn", title: "Rainbow Unicorn", imageUrl: "resources/images/paint_unicon.png", gridWidth: 20, gridHeight: 20 },
            { id: "happy-robot", title: "Happy Robot", imageUrl: "resources/images/paint_robot.png", gridWidth: 25, gridHeight: 25 },
            { id: "space-rocket", title: "Space Rocket", imageUrl: "resources/images/paint_rocket.png", gridWidth: 15, gridHeight: 15 },
            { id: "friendly-dinosaur", title: "Friendly Dinosaur", imageUrl: "resources/images/paint_dino.png", gridWidth: 22, gridHeight: 22 },
            { id: "cute-cat", title: "Cute Cat", imageUrl: "resources/images/cat_paint.png", gridWidth: 18, gridHeight: 18 },
            { id: "jungle-animals", title: "Jungle Animals", imageUrl: "resources/images/paint_forest.png", gridWidth: 30, gridHeight: 20 },
        ];
        
        this.currentSelectedColor = null;
    }

    /**
     * Render the coloring page selection screen
     */
    render() {
        let coloringGalleryHtml = `
            <p class="text-gray-700 text-lg mb-4">Choose a picture to color:</p>
            <div class="coloring-page-grid">
        `;
        
        this.coloringPages.forEach(page => {
            coloringGalleryHtml += `
                <div class="coloring-thumbnail" data-page-id="${page.id}">
                    <img src="${page.imageUrl}" alt="${page.title} thumbnail">
                    <span>${page.title}</span>
                </div>
            `;
        });
        
        coloringGalleryHtml += `</div>`;
        this.gameContentArea.innerHTML = coloringGalleryHtml;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const thumbnails = this.gameContentArea.querySelectorAll('.coloring-thumbnail');
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (event) => {
                const pageId = event.currentTarget.dataset.pageId;
                this.displayColoringPage(pageId);
            });
        });
    }

    /**
     * Display the selected coloring page with canvas
     * @param {string} pageId - The ID of the coloring page
     */
    displayColoringPage(pageId) {
        const selectedPage = this.coloringPages.find(page => page.id === pageId);
        if (!selectedPage) {
            this.gameContentArea.innerHTML = `<p class="text-red-500">Coloring page not found!</p>`;
            return;
        }

        this.messageBoxTitle.textContent = `Coloring: ${selectedPage.title}`;
        this.gameContentArea.innerHTML = `
            <div class="coloring-canvas-main-area">
                <div class="coloring-reference-section">
                    <h4 class="text-xl font-bold text-gray-800 mb-4">Reference Image</h4>
                    <img src="${selectedPage.imageUrl}" alt="${selectedPage.title}" class="coloring-image-display">
                </div>

                <div class="coloring-interactive-section">
                    <h4 class="text-xl font-bold text-gray-800 mb-4">Your Coloring Canvas</h4>
                    <div id="colorPalette" class="color-palette">
                        <!-- Color swatches will be dynamically added here -->
                    </div>
                    <div id="pixelArtCanvas" class="pixel-art-grid-container">
                        <!-- Pixel boxes will be generated here -->
                    </div>
                    <div class="mt-6 flex justify-center space-x-4">
                        <button id="clearCanvasButton" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-colors duration-200">Clear Canvas</button>
                        <button id="backToColoringGallery" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-colors duration-200">Back to Gallery</button>
                    </div>
                </div>
            </div>
        `;

        this.setupColoringCanvas(selectedPage);
    }

    /**
     * Set up the coloring canvas with colors and pixel grid
     * @param {Object} selectedPage - The selected coloring page data
     */
    setupColoringCanvas(selectedPage) {
        const colorPaletteDiv = document.getElementById('colorPalette');
        const pixelArtCanvas = document.getElementById('pixelArtCanvas');
        
        const colors = [
            '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', // Rainbow colors
            '#FFC0CB', '#808080', '#A52A2A', '#000000', '#FFFFFF' // Pink, Gray, Brown, Black, White
        ];

        // Calculate pixel size dynamically
        const gridContainerMaxWidth = 400;
        const pixelSize = Math.floor(gridContainerMaxWidth / selectedPage.gridWidth);

        pixelArtCanvas.style.gridTemplateColumns = `repeat(${selectedPage.gridWidth}, 1fr)`;
        pixelArtCanvas.style.gridTemplateRows = `repeat(${selectedPage.gridHeight}, 1fr)`;
        pixelArtCanvas.style.setProperty('--pixel-size', `${pixelSize}px`);

        // Generate pixel boxes
        for (let i = 0; i < selectedPage.gridWidth * selectedPage.gridHeight; i++) {
            const pixelBox = document.createElement('div');
            pixelBox.className = 'pixel-box';
            pixelBox.addEventListener('click', () => {
                if (this.currentSelectedColor) {
                    pixelBox.style.backgroundColor = this.currentSelectedColor;
                }
            });
            pixelArtCanvas.appendChild(pixelBox);
        }

        // Create color palette
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color;
            swatch.addEventListener('click', () => {
                // Remove 'selected' class from previous swatch
                if (this.currentSelectedColor) {
                    const prevSwatch = colorPaletteDiv.querySelector(`.color-swatch[data-color="${this.currentSelectedColor}"]`);
                    if (prevSwatch) prevSwatch.classList.remove('selected');
                }
                // Add 'selected' class to current swatch
                swatch.classList.add('selected');
                this.currentSelectedColor = color;
            });
            colorPaletteDiv.appendChild(swatch);
        });

        // Auto-select the first color
        if (colors.length > 0) {
            const firstSwatch = colorPaletteDiv.querySelector(`.color-swatch[data-color="${colors[0]}"]`);
            if (firstSwatch) {
                firstSwatch.classList.add('selected');
                this.currentSelectedColor = colors[0];
            }
        }

        // Bind button events
        document.getElementById('clearCanvasButton').addEventListener('click', () => {
            document.querySelectorAll('.pixel-box').forEach(box => {
                box.style.backgroundColor = '#ffffff';
            });
        });

        document.getElementById('backToColoringGallery').addEventListener('click', () => {
            this.messageBoxTitle.textContent = this.title;
            this.render();
            this.bindEvents();
        });
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        this.currentSelectedColor = null;
    }
}