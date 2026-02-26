// src/components/Sidebar.jsx
import { IconDisc } from './Icons';
import { JazzFortune } from './JazzFortune'; 

export const Sidebar = ({ 
    isPlaying, 
    currentMonth, 
    setCurrentMonth, 
    selectedDate, 
    handleDateChange, 
    jazzData, 
    setShowChangelog, 
    latestVersion 
}) => {
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const formatDateString = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    return (
        <aside className="lg:col-span-3 lg:sticky lg:top-0 h-screen border-r border-stone-200/60 flex flex-col justify-between bg-[#f8f6f2] z-20 overflow-y-auto hidden-scrollbar pt-12 pb-6 px-6 lg:px-8">
            
            <div className="flex-1">
                {/* 網站標題與 Logo 區塊 */}
                <div className="mb-12 cursor-pointer group" onClick={() => handleDateChange(new Date())}>
                    <div className="flex items-center gap-3 mb-3">
                        <IconDisc 
                            className={`text-amber-700 transition-transform duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`} 
                            size={28} 
                        />
                        <h1 className="text-xl font-bold tracking-widest text-stone-800 font-playfair">JAZZ 365</h1>
                    </div>
                    <p className="text-[10px] tracking-[0.3em] text-stone-400 font-medium uppercase group-hover:text-amber-600 transition-colors">
                        Daily Jazz Almanac
                    </p>
                </div>

                {/* 日曆導覽區塊 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={handlePrevMonth} className="text-stone-400 hover:text-amber-700 transition-colors p-1">&lt;</button>
                        <h2 className="text-sm font-bold tracking-widest uppercase font-playfair">
                            {currentMonth.toLocaleString('default', { month: 'long' })} {year}
                        </h2>
                        <button onClick={handleNextMonth} className="text-stone-400 hover:text-amber-700 transition-colors p-1">&gt;</button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-[9px] text-stone-400 tracking-wider uppercase font-medium">{day}</div>
                        ))}
                        {blanks.map(blank => <div key={`blank-${blank}`} />)}
                        {days.map(day => {
                            const dateStr = formatDateString(year, month, day);
                            const hasData = jazzData && jazzData[dateStr];
                            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDateChange(new Date(year, month, day))}
                                    disabled={!hasData}
                                    className={`
                                        relative text-xs py-1.5 w-full flex items-center justify-center transition-all duration-300
                                        ${isSelected ? 'bg-amber-700 text-white font-bold shadow-md' : ''}
                                        ${!isSelected && hasData ? 'hover:bg-stone-200 text-stone-700' : ''}
                                        ${!hasData ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
                                        ${isToday && !isSelected ? 'text-amber-700 font-bold' : ''}
                                    `}
                                >
                                    {day}
                                    {/* 有資料的日期標示小圓點 */}
                                    {hasData && !isSelected && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-700 rounded-full opacity-50"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 爵士占卜區塊 */}
                <div className="mt-8 mb-10 px-1">
                    <JazzFortune 
                        jazzData={jazzData} 
                        onNavigate={handleDateChange} 
                    />
                </div>
            </div>

            {/* 側邊欄底部：版本資訊 */}
            <div className="pt-6 border-t border-stone-200/60 flex items-center justify-between">
                <button 
                    onClick={() => setShowChangelog(true)}
                    className="text-[10px] tracking-widest text-stone-400 hover:text-amber-700 transition-colors flex items-center gap-1 uppercase font-bold"
                >
                    Update Log <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                </button>
                <span className="text-[10px] text-stone-300 font-mono">{latestVersion}</span>
            </div>
            
        </aside>
    );
};