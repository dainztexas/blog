/**
 * Shape Sorter Game
 * Drag and drop shapes into the correct bins
 */

import { Game } from '../utils/gameBase.js';

export class ShapeSorterGame extends Game {
    constructor() {
        super('shape-sorter', 'Shape Sorter!');
        
        // Shape data
        this.shapesData = [
            { id: 'shape1', type: 'circle', color: '#EF4444', emoji: '🔴' },
            { id: 'shape2', type: 'circle', color: '#F97316', emoji: '🟠' },
            { id: 'shape3', type: 'square', color: '#22C55E', emoji: '🟩' },
            { id: 'shape4', type: 'square', color: '#10B981', emoji: '🟢' },
            { id: 'shape5', type: 'triangle', color: '#3B82F6', emoji: '🔺' },
            { id: 'shape6', type: 'triangle', color: '#6366F1', emoji: '🔼' },
            { id: 'shape7', type: 'star', color: '#EAB308', emoji: '⭐' },
            { id: 'shape8', type: 'star', color: '#FDE047', emoji: '🌟' },
            { id: 'shape9', type: 'rectangle', color: '#EC4899', emoji: '🟪' },
            { id: 'shape10', type: 'rectangle', color: '#D946EF', emoji: '🟫' },
        ];
        
        this.currentShapes = [];
        this.score = 0;
        this.totalShapesCount = 0;
        this.draggedElement = null;
    }

    /**
     * Render the shape sorter game
     */
    render() {
        this.gameContentArea.innerHTML = `
            <div class="shape-sorter-game">
                <p class="text-gray-700 text-lg mb-4">Drag each shape to its matching bin!</p>

                <div id="shapeDragArea" class="shape-drag-area">
                    <!-- Draggable shapes will be rendered here -->
                </div>

                <div id="shapeDropArea" class="shape-drop-area">
                    <!-- Drop bins will be rendered here -->
                </div>

                <p id="scoreDisplay" class="score-display">Score: 0 / 0</p>
                <p id="gameFeedback" class="game-feedback"></p>

                <button id="resetShapeSorterButton" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200 mt-6">Play Again</button>
            </div>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        document.getElementById('resetShapeSorterButton').addEventListener('click', () => this.resetGame());
        this.resetGame(); // Start the first game
    }

    /**
     * Reset the game to start a new round
     */
    resetGame() {
        this.score = 0;
        this.currentShapes = [...this.shapesData];
        this.shuffleArray(this.currentShapes);
        this.totalShapesCount = this.currentShapes.length;

        document.getElementById('scoreDisplay').textContent = `Score: ${this.score} / ${this.totalShapesCount}`;
        document.getElementById('gameFeedback').textContent = '';
        document.getElementById('resetShapeSorterButton').classList.add('hidden');

        this.renderShapes();
        this.renderBins();
    }

    /**
     * Render draggable shapes
     */
    renderShapes() {
        const shapeDragArea = document.getElementById('shapeDragArea');
        shapeDragArea.innerHTML = '';
        
        this.currentShapes.forEach(shape => {
            const shapeDiv = document.createElement('div');
            shapeDiv.className = 'draggable-shape';
            shapeDiv.draggable = true;
            shapeDiv.dataset.shapeId = shape.id;
            shapeDiv.dataset.shapeType = shape.type;
            shapeDiv.style.backgroundColor = shape.color;
            shapeDiv.innerHTML = shape.emoji;

            shapeDiv.addEventListener('dragstart', (event) => this.handleDragStart(event));
            shapeDiv.addEventListener('dragend', (event) => this.handleDragEnd(event));
            shapeDragArea.appendChild(shapeDiv);
        });
    }

    /**
     * Render drop bins for each shape type
     */
    renderBins() {
        const shapeDropArea = document.getElementById('shapeDropArea');
        shapeDropArea.innerHTML = '';

        const uniqueShapeTypes = [...new Set(this.shapesData.map(shape => shape.type))];

        uniqueShapeTypes.forEach(type => {
            const binDiv = document.createElement('div');
            binDiv.className = 'drop-bin';
            binDiv.dataset.binType = type;
            binDiv.innerHTML = `
                ${this.getShapeSVG(type)}
                <span>${type.charAt(0).toUpperCase() + type.slice(1)} Bin</span>
            `;

            binDiv.addEventListener('dragover', (event) => this.handleDragOver(event));
            binDiv.addEventListener('dragleave', (event) => this.handleDragLeave(event));
            binDiv.addEventListener('drop', (event) => this.handleDrop(event));
            shapeDropArea.appendChild(binDiv);
        });
    }

    /**
     * Get SVG for shape type
     * @param {string} type - Shape type
     * @returns {string} SVG string
     */
    getShapeSVG(type) {
        switch (type) {
            case 'circle':
                return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>`;
            case 'square':
                return `<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="currentColor"/></svg>`;
            case 'triangle':
                return `<svg viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" fill="currentColor"/></svg>`;
            case 'star':
                return `<svg viewBox="0 0 100 100"><polygon points="50,5 61,39 98,39 68,61 79,95 50,73 21,95 32,61 2,39 39,39" fill="currentColor"/></svg>`;
            case 'rectangle':
                return `<svg viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="currentColor"/></svg>`;
            default:
                return '';
        }
    }

    /**
     * Handle drag start
     */
    handleDragStart(event) {
        this.draggedElement = event.target;
        event.dataTransfer.setData('text/plain', this.draggedElement.dataset.shapeType);
        this.draggedElement.classList.add('dragging');
    }

    /**
     * Handle drag end
     */
    handleDragEnd(event) {
        if (event.target) {
            event.target.classList.remove('dragging');
        }
        this.draggedElement = null;
    }

    /**
     * Handle drag over
     */
    handleDragOver(event) {
        event.preventDefault();
        if (event.currentTarget) {
            event.currentTarget.classList.add('drag-over');
        }
    }

    /**
     * Handle drag leave
     */
    handleDragLeave(event) {
        if (event.currentTarget) {
            event.currentTarget.classList.remove('drag-over');
        }
    }

    /**
     * Handle drop
     */
    handleDrop(event) {
        event.preventDefault();
        const droppedShapeType = event.dataTransfer.getData('text/plain');
        const targetBin = event.currentTarget;
        const feedbackDisplay = document.getElementById('gameFeedback');
        const scoreDisplay = document.getElementById('scoreDisplay');

        if (!targetBin) return;

        targetBin.classList.remove('drag-over');

        if (droppedShapeType === targetBin.dataset.binType) {
            this.score++;
            this.showFeedback(`🥳 Great job! That's a ${droppedShapeType}!`, 'success', feedbackDisplay);
            targetBin.classList.add('correct-drop');
            
            // Remove the shape
            if (this.draggedElement) {
                this.draggedElement.remove();
                this.currentShapes = this.currentShapes.filter(shape => shape.id !== this.draggedElement.dataset.shapeId);
            }
        } else {
            this.showFeedback(`😔 Oops! That's not a ${targetBin.dataset.binType}. Try again!`, 'error', feedbackDisplay);
            targetBin.classList.add('incorrect-drop');
        }

        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${this.score} / ${this.totalShapesCount}`;
        }

        // Remove feedback and color after delay
        setTimeout(() => {
            if (feedbackDisplay) feedbackDisplay.textContent = '';
            if (targetBin) targetBin.classList.remove('correct-drop', 'incorrect-drop');
        }, 1500);

        // Check if all shapes are sorted
        if (this.currentShapes.length === 0) {
            this.showFeedback(`🎉 You sorted all the shapes! Well done!`, 'success', feedbackDisplay);
            const resetButton = document.getElementById('resetShapeSorterButton');
            if (resetButton) resetButton.classList.remove('hidden');
        }
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        this.currentShapes = [];
        this.score = 0;
        this.draggedElement = null;
    }
}