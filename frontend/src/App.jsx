import React, { useEffect, useState } from 'react';
import CampusHub from './CampusHub';
import TimetableEngine from './TimetableEngine';
import SmartAttendanceEngine from './SmartAttendanceEngine';
import MultiSubjectEngine from './MultiSubjectEngine';
import GpaEngine from './GpaEngine';
import CampusFeedEngine from './CampusFeedEngine';
import { User, Megaphone, X, UserPlus, Cloud, CloudOff, LogOut, LogIn, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');

  // Load saved profile or start empty
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('student_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: '',
          rollNo: '',
          email: '',
          branch: 'B.Tech CSE',
          semester: 'Sem 1',
          role: 'student',
        };
  });

  const [isProfileOpen, setIsProfileOpen] = useState(!profile.name);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(profile.name ? 'profile' : 'login'); // 'login' | 'profile'

  // Auth form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Campus notices now come from the FastAPI backend.
  const [notices, setNotices] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [noticeData] = await Promise.all([api.getNotices(), api.health()]);
        if (alive) {
          setNotices(noticeData);
          setBackendOnline(true);
        }
      } catch (error) {
        console.error('Backend connection failed:', error);
        if (alive) setBackendOnline(false);
      } finally {
        if (alive) setNoticeLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('General');
  const [noticeTarget, setNoticeTarget] = useState('All Branches');
  const [noticeDesc, setNoticeDesc] = useState('');

  const courseOptions = [
    'B.Tech CSE',
    'B.Tech DSAI',
    'B.Tech ECE',
    'M.Tech CSE',
    'M.Tech ECE',
    'Ph.D. Scholar',
    'Computer Science & Engineering',
    'Electronics & Communication'
  ];

  const semesterOptions = [
    'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4',
    'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8',
    'Faculty / Staff'
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('student_profile', JSON.stringify(profile));
    setIsProfileOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      const data = await api.login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      localStorage.setItem('access_token', data.access_token);
      const user = data.user;
      const updatedProfile = {
        name: user.name,
        email: user.email,
        rollNo: user.roll_no || '',
        branch: user.branch || user.department || 'B.Tech CSE',
        semester: user.semester || (user.role === 'teacher' ? 'Faculty / Staff' : 'Sem 1'),
        role: user.role || 'student',
      };
      setProfile(updatedProfile);
      localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
      setAuthSuccess(`Welcome, ${user.name}!`);
      setTimeout(() => {
        setIsProfileOpen(false);
        setLoginEmail('');
        setLoginPassword('');
        setAuthSuccess('');
      }, 700);
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_profile');
    localStorage.removeItem('access_token');
    setProfile({
      name: '',
      rollNo: '',
      email: '',
      branch: 'B.Tech CSE',
      semester: 'Sem 1',
      role: 'student',
    });
    setAuthError('');
    setAuthSuccess('Logged out successfully.');
    setModalMode('login');
    setIsProfileOpen(true);
  };

  const handlePostNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    const newEntry = {
      title: noticeTitle,
      category: noticeCategory,
      target: noticeTarget,
      date: new Date().toISOString().split('T')[0],
      description: noticeDesc || 'No additional details provided.',
      author: profile.name || (profile.role === 'teacher' ? 'Faculty' : 'Student')
    };

    try {
      const saved = await api.createNotice(newEntry);
      setNotices((current) => [saved, ...current]);
      setBackendOnline(true);
    } catch (error) {
      console.error('Could not save notice:', error);
      alert('Could not save the notice. Make sure the backend is running.');
      return;
    }

    setNoticeTitle('');
    setNoticeDesc('');
    setIsNoticeModalOpen(false);
  };

  return (
    <div 
      className="relative min-h-screen text-slate-100 pb-28 pt-4 px-4 md:px-8 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden"
      style={{
        backgroundColor: '#030704',
        backgroundImage: `
          radial-gradient(circle at 50% -5%, rgba(34, 197, 94, 0.22) 0%, transparent 55%),
          radial-gradient(circle at 85% 35%, rgba(16, 185, 129, 0.12) 0%, transparent 45%),
          radial-gradient(circle at 15% 75%, rgba(34, 197, 94, 0.10) 0%, transparent 50%),
          linear-gradient(to bottom, #030704 0%, #051209 50%, #020603 100%)
        `
      }}
    >
      {/* Ambient Cyber Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Navbar Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 py-3 border-b border-emerald-500/20">
        
        {/* Brand Logo & Cyber Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center font-black text-black text-xs shadow-[0_0_18px_rgba(74,222,128,0.5)]">
            DX
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-widest text-base text-slate-100">
                SMART<span className="text-[#4ade80]">CAMPUS</span>
              </span>
              <span className="text-[10px] text-emerald-400/90 font-mono border border-emerald-500/30 px-1.5 py-0.5 rounded-md bg-emerald-500/10">
                [ 2.0 ]
              </span>
            </div>
            <span className="text-[10px] text-emerald-400/70 font-mono tracking-wider block">IIIT NAYA RAIPUR</span>
          </div>
        </div>

        {/* Center Tagline */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-emerald-400/80 tracking-widest uppercase">
          <span>|</span>
          <span className="text-emerald-300 font-bold">EMPOWERING CAMPUS ON THE DOT</span>
          <span>|</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono border ${backendOnline ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-300 bg-rose-500/10 border-rose-500/30'}`}>
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]' : 'bg-rose-400'}`} />
            {backendOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
          </div>

          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="flex items-center gap-2 bg-[#081a0e] hover:bg-[#0e2a16] text-emerald-200 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-[0_0_12px_rgba(34,197,94,0.15)]"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#4ade80]" /> Post Notice
          </button>

          {/* Profile Button with neon green circle button */}
          <button
            onClick={() => {
              setModalMode('profile');
              setIsProfileOpen(true);
            }}
            className="flex items-center gap-2.5 bg-[#081a0e] hover:bg-[#0f2e18] border border-emerald-500/35 pl-3.5 pr-1.5 py-1.5 rounded-full text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          >
            <div className="text-left hidden sm:block">
              <p className="font-bold text-slate-200 leading-tight">
                {profile.name || 'Sign In / Profile'}
              </p>
              <p className="text-[10px] text-emerald-400/80 font-mono">
                {profile.role === 'teacher' ? 'Faculty' : (profile.rollNo ? profile.rollNo : profile.branch)} • {profile.semester}
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#4ade80] flex items-center justify-center font-black text-black text-[11px] shadow-[0_0_12px_#4ade80]">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '↗'}
            </div>
          </button>

          {/* Log Out Button */}
          {profile.name && (
            <button
              onClick={handleLogout}
              title="Log Out"
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </header>

      {/* Main Views */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'hub' && <CampusHub notices={notices} profile={profile} />}
        {activeTab === 'timetable' && <TimetableEngine userBranch={profile.branch} />}
        {activeTab === 'quickbunk' && <SmartAttendanceEngine />}
        {activeTab === 'multisubject' && <MultiSubjectEngine userBranch={profile.branch} userSem={profile.semester} />}
        {activeTab === 'gpa' && <GpaEngine />}
        {activeTab === 'feed' && (
          <CampusFeedEngine
            notices={notices}
            profile={profile}
            onPostNotice={(newNotice) => setNotices((current) => [newNotice, ...current])}
          />
        )}
        {activeTab === 'mart' && (
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-[#131b2e] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🛒</span>
                <div>
                  <span className="font-bold text-slate-100 text-sm">B1 Mart Storefront</span>
                  <span className="text-slate-400 text-xs ml-2 hidden sm:inline">• IIIT Naya Raipur Official Mart</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 font-semibold hidden md:inline">
                  Pickup Counter: 10AM–2PM • 4PM–11PM
                </span>
                <a
                  href="https://smart-campus-backend-ty3z.onrender.com/b1-mart"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Fullscreen</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            <iframe
              src="https://smart-campus-backend-ty3z.onrender.com/b1-mart"
              title="B1 Mart Storefront"
              className="w-full h-[82vh] border-0 bg-white"
            />
          </div>
        )}
        {activeTab === 'mobility' && (
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-[#131b2e] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🚌</span>
                <div>
                  <span className="font-bold text-slate-100 text-sm">RaipurTransit Smart Mobility</span>
                  <span className="text-slate-400 text-xs ml-2 hidden sm:inline">• Nava Raipur ↔ Raipur Navigator (Rapido+ & BRTS)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 font-semibold hidden md:inline">
                  Live Fares & BRTS Timings
                </span>
                <a
                  href="https://smart-campus-backend-ty3z.onrender.com/mobility"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Fullscreen</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
            <iframe
              src="https://smart-campus-backend-ty3z.onrender.com/mobility"
              title="RaipurTransit Smart Mobility"
              className="w-full h-[85vh] border-0 bg-white"
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Cyber Navigation Dock (DOTDNA Signature UI) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
        <div className="flex items-center gap-1.5 bg-[#05140a]/92 backdrop-blur-2xl px-3 py-2 rounded-full border border-emerald-500/35 shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(34,197,94,0.18)] overflow-x-auto scrollbar-none">
          {[
            { id: 'hub', label: 'Campus Hub' },
            { id: 'timetable', label: 'Timetable +' },
            { id: 'quickbunk', label: 'Quick Bunk' },
            { id: 'multisubject', label: 'Multi-Subject' },
            { id: 'gpa', label: 'GPA Predictor' },
            { id: 'feed', label: 'Campus Feed' },
            { id: 'mart', label: '🛒 B1 Mart' },
            { id: 'mobility', label: '🚌 Smart Mobility' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#12311b] text-[#4ade80] border border-emerald-500/50 shadow-[0_0_15px_rgba(74,222,128,0.3)] font-bold'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-[#0c2213]/60'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile & Auth Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#040e07]/95 backdrop-blur-2xl border border-emerald-500/40 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(34,197,94,0.2)] relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#4ade80]" />
                <h3 className="font-bold text-lg text-slate-100">
                  {modalMode === 'login' ? 'Sign In to Campus' : 'Profile Settings'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {profile.name && (
                  <button
                    type="button"
                    onClick={() => setModalMode(modalMode === 'login' ? 'profile' : 'login')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                  >
                    {modalMode === 'login' ? 'Profile Details' : 'Switch Account'}
                  </button>
                )}
                {profile.name && (
                  <button type="button" onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification messages */}
            {authError && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Mode 1: Sign In via Backend Auth */}
            {modalMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    IIIT-NR Email (@iiitnr.edu.in)
                  </label>
                  <input
                    type="email"
                    placeholder="student21@iiitnr.edu.in or teacher@iiitnr.edu.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Student email frame contains digits. Teacher email frame has no digits.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  <LogIn className="w-4 h-4" />
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setModalMode('profile')}
                    className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Or continue with guest / local profile setup
                  </button>
                </div>
              </form>
            ) : (
              /* Mode 2: Profile Settings */
              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Roll / ID Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 2310010001"
                      value={profile.rollNo}
                      onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">College Email ID</label>
                    <input
                      type="email"
                      placeholder="user@iiitnr.edu.in"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Branch / Department</label>
                    <select
                      value={profile.branch}
                      onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500"
                    >
                      {courseOptions.map((course, idx) => (
                        <option key={idx} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Semester / Role</label>
                    <select
                      value={profile.semester}
                      onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500"
                    >
                      {semesterOptions.map((sem, idx) => (
                        <option key={idx} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  Save Profile
                </button>
              </form>
            )}

            {/* Modal Logout Option */}
            {profile.name && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Log Out of Account
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handlePostNoticeSubmit} className="bg-[#040e07]/95 backdrop-blur-2xl border border-emerald-500/40 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(34,197,94,0.2)] relative">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-100">
                <Megaphone className="w-5 h-5 text-[#4ade80]" /> Post Campus Notice
              </h3>
              <button type="button" onClick={() => setIsNoticeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-400/80 mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lab schedule change"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full bg-[#020703] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-bold text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_12px_rgba(74,222,128,0.2)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400/80 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full bg-[#020703] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-bold text-emerald-100 focus:outline-none focus:border-[#4ade80]"
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                    <option value="Placement">Placement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400/80 mb-1">Target Audience</label>
                  <select
                    value={noticeTarget}
                    onChange={(e) => setNoticeTarget(e.target.value)}
                    className="w-full bg-[#020703] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs font-bold text-emerald-100 focus:outline-none focus:border-[#4ade80]"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="CSE Only">CSE Only</option>
                    <option value="ECE Only">ECE Only</option>
                    <option value="DSAI Only">DSAI Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-400/80 mb-1">Details / Description</label>
                <textarea
                  rows="3"
                  placeholder="Notice details..."
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  className="w-full bg-[#020703] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_12px_rgba(74,222,128,0.2)]"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:brightness-110 text-black text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(74,222,128,0.4)]"
            >
              Publish Notice Immediately
            </button>
          </form>
        </div>
      )}

    </div>
  );
}