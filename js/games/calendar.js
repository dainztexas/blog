import { Game } from '../utils/gameBase.js';

export class Calendar extends Game {
    constructor() {
        super('calendar', 'My Calendar');
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = this.loadEvents();
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.kidActivities = [
            'Birthday Party 🎂', 'School Trip 🚌', 'Doctor Visit 👩‍⚕️',
            'Soccer Practice ⚽', 'Music Lesson 🎵', 'Family Movie Night 🎬',
            'Playground Time 🏰', 'Library Visit 📚', 'Art Class 🎨',
            'Swimming 🏊‍♀️', 'Dentist Visit 🦷', 'Sleepover 🛏️'
        ];
    }

    render() {
        const gameContent = document.getElementById('gameContentArea');
        gameContent.innerHTML = `
            <div class="calendar-container">
                <!-- Calendar Header -->
                <div class="calendar-header">
                    <button id="prevMonth" class="nav-btn">
                        <span class="text-2xl">⬅️</span>
                    </button>
                    <div class="month-year">
                        <h3 id="monthYear" class="text-2xl font-bold text-purple-600"></h3>
                        <p class="text-sm text-gray-600">Click on any day to add an event!</p>
                    </div>
                    <button id="nextMonth" class="nav-btn">
                        <span class="text-2xl">➡️</span>
                    </button>
                </div>

                <!-- Calendar Grid -->
                <div class="calendar-grid">
                    <!-- Day headers -->
                    <div class="day-headers">
                        ${this.dayNames.map(day => `
                            <div class="day-header">${day}</div>
                        `).join('')}
                    </div>
                    
                    <!-- Calendar days -->
                    <div id="calendarDays" class="calendar-days">
                        <!-- Days will be generated here -->
                    </div>
                </div>

                <!-- Event Panel -->
                <div class="event-panel">
                    <div class="today-info">
                        <p class="text-lg font-semibold text-blue-600">
                            📅 Today: ${this.formatDate(new Date())}
                        </p>
                    </div>

                    <!-- Selected Date Events -->
                    <div id="selectedDateEvents" class="selected-events">
                        <p class="text-gray-500">Click on a date to see or add events!</p>
                    </div>

                    <!-- Quick Add Buttons -->
                    <div class="quick-add-section" style="display: none;" id="quickAddSection">
                        <h4 class="text-lg font-semibold mb-2">✨ Quick Add:</h4>
                        <div class="activity-buttons">
                            ${this.kidActivities.slice(0, 6).map(activity => `
                                <button class="activity-btn" data-activity="${activity}">
                                    ${activity}
                                </button>
                            `).join('')}
                        </div>
                        
                        <!-- Custom Event Input -->
                        <div class="custom-event-section">
                            <input type="text" id="customEvent" placeholder="Or type your own event..." 
                                   class="w-full p-2 border-2 border-purple-300 rounded-lg">
                            <button id="addCustomEvent" class="add-event-btn">
                                Add Event ➕
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Fun Facts Section -->
                <div class="fun-facts">
                    <div class="fact-card">
                        <h4>🌟 Calendar Fun Fact!</h4>
                        <p id="funFact"></p>
                    </div>
                </div>
            </div>
        `;

        this.updateCalendar();
        this.displayRandomFact();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateCalendar();
        });

        // Quick activity buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('activity-btn')) {
                const activity = e.target.dataset.activity;
                this.addEvent(this.selectedDate, activity);
            }
        });

        // Custom event button
        document.getElementById('addCustomEvent').addEventListener('click', () => {
            const customEvent = document.getElementById('customEvent').value.trim();
            if (customEvent && this.selectedDate) {
                this.addEvent(this.selectedDate, customEvent);
                document.getElementById('customEvent').value = '';
            }
        });

        // Enter key for custom event
        document.getElementById('customEvent').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addCustomEvent').click();
            }
        });
    }

    updateCalendar() {
        // Update month/year display
        const monthYear = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('monthYear').textContent = monthYear;

        // Generate calendar days
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before first day of month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateKey = this.getDateKey(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const hasEvents = this.events[dateKey] && this.events[dateKey].length > 0;
            
            // Check if it's today
            const today = new Date();
            const isToday = (
                this.currentDate.getFullYear() === today.getFullYear() &&
                this.currentDate.getMonth() === today.getMonth() &&
                day === today.getDate()
            );

            dayElement.innerHTML = `
                <span class="day-number ${isToday ? 'today' : ''}">${day}</span>
                ${hasEvents ? '<div class="event-indicator">📝</div>' : ''}
            `;

            if (hasEvents) {
                dayElement.classList.add('has-events');
            }

            if (isToday) {
                dayElement.classList.add('today-cell');
            }

            dayElement.addEventListener('click', () => {
                this.selectDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            });

            calendarDays.appendChild(dayElement);
        }
    }

    selectDate(year, month, day) {
        this.selectedDate = { year, month, day };
        const dateKey = this.getDateKey(year, month, day);
        
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked day
        event.target.closest('.calendar-day').classList.add('selected');

        // Show events for selected date
        this.displayEventsForDate(dateKey);
        
        // Show quick add section
        document.getElementById('quickAddSection').style.display = 'block';
    }

    displayEventsForDate(dateKey) {
        const eventsContainer = document.getElementById('selectedDateEvents');
        const events = this.events[dateKey] || [];
        
        const selectedDateObj = new Date(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day);
        const formattedDate = this.formatDate(selectedDateObj);

        if (events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="selected-date-header">
                    <h4>📅 ${formattedDate}</h4>
                    <p class="text-gray-600">No events planned. Add some fun activities!</p>
                </div>
            `;
        } else {
            eventsContainer.innerHTML = `
                <div class="selected-date-header">
                    <h4>📅 ${formattedDate}</h4>
                    <div class="events-list">
                        ${events.map((event, index) => `
                            <div class="event-item">
                                <span class="event-text">${event}</span>
                                <button class="delete-event" data-date="${dateKey}" data-index="${index}">
                                    ❌
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Bind delete event listeners
            document.querySelectorAll('.delete-event').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const dateKey = e.target.dataset.date;
                    const index = parseInt(e.target.dataset.index);
                    this.deleteEvent(dateKey, index);
                });
            });
        }
    }

    addEvent(date, eventText) {
        if (!date || !eventText) return;
        
        const dateKey = this.getDateKey(date.year, date.month, date.day);
        
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }
        
        this.events[dateKey].push(eventText);
        this.saveEvents();
        this.updateCalendar();
        this.displayEventsForDate(dateKey);
        
        // Show success message
        this.showMessage(`Event added: ${eventText}! 🎉`, 'success');
    }

    deleteEvent(dateKey, index) {
        if (this.events[dateKey]) {
            this.events[dateKey].splice(index, 1);
            if (this.events[dateKey].length === 0) {
                delete this.events[dateKey];
            }
            this.saveEvents();
            this.updateCalendar();
            this.displayEventsForDate(dateKey);
            this.showMessage('Event removed! ✅', 'success');
        }
    }

    getDateKey(year, month, day) {
        return `${year}-${month}-${day}`;
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
            "There are 12 months in a year! 🎯",
            "Some months have 30 days, others have 31, except February! 🤔",
            "A week has 7 days - that's perfect for planning fun activities! 🎉"
        ];
        
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        document.getElementById('funFact').textContent = randomFact;
    }

    showMessage(message, type = 'info') {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `message-popup ${type}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    loadEvents() {
        try {
            const saved = localStorage.getItem('calendar-events');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Could not load calendar events:', error);
            return {};
        }
    }

    saveEvents() {
        try {
            localStorage.setItem('calendar-events', JSON.stringify(this.events));
        } catch (error) {
            console.warn('Could not save calendar events:', error);
        }
    }

    cleanup() {
        super.cleanup();
        // Clean up any timers or intervals if needed
    }
}

export default Calendar;