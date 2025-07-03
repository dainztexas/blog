/**
 * Music Maker Game - Placeholder
 */
import { Game } from '../utils/gameBase.js';

export class MusicMakerGame extends Game {
    constructor() {
        super('music-maker', 'Music Maker!');
    }

    render() {
        this.gameContentArea.innerHTML = `
            <div class="text-center">
                <p class="text-gray-700 text-lg mb-6">🎵 Create your own tunes!</p>
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <p class="text-yellow-700">🚧 Under Construction - Music maker coming soon!</p>
                </div>
            </div>
        `;
    }
}