import { Game } from '../utils/gameBase.js';

export class NumberExplorerGame extends Game {
    constructor() {
        super('number-explorer', 'Number Explorer!');
    }

    render() {
        this.gameContentArea.innerHTML = `
            <div class="text-center">
                <p class="text-gray-700 text-lg mb-6">🔢 Explore numbers and counting!</p>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-blue-700">🚧 Under Construction - Number games coming soon!</p>
                </div>
            </div>
        `;
    }
}