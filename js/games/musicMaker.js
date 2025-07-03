/**
 * Music Maker Game
 * Create music with piano keys and pre-made melodies using Tone.js
 */

import { Game } from '../utils/gameBase.js';

export class MusicMakerGame extends Game {
    constructor() {
        super('music-maker', 'Music Maker Fun!');
        this.synth = null;
        this.currentSequence = null;
        
        // Define melodies
        this.melodies = {
            twinkle: [
                { note: "C4", duration: "4n" }, { note: "C4", duration: "4n" }, { note: "G4", duration: "4n" }, { note: "G4", duration: "4n" },
                { note: "A4", duration: "4n" }, { note: "A4", duration: "4n" }, { note: "G4", duration: "2n" },
                { note: "F4", duration: "4n" }, { note: "F4", duration: "4n" }, { note: "E4", duration: "4n" }, { note: "E4", duration: "4n" },
                { note: "D4", duration: "4n" }, { note: "D4", duration: "4n" }, { note: "C4", duration: "2n" }
            ],
            mary: [
                { note: "E4", duration: "4n" }, { note: "D4", duration: "4n" }, { note: "C4", duration: "4n" }, { note: "D4", duration: "4n" },
                { note: "E4", duration: "4n" }, { note: "E4", duration: "4n" }, { note: "E4", duration: "2n" },
                { note: "D4", duration: "4n" }, { note: "D4", duration: "4n" }, { note: "D4", duration: "2n" },
                { note: "E4", duration: "4n" }, { note: "G4", duration: "4n" }, { note: "G4", duration: "2n" }
            ],
            scales: [
                { note: "C4", duration: "8n" }, { note: "D4", duration: "8n" }, { note: "E4", duration: "8n" }, { note: "F4", duration: "8n" },
                { note: "G4", duration: "8n" }, { note: "A4", duration: "8n" }, { note: "B4", duration: "8n" }, { note: "C5", duration: "8n" }
            ]
        };
    }

    /**
     * Render the music maker interface
     */
    render() {
        this.gameContentArea.innerHTML = `
            <p class="text-gray-700 text-lg mb-4">Play notes or hear some fun melodies!</p>

            <div id="currentPlayingNoteDisplay" class="current-note-display"></div>

            <div class="piano-keyboard">
                <button class="piano-key" data-note="C4">C</button>
                <button class="piano-key" data-note="D4">D</button>
                <button class="piano-key" data-note="E4">E</button>
                <button class="piano-key" data-note="F4">F</button>
                <button class="piano-key" data-note="G4">G</button>
                <button class="piano-key" data-note="A4">A</button>
                <button class="piano-key" data-note="B4">B</button>
                <button class="piano-key" data-note="C5">C5</button>
            </div>

            <p class="text-gray-700 text-lg mb-4">Try some pre-made melodies:</p>
            <div class="melody-buttons">
                <button class="melody-button" data-melody="twinkle">Twinkle, Twinkle</button>
                <button class="melody-button" data-melody="mary">Mary Had a Little Lamb</button>
                <button class="melody-button" data-melody="scales">Ascending Scale</button>
            </div>

            <div class="music-controls">
                <button id="stopMusicButton" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-colors duration-200">Stop All Music</button>
            </div>
        `;
    }

    /**
     * Bind event listeners and initialize Tone.js
     */
    bindEvents() {
        this.initializeToneJS();
        this.bindPianoKeys();
        this.bindMelodyButtons();
        this.bindStopButton();
    }

    /**
     * Initialize Tone.js synthesizer
     */
    initializeToneJS() {
        if (!this.synth && window.Tone) {
            this.synth = new Tone.Synth().toDestination();
            
            // Start Tone.js context on first user interaction
            document.documentElement.addEventListener('mousedown', () => {
                if (Tone.context.state !== 'running') {
                    Tone.context.resume();
                }
            }, { once: true });
        }
    }

    /**
     * Bind piano key events
     */
    bindPianoKeys() {
        const currentPlayingNoteDisplay = document.getElementById('currentPlayingNoteDisplay');
        const pianoKeys = document.querySelectorAll('.piano-key');

        pianoKeys.forEach(key => {
            key.addEventListener('click', (event) => {
                const note = event.target.dataset.note;
                if (this.synth) {
                    this.synth.triggerAttackRelease(note, "8n");
                    
                    // Visual feedback
                    key.classList.add('active-key');
                    setTimeout(() => {
                        key.classList.remove('active-key');
                    }, Tone.Time("8n").toMilliseconds());
                }
                currentPlayingNoteDisplay.textContent = note;
            });
        });
    }

    /**
     * Bind melody button events
     */
    bindMelodyButtons() {
        const melodyButtons = document.querySelectorAll('.melody-button');
        melodyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const melodyId = event.target.dataset.melody;
                if (this.melodies[melodyId]) {
                    this.playMelody(this.melodies[melodyId]);
                }
            });
        });
    }

    /**
     * Bind stop button event
     */
    bindStopButton() {
        document.getElementById('stopMusicButton').addEventListener('click', () => {
            this.stopAllMusic();
        });
    }

    /**
     * Play a melody sequence
     * @param {Array} melody - Array of note objects
     */
    playMelody(melody) {
        if (!window.Tone || !this.synth) return;

        // Stop any currently playing sequence
        this.stopAllMusic();

        const currentPlayingNoteDisplay = document.getElementById('currentPlayingNoteDisplay');
        const pianoKeys = document.querySelectorAll('.piano-key');

        // Create a new sequence
        this.currentSequence = new Tone.Sequence((time, noteInfo) => {
            // Schedule note playback
            if (this.synth) {
                this.synth.triggerAttackRelease(noteInfo.note, noteInfo.duration, time);
            }

            // Schedule visual updates
            Tone.Draw.schedule(() => {
                // Clear previous highlights
                currentPlayingNoteDisplay.textContent = noteInfo.note;
                pianoKeys.forEach(key => key.classList.remove('active-key'));

                // Highlight current key
                const activeKey = document.querySelector(`.piano-key[data-note="${noteInfo.note}"]`);
                if (activeKey) {
                    activeKey.classList.add('active-key');
                }

                // Schedule removal of highlight after note duration
                setTimeout(() => {
                    if (activeKey) {
                        activeKey.classList.remove('active-key');
                    }
                }, Tone.Time(noteInfo.duration).toMilliseconds());

            }, time);
        }, melody, "4n");

        // Start the transport and sequence
        Tone.Transport.start();
        this.currentSequence.start(0);
    }

    /**
     * Stop all music and clear highlights
     */
    stopAllMusic() {
        if (window.Tone) {
            if (this.currentSequence) {
                Tone.Transport.stop();
                Tone.Transport.cancel();
                this.currentSequence.dispose();
                this.currentSequence = null;
            }
            
            // Clear visual highlights
            const pianoKeys = document.querySelectorAll('.piano-key');
            const currentPlayingNoteDisplay = document.getElementById('currentPlayingNoteDisplay');
            
            pianoKeys.forEach(key => key.classList.remove('active-key'));
            if (currentPlayingNoteDisplay) {
                currentPlayingNoteDisplay.textContent = '';
            }
        }
    }

    /**
     * Cleanup game resources
     */
    cleanup() {
        super.cleanup();
        this.stopAllMusic();
        
        if (this.synth) {
            this.synth.dispose();
            this.synth = null;
        }
    }
}