import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, Calculator, TrendingUp } from 'lucide-react';

export default function GpaPredictorEngine() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('gpaCourses');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Data Structures', credits: 4, gradePoint: 9 },
      { id: 2, name: 'Operating Systems', credits: 3, gradePoint: 8 },
      { id: 3, name: 'Computer Networks', credits: 3, gradePoint: 7 },
    ];
  });

  const [targetGpa, setTargetGpa] = useState(8.5);
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [gradePoint, setGradePoint] = useState(8);

  useEffect(() => {
    localStorage.setItem('gpaCourses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = () => {
    if (!name.trim() || !credits) return;
    setCourses([
      ...courses,
      { id: Date.now(), name, credits: Number(credits), gradePoint: Number(gradePoint) }
    ]);
    setName(''); setCredits('');
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // GPA Math
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const totalPoints = courses.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
  const currentGpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

  return (
    <div className="max-w-5xl mx-auto bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <Award className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ ACADEMIC METRICS ]
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                [ 4.0 ]
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">GPA Predictor & Planner</h1>
          </div>
        </div>
      </div>

      {/* Input Module */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#020703] p-4 rounded-2xl border border-emerald-500/25">
        <input 
          type="text" 
          placeholder="Course Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#4ade80]"
        />
        <input 
          type="number" 
          placeholder="Credits (e.g. 4)" 
          value={credits} 
          onChange={(e) => setCredits(e.target.value)} 
          className="bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#4ade80]"
        />
        <select 
          value={gradePoint} 
          onChange={(e) => setGradePoint(e.target.value)}
          className="bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#4ade80]"
        >
          <option value={10}>S / O Grade (10)</option>
          <option value={9}>A+ Grade (9)</option>
          <option value={8}>A Grade (8)</option>
          <option value={7}>B+ Grade (7)</option>
          <option value={6}>B Grade (6)</option>
          <option value={5}>C Grade (5)</option>
        </select>
        <input 
          type="number" 
          placeholder="Target GPA" 
          value={targetGpa} 
          onChange={(e) => setTargetGpa(e.target.value)} 
          className="bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#4ade80]"
        />
        <button 
          onClick={addCourse} 
          className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:brightness-110 text-black rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition py-2 px-3 col-span-2 md:col-span-1 shadow-[0_0_12px_rgba(74,222,128,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#020703] border border-emerald-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[inset_0_0_20px_rgba(34,197,94,0.08)]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">Calculated SGPA</span>
          <div className="text-4xl md:text-5xl font-mono font-black text-[#4ade80] drop-shadow-[0_0_12px_rgba(74,222,128,0.5)]">
            {currentGpa}
          </div>
          <p className="text-xs font-mono text-emerald-300/70 mt-3">
            Registered Credits: <strong className="text-white font-bold">{totalCredits}</strong>
          </p>
        </div>

        <div className="md:col-span-2 bg-[#020703] border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Target Status</h4>
            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              TARGET: {targetGpa}
            </span>
          </div>

          {currentGpa >= targetGpa ? (
            <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#4ade80] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#4ade80]">On Target!</p>
                <p className="text-xs text-emerald-200/80 mt-0.5 font-medium">Your current SGPA ({currentGpa}) meets or surpasses your benchmark of {targetGpa}.</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl flex items-center gap-3">
              <Calculator className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-300">Below Target Benchmark</p>
                <p className="text-xs text-amber-200/80 mt-0.5 font-medium">Target is {targetGpa}. Aim for 9+ in high-credit subjects to raise your cumulative aggregate.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-emerald-400/80 uppercase tracking-wider">Registered Courses</h3>
        <div className="grid grid-cols-1 gap-2.5">
          {courses.map((c) => (
            <div key={c.id} className="bg-[#020703] border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 flex justify-between items-center text-xs transition-all">
              <div>
                <span className="font-extrabold text-white text-sm">{c.name}</span>
                <p className="text-emerald-400/70 font-mono mt-0.5">{c.credits} Credits • Grade Point: {c.gradePoint}/10</p>
              </div>
              <button onClick={() => deleteCourse(c.id)} className="text-slate-500 hover:text-rose-400 transition p-1 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}