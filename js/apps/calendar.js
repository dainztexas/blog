import React, { useState, useEffect, useMemo } from 'react';

// --- Helper Data & Functions ---

const fonts = [
    { name: 'Quicksand', family: "'Quicksand', sans-serif" },
    { name: 'Pacifico', family: "'Pacifico', cursive" },
    { name: 'Comic Neue', family: "'Comic Neue', cursive" },
    { name: 'Patrick Hand', family: "'Patrick Hand', cursive" },
    { name: 'Indie Flower', family: "'Indie Flower', cursive" },
];

const colorThemes = {
    pastelUnicorn: {
        name: 'Pastel Unicorn',
        bg: 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100',
        header: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600',
        year: 'text-purple-400',
        weekDay: 'text-purple-600',
        day: 'text-purple-700',
        border: 'border-pink-200/50',
        borderHeader: 'border-pink-300',
        button: 'bg-gradient-to-br from-pink-500 to-purple-600 focus:ring-purple-300',
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
        button: 'bg-gradient-to-br from-cyan-500 to-blue-600 focus:ring-blue-300',
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
        button: 'bg-gradient-to-br from-green-500 to-lime-600 focus:ring-lime-300',
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
        button: 'bg-gradient-to-br from-orange-500 to-red-600 focus:ring-red-300',
    },
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Main App Component
export default function App() {
    // --- State Management ---
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [fontFamily, setFontFamily] = useState(fonts[0].family);
    const [theme, setTheme] = useState(colorThemes.pastelUnicorn);
    
    const [unicornImageUrl, setUnicornImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Calendar Generation Logic ---
    const calendarDays = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className={`border-r border-b ${theme.border}`}></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div key={day} className={`p-2 border-r border-b ${theme.border} h-24 md:h-28 flex flex-col`}>
                    <span className={`font-bold ${theme.day}`}>{day}</span>
                    <div className="flex-grow"></div>
                </div>
            );
        }
        return days;
    }, [year, month, theme]);

    // --- Gemini API Call to Generate Unicorn Image ---
    const generateImage = async () => {
        setIsLoading(true);
        setError(null);
        setUnicornImageUrl('');
        const prompt = "A very cute, whimsical baby unicorn with a pastel rainbow mane and a small golden horn, sitting on a fluffy white cloud. The background is a soft, dreamy sky with subtle sparkles. The style is gentle, like a children's book illustration. Full body, centered.";
        const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
        const apiKey = ""; // API key will be injected by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.predictions && result.predictions[0].bytesBase64Encoded) {
                setUnicornImageUrl(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
            } else {
                throw new Error("Image data not found in API response.");
            }
        } catch (err) {
            console.error("Error generating image:", err);
            setError("Sorry, the unicorn is being shy! Could not generate the image.");
            setUnicornImageUrl('https://placehold.co/600x400/f8bbd0/ffffff?text=Shy+Unicorn');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Event Handlers ---
    const handlePrint = () => window.print();
    const handleThemeChange = (e) => setTheme(colorThemes[e.target.value]);

    return (
        <>
            {/* --- Global Styles and Font Imports --- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&family=Indie+Flower&family=Pacifico&family=Patrick+Hand&family=Quicksand:wght@400;600;700&display=swap');
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .printable-area { margin: 0; padding: 0; border: none; box-shadow: none; height: 100vh; width: 100vw; }
                }
            `}</style>

            <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-500 ${theme.bg}`} style={{ fontFamily: fontFamily }}>
                
                {/* --- Controls Panel (No Print) --- */}
                <div className="max-w-6xl mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg mb-8 no-print">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        {/* Year Selector */}
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="year-select">Year</label>
                            <select id="year-select" value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                {[...Array(11).keys()].map(i => <option key={i} value={2020 + i}>{2020 + i}</option>)}
                            </select>
                        </div>
                        {/* Month Selector */}
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="month-select">Month</label>
                            <select id="month-select" value={month} onChange={e => setMonth(parseInt(e.target.value))} className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                        </div>
                        {/* Font Selector */}
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="font-select">Font Style</label>
                            <select id="font-select" value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                {fonts.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
                            </select>
                        </div>
                         {/* Theme Selector */}
                        <div>
                            <label className="block text-sm font-bold mb-1" htmlFor="theme-select">Color Theme</label>
                            <select id="theme-select" value={Object.keys(colorThemes).find(key => colorThemes[key].name === theme.name)} onChange={handleThemeChange} className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                {Object.entries(colorThemes).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <button onClick={generateImage} disabled={isLoading} className={`w-full sm:w-auto flex-grow text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${theme.button}`}>
                            {isLoading ? 'Summoning Magic...' : 'Generate Unicorn Image'}
                        </button>
                        <button onClick={handlePrint} className={`w-full sm:w-auto flex-grow text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 ${theme.button}`}>
                            Print Calendar
                        </button>
                    </div>
                </div>

                {/* --- Calendar Display Area (Printable) --- */}
                <div className="max-w-6xl mx-auto printable-area bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-200/50 overflow-hidden">
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <div className="text-center md:text-left">
                                <h1 className={`text-5xl md:text-7xl transition-colors duration-500 ${theme.header}`} style={{fontFamily: "'Pacifico', cursive"}}>{months[month]}</h1>
                                <p className={`text-2xl md:text-3xl font-semibold mt-1 transition-colors duration-500 ${theme.year}`}>{year}</p>
                            </div>
                            <div className="w-48 h-32 md:w-64 md:h-48 mt-4 md:mt-0 flex items-center justify-center">
                                {isLoading && <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse"><span className="text-sm text-gray-500">Generating...</span></div>}
                                {error && <div className="w-full h-full bg-red-100 rounded-2xl flex items-center justify-center text-center p-2"><p className="text-red-600 text-sm">{error}</p></div>}
                                {unicornImageUrl && <img src={unicornImageUrl} alt="A magical unicorn" className="object-contain w-full h-full rounded-2xl shadow-lg shadow-pink-300/50" />}
                            </div>
                        </div>

                        <div className="bg-white/50 rounded-2xl border border-pink-200/50">
                            <div className={`grid grid-cols-7 text-center font-bold border-b-2 transition-colors duration-500 ${theme.weekDay} ${theme.borderHeader}`}>
                                {weekDays.map(day => <div key={day} className={`p-3 border-r last:border-r-0 transition-colors duration-500 ${theme.border}`}>{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7" style={{minHeight: '384px'}}>
                                {calendarDays}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
