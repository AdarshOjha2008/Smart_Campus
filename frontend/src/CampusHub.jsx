import React, { useState, useEffect } from 'react';
import { api } from './api';

export default function CampusHub() {
  const [attended, setAttended] = useState(28);
  const [totalHeld, setTotalHeld] = useState(35);
  const [targetPct, setTargetPct] = useState(75);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getEvents().then(setEvents).catch((error) => console.error('Could not load events:', error));
  }, []);

  // Live Exam Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 31, hours: 23, mins: 11, secs: 45 });

  useEffect(() => {
    const examDate = new Date('2026-10-26T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = examDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPct = totalHeld > 0 ? ((attended / totalHeld) * 100).toFixed(1) : 0;
  const targetFrac = targetPct / 100;
  const maxBunks = Math.floor((attended - targetFrac * totalHeld) / targetFrac);
  const safeBunks = maxBunks > 0 ? maxBunks : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Bento Row: Hero Academic Calendar [ 1.0 ] & Radar Alerts [ 2.0 ] */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bento [ 1.0 ]: Academic Calendar & Live Exam Countdown */}
        <div className="lg:col-span-2 relative bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
          {/* Ambient Inner Glow */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)'
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#4ade80] uppercase flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
                | OFFICIAL ACADEMIC CALENDAR |
              </span>
              <span className="text-xs font-mono text-emerald-400/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                [ 1.0 ]
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Mid-Term Exams <span className="text-[#4ade80]">(MTE)</span>
            </h1>
            <p className="text-xs md:text-sm text-emerald-200/70 max-w-xl font-medium">
              Autumn Semester 2026-27 • Scheduled from Oct 26 to Nov 03, 2026. Official guardrails active.
            </p>
          </div>

          {/* Countdown & Action Pill */}
          <div className="mt-8 pt-6 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
            {/* Digital Countdown Timer Boxes */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {[
                { label: 'DAYS', val: timeLeft.days },
                { label: 'HOURS', val: timeLeft.hours },
                { label: 'MINS', val: timeLeft.mins },
                { label: 'SECS', val: timeLeft.secs }
              ].map((unit, i) => (
                <div 
                  key={i} 
                  className="bg-[#030905] border border-emerald-500/30 px-3.5 py-2.5 rounded-2xl text-center min-w-[58px] shadow-[inset_0_0_12px_rgba(34,197,94,0.1)]"
                >
                  <span className="block font-mono text-xl md:text-2xl font-black text-[#4ade80] tracking-tight drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                    {String(unit.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-400/70 tracking-wider">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* DOTDNA Pill Button with green arrow */}
            <div className="flex items-center gap-2 bg-[#081a0e] border border-emerald-500/40 pl-4 pr-1.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
              <span>Exam Timetable Verified</span>
              <div className="w-6 h-6 rounded-full bg-[#4ade80] flex items-center justify-center font-black text-black text-xs shadow-[0_0_10px_#4ade80]">
                ↗
              </div>
            </div>
          </div>
        </div>

        {/* Bento [ 2.0 ]: Biometric Reticle & Dynamic Class Alerts */}
        <div className="relative bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ BIOMETRIC RADAR ]
              </span>
              <span className="text-xs font-mono text-emerald-400/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                [ 2.0 ]
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">Class Push Radar</h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed font-medium">
              Instant biometric lecture notifications delivered 10 mins before room or laboratory sessions start.
            </p>
          </div>

          {/* Futuristic Biometric Scanner Reticle (from video) */}
          <div className="my-5 p-4 rounded-2xl bg-[#020703] border border-emerald-500/20 relative flex items-center justify-center">
            <div className="absolute inset-2 border border-emerald-500/20 rounded-xl pointer-events-none" />
            <div className="text-center py-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-[#4ade80] text-2xl font-mono relative mb-2 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                ⬡
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#4ade80]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#4ade80]" />
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#4ade80]" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#4ade80]" />
              </div>
              <p className="text-[11px] font-mono text-emerald-300 font-bold tracking-wider">
                RADAR: {alertsEnabled ? 'SYNCHRONIZED' : 'STANDBY'}
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center justify-between pt-3 border-t border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400/80 font-mono">PUSH ALERTS</span>
            <button 
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                alertsEnabled
                  ? 'bg-emerald-500/20 border border-emerald-400 text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.3)]'
                  : 'bg-[#030905] border border-slate-700 text-slate-400'
              }`}
            >
              <span>{alertsEnabled ? 'ACTIVE' : 'MUTED'}</span>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                alertsEnabled ? 'bg-[#4ade80] text-black font-black' : 'bg-slate-700 text-slate-300'
              }`}>
                {alertsEnabled ? '●' : '○'}
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Second Row Bento Grid: Attendance Guard [ 3.0 ] & Holidays [ 4.0 ] */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bento [ 3.0 ]: Attendance Guard & Safe Bunks */}
        <div className="bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ SMART ATTENDANCE SAFEGUARD ]
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">Safe Bunk Guardrails</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
              [ 3.0 ]
            </span>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-3 gap-3 my-5">
            {[
              { label: 'Attended', val: attended, set: setAttended },
              { label: 'Total Held', val: totalHeld, set: setTotalHeld },
              { label: 'Target %', val: targetPct, set: setTargetPct }
            ].map((f, i) => (
              <div key={i} className="bg-[#020703] border border-emerald-500/30 p-3 rounded-2xl">
                <label className="text-[10px] font-mono uppercase text-emerald-400/70 font-bold block mb-1">
                  {f.label}
                </label>
                <input 
                  type="number" 
                  value={f.val} 
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-lg font-black text-white focus:outline-none focus:text-[#4ade80]"
                />
              </div>
            ))}
          </div>

          {/* Status Display Card */}
          <div className={`p-5 rounded-2xl border ${
            currentPct >= targetPct 
              ? 'bg-emerald-950/30 border-emerald-500/40' 
              : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-base font-extrabold font-mono ${
                currentPct >= targetPct ? 'text-[#4ade80]' : 'text-rose-400'
              }`}>
                Current Ratio: {currentPct}%
              </span>
              <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full ${
                currentPct >= targetPct 
                  ? 'bg-emerald-400 text-black shadow-[0_0_10px_#4ade80]' 
                  : 'bg-rose-500 text-white'
              }`}>
                {currentPct >= targetPct ? 'SAFE ZONE' : 'DANGER ZONE'}
              </span>
            </div>
            {currentPct >= targetPct ? (
              <p className="text-xs text-emerald-200/90 font-medium">
                🎉 Target preserved! You can safely skip <strong className="text-[#4ade80] font-mono text-sm underline decoration-[#4ade80]/50">{safeBunks} lectures</strong> continuously.
              </p>
            ) : (
              <p className="text-xs text-rose-300 font-medium">
                ⚠️ Below target threshold! Attend upcoming lectures to recover.
              </p>
            )}
          </div>
        </div>

        {/* Bento [ 4.0 ]: Official Holidays Calendar */}
        <div className="bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ GAD NOTIFICATION ]
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">Upcoming Holidays</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
              [ 4.0 ]
            </span>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
            {[
              { name: 'Krishna Janmashtami', day: 'Friday', date: '2026-09-04' },
              { name: 'Haritalika Teej', day: 'Monday', date: '2026-09-14' },
              { name: 'Nuwakhai', day: 'Tuesday', date: '2026-09-15' },
              { name: 'Gandhi Jayanti', day: 'Friday', date: '2026-10-02' },
              { name: 'Dussehra', day: 'Tuesday', date: '2026-10-20' },
              { name: 'Diwali', day: 'Sunday', date: '2026-11-08' }
            ].map((h, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between bg-[#020703] border border-emerald-500/20 hover:border-emerald-500/40 p-3 rounded-2xl transition-all"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-100">{h.name}</strong>
                  <span className="text-[10px] text-emerald-400/70 font-mono">{h.day}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#4ade80] bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                  {h.date}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Third Bento Row: Live Campus Events [ 5.0 ] */}
      <div className="bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
              [ FASTAPI LIVE DATA ]
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">Campus Events Radar</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
            [ 5.0 ]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length ? events.map((event) => (
            <div 
              key={event.id} 
              className="bg-[#020703] border border-emerald-500/20 hover:border-emerald-500/50 p-4 rounded-2xl transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <span className="text-[10px] font-mono text-[#4ade80] font-bold uppercase">{event.date}</span>
                </div>
                <strong className="block text-sm font-bold text-slate-100 leading-snug">{event.title}</strong>
                <p className="text-xs text-emerald-200/60 mt-1 line-clamp-2">{event.description}</p>
              </div>
              <div className="pt-2 border-t border-emerald-500/10 text-[10px] font-mono text-emerald-400/70">
                📍 {event.location}
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-xs font-mono text-emerald-400/60">
              ● No upcoming events loaded from backend
            </div>
          )}
        </div>
      </div>

    </div>
  );
}