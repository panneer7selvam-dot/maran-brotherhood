"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Crown, Heart, Brain, BicepsFlexed, 
  CheckCircle, Lock, Unlock, Flame,
  Trash2, Plus, X, AlertTriangle, RefreshCw,
  Sparkles, Battery
} from 'lucide-react';

// --- CONFIGURATION v9.2 (Build Fix) ---
const APP_VERSION = "v9.2 (Stable)";

const INITIAL_KIDS = [
  { 
    id: '1', name: 'Aniv', baseAvatar: '🦁', 
    credits: 0, xp: 0, level: 1, str: 10, eq: 10,
    battery: 80, streak: 0, 
    dharma: { bed: false, plate: false, teeth: false }, 
    color: 'from-blue-600 to-indigo-600'
  },
  { 
    id: '2', name: 'Thiru', baseAvatar: '🐯', 
    credits: 0, xp: 0, level: 1, str: 10, eq: 10,
    battery: 80, streak: 0, 
    dharma: { bed: false, plate: false, teeth: false }, 
    color: 'from-orange-500 to-red-600'
  }
];

const MOODS = [
  { label: 'Happy', icon: '😄', advice: 'Wonderful! Spread that sunshine.' },
  { label: 'Proud', icon: '🤩', advice: 'Great effort! Pat your own back.' },
  { label: 'Bored', icon: '😐', advice: 'Opportunity! Draw or build something new.' },
  { label: 'Sad', icon: '😢', advice: 'It is okay. Ask for a hug.' },
  { label: 'Angry', icon: '😡', advice: 'Protocol: 5 Deep Breaths. Walk away.' },
  { label: 'Scared', icon: '😨', advice: 'Bravery is being scared but doing it anyway.' },
];

const EXERCISES = [
  { id: 1, name: 'Frog Jumps', xp: 15, str: 5, icon: '🐸', desc: '10 jumps' },
  { id: 2, name: 'Bear Crawl', xp: 15, str: 5, icon: '🐻', desc: 'Across the room' },
  { id: 3, name: 'Flamingo Balance', xp: 10, str: 5, icon: '🦩', desc: '30s per leg' },
  { id: 4, name: 'Super Stretch', xp: 10, str: 2, icon: '🧘', desc: 'Touch toes' },
  { id: 5, name: 'Pushups', xp: 20, str: 10, icon: '💪', desc: '10 reps' },
];

const INITIAL_QUESTS = [
  { id: 1, title: 'Greet a Guest', type: 'SOCIAL', reward: 0, xp: 20, icon: '🤝', desc: 'Look in eye & say Namaste.' },
  { id: 2, title: 'Share w/ Brother', type: 'SOCIAL', reward: 0, xp: 30, icon: '🤲', desc: 'No fighting over toys.' },
  { id: 3, title: 'Shoes in Rack', type: 'HOME', reward: 0, xp: 10, icon: '👟', desc: 'Keep entrance clean.' },
  { id: 4, title: 'Fold Laundry', type: 'WORK', reward: 5, xp: 10, icon: '👕', desc: 'Fold 10 items.' },
  { id: 5, title: 'Water Plants', type: 'WORK', reward: 5, xp: 5, icon: '🌱', desc: 'Garden duty.' },
  { id: 6, title: 'Wash Vehicle', type: 'JOB', reward: 20, xp: 50, icon: '🚗', desc: 'Soap & Water clean.' },
];

export default function MaranEcosystem() {
  const [kids, setKids] = useState(INITIAL_KIDS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [soulLogs, setSoulLogs] = useState<{id: number, kidId: string, text: string, mood: string, date: string}[]>([]);
  
  const [selectedId, setSelectedId] = useState('1');
  const [activeTab, setActiveTab] = useState('HERO'); 
  const [isParentMode, setIsParentMode] = useState(false);
  
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showAddQuest, setShowAddQuest] = useState(false);
  
  const [newQuest, setNewQuest] = useState({ title: '', reward: 0, xp: 10, icon: '⭐', type: 'SOCIAL' });
  const [newLog, setNewLog] = useState('');
  const [currentMoodAdvice, setCurrentMoodAdvice] = useState<string | null>(null);

  useEffect(() => {
    const savedKids = localStorage.getItem('maran_kids_v9_2');
    const savedQuests = localStorage.getItem('maran_quests_v9_2');
    const savedLogs = localStorage.getItem('maran_logs_v9_2');
    if (savedKids) setKids(JSON.parse(savedKids));
    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedLogs) setSoulLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('maran_kids_v9_2', JSON.stringify(kids));
    localStorage.setItem('maran_quests_v9_2', JSON.stringify(quests));
    localStorage.setItem('maran_logs_v9_2', JSON.stringify(soulLogs));
  }, [kids, quests, soulLogs]);

  const activeKid = kids.find(k => k.id === selectedId) || kids[0];

  const handlePinSubmit = () => {
    if (pinInput === '1234') { 
      setIsParentMode(true); setShowPinPad(false); setPinInput('');
    } else {
      setPinInput(''); alert('Wrong PIN');
    }
  };

  const factoryReset = () => {
    if(confirm("RESET ALL DATA?")) { localStorage.clear(); window.location.reload(); }
  };

  // FIX: Using (k as any) to bypass TypeScript strict indexing error
  const updateStat = (id: string, field: string, value: number) => {
    setKids(kids.map(k => {
      if (k.id !== id) return k;
      
      const currentVal = (k as any)[field] || 0;
      let newVal = currentVal + value;
      
      if (field === 'battery') newVal = Math.min(100, Math.max(0, newVal));
      
      let newLevel = k.level;
      if (field === 'xp') newLevel = Math.floor(newVal / 500) + 1;
      
      return { ...k, [field]: newVal, level: newLevel };
    }));
  };

  // FIX: Using (dharma as any) to bypass strict string indexing error
  const toggleDharma = (task: string) => {
    setKids(kids.map(k => {
      if (k.id !== activeKid.id) return k;
      const d = k.dharma as any;
      return { ...k, dharma: { ...d, [task]: !d[task] } };
    }));
  };

  const handleAddQuest = () => {
    if (!newQuest.title) return;
    setQuests([...quests, { ...newQuest, id: Date.now(), desc: 'Custom Mission' }]);
    setShowAddQuest(false);
    setNewQuest({ title: '', reward: 0, xp: 10, icon: '⭐', type: 'SOCIAL' });
  };
  
  const handleDeleteQuest = (id: number) => {
    if (confirm('Delete?')) setQuests(quests.filter(q => q.id !== id));
  };

  const handleMoodSelect = (mood: any) => {
    setCurrentMoodAdvice(mood.advice);
    updateStat(activeKid.id, 'eq', 5);
    setTimeout(() => setCurrentMoodAdvice(null), 6000);
  };

  const addSoulLog = () => {
    if(!newLog) return;
    const log = { id: Date.now(), kidId: activeKid.id, text: newLog, mood: 'Log', date: new Date().toLocaleDateString() };
    setSoulLogs([log, ...soulLogs]);
    setNewLog('');
    updateStat(activeKid.id, 'eq', 10);
  };

  const getEvolvedAvatar = (base: string, level: number) => {
    if (level < 5) return base; 
    if (level < 10) return `${base}⚔️`; 
    return `${base}👑`; 
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white pb-28 select-none relative overflow-x-hidden">
      
      {/* ADD MISSION MODAL */}
      {showAddQuest && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">New Mission</h2>
               <button onClick={() => setShowAddQuest(false)}><X size={20}/></button>
             </div>
             <input className="w-full bg-slate-800 p-3 rounded-lg mb-3 border border-slate-700" placeholder="Title (e.g. Say Thank You)" value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} />
             <div className="flex gap-2 mb-3">
               <div className="w-1/2">
                 <label className="text-[10px] text-slate-500 font-bold uppercase">Rupees (₹)</label>
                 <input type="number" className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" value={newQuest.reward} onChange={e => setNewQuest({...newQuest, reward: Number(e.target.value)})} />
               </div>
               <div className="w-1/2">
                 <label className="text-[10px] text-slate-500 font-bold uppercase">Wisdom (XP)</label>
                 <input type="number" className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" value={newQuest.xp} onChange={e => setNewQuest({...newQuest, xp: Number(e.target.value)})} />
               </div>
             </div>
             <div className="flex gap-1 mb-4">
               {['SOCIAL', 'WORK', 'HOME'].map(t => (
                 <button key={t} onClick={() => setNewQuest({...newQuest, type: t})} className={`flex-1 py-2 text-[10px] font-bold rounded ${newQuest.type === t ? 'bg-blue-600' : 'bg-slate-800'}`}>{t}</button>
               ))}
             </div>
             <button onClick={handleAddQuest} className="w-full bg-green-600 py-3 rounded-lg font-bold">Save Mission</button>
          </div>
        </div>
      )}

      {/* PIN PAD */}
      {showPinPad && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm text-center border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-red-500">Parent Access</h2>
            <div className="flex justify-center gap-2 mb-6">{[1,2,3,4].map((_, i) => <div key={i} className={`h-4 w-4 rounded-full ${pinInput.length > i ? 'bg-white' : 'bg-slate-700'}`} />)}</div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6,7,8,9,0].map(n => <button key={n} onClick={() => setPinInput(p => (p + n).slice(0,4))} className="h-14 bg-slate-800 rounded-xl font-bold text-xl">{n}</button>)}
              <button onClick={handlePinSubmit} className="col-span-2 h-14 bg-green-600 rounded-xl font-bold">ENTER</button>
            </div>
            <button onClick={() => setShowPinPad(false)} className="mt-4 text-slate-500 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex gap-2">
            {kids.map(kid => (
              <button key={kid.id} onClick={() => setSelectedId(kid.id)} className={`relative transition-all ${activeKid.id === kid.id ? 'scale-110 z-10' : 'opacity-50 scale-90'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${kid.color} ring-2 ring-white/20`}>
                  {getEvolvedAvatar(kid.baseAvatar, kid.level)}
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => isParentMode ? setIsParentMode(false) : setShowPinPad(true)} className={`h-10 w-10 rounded-full flex items-center justify-center ${isParentMode ? 'bg-red-500 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
             {isParentMode ? <Unlock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">

        {/* --- ID CARD --- */}
        <div className={`rounded-3xl p-1 bg-gradient-to-br ${activeKid.color} shadow-2xl relative`}>
           <div className="bg-slate-900/90 rounded-[22px] p-5 backdrop-blur-sm">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider">Level {activeKid.level}</span>
                      <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold"><Flame size={10} className="fill-orange-400"/> {activeKid.streak} Day Streak</div>
                   </div>
                   <h1 className="text-4xl font-black italic tracking-tight">{activeKid.name}</h1>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Wallet</p>
                   <p className="text-3xl font-black text-white">₹{activeKid.credits}</p>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Sparkles size={16} className="mx-auto text-yellow-400 mb-1"/>
                   <div className="text-xs font-bold">{activeKid.xp}</div>
                   <div className="text-[8px] text-slate-500 uppercase">Wisdom</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <BicepsFlexed size={16} className="mx-auto text-red-400 mb-1"/>
                   <div className="text-xs font-bold">{activeKid.str}</div>
                   <div className="text-[8px] text-slate-500 uppercase">Body</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Brain size={16} className="mx-auto text-indigo-400 mb-1"/>
                   <div className="text-xs font-bold">{activeKid.eq}</div>
                   <div className="text-[8px] text-slate-500 uppercase">EQ</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Battery size={16} className={`mx-auto mb-1 ${activeKid.battery < 30 ? 'text-red-500' : 'text-green-400'}`}/>
                   <div className="text-xs font-bold">{activeKid.battery}%</div>
                   <div className="text-[8px] text-slate-500 uppercase">Energy</div>
                </div>
             </div>

             {isParentMode && (
               <div className="space-y-2 pt-2 border-t border-slate-800">
                 <div className="flex gap-2">
                    <button onClick={() => updateStat(activeKid.id, 'battery', -20)} className="flex-1 bg-red-900/40 text-red-300 text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1"><AlertTriangle size={10}/> Drain</button>
                    <button onClick={() => updateStat(activeKid.id, 'battery', 20)} className="flex-1 bg-green-900/40 text-green-300 text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1"><Zap size={10}/> Boost</button>
                    <button onClick={() => updateStat(activeKid.id, 'streak', 1)} className="flex-1 bg-orange-900/40 text-orange-300 text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1"><Flame size={10}/> Streak</button>
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* TABS */}
        {activeTab === 'HERO' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Daily Protocol</h2>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
              <button onClick={() => toggleDharma('bed')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${(activeKid.dharma as any).bed ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg"><Crown size={18} className="text-yellow-400"/></div>
                    <div className="text-left"><div className="text-sm font-bold">Order</div><div className="text-[10px] text-slate-500">Make Bed / Pack Bag</div></div>
                 </div>
                 {(activeKid.dharma as any).bed ? <CheckCircle size={24} className="text-green-500"/> : <div className="h-6 w-6 rounded-full border-2 border-slate-700"/>}
              </button>
              <button onClick={() => toggleDharma('teeth')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${(activeKid.dharma as any).teeth ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg"><Crown size={18} className="text-yellow-400"/></div>
                    <div className="text-left"><div className="text-sm font-bold">Hygiene</div><div className="text-[10px] text-slate-500">Brush & Bath</div></div>
                 </div>
                 {(activeKid.dharma as any).teeth ? <CheckCircle size={24} className="text-green-500"/> : <div className="h-6 w-6 rounded-full border-2 border-slate-700"/>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'DOJO' && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl text-center mb-6">
                 <BicepsFlexed size={32} className="mx-auto text-red-500 mb-2"/>
                 <h2 className="text-xl font-black text-red-100 uppercase italic">The Dojo</h2>
                 <p className="text-xs text-red-300/70">Train Body. Earn Strength.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 {EXERCISES.map(ex => (
                    <div key={ex.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 relative">
                       <div className="text-2xl mb-2">{ex.icon}</div>
                       <div className="font-bold text-sm">{ex.name}</div>
                       <div className="text-[10px] text-slate-400 mb-2">{ex.desc}</div>
                       <div className="text-[10px] text-slate-500 mt-1 flex gap-2">
                          <span className="text-red-400">+{ex.str} STR</span>
                          <span className="text-blue-400">+{ex.xp} XP</span>
                       </div>
                       {isParentMode ? (
                         <button onClick={() => { updateStat(activeKid.id, 'str', ex.str); updateStat(activeKid.id, 'xp', ex.xp); }} className="mt-3 w-full bg-red-600 text-white text-[10px] font-bold py-2 rounded">Verify</button>
                       ) : <div className="mt-3 w-full bg-slate-800 text-slate-600 text-[10px] font-bold py-2 rounded text-center">Ask Dad</div>}
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'MIND' && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl text-center mb-6">
                 <Brain size={32} className="mx-auto text-indigo-400 mb-2"/>
                 <h2 className="text-xl font-black text-indigo-100 uppercase italic">Emotion Lab</h2>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
                 <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">How do you feel?</h3>
                 <div className="grid grid-cols-3 gap-2">
                    {MOODS.map(m => (
                       <button key={m.label} onClick={() => handleMoodSelect(m)} className="flex flex-col items-center bg-slate-800 p-2 rounded-xl border border-slate-700 hover:bg-slate-700">
                          <span className="text-2xl mb-1">{m.icon}</span>
                          <span className="text-[10px] font-bold">{m.label}</span>
                       </button>
                    ))}
                 </div>
                 {currentMoodAdvice && (
                    <div className="mt-4 bg-blue-600/20 border border-blue-500/50 p-3 rounded-xl text-center animate-in zoom-in duration-300">
                       <p className="text-sm font-bold text-blue-200">{currentMoodAdvice}</p>
                    </div>
                 )}
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                 <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Memory Vault</h3>
                 <div className="flex gap-2">
                    <input value={newLog} onChange={e => setNewLog(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 text-sm focus:outline-none" placeholder="What happened today?" />
                    <button onClick={addSoulLog} className="bg-indigo-600 px-4 rounded-lg font-bold text-xs">Save</button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'GUILD' && (
           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              {isParentMode && (
                <button onClick={() => setShowAddQuest(true)} className="w-full border-2 border-dashed border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-900 hover:text-white transition mb-4">
                  <Plus size={16}/> <span className="font-bold text-xs">Add New Mission</span>
                </button>
              )}
              {quests.map(q => (
                <div key={q.id} className={`bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between transition-all ${activeKid.battery < 30 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl border border-slate-700">{q.icon}</div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{q.title}</h3>
                        <div className="text-[10px] text-slate-500">{q.desc}</div>
                        <div className="flex gap-2 mt-1">
                           <span className={`text-[10px] px-2 rounded font-bold ${q.reward > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-700 text-slate-400'}`}>{q.reward > 0 ? `₹${q.reward}` : 'Honor'}</span>
                           <span className="text-[10px] text-blue-400 font-bold bg-blue-500/20 px-2 rounded">+{q.xp} XP</span>
                        </div>
                      </div>
                   </div>
                   {isParentMode ? (
                     <div className="flex gap-1">
                        <button onClick={() => handleDeleteQuest(q.id)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                        <button onClick={() => { updateStat(activeKid.id, 'credits', q.reward); updateStat(activeKid.id, 'xp', q.xp); }} className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-xs">Verify</button>
                     </div>
                   ) : <Lock size={16} className="text-slate-600"/>}
                </div>
              ))}
              {activeKid.battery < 30 && (
                <div className="text-center text-red-500 text-xs font-bold mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/50">
                   ⚠️ LOW BATTERY: Missions Locked. Rest Required.
                </div>
              )}
           </div>
        )}
      
      {isParentMode && (
          <div className="text-center mt-10 opacity-50 pb-4">
              <button onClick={factoryReset} className="text-[10px] text-red-500 flex items-center justify-center gap-1 mx-auto border border-red-900 p-2 rounded hover:bg-red-900/20">
                  <RefreshCw size={10} /> Factory Reset
              </button>
              <p className="text-[8px] text-slate-600 mt-1">System {APP_VERSION}</p>
          </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2 rounded-2xl flex justify-between shadow-2xl z-50">
        {[
          { id: 'HERO', icon: <Crown size={20} />, label: 'Hero' },
          { id: 'DOJO', icon: <BicepsFlexed size={20} />, label: 'Dojo' },
          { id: 'MIND', icon: <Brain size={20} />, label: 'Mind' },
          { id: 'GUILD', icon: <Zap size={20} />, label: 'Guild' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            {tab.icon} <span className="text-[10px] font-bold mt-1">{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
