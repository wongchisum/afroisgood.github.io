// src/components/JazzFortune.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export const JazzFortune = ({ jazzData, onNavigate }) => {
    const [formData, setFormData] = useState({ name: '', date: '', mode: 'astrology' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!formData.date || !formData.name) return alert("請填寫姓名與出生日期。");
        if (!jazzData || Object.keys(jazzData).length === 0) return alert("資料庫準備中，請稍後再試。");
        
        setLoading(true);

        try {
            const availableDates = Object.keys(jazzData).filter(key => jazzData[key] && jazzData[key].album);
            const randomDateKey = availableDates[Math.floor(Math.random() * availableDates.length)];
            const randomSong = jazzData[randomDateKey];

            const { data, error } = await supabase.functions.invoke('jazz-fortune-ai', {
                body: { 
                    name: formData.name, 
                    birthDate: formData.date, 
                    mode: formData.mode,
                    currentAlbum: randomSong.album,
                    currentArtist: randomSong.artist
                }
            });

            if (error) throw error;

            setResult({ text: data.ai_text });
            
            const [y, m, d] = randomDateKey.split('-').map(Number);
            onNavigate(new Date(y, m - 1, d));

        } catch (err) {
            console.error("AI 占卜感應失敗:", err);
            alert("宇宙訊號微弱，請稍後再試。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 pt-6 border-t border-white/20 font-zen relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 px-3 py-1 text-[10px] tracking-[0.2em] text-amber-500 font-bold uppercase border border-amber-500/50 whitespace-nowrap rounded shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                Jazz Fortune
            </div>

            {!result ? (
                // 底色改為更實心的 zinc-900，邊框提亮
                <div className="bg-zinc-900 p-4 shadow-lg border border-white/20 text-sm rounded-md">
                    <div className="space-y-3 mb-4">
                        <input 
                            type="text" placeholder="你的姓名" 
                            className="w-full bg-transparent border-b border-white/30 py-1 text-xs focus:outline-none focus:border-amber-400 text-white placeholder:text-zinc-400 transition-colors font-medium"
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        
                        <div className="relative w-full">
                            {!formData.date && (
                                <div className="absolute left-0 top-1 text-xs text-zinc-400 pointer-events-none font-medium">
                                    選擇出生年月日
                                </div>
                            )}
                            <input 
                                type="date" 
                                className={`w-full bg-transparent border-b border-white/30 py-1 text-xs focus:outline-none focus:border-amber-400 cursor-pointer relative z-10 transition-colors font-medium ${!formData.date ? 'text-transparent' : 'text-white'}`}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mb-5">
                        <button 
                            onClick={() => setFormData({...formData, mode: 'astrology'})}
                            className={`flex-1 py-2 text-[10px] tracking-widest font-bold border border-transparent transition-all rounded-sm ${formData.mode === 'astrology' ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'}`}
                        >
                            紫微/占星
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, mode: 'humanDesign'})}
                            className={`flex-1 py-2 text-[10px] tracking-widest font-bold border border-transparent transition-all rounded-sm ${formData.mode === 'humanDesign' ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'}`}
                        >
                            人類圖
                        </button>
                    </div>

                    <button 
                        onClick={handleAnalyze} disabled={loading}
                        className="w-full py-3 bg-amber-500 text-zinc-950 text-[11px] font-black tracking-widest hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-50 transition-all rounded-sm uppercase"
                    >
                        {loading ? "感應星象中..." : "抽取今日命定爵士"}
                    </button>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-amber-500/40 text-white p-5 shadow-2xl page-reveal text-xs rounded-md">
                    <p className="text-[10px] text-amber-400 tracking-widest mb-3 font-bold uppercase border-b border-amber-500/30 pb-1 inline-block">
                        {formData.name} 的專屬指引
                    </p>
                    <p className="leading-relaxed font-zen italic text-zinc-100 mb-4 whitespace-pre-line text-[13px]">
                        {result.text}
                    </p>
                    <button onClick={() => setResult(null)} className="text-[10px] text-zinc-400 hover:text-amber-400 tracking-widest transition-colors font-bold">
                        ← 重新抽取
                    </button>
                </div>
            )}
        </div>
    );
};