import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

// DSPM IIIT Naya Raipur - Exact Curriculum Subject Database
const SUBJECT_DATABASE = {
  // B.Tech 1st Semesters
  'B.Tech_CSE_1': [
    'Linear Algebra & Matrix Analysis',
    'Calculas',
    'Programming with C',
    'Digital Electronics using Verilog',
    'Internet of Things',
    'International Language Competency (ILC)',
    'IT Workshop',
    'Entrepreneruship',
    'Music',
    'Yoga'
  ],
  'B.Tech_DSAI_1': [
    'Linear Algebra & Matrix Analysis',
    'Calculas',
    'Programming with C',
    'Digital Electronics using Verilog',
    'Internet of Things',
    'International Language Competency (ILC)',
    'IT Workshop',
    'Entrepreneruship',
    'Music',
    'Yoga'
  ],
  'B.Tech_ECE_1': [
    'Linear Algebra & Matrix Analysis',
    'Calculas',
    'Programming with C',
    'Digital Electronics using Verilog',
    'Internet of Things',
    'International Language Competency (ILC)',
    'IT Workshop',
    'Entrepreneruship',
    'Music',
    'Yoga'
  ],

  // M.Tech 1st Semesters
  'M.Tech_CSE_1': [
    'Mathematics for Machine Learning',
    'Data Structures and Algorithm Analysis',
    'Cyber Security Fundamentals',
    'Generative AI and Prompt Engineering',
    'Data Visualisation Analysis',
    'Foundation of data science',
    'Digital Transformation-I',
    'Personality Development and Life Skills'
  ],
  'M.Tech_DSAI_1': [
    'Data Structures and Algorithm Analysis',
    'Cyber Security Fundamentals',
    'Data Visualisation Analysis',
    'Foundation of data science',
    'Digital Transformation-I',
    'Personality Development and Life Skills',
    'Inside Indian Governance: Policies, People, and Processes'
  ],
  'M.Tech_ECE_1': [
    'Optimization Algorithms',
    'VLSI Design',
    'Intelligent Systems',
    'Programming Lab-1 (FPGA/Python)',
    'Data Structures and Algorithm Analysis',
    'Foundations of Data Science',
    'AI for Autonomous Systems',
    'Personality Development and Life Skills',
    'Digital System Design',
    'Microelectronics'
  ]
};

export default function MultiSubjectEngine({ branch = 'CSE', year = '1', semester = '1', degree = 'B.Tech' }) {
  // Format key for database lookup (e.g., "B.Tech_CSE_1")
  const profileKey = `${degree}_${branch}_${semester}`;
  const storageKey = `multi_subject_data_${profileKey}`;

  // Helper to load default subjects for the current profile
  const getDefaultSubjects = () => {
    const defaultList = SUBJECT_DATABASE[profileKey] || SUBJECT_DATABASE['B.Tech_CSE_1'];
    return defaultList.map((name, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: name,
      attended: 0,
      total: 0,
      target: 75
    }));
  };

  // State management
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : getDefaultSubjects();
  });

  const [newSubjectName, setNewSubjectName] = useState('');

  // Re-load subjects whenever Branch / Degree / Semester changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSubjects(JSON.parse(saved));
    } else {
      setSubjects(getDefaultSubjects());
    }
  }, [profileKey]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(subjects));
  }, [subjects, storageKey]);

  // Reset to default timetable subjects
  const handleResetToDefault = () => {
    if (window.confirm("Reset subjects to official timetable list? Custom edits will be lost.")) {
      const defaults = getDefaultSubjects();
      setSubjects(defaults);
      localStorage.setItem(storageKey, JSON.stringify(defaults));
    }
  };

  // Add new subject manually
  const addSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const newSub = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      attended: 0,
      total: 0,
      target: 75
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
  };

  // Delete subject
  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Dynamic input update
  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        return { ...s, [field]: Math.max(0, parseInt(value) || 0) };
      }
      return s;
    }));
  };

  // Quick action (+1 attend / +1 bunk)
  const handleQuickAction = (id, action) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        if (action === 'attend') return { ...s, attended: s.attended + 1, total: s.total + 1 };
        if (action === 'bunk') return { ...s, total: s.total + 1 };
      }
      return s;
    }));
  };

  return (
    <div className="bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <Layers className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ SUBJECT ATTENDANCE RADAR ]
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                [ 3.0 ]
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Multi-Course Telemetry</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 bg-[#020703] hover:bg-[#081a0e] text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer"
            title="Reset to official timetable subjects"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#4ade80]" /> Reset Subjects
          </button>
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#4ade80]">
            {degree} • {branch} • Sem {semester}
          </div>
        </div>
      </div>

      {/* Manual Subject Form */}
      <form onSubmit={addSubject} className="flex gap-3">
        <input
          type="text"
          placeholder="Add custom course module..."
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          className="flex-1 bg-[#020703] border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs md:text-sm font-mono text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-[#4ade80] transition-all"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 hover:brightness-110 text-black px-5 py-2.5 rounded-2xl text-xs font-black shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </form>

      {/* Subject Cards Grid */}
      <div className="space-y-4">
        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-[#020703] border border-emerald-500/20 rounded-2xl text-emerald-400/60 font-mono text-xs">
            ● No subjects registered. Click 'Reset Subjects' or add a custom module.
          </div>
        ) : (
          subjects.map((sub) => {
            const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
            const pctText = pct.toFixed(1);
            const isDanger = pct < sub.target;
            const targetPct = sub.target / 100;

            let outputText = "";
            if (pct < sub.target) {
              const needed = Math.ceil((targetPct * sub.total - sub.attended) / (1 - targetPct));
              outputText = `⚠️ Attend ${Math.max(0, needed)} consecutive lectures to reach ${sub.target}%`;
            } else {
              const bunks = Math.floor((sub.attended - targetPct * sub.total) / targetPct);
              outputText = `🎉 Safe to skip ${Math.max(0, bunks)} upcoming lectures`;
            }

            return (
              <div 
                key={sub.id} 
                className={`p-5 rounded-2xl border transition-all space-y-4 bg-[#020703] ${
                  isDanger 
                    ? 'border-rose-500/40 hover:border-rose-500/60' 
                    : 'border-emerald-500/25 hover:border-emerald-500/50'
                }`}
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isDanger ? (
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                    )}
                    <h3 className="font-extrabold text-base text-white">{sub.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border ${
                      isDanger 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                        : 'bg-emerald-500/10 text-[#4ade80] border-emerald-500/30 shadow-[0_0_8px_rgba(74,222,128,0.2)]'
                    }`}>
                      {pctText}%
                    </span>
                    <button 
                      onClick={() => deleteSubject(sub.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-all cursor-pointer"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inputs Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-emerald-400/70 uppercase font-bold mb-1">Attended</label>
                    <input
                      type="number"
                      value={sub.attended}
                      onChange={(e) => updateSubject(sub.id, 'attended', e.target.value)}
                      className="w-full bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-emerald-400/70 uppercase font-bold mb-1">Total</label>
                    <input
                      type="number"
                      value={sub.total}
                      onChange={(e) => updateSubject(sub.id, 'total', e.target.value)}
                      className="w-full bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-emerald-400/70 uppercase font-bold mb-1">Target %</label>
                    <input
                      type="number"
                      value={sub.target}
                      onChange={(e) => updateSubject(sub.id, 'target', e.target.value)}
                      className="w-full bg-[#051209] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>
                </div>

                {/* Quick Actions & Calculation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-500/15">
                  <p className={`text-xs font-mono font-medium ${isDanger ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {outputText}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickAction(sub.id, 'attend')}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-[#4ade80] border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(74,222,128,0.15)]"
                    >
                      +1 Attended
                    </button>
                    <button
                      onClick={() => handleQuickAction(sub.id, 'bunk')}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      +1 Bunked
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}