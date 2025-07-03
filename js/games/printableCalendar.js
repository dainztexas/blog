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
                <div class="max-w-7xl mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg mb-8 no-print">
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
                <div class="w-full mx-auto printable-area bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    <div class="p-4 lg:p-6">
                        <div class="flex flex-row justify-between items-center mb-4">
                            <div class="text-left flex-1">
                                <h1 id="calendar-month" class="text-4xl lg:text-6xl transition-colors duration-500 ${theme.header}" style="font-family: 'Pacifico', cursive">
                                    ${this.months[this.month]}
                                </h1>
                                <p id="calendar-year" class="text-xl lg:text-2xl font-semibold mt-1 transition-colors duration-500 ${theme.year}">
                                    ${this.year}
                                </p>
                            </div>
                            
                            <!-- Placeholder for unicorn image -->
                            <div class="w-32 h-24 lg:w-40 lg:h-32 flex items-center justify-center flex-shrink-0">
                                <div class="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span class="text-4xl lg:text-5xl">🦄</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white/50 rounded-2xl border border-pink-200/50 w-full">
                            <!-- Week days header -->
                            <div id="week-header" class="grid grid-cols-7 text-center font-bold border-b-2 transition-colors duration-500 ${theme.weekDay} ${theme.borderHeader}">
                                ${this.weekDays.map(day => `
                                    <div class="p-2 lg:p-3 border-r last:border-r-0 transition-colors duration-500 ${theme.border} text-sm lg:text-base">${day}</div>
                                `).join('')}
                            </div>
                            
                            <!-- Calendar grid -->
                            <div id="calendar-grid" class="grid grid-cols-7 w-full" style="min-height: 300px;">
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
        
        // Remove existing event listeners first to prevent duplicates
        this.removeEventListeners();
        
        try {
            // Year selector
            const yearSelect = document.getElementById('year-select');
            if (yearSelect) {
                this.yearHandler = (e) => {
                    this.year = parseInt(e.target.value);
                    this.updateCalendar();
                };
                yearSelect.addEventListener('change', this.yearHandler);
            }

            // Month selector
            const monthSelect = document.getElementById('month-select');
            if (monthSelect) {
                this.monthHandler = (e) => {
                    this.month = parseInt(e.target.value);
                    this.updateCalendar();
                };
                monthSelect.addEventListener('change', this.monthHandler);
            }

            // Font selector
            const fontSelect = document.getElementById('font-select');
            if (fontSelect) {
                this.fontHandler = (e) => {
                    this.fontFamily = e.target.value;
                    this.updateStyles();
                };
                fontSelect.addEventListener('change', this.fontHandler);
            }

            // Theme selector
            const themeSelect = document.getElementById('theme-select');
            if (themeSelect) {
                this.themeHandler = (e) => {
                    this.currentTheme = e.target.value;
                    this.updateTheme();
                };
                themeSelect.addEventListener('change', this.themeHandler);
            }

            // Print button
            const printBtn = document.getElementById('print-calendar-btn');
            if (printBtn) {
                console.log('✅ Print button found, adding event listener');
                this.printHandler = (e) => {
                    console.log('🖨️ Print button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.printCalendar();
                };
                printBtn.addEventListener('click', this.printHandler);
            } else {
                console.error('❌ Print button not found!');
            }

            // Image generation button (disabled)
            const imageBtn = document.getElementById('generate-image-btn');
            if (imageBtn) {
                this.imageHandler = () => {
                    alert('🦄 Image generation feature will be available soon! For now, enjoy the cute unicorn emoji! 🌈');
                };
                imageBtn.addEventListener('click', this.imageHandler);
            }

        } catch (error) {
            console.error('Error binding printable calendar events:', error);
        }
    }

    removeEventListeners() {
        // Remove existing event listeners to prevent duplicates
        const yearSelect = document.getElementById('year-select');
        const monthSelect = document.getElementById('month-select');
        const fontSelect = document.getElementById('font-select');
        const themeSelect = document.getElementById('theme-select');
        const printBtn = document.getElementById('print-calendar-btn');
        const imageBtn = document.getElementById('generate-image-btn');

        if (yearSelect && this.yearHandler) {
            yearSelect.removeEventListener('change', this.yearHandler);
        }
        if (monthSelect && this.monthHandler) {
            monthSelect.removeEventListener('change', this.monthHandler);
        }
        if (fontSelect && this.fontHandler) {
            fontSelect.removeEventListener('change', this.fontHandler);
        }
        if (themeSelect && this.themeHandler) {
            themeSelect.removeEventListener('change', this.themeHandler);
        }
        if (printBtn && this.printHandler) {
            printBtn.removeEventListener('click', this.printHandler);
        }
        if (imageBtn && this.imageHandler) {
            imageBtn.removeEventListener('click', this.imageHandler);
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
                <div class="p-1 lg:p-2 border-r border-b ${theme.border} h-20 lg:h-24 flex flex-col">
                    <span class="font-bold ${theme.day} text-sm lg:text-base">${day}</span>
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
        // Re-bind events after re-rendering
        this.bindEvents();
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
                @page {
                    margin: 0.3in;
                    size: landscape;
                }
                
                @media print {
                    /* Hide everything first */
                    * {
                        visibility: hidden !important;
                    }
                    
                    /* Hide the message box title completely */
                    #messageBoxTitle {
                        display: none !important;
                        visibility: hidden !important;
                    }
                    
                    /* Show only calendar content */
                    .printable-area,
                    .printable-area * {
                        visibility: visible !important;
                    }
                    
                    /* Reset page styling */
                    html, body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        font-size: 10px !important;
                        overflow: hidden !important;
                    }
                    
                    /* Main calendar container */
                    .printable-area {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 8px !important;
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        page-break-inside: avoid !important;
                        overflow: hidden !important;
                    }
                    
                    /* Calendar wrapper */
                    .printable-area > div {
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        background: white !important;
                    }
                    
                    /* Header section */
                    .printable-area .flex {
                        margin-bottom: 8px !important;
                        height: auto !important;
                    }
                    
                    /* Month title */
                    .printable-area h1 {
                        font-size: 28px !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        line-height: 1 !important;
                        color: #333 !important;
                    }
                    
                    /* Year */
                    .printable-area p {
                        font-size: 16px !important;
                        margin: 2px 0 0 0 !important;
                        padding: 0 !important;
                        color: #666 !important;
                    }
                    
                    /* Hide unicorn on print */
                    .printable-area .w-32,
                    .printable-area .w-40,
                    .printable-area .lg\\:w-40 {
                        display: none !important;
                    }
                    
                    /* Calendar grid container */
                    .printable-area .grid {
                        width: 100% !important;
                        margin: 0 !important;
                        border: 2px solid #000 !important;
                        border-collapse: collapse !important;
                    }
                    
                    /* Day headers */
                    .printable-area .grid > div:nth-child(-n+7) {
                        background: #f5f5f5 !important;
                        font-weight: bold !important;
                        text-align: center !important;
                        padding: 4px !important;
                        border: 1px solid #000 !important;
                        font-size: 11px !important;
                        height: 25px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                    
                    /* Calendar day cells */
                    .printable-area .grid > div:nth-child(n+8) {
                        border: 1px solid #333 !important;
                        height: 70px !important;
                        padding: 3px !important;
                        font-size: 10px !important;
                        background: white !important;
                        vertical-align: top !important;
                        position: relative !important;
                    }
                    
                    /* Day numbers */
                    .printable-area .grid span {
                        font-weight: bold !important;
                        font-size: 10px !important;
                        color: #000 !important;
                        display: block !important;
                        line-height: 1 !important;
                    }
                    
                    /* Remove all Tailwind backgrounds and effects */
                    .bg-white\\/80,
                    .backdrop-blur-sm,
                    .bg-gradient-to-br,
                    .rounded-3xl,
                    .shadow-2xl {
                        background: white !important;
                        backdrop-filter: none !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                    }
                    
                    /* Ensure text colors are print-friendly */
                    .text-transparent,
                    .bg-clip-text {
                        color: #333 !important;
                        background: none !important;
                        -webkit-background-clip: unset !important;
                        background-clip: unset !important;
                    }
                    
                    /* Ensure calendar fits on one page */
                    .grid-cols-7 {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr) !important;
                        width: 100% !important;
                    }
                    
                    /* Force color printing */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    printCalendar() {
        console.log('🖨️ printCalendar() function called');
        try {
            // Show print instructions
            const confirmed = confirm(
                '🖨️ Ready to print your beautiful calendar!\n\n' +
                '📋 Print Instructions:\n' +
                '• Paper: A4 or Letter size\n' +
                '• Orientation: LANDSCAPE (automatic)\n' +
                '• In print dialog, click "More settings"\n' +
                '• Enable "Background graphics"\n' +
                '• Set margins to "Minimum"\n\n' +
                '✨ Perfect fit: One page, clean layout, no extra content!\n' +
                '🗓️ Only the calendar will print - no titles or backgrounds!\n\n' +
                'Click OK to open print dialog!'
            );
            
            console.log('User confirmed print:', confirmed);
            
            if (confirmed) {
                console.log('🖨️ Calling window.print()...');
                
                // Small delay to ensure styles are applied
                setTimeout(() => {
                    window.print();
                    console.log('✅ window.print() called successfully');
                }, 100);
            } else {
                console.log('ℹ️ User cancelled print');
            }
        } catch (error) {
            console.error('❌ Error printing calendar:', error);
            alert('❌ Oops! There was an issue opening the print dialog. Please try again.');
        }
    }

    cleanup() {
        console.log('PrintableCalendar cleanup called');
        // Remove event listeners before cleanup
        this.removeEventListeners();
        super.cleanup();
    }
}