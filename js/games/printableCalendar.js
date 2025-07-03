import { Game } from '../utils/gameBase.js';

export class PrintableCalendar extends Game {
    constructor() {
        console.log('PrintableCalendar constructor called');
        super('printable-calendar', 'Print My Calendar');
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth();
        this.fontFamily = "'Quicksand', sans-serif";
        this.currentTheme = 'pastelUnicorn';
        
        this.fonts = [
            { name: 'Quicksand', family: "'Quicksand', sans-serif" },
            { name: 'Pacifico', family: "'Pacifico', cursive" },
            { name: 'Comic Neue', family: "'Comic Neue', cursive" },
            { name: 'Patrick Hand', family: "'Patrick Hand', cursive" },
            { name: 'Indie Flower', family: "'Indie Flower', cursive" }
        ];
        
        this.colorThemes = {
            pastelUnicorn: {
                name: 'Pastel Unicorn',
                bg: 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100',
                header: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600',
                year: 'text-purple-400',
                weekDay: 'text-purple-600',
                day: 'text-purple-700',
                border: 'border-pink-200/50',
                borderHeader: 'border-pink-300',
                button: 'bg-gradient-to-br from-pink-500 to-purple-600 focus:ring-purple-300'
            },
            oceanBreeze: {
                name: 'Ocean Breeze',
                bg: 'bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100',
                header: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600',
                year: 'text-blue-400',
                weekDay: 'text-blue-600',
                day: 'text-blue-700',
                border: 'border-cyan-200/50',
                borderHeader: 'border-cyan-300',
                button: 'bg-gradient-to-br from-cyan-500 to-blue-600 focus:ring-blue-300'
            },
            forestWhisper: {
                name: 'Forest Whisper',
                bg: 'bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100',
                header: 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-700',
                year: 'text-lime-500',
                weekDay: 'text-green-700',
                day: 'text-green-800',
                border: 'border-green-200/50',
                borderHeader: 'border-green-300',
                button: 'bg-gradient-to-br from-green-500 to-lime-600 focus:ring-lime-300'
            },
            sunsetGlow: {
                name: 'Sunset Glow',
                bg: 'bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100',
                header: 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600',
                year: 'text-red-400',
                weekDay: 'text-orange-600',
                day: 'text-red-700',
                border: 'border-orange-200/50',
                borderHeader: 'border-orange-300',
                button: 'bg-gradient-to-br from-orange-500 to-red-600 focus:ring-red-300'
            }
        };
        
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }

    async render() {
        console.log('PrintableCalendar render called');
        const gameContent = this.gameContentArea || document.getElementById('gameContentArea');
        
        if (!gameContent) {
            console.error('Game content area not found');
            return;
        }

        // Add Google Fonts
        this.addGoogleFonts();
        
        const theme = this.colorThemes[this.currentTheme];
        
        gameContent.innerHTML = `
            <div class="printable-calendar-container min-h-screen transition-colors duration-500 ${theme.bg}" style="font-family: ${this.fontFamily}">
                
                <!-- Controls Panel (No Print) -->
                <div class="max-w-6xl mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg mb-8 no-print">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <!-- Year Selector -->
                        <div>
                            <label class="block text-sm font-bold mb-1" for="year-select">Year</label>
                            <select id="year-select" class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                ${this.generateYearOptions()}
                            </select>
                        </div>
                        
                        <!-- Month Selector -->
                        <div>
                            <label class="block text-sm font-bold mb-1" for="month-select">Month</label>
                            <select id="month-select" class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                ${this.months.map((m, i) => `
                                    <option value="${i}" ${i === this.month ? 'selected' : ''}>${m}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <!-- Font Selector -->
                        <div>
                            <label class="block text-sm font-bold mb-1" for="font-select">Font Style</label>
                            <select id="font-select" class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                ${this.fonts.map(f => `
                                    <option value="${f.family}" ${f.family === this.fontFamily ? 'selected' : ''}>${f.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <!-- Theme Selector -->
                        <div>
                            <label class="block text-sm font-bold mb-1" for="theme-select">Color Theme</label>
                            <select id="theme-select" class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                ${Object.entries(this.colorThemes).map(([key, value]) => `
                                    <option value="${key}" ${key === this.currentTheme ? 'selected' : ''}>${value.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-4 flex flex-col sm:flex-row gap-4">
                        <!-- Image Generation Disabled -->
                        <button id="generate-image-btn" disabled class="w-full sm:w-auto flex-grow text-white font-bold py-2 px-4 rounded-full shadow-lg opacity-50 cursor-not-allowed bg-gray-400">
                            🦄 Image Generation (Coming Soon!)
                        </button>
                        <button id="print-calendar-btn" class="w-full sm:w-auto flex-grow text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 ${theme.button}">
                            🖨️ Print Calendar
                        </button>
                    </div>
                </div>

                <!-- Calendar Display Area (Printable) -->
                <div class="max-w-6xl mx-auto printable-area bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    <div class="p-6 md:p-10">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                            <div class="text-center md:text-left">
                                <h1 id="calendar-month" class="text-5xl md:text-7xl transition-colors duration-500 ${theme.header}" style="font-family: 'Pacifico', cursive">
                                    ${this.months[this.month]}
                                </h1>
                                <p id="calendar-year" class="text-2xl md:text-3xl font-semibold mt-1 transition-colors duration-500 ${theme.year}">
                                    ${this.year}
                                </p>
                            </div>
                            
                            <!-- Placeholder for unicorn image -->
                            <div class="w-48 h-32 md:w-64 md:h-48 mt-4 md:mt-0 flex items-center justify-center">
                                <div class="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span class="text-6xl">🦄</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white/50 rounded-2xl border border-pink-200/50">
                            <!-- Week days header -->
                            <div id="week-header" class="grid grid-cols-7 text-center font-bold border-b-2 transition-colors duration-500 ${theme.weekDay} ${theme.borderHeader}">
                                ${this.weekDays.map(day => `
                                    <div class="p-3 border-r last:border-r-0 transition-colors duration-500 ${theme.border}">${day}</div>
                                `).join('')}
                            </div>
                            
                            <!-- Calendar grid -->
                            <div id="calendar-grid" class="grid grid-cols-7" style="min-height: 384px;">
                                <!-- Calendar days will be generated here -->
                            </div>
                        </div>
                        
                        <!-- Print instructions -->
                        <div class="mt-6 p-4 bg-white/70 rounded-xl no-print text-center">
                            <p class="text-sm text-gray-600">
                                📄 <strong>Print Tip:</strong> For best results, use A4 paper and select "More settings" → "Background graphics" in your browser's print dialog.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.generateCalendarDays();
        this.addPrintStyles();
    }

    bindEvents() {
        console.log('PrintableCalendar bindEvents called');
        
        try {
            // Year selector
            const yearSelect = document.getElementById('year-select');
            if (yearSelect) {
                yearSelect.addEventListener('change', (e) => {
                    this.year = parseInt(e.target.value);
                    this.updateCalendar();
                });
            }

            // Month selector
            const monthSelect = document.getElementById('month-select');
            if (monthSelect) {
                monthSelect.addEventListener('change', (e) => {
                    this.month = parseInt(e.target.value);
                    this.updateCalendar();
                });
            }

            // Font selector
            const fontSelect = document.getElementById('font-select');
            if (fontSelect) {
                fontSelect.addEventListener('change', (e) => {
                    this.fontFamily = e.target.value;
                    this.updateStyles();
                });
            }

            // Theme selector
            const themeSelect = document.getElementById('theme-select');
            if (themeSelect) {
                themeSelect.addEventListener('change', (e) => {
                    this.currentTheme = e.target.value;
                    this.updateTheme();
                });
            }

            // Print button
            const printBtn = document.getElementById('print-calendar-btn');
            if (printBtn) {
                printBtn.addEventListener('click', () => {
                    this.printCalendar();
                });
            }

            // Image generation button (disabled)
            const imageBtn = document.getElementById('generate-image-btn');
            if (imageBtn) {
                imageBtn.addEventListener('click', () => {
                    alert('🦄 Image generation feature will be available soon! For now, enjoy the cute unicorn emoji! 🌈');
                });
            }

        } catch (error) {
            console.error('Error binding printable calendar events:', error);
        }
    }

    generateYearOptions() {
        let options = '';
        for (let i = 2020; i <= 2030; i++) {
            options += `<option value="${i}" ${i === this.year ? 'selected' : ''}>${i}</option>`;
        }
        return options;
    }

    generateCalendarDays() {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;

        const theme = this.colorThemes[this.currentTheme];
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
        const firstDayOfMonth = new Date(this.year, this.month, 1).getDay();
        
        let daysHTML = '';

        // Empty cells for days before first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysHTML += `<div class="border-r border-b ${theme.border}"></div>`;
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            daysHTML += `
                <div class="p-2 border-r border-b ${theme.border} h-24 md:h-28 flex flex-col">
                    <span class="font-bold ${theme.day}">${day}</span>
                    <div class="flex-grow"></div>
                </div>
            `;
        }

        calendarGrid.innerHTML = daysHTML;
    }

    updateCalendar() {
        // Update month and year display
        const monthEl = document.getElementById('calendar-month');
        const yearEl = document.getElementById('calendar-year');
        
        if (monthEl) monthEl.textContent = this.months[this.month];
        if (yearEl) yearEl.textContent = this.year;
        
        // Regenerate calendar days
        this.generateCalendarDays();
    }

    updateStyles() {
        const container = document.querySelector('.printable-calendar-container');
        if (container) {
            container.style.fontFamily = this.fontFamily;
        }
    }

    updateTheme() {
        // Re-render with new theme
        this.render();
    }

    addGoogleFonts() {
        // Check if fonts are already loaded
        if (!document.querySelector('#google-fonts-printable')) {
            const link = document.createElement('link');
            link.id = 'google-fonts-printable';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&family=Indie+Flower&family=Pacifico&family=Patrick+Hand&family=Quicksand:wght@400;600;700&display=swap';
            document.head.appendChild(link);
        }
    }

    addPrintStyles() {
        // Check if print styles are already added
        if (!document.querySelector('#print-styles-calendar')) {
            const style = document.createElement('style');
            style.id = 'print-styles-calendar';
            style.textContent = `
                @media print {
                    body { 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                    }
                    .no-print { 
                        display: none !important; 
                    }
                    .printable-area { 
                        margin: 0; 
                        padding: 0; 
                        border: none; 
                        box-shadow: none; 
                        height: 100vh; 
                        width: 100vw; 
                        page-break-inside: avoid;
                    }
                    .printable-calendar-container {
                        margin: 0;
                        padding: 0;
                        min-height: auto;
                    }
                    /* Ensure colors print properly */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    printCalendar() {
        try {
            // Show print instructions
            const confirmed = confirm(
                '🖨️ Ready to print your calendar!\n\n' +
                '📋 Print Tips:\n' +
                '• Use A4 paper for best results\n' +
                '• Enable "Background graphics" in print settings\n' +
                '• Choose "Landscape" orientation if needed\n\n' +
                'Click OK to open print dialog!'
            );
            
            if (confirmed) {
                window.print();
            }
        } catch (error) {
            console.error('Error printing calendar:', error);
            alert('❌ Oops! There was an issue opening the print dialog. Please try again.');
        }
    }

    cleanup() {
        console.log('PrintableCalendar cleanup called');
        super.cleanup();
    }
}

export default PrintableCalendar;