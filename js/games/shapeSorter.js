import { Game } from '../utils/gameBase.js';

export class ShapeSorterGame extends Game {
    constructor() {
        super('shape-sorter', 'Shape Sorter!');
    }

    render() {
        this.gameContentArea.innerHTML = `
            <div class="text-center">
                <p class="text-gray-700 text-lg mb-6">🔺 Match shapes and learn geometry!</p>
                <div class="bg-pink-50 p-4 rounded-lg">
                    <p class="text-pink-700">🚧 Under Construction - Shape sorting coming soon!</p>
                </div>
            </div>
        `;
    }
}