import React, { useState } from 'react';

export default function SmartAttendanceEngine() {
  const [attended, setAttended] = useState(18);
  const [total, setTotal] = useState(20);
  const [target, setTarget] = useState(75);

  const currentPercentage = total > 0 ? ((attended / total) * 100).toFixed(1) : 0;
  const targetFraction = target / 100;
  const maxBunks = Math.floor((attended - targetFraction * total) / targetFraction);
  const safeBunks = maxBunks > 0 ? maxBunks : 0;
  const classesNeeded = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-180px)] p-4">
      <div className="relative bg-[#051209]/90 backdrop-blur-2xl border border-emerald-500/30 p-8 rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(34,197,94,0.15)] overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-36 pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        />

        {/* Header with Monospace Cyber Badge */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#4ade80] uppercase font-bold block">
              [ 2026 / ATTENDANCE RADAR ]
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              Attendance Shield
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10 font-bold">
            [ 3.0 ]
          </span>
        </div>

        {/* Inputs styled as cyber telemetry modules */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-mono text-emerald-400/80 uppercase font-semibold block mb-1.5">
              Attended Classes
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={attended} 
                onChange={(e) => setAttended(Number(e.target.value))}
                className="w-full bg-[#020703] border border-emerald-500/30 rounded-2xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_15px_rgba(74,222,128,0.25)] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400/60 font-bold">LCRS</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-emerald-400/80 uppercase font-semibold block mb-1.5">
              Total Classes Held
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={total} 
                onChange={(e) => setTotal(Number(e.target.value))}
                className="w-full bg-[#020703] border border-emerald-500/30 rounded-2xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_15px_rgba(74,222,128,0.25)] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400/60 font-bold">TOTAL</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-emerald-400/80 uppercase font-semibold block mb-1.5">
              Target Threshold (%)
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-[#020703] border border-emerald-500/30 rounded-2xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_15px_rgba(74,222,128,0.25)] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400/60 font-bold">%</span>
            </div>
          </div>
        </div>

        {/* Telemetry Indicator Card */}
        <div className={`p-6 rounded-2xl border transition-all ${
          currentPercentage >= target 
            ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
            : 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-300 font-bold">
              Current Quotient
            </span>
            <span className={`text-xs font-mono font-black px-3 py-1 rounded-full ${
              currentPercentage >= target 
                ? 'bg-emerald-400 text-black shadow-[0_0_10px_#4ade80]' 
                : 'bg-rose-500 text-white'
            }`}>
              {currentPercentage >= target ? 'SAFE ZONE' : 'CRITICAL DEFICIT'}
            </span>
          </div>

          <div className="text-3xl font-mono font-black text-white mb-2">
            {currentPercentage}%
          </div>

          {currentPercentage >= target ? (
            <p className="text-xs text-emerald-200/90 font-medium leading-relaxed">
              🎉 Optimal margin maintained. You can safely skip <strong className="text-[#4ade80] font-mono text-sm underline decoration-[#4ade80]/50">{safeBunks} lectures</strong> back-to-back!
            </p>
          ) : (
            <p className="text-xs text-rose-300 font-medium leading-relaxed">
              ⚠️ Below required threshold! You must attend <strong className="text-rose-400 font-mono text-sm underline decoration-rose-400/50">{classesNeeded > 0 ? classesNeeded : 0} consecutive lectures</strong> to recover {target}%.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}