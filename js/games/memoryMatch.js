import { Game } from '../utils/gameBase.js';

export class MemoryMatchGame extends Game {
    constructor() {
        super('memory-match', 'Memory Match!');
    }

    render() {
        this.gameContentArea.innerHTML = `
            <div class="text-center">
                <p class="text-gray-700 text-lg mb-6">🧠 Test your memory with fun cards!</p>
                <div class="bg-teal-50 p-4 rounded-lg">
                    <p class="text-teal-700">🚧 Under Construction - Memory game coming soon!</p>
                </div>
            </div>
        `;
    }
}