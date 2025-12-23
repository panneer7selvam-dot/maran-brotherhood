"use client";

import React, { useState, useEffect } from 'react';
import { 
  Crown, Brain, BicepsFlexed, Zap,
  CheckCircle, Lock, Unlock, Flame,
  Trash2, Plus, X, AlertTriangle, RefreshCw,
  Sparkles, Battery, Delete
} from 'lucide-react';

const APP_VERSION = "v17.0 (Pin Fixed)";

// --- DEFAULTS ---
const DEFAULT_KIDS = [
  { id: '1', name: 'Aniv', baseAvatar: '🦁', credits: 0, xp: 0, level: 1, str: 10, eq: 10, battery: 80, streak: 0, dharma: {}, color: 'from-blue-600 to-indigo-600' },
  { id: '2', name: 'Thiru', baseAvatar: '🐯', credits: 0, xp: 0, level: 1, str: 10, eq: 10, battery: 80, streak: 0, dharma: {}, color: 'from-orange-500 to-red-600' }
];

const DEFAULT_HABITS = [
  { id: 1, title: 'Make Bed', icon: '🛏️' },
  { id: 2, title: 'Brush Teeth', icon: '🪥' },
  { id: 3, title: 'Pack Bag', icon: '🎒' }
];

const DEFAULT_EXERCISES = [
  { id: 1, name: 'Frog Jumps', xp: 15, str: 5, icon: '🐸' },
  { id: 2, name: 'Bear Crawl', xp: 15, str: 5, icon: '🐻' },
  { id: 3, name: 'Pushups', xp: 20, str: 10, icon: '💪' }
];

const DEFAULT_QUESTS = [
  { id: 1, title: 'Greet Guest', reward: 0, xp: 20, icon: '🤝' },
  { id: 2, title: 'Fold Laundry', reward: 5, xp: 10, icon: '👕' },
  { id: 3, title: 'Wash Vehicle', reward: 20, xp: 50, icon: '🚗' },
];

const MOODS = [
  { label: 'Happy', icon: '😄', advice: 'Spread sunshine!' },
  { label: 'Bored', icon: '😐', advice: 'Build something.' },
  { label: 'Sad', icon: '😢', advice: 'Ask for a hug.' },
  { label: 'Angry', icon: '😡', advice: '5 Deep Breaths.' },
  { label: 'Proud', icon: '🤩', advice: 'Pat your back!' },
];

export default function MaranEcosystem() {
  // --- STATE ---
  const [kids, setKids] = useState(DEFAULT_KIDS);
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES);
  const [quests, setQuests] = useState(DEFAULT_QUESTS);
  const [soulLogs, setSoulLogs] = useState<{id: number, kidId: string, text: string, date: string}[]>([]);
  
  const [selectedId, setSelectedId] = useState('1');
  const [activeTab, setActiveTab] = useState('GUILD'); 
  const [isParentMode, setIsParentMode] = useState(false);
  
  // Modals
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  // Creator State
  const [creatorMode, setCreatorMode] = useState<'HABIT' | 'EXERCISE' | 'QUEST' | null>(null);
  const [newItem, setNewItem] = useState({ title: '', icon: '⭐', reward: 0, xp: 10, str: 0 });
  const [newLog, setNewLog] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    if (localStorage.getItem('maran_kids_v17')) setKids(JSON.parse(localStorage.getItem('maran_kids_v17')!));
    if (localStorage.getItem('maran_habits_v17')) setHabits(JSON.parse(localStorage.getItem('maran_habits_v17')!));
    if (localStorage.getItem('maran_exercises_v17')) setExercises(JSON.parse(localStorage.getItem('maran_exercises_v17')!));
    if (localStorage.getItem('maran_quests_v17')) setQuests(JSON.parse(localStorage.getItem('maran_quests_v17')!));
    if (localStorage.getItem('maran_logs_v17')) setSoulLogs(JSON.parse(localStorage.getItem('maran_logs_v17')!));
  }, []);

  useEffect(() => {
    localStorage.setItem('maran_kids_v17', JSON.stringify(kids));
    localStorage.setItem('maran_habits_v17', JSON.stringify(habits));
    localStorage.setItem('maran_exercises_v17', JSON.stringify(exercises));
    localStorage.setItem('maran_quests_v17', JSON.stringify(quests));
    localStorage.setItem('maran_logs_v17', JSON.stringify(soulLogs));
  }, [kids, habits, exercises, quests, soulLogs]);

  const activeKid = kids.find(k => k.id === selectedId) || kids[0];
  const currentDharma = (activeKid.dharma || {}) as any;

  // --- ACTIONS ---
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Fixed PIN Logic
  const handlePinDigit = (digit: number) => {
    if (pinInput.length < 4) {
      setPinInput(prev => prev + digit.toString());
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (pinInput === '1234') { 
      setIsParentMode(true); 
      setShowPinPad(false); 
      setPinInput(''); 
      showToast("Parent Mode Unlocked");
    } else { 
      alert('Wrong PIN'); 
      setPinInput(''); 
    }
  };

  const updateStat = (id: string, updates: any) => {
    setKids(prev => prev.map(k => {
      if (k.id !== id) return k;
      const newKid = { ...k };
      
      if(updates.credits) newKid.credits = Math.max(0, (newKid.credits || 0) + updates.credits);
      if(updates.xp) newKid.xp = (newKid.xp || 0) + updates.xp;
      if(updates.str) newKid.str = (newKid.str || 0) + updates.str;
      if(updates.eq) newKid.eq = (newKid.eq || 0) + updates.eq;
      
      if(updates.battery) newKid.battery = Math.min(100, Math.max(0, (newKid.battery || 0) + updates.battery));
      
      newKid.level = Math.floor((newKid.xp || 0) / 500) + 1;
      return newKid;
    }));
    if(updates.xp) showToast(`+${updates.xp} XP!`);
    if(updates.credits) showToast(`+₹${updates.credits}!`);
  };

  const toggleDharma = (habitId: string) => {
    setKids(prev => prev.map(k => {
      if (k.id !== activeKid.id) return k;
      const d = { ...k.dharma } as any;
      const isDone = !d[habitId];
      d[habitId] = isDone;
      if(isDone) showToast("Habit Done! +5 XP");
      return { ...k, dharma: d, xp: isDone ? k.xp + 5 : k.xp };
    }));
  };

  // --- CREATOR LOGIC ---
  const handleCreateItem = () => {
    if (!newItem.title) return;
    const id = Date.now();
    
    if (creatorMode === 'HABIT') {
      setHabits([...habits, { id, title: newItem.title, icon: newItem.icon }]);
    } else if (creatorMode === 'EXERCISE') {
      setExercises([...exercises, { id, name: newItem.title, icon: newItem.icon, xp: newItem.xp, str: newItem.str }]);
    } else if (creatorMode === 'QUEST') {
      setQuests([...quests, { id, title: newItem.title, icon: newItem.icon, reward: newItem.reward, xp: newItem.xp }]);
    }
    
    setCreatorMode(null);
    setNewItem({ title: '', icon: '⭐', reward: 0, xp: 10, str: 0 });
  };

  const deleteItem = (type: string, id: number) => {
    if(!confirm("Delete this item?")) return;
    if(type === 'HABIT') setHabits(habits.filter(h => h.id !== id));
    if(type === 'EXERCISE') setExercises(exercises.filter(e => e.id !== id));
    if(type === 'QUEST') setQuests(quests.filter(q => q.id !== id));
  };

  const addSoulLog = () => {
    if(!newLog) return;
    setSoulLogs([{ id: Date.now(), kidId: activeKid.id, text: newLog, date: new Date().toLocaleDateString() }, ...soulLogs]);
    setNewLog('');
    updateStat(activeKid.id, { eq: 10 });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28 font-sans select-none relative overflow-x-hidden">
      
      {/* TOAST POPUP */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-yellow-400 text-black font-black px-6 py-2 rounded-full shadow-xl animate-bounce">
          {toast}
        </div>
      )}

      {/* CREATOR MODAL */}
      {creatorMode && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700">
             <h2 className="text-xl font-bold mb-4 capitalize">New {creatorMode.toLowerCase()}</h2>
             <div className="space-y-3">
               <input className="w-full bg-slate-800 p-3 rounded-lg" placeholder="Title / Name" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
               <input className="w-full bg-slate-800 p-3 rounded-lg" placeholder="Icon (Emoji)" value={newItem.icon} onChange={e => setNewItem({...newItem, icon: e.target.value})} />
               
               {(creatorMode === 'QUEST' || creatorMode === 'EXERCISE') && (
                 <div className="flex gap-2">
                   <input type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg" placeholder="XP" value={newItem.xp} onChange={e => setNewItem({...newItem, xp: Number(e.target.value)})} />
                   {creatorMode === 'QUEST' && <input type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg" placeholder="₹ Money" value={newItem.reward} onChange={e => setNewItem({...newItem, reward: Number(e.target.value)})} />}
                   {creatorMode === 'EXERCISE' && <input type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg" placeholder="STR" value={newItem.str} onChange={e => setNewItem({...newItem, str: Number(e.target.value)})} />}
                 </div>
               )}
             </div>
             <button onClick={handleCreateItem} className="w-full bg-green-600 py-3 rounded-lg font-bold mt-4">Create</button>
             <button onClick={() => setCreatorMode(null)} className="w-full mt-2 text-slate-500 text-xs">Cancel</button>
          </div>
        </div>
      )}

      {/* PIN PAD */}
      {showPinPad && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm text-center border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-red-500">Parent Access</h2>
            
            {/* Dots */}
            <div className="flex justify-center gap-4 mb-8">
              {[0,1,2,3].map(i => (
                <div key={i} className={`h-4 w-4 rounded-full border-2 border-slate-600 transition-all ${pinInput.length > i ? 'bg-white border-white scale-110' : 'bg-transparent'}`} />
              ))}
            </div>

            {/* Keys */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} onClick={() => handlePinDigit(n)} className="h-16 rounded-xl bg-slate-800 font-bold text-2xl active:bg-slate-700 transition-colors shadow-lg border-b-4 border-slate-950 active:border-b-0 active:translate-y-1">{n}</button>
              ))}
              <button onClick={handleBackspace} className="h-16 rounded-xl bg-red-900/30 text-red-400 font-bold text-lg flex items-center justify-center active:bg-red-900/50">⌫</button>
              <button onClick={() => handlePinDigit(0)} className="h-16 rounded-xl bg-slate-800 font-bold text-2xl active:bg-slate-700 shadow-lg border-b-4 border-slate-950 active:border-b-0 active:translate-y-1">0</button>
              <button onClick={handlePinSubmit} className="h-16 rounded-xl bg-green-600 font-bold text-lg flex items-center justify-center active:bg-green-700 shadow-lg border-b-4 border-green-900 active:border-b-0 active:translate-y-1">OK</button>
            </div>
            
            <button onClick={() => {setShowPinPad(false); setPinInput('');}} className="text-slate-500 text-sm py-2 px-4 rounded-lg hover:bg-slate-800">Cancel</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div className="flex gap-2">
          {kids.map(k => (
            <button key={k.id} onClick={() => setSelectedId(k.id)} className={`h-10 w-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${k.color} transition-all ${activeKid.id === k.id ? 'ring-2 ring-white scale-110' : 'opacity-50'}`}>
              {k.level < 5 ? k.baseAvatar : k.baseAvatar + '👑'}
            </button>
          ))}
        </div>
        <button onClick={() => isParentMode ? setIsParentMode(false) : setShowPinPad(true)} className={`h-10 w-10 rounded-full flex items-center justify-center ${isParentMode ? 'bg-red-500 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
           {isParentMode ? <Unlock size={18} /> : <Lock size={18} />}
        </button>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">

        {/* ID CARD */}
        <div className={`rounded-3xl p-1 bg-gradient-to-br ${activeKid.color} shadow-2xl`}>
           <div className="bg-slate-900/90 rounded-[22px] p-5 backdrop-blur-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider">Lvl {activeKid.level} Hero</span>
                      <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold"><Flame size={10} className="fill-orange-400"/> {activeKid.streak}</div>
                   </div>
                   <h1 className="text-4xl font-black italic tracking-tight">{activeKid.name}</h1>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Wealth</p>
                   <p className="text-3xl font-black text-white">₹{activeKid.credits}</p>
                </div>
             </div>

             {/* Progress Bar */}
             <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-1000" style={{ width: `${(activeKid.xp % 500) / 5}%` }}></div>
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
                   <div className="text-[8px] text-slate-500 uppercase">Mind</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Battery size={16} className={`mx-auto mb-1 ${activeKid.battery < 30 ? 'text-red-500' : 'text-green-400'}`}/>
                   <div className="text-xs font-bold">{activeKid.battery}%</div>
                   <div className="text-[8px] text-slate-500 uppercase">Energy</div>
                </div>
             </div>

             {isParentMode && (
               <div className="space-y-2 pt-2 border-t border-slate-800">
                 <div className="grid grid-cols-4 gap-1">
                    <button onClick={() => updateStat(activeKid.id, { credits: 10 })} className="bg-yellow-500/10 text-yellow-300 text-[10px] font-bold py-2 rounded border border-yellow-500/20">+₹10</button>
                    <button onClick={() => updateStat(activeKid.id, { xp: 50 })} className="bg-blue-500/10 text-blue-300 text-[10px] font-bold py-2 rounded border border-blue-500/20">+XP</button>
                    <button onClick={() => updateStat(activeKid.id, { battery: -20 })} className="bg-red-900/40 text-red-300 text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1"><AlertTriangle size={10}/> Drain</button>
                    <button onClick={() => updateStat(activeKid.id, { battery: 20 })} className="bg-green-900/40 text-green-300 text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1"><Zap size={10}/> Boost</button>
                 </div>
                 <button onClick={() => { if(confirm("Clear local storage?")) localStorage.clear(); window.location.reload(); }} className="w-full text-[9px] text-slate-500 mt-2">Factory Reset</button>
               </div>
             )}
           </div>
        </div>

        {/* --- GUILD TAB --- */}
        {activeTab === 'GUILD' && (
           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center px-1">
                 <h2 className="text-xs font-bold text-slate-500 uppercase">Mission Board</h2>
                 {isParentMode && <button onClick={() => setCreatorMode('QUEST')} className="flex items-center gap-1 text-blue-400 text-xs font-bold bg-blue-500/10 px-2 py-1 rounded"><Plus size={12}/> New Job</button>}
              </div>
              
              {quests.map(q => (
                <div key={q.id} className={`bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center transition-all ${activeKid.battery < 30 ? 'opacity-60' : ''}`}>
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl border border-slate-700">{q.icon}</div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{q.title}</h3>
                        <div className="flex gap-2 mt-1">
                           <span className={`text-[10px] px-2 rounded font-bold ${q.reward > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-700 text-slate-400'}`}>{q.reward > 0 ? `₹${q.reward}` : 'Duty'}</span>
                           <span className="text-[10px] text-blue-400 font-bold bg-blue-500/20 px-2 rounded">+{q.xp} XP</span>
                        </div>
                      </div>
                   </div>
                   {isParentMode ? (
                     <div className="flex gap-2">
                        <button onClick={() => deleteItem('QUEST', q.id)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={14}/></button>
                        <button onClick={() => updateStat(activeKid.id, { credits: q.reward, xp: q.xp })} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs">Verify</button>
                     </div>
                   ) : (
                     <div className="text-slate-600">
                        {activeKid.battery < 30 ? <Lock size={16} className="text-red-900" /> : <Lock size={16} />}
                     </div>
                   )}
                </div>
              ))}
              {activeKid.battery < 30 && <div className="text-center text-red-500 text-xs font-bold p-3 bg-red-900/10 rounded-lg">Low Battery. Take a break.</div>}
           </div>
        )}

        {/* --- HERO TAB --- */}
        {activeTab === 'HERO' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center px-1 mb-3">
                 <h2 className="text-xs font-bold text-slate-500 uppercase">Daily Habits</h2>
                 {isParentMode && <button onClick={() => setCreatorMode('HABIT')} className="flex items-center gap-1 text-blue-400 text-xs font-bold bg-blue-500/10 px-2 py-1 rounded"><Plus size={12}/> New Habit</button>}
            </div>
            <div className="space-y-3">
              {habits.map(h => (
                 <div key={h.id} className={`bg-slate-900 p-4 rounded-2xl border-2 flex justify-between items-center transition-all ${currentDharma[h.id] ? 'border-green-500/50' : 'border-slate-800'}`}>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-lg">{h.icon}</div>
                      <div>
                          <div className="text-sm font-bold">{h.title}</div>
                          <div className="text-[10px] text-slate-500">+5 XP</div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      {isParentMode && <button onClick={() => deleteItem('HABIT', h.id)} className="text-slate-700 hover:text-red-500 mr-2"><Trash2 size={14}/></button>}
                      <button onClick={() => toggleDharma(h.id.toString())} className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-800">
                          {currentDharma[h.id] ? <CheckCircle size={24} className="text-green-500"/> : <div className="h-5 w-5 rounded-full border-2 border-slate-600"/>}
                      </button>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* --- DOJO TAB --- */}
        {activeTab === 'DOJO' && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center px-1 mb-3">
                 <h2 className="text-xs font-bold text-slate-500 uppercase">Training</h2>
                 {isParentMode && <button onClick={() => setCreatorMode('EXERCISE')} className="flex items-center gap-1 text-blue-400 text-xs font-bold bg-blue-500/10 px-2 py-1 rounded"><Plus size={12}/> New</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                 {exercises.map(ex => (
                    <div key={ex.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 relative">
                       <div className="flex justify-between">
                          <div className="text-2xl mb-2">{ex.icon}</div>
                          {isParentMode && <button onClick={() => deleteItem('EXERCISE', ex.id)} className="text-slate-700 hover:text-red-500"><Trash2 size={14}/></button>}
                       </div>
                       <div className="font-bold text-sm">{ex.name}</div>
                       <div className="text-[10px] text-slate-500 mt-1 flex gap-2">
                          <span className="text-red-400">+{ex.str} STR</span>
                          <span className="text-blue-400">+{ex.xp} XP</span>
                       </div>
                       {isParentMode ? (
                         <button onClick={() => updateStat(activeKid.id, { str: ex.str, xp: ex.xp })} className="mt-3 w-full bg-red-900/30 text-red-300 text-[10px] font-bold py-2 rounded hover:bg-red-900/50">Verify</button>
                       ) : <div className="mt-3 w-full bg-slate-800 text-slate-600 text-[10px] font-bold py-2 rounded text-center opacity-50">Ask Dad</div>}
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- MIND TAB --- */}
        {activeTab === 'MIND' && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">How do you feel?</h3>
                 <div className="grid grid-cols-5 gap-1">
                    {MOODS.map(m => (
                       <button key={m.label} onClick={() => { showToast(m.advice); updateStat(activeKid.id, { eq: 5 }); }} className="flex flex-col items-center bg-slate-800 p-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
                          <span className="text-xl mb-1">{m.icon}</span>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                 <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Journal</h3>
                 <div className="flex gap-2">
                    <input value={newLog} onChange={e => setNewLog(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 text-sm focus:outline-none" placeholder="Enter memory..." />
                    <button onClick={addSoulLog} className="bg-indigo-600 px-4 rounded-lg font-bold text-xs">Save</button>
                 </div>
                 <div className="mt-4 space-y-2 h-40 overflow-y-auto">
                    {soulLogs.filter(l => l.kidId === activeKid.id).map(log => (
                        <div key={log.id} className="text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                            <span className="text-slate-600 mr-2">{log.date}</span>
                            {log.text}
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

      </div>

      {/* --- BOTTOM NAV --- */}
      <div className="fixed bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-2 rounded-2xl flex justify-between shadow-2xl z-50">
        <button onClick={() => setActiveTab('HERO')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'HERO' ? 'text-white' : 'text-slate-500'}`}><Crown size={20}/><span className="text-[10px] font-bold">Hero</span></button>
        <button onClick={() => setActiveTab('DOJO')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'DOJO' ? 'text-white' : 'text-slate-500'}`}><BicepsFlexed size={20}/><span className="text-[10px] font-bold">Dojo</span></button>
        <button onClick={() => setActiveTab('MIND')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'MIND' ? 'text-white' : 'text-slate-500'}`}><Brain size={20}/><span className="text-[10px] font-bold">Mind</span></button>
        <button onClick={() => setActiveTab('GUILD')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'GUILD' ? 'text-white' : 'text-slate-500'}`}><Zap size={20}/><span className="text-[10px] font-bold">Guild</span></button>
      </div>

    </div>
  );
}
// --- END ---
