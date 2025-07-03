import { Game } from '../utils/gameBase.js';

export class Calendar extends Game {
    constructor() {
        console.log('Calendar constructor called');
        super('calendar', 'My Calendar');
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = {};
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    async render() {
        console.log('Calendar render method called');
        const gameContent = this.gameContentArea || document.getElementById('gameContentArea');
        
        if (!gameContent) {
            console.error('Game content area not found');
            return;
        }
        
        gameContent.innerHTML = `
            <div class="calendar-container">
                <div class="text-center p-8">
                    <h2 class="text-3xl font-bold text-purple-600 mb-4">📅 My Calendar</h2>
                    <p class="text-lg text-gray-600 mb-6">Keep track of your events and activities!</p>
                    
                    <!-- Simple Calendar Display -->
                    <div class="calendar-header bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg mb-4">
                        <div class="flex justify-between items-center">
                            <button id="prevMonth" class="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30">
                                ⬅️
                            </button>
                            <h3 id="monthYear" class="text-xl font-bold"></h3>
                            <button id="nextMonth" class="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30">
                                ➡️
                            </button>
                        </div>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="bg-white rounded-lg shadow-lg p-4">
                        <div class="grid grid-cols-7 gap-1 mb-2">
                            ${this.dayNames.map(day => `
                                <div class="p-2 font-semibold text-gray-600 text-center">${day}</div>
                            `).join('')}
                        </div>
                        <div id="calendarDays" class="grid grid-cols-7 gap-1">
                            <!-- Days will be generated here -->
                        </div>
                    </div>
                    
                    <!-- Today's Date -->
                    <div class="mt-6 p-4 bg-blue-100 rounded-lg">
                        <p class="text-lg font-semibold text-blue-800">
                            📅 Today: ${this.formatDate(new Date())}
                        </p>
                    </div>
                    
                    <!-- Fun Fact -->
                    <div class="mt-4 p-4 bg-yellow-100 rounded-lg">
                        <h4 class="text-lg font-semibold text-yellow-800 mb-2">🌟 Calendar Fun Fact!</h4>
                        <p id="funFact" class="text-yellow-700"></p>
                    </div>
                </div>
            </div>
        `;

        try {
            this.updateCalendar();
            this.displayRandomFact();
        } catch (error) {
            console.error('Error in calendar render methods:', error);
        }
    }

    bindEvents() {
        console.log('Calendar bindEvents called');
        
        try {
            // Navigation buttons
            const prevButton = document.getElementById('prevMonth');
            const nextButton = document.getElementById('nextMonth');
            
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                    this.updateCalendar();
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                    this.updateCalendar();
                });
            }
        } catch (error) {
            console.error('Error binding calendar events:', error);
        }
    }

    updateCalendar() {
        try {
            // Update month/year display
            const monthYear = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
            const monthYearEl = document.getElementById('monthYear');
            if (monthYearEl) {
                monthYearEl.textContent = monthYear;
            }

            // Generate calendar days
            const calendarDays = document.getElementById('calendarDays');
            if (!calendarDays) return;
            
            calendarDays.innerHTML = '';

            const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
            const startingDayOfWeek = firstDay.getDay();

            // Add empty cells for days before first day of month
            for (let i = 0; i < startingDayOfWeek; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'p-2';
                calendarDays.appendChild(emptyDay);
            }

            // Add days of the month
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'p-2 border rounded hover:bg-blue-100 cursor-pointer text-center';
                
                // Check if it's today
                const today = new Date();
                const isToday = (
                    this.currentDate.getFullYear() === today.getFullYear() &&
                    this.currentDate.getMonth() === today.getMonth() &&
                    day === today.getDate()
                );

                if (isToday) {
                    dayElement.className += ' bg-blue-500 text-white font-bold';
                }

                dayElement.textContent = day;
                
                dayElement.addEventListener('click', () => {
                    alert(`You clicked on day ${day}! 📅`);
                });

                calendarDays.appendChild(dayElement);
            }
        } catch (error) {
            console.error('Error updating calendar:', error);
        }
    }

    formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    displayRandomFact() {
        const facts = [
            "A year has 365 days, except leap years which have 366! 🗓️",
            "The calendar we use today is called the Gregorian calendar! 📅", 
            "February is the shortest month with only 28 or 29 days! 📆",
            "Sunday is the first day of the week in many countries! 🌞",
            "There are 12 months in a year! 🎯"
        ];
        
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        const factElement = document.getElementById('funFact');
        if (factElement) {
            factElement.textContent = randomFact;
        }
    }

    cleanup() {
        console.log('Calendar cleanup called');
        super.cleanup();
    }
}

export default Calendar;