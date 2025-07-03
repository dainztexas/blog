/**
 * Story Time Adventures Game
 * Interactive story reading with images
 */

import { Game } from '../utils/gameBase.js';

export class StoryTimeGame extends Game {
    constructor() {
        super('story-time-adventures', 'Story Time Adventures!');
        
        // Story data
        this.stories = {
            "the-little-bear": {
                title: "The Little Bear Who Lost His Roar",
                content: `
                    Once upon a time, in a cozy forest, lived a little bear named Barnaby.
                    Barnaby loved to play, but he had a secret: he couldn't roar! All the other bears
                    had mighty roars that shook the leaves, but Barnaby's was just a tiny squeak.
                    <br><br>
                    One sunny morning, Barnaby decided he would find his roar. He asked the wise old owl,
                    "How can I find my roar?" The owl hooted softly, "Your roar isn't lost, little bear.
                    It's inside you, waiting to be brave!"
                    <br><br>
                    Barnaby wasn't sure what that meant, but he decided to try being brave.
                    He saw a tiny squirrel struggling to reach a nut high on a branch.
                    Barnaby carefully nudged the branch, and the nut fell. The squirrel chattered happily.
                    <br><br>
                    Next, he saw a baby bird fall from its nest. Barnaby gently picked it up
                    and placed it back. The mother bird sang a sweet thank you.
                    <br><br>
                    Later, a big, grumpy badger blocked the path. Barnaby took a deep breath,
                    and though scared, he puffed out his chest and said, "Excuse me, Mr. Badger,
                    may I please pass?" The badger, surprised by Barnaby's politeness and bravery,
                    grumbled and moved aside.
                    <br><br>
                    As Barnaby walked home, he felt a warmth in his chest. He saw his reflection
                    in a pond and decided to try again. He took a huge breath, and this time,
                    a magnificent, rumbling ROAR burst forth! It wasn't loud, but it was strong and true.
                    Barnaby smiled. He had found his roar by being kind and brave.
                `,
                imageUrl: "resources/images/bear.png",
                imageAlt: "A cute little bear cub trying to roar in a forest"
            },
            "the-magical-treehouse": {
                title: "The Magical Treehouse Adventure",
                content: `
                    Lily and Tom discovered a treehouse unlike any other. It glowed with a soft,
                    rainbow light and hummed with a gentle tune. Inside, instead of dusty boards,
                    were sparkling crystals and a map to fantastical lands.
                    <br><br>
                    "Where should we go first?" whispered Lily, eyes wide with wonder.
                    "The Candy Cloud Kingdom!" shouted Tom, pointing to a swirl of pink on the map.
                    <br><br>
                    They touched the spot, and with a whoosh, the treehouse spun. When it stopped,
                    they were floating amidst clouds made of cotton candy and rivers of fizzy lemonade!
                    They laughed and ate until their tummies were full.
                    <br><br>
                    Their next adventure took them to the Whispering Woods, where trees told ancient
                    tales, and then to the Sparkle Stone Caves, filled with gems that twinkled like stars.
                    Every journey from the magical treehouse was a new, delightful surprise.
                    <br><br>
                    They knew that no matter where they went, their greatest adventure was always
                    the joy of discovering new places together. And the magical treehouse was always
                    ready for their next big dream.
                `,
                imageUrl: "resources/images/story_forest.png",
                imageAlt: "Children in a glowing magical treehouse"
            },
            "the-brave-little-robot": {
                title: "The Brave Little Robot",
                content: `
                    In a world of gleaming gears and whirring circuits, lived a small robot named Bolt.
                    Bolt was not very big, nor very strong, but he had the biggest heart of all.
                    His job was to fix tiny, broken things in the city.
                    <br><br>
                    One day, the city's giant clock tower stopped ticking. Everyone was worried.
                    "It's too high!" cried the tall robots. "It's too complicated!" whirred the smart robots.
                    <br><br>
                    But Bolt, seeing the sadness in the citizens' eyes, decided to try.
                    He carefully climbed the gears, one tiny cog at a time, until he reached the very top.
                    With his small, precise tools, he found the loose spring and fixed it.
                    <br><br>
                    *Tick-tock!* The giant clock began to chime again! The city cheered for Bolt,
                    the brave little robot who proved that even the smallest among us can do the biggest things.
                `,
                imageUrl: "resources/images/story_robot.png",
                imageAlt: "A small robot fixing a giant clock tower"
            }
        };
    }

    /**
     * Render the main story selection screen
     */
    render() {
        let storyListHtml = '<p class="text-gray-700 text-lg mb-4">Choose a story to read:</p>';
        storyListHtml += '<div class="w-full flex flex-col items-center">';
        
        for (const storyId in this.stories) {
            storyListHtml += `
                <div class="story-list-item w-full md:w-3/4 lg:w-2/3" data-story-id="${storyId}">
                    <span>${this.stories[storyId].title}</span>
                    <span>➡️</span>
                </div>
            `;
        }
        
        storyListHtml += '</div>';
        this.gameContentArea.innerHTML = storyListHtml;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        const storyItems = this.gameContentArea.querySelectorAll('.story-list-item');
        storyItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const storyId = event.currentTarget.dataset.storyId;
                this.displayStory(storyId);
            });
        });
    }

    /**
     * Display a specific story with image and content
     * @param {string} storyId - The ID of the story to display
     */
    displayStory(storyId) {
        const story = this.stories[storyId];
        if (!story) {
            this.gameContentArea.innerHTML = `<p class="text-red-500">Story not found!</p>`;
            return;
        }

        this.gameContentArea.innerHTML = `
            <h4 class="mb-4">${story.title}</h4>
            <img src="${story.imageUrl}" alt="${story.imageAlt}" class="story-image">
            <div class="story-content text-justify">${story.content}</div>
            <button id="backToStoriesButton" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-colors duration-200 mt-4">Back to Stories</button>
        `;
        
        this.messageBoxTitle.textContent = story.title;

        // Bind back button
        document.getElementById('backToStoriesButton').addEventListener('click', () => {
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
    }
}