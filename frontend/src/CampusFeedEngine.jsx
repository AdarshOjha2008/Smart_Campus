import React, { useState } from 'react';
import { Megaphone, Filter, Tag, Calendar, UserCheck, Search } from 'lucide-react';

export default function CampusFeedEngine({ notices = [], profile = {}, onPostNotice }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract branch & semester dynamically from profile
  const userBranch = profile?.branch || 'All Branches';
  const userSem = profile?.semester || 'All Semesters';

  // Filter Notices based on Category, Search query, and Branch target
  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === 'All' || notice.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch =
      notice.target === 'All Branches' ||
      notice.target.toLowerCase().includes(userBranch.split(' ')[1]?.toLowerCase() || '');

    return matchesCategory && matchesSearch && matchesBranch;
  });

  return (
    <div className="bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      
      {/* Header Section with Dynamic Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <Megaphone className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ CAMPUS BROADCAST RADAR ]
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                [ 5.0 ]
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Campus Feed & Notices</h2>
            <p className="text-xs font-mono text-emerald-400/70 mt-0.5">
              Filtered for: <span className="text-white font-bold">{userBranch} ({userSem})</span> & General Channels
            </p>
          </div>
        </div>

        {/* Cyber Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search telemetry & feed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#020703] border border-emerald-500/30 rounded-full pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-emerald-800 focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_12px_rgba(74,222,128,0.2)] transition-all"
          />
        </div>
      </div>

      {/* Category Filter Pills (Pill Dock style from video) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 bg-[#020703] p-1.5 rounded-full border border-emerald-500/25">
          <span className="text-[10px] font-mono font-bold text-emerald-400/60 px-2 uppercase">CHANNELS:</span>
          {['All', 'General', 'Exam', 'Event', 'Placement'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#12311b] text-[#4ade80] border border-emerald-500/50 shadow-[0_0_10px_rgba(74,222,128,0.25)]'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-[#0c2213]/40'
                }`}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notices Feed Grid (Bento cards with glowing borders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, idx) => (
            <div
              key={notice.id || idx}
              className="bg-[#020703] border border-emerald-500/25 hover:border-emerald-500/55 rounded-2xl p-6 shadow-lg transition-all flex flex-col justify-between space-y-4 hover:shadow-[0_0_20px_rgba(34,197,94,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      notice.category === 'Exam'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : notice.category === 'Event'
                        ? 'bg-emerald-500/10 text-[#4ade80] border border-emerald-500/30'
                        : notice.category === 'Placement'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    ● {notice.category}
                  </span>

                  <span className="text-[11px] font-mono text-emerald-400/70 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {notice.date}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white mb-2 leading-snug">
                  {notice.title}
                </h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed font-medium line-clamp-3">
                  {notice.description}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-mono text-emerald-400/80 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <UserCheck className="w-3.5 h-3.5 text-[#4ade80]" /> {notice.author}
                </span>
                <span className="flex items-center gap-1 bg-[#051209] px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <Tag className="w-3 h-3 text-[#4ade80]" /> {notice.target}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-[#020703] border border-emerald-500/20 rounded-2xl p-12 text-center">
            <p className="text-emerald-300 font-mono text-sm font-bold">● No telemetry records found matching filters.</p>
            <p className="text-emerald-500/60 font-mono text-xs mt-1">Try switching channels or clearing query terms.</p>
          </div>
        )}
      </div>

    </div>
  );
}