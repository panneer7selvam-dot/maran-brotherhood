"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Crown, Heart, ShoppingBag, 
  BookOpen, Shield, Battery, Users, 
  CheckCircle, Lock, Unlock, Flame,
  Trash2, Plus, X, Star, Smile, ThumbsUp
} from 'lucide-react';

// --- 1. REALISTIC DATA CONFIGURATION ---

const INITIAL_KIDS = [
  { 
    id: '1', name: 'Aniv', baseAvatar: '🦁', credits: 150, xp: 850, level: 5, battery: 80, streak: 4, 
    // Updated Dharma: Bed (Order), Plate (Manners), Teeth (Hygiene)
    dharma: { bed: false, plate: false, teeth: false }, 
    color: 'from-blue-600 to-indigo-600'
  },
  { 
    id: '2', name: 'Thiru', baseAvatar: '🐯', credits: 50, xp: 420, level: 3, battery: 90, streak: 12,
    dharma: { bed: false, plate: false, teeth: false }, 
    color: 'from-orange-500 to-red-600'
  }
];

const INITIAL_QUESTS = [
  // --- TIER 1: DUTY (0 Credits - The Bare Minimum) ---
  { id: 1, title: 'Homework Finished', type: 'DUTY', reward: 0, xp: 20, icon: '📝', desc: 'Complete before dinner.' },
  { id: 2, title: 'School Bag Ready', type: 'DUTY', reward: 0, xp: 10, icon: '🎒', desc: 'Packed for tomorrow.' },

  // --- TIER 2: HOUSE HELP (Low Pay - Motor Skills) ---
  { id: 3, title: 'Fill Water Bottles', type: 'WORK', reward: 2, xp: 5, icon: '💧', desc: 'Fill all fridge bottles.' },
  { id: 4, title: 'Fold Laundry', type: 'WORK', reward: 5, xp: 15, icon: '👕', desc: 'Fold 10 items of clothing.' },
  { id: 5, title: 'Toy Sort', type: 'WORK', reward: 5, xp: 10, icon: '🧸', desc: 'Put all toys in correct bins.' },

  // --- TIER 3: HARD LABOR (Real Pay - Effort) ---
  { id: 6, title: 'Car/Bike Wash', type: 'JOB', reward: 20, xp: 50, icon: '🚗', desc: 'Wash with soap & water.' },
  { id: 7, title: 'Clean Ceiling Fan', type: 'JOB', reward: 15, xp: 30, icon: '🧹', desc: 'Wipe dust (Ask Dad for help).' },
  
  // --- TIER 4: IRON MIND (Character Building) ---
  { id: 8, title: 'The Truth Bomb', type: 'IRON', reward: 0, xp: 100, icon: '💣', desc: 'Admit a mistake voluntarily.' },
];

export default function MaranBrotherhoodAdmin() {
  // --- STATE ---
  const [kids, setKids] = useState(INITIAL_KIDS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [soulLogs, setSoulLogs] = useState<{id: number, kidId: string, text: string, mood: string, date: string}[]>([]);
  
  const [selectedId, setSelectedId] = useState('1');
  const [activeTab, setActiveTab] = useState('HQ'); 
  const [isParentMode, setIsParentMode] = useState(false);
  
  // Modals
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  // Add Quest State
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: '', reward: 0, xp: 10, icon: '⭐', type: 'WORK' });

  // Soul Log State
  const [newLog, setNewLog] = useState({ text: '', mood: 'Happy' });

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedKids = localStorage.getItem('maran_kids_v5');
    const savedQuests = localStorage.getItem('maran_quests_v5');
    const savedLogs = localStorage.getItem('maran_logs_v5');
    if (savedKids) setKids(JSON.parse(savedKids));
    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedLogs) setSoulLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('maran_kids_v5', JSON.stringify(kids));
    localStorage.setItem('maran_quests_v5', JSON.stringify(quests));
    localStorage.setItem('maran_logs_v5', JSON.stringify(soulLogs));
  }, [kids, quests, soulLogs]);

  const activeKid = kids.find(k => k.id === selectedId) || kids[0];

  // --- ACTIONS ---
  const handlePinSubmit = () => {
    if (pinInput === '1234') { 
      setIsParentMode(true); setShowPinPad(false); setPinInput('');
    } else {
      setPinInput(''); alert('Wrong PIN');
    }
  };

  const updateStat = (id: string, field: string, value: number) => {
    setKids(kids.map(k => {
      if (k.id !== id) return k;
      let newVal = (k[field as keyof typeof k] as number) + value;
      if (field === 'battery') newVal = Math.min(100, Math.max(0, newVal));
      let newLevel = k.level;
      if (field === 'xp') newLevel = Math.floor(newVal / 500) + 1;
      return { ...k, [field]: newVal, level: newLevel };
    }));
  };

  const toggleDharma = (task: string) => {
    setKids(kids.map(k => k.id === activeKid.id ? {
      ...k, dharma: { ...k.dharma, [task]: !k.dharma[task as keyof typeof k.dharma] }
    } : k));
  };

  // --- QUEST MANAGEMENT (ADD/DELETE) ---
  const handleDeleteQuest = (id: number) => {
    if (confirm('Are you sure you want to delete this mission?')) {
      setQuests(quests.filter(q => q.id !== id));
    }
  };

  const handleAddQuest = () => {
    if (!newQuest.title) return;
    const quest = {
      id: Date.now(), // Unique ID
      title: newQuest.title,
      reward: Number(newQuest.reward),
      xp: Number(newQuest.xp),
      icon: newQuest.icon,
      type: newQuest.type,
      desc: 'Custom Mission'
    };
    setQuests([...quests, quest]);
    setShowAddQuest(false);
    setNewQuest({ title: '', reward: 0, xp: 10, icon: '⭐', type: 'WORK' });
  };

  const addSoulLog = () => {
    if(!newLog.text) return;
    const log = { id: Date.now(), kidId: activeKid.id, text: newLog.text, mood: newLog.mood, date: new Date().toLocaleDateString() };
    setSoulLogs([log, ...soulLogs]);
    setNewLog({ text: '', mood: 'Happy' });
  };

  const getEvolvedAvatar = (base: string, level: number) => {
    if (level < 5) return base; 
    if (level < 10) return `${base}⚔️`; 
    return `${base}👑`; 
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white pb-24 select-none relative">
      
      {/* --- MODAL: ADD QUEST --- */}
      {showAddQuest && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Mission</h2>
              <button onClick={() => setShowAddQuest(false)}><X size={20}/></button>
            </div>
            
            <label className="text-xs text-slate-500 font-bold uppercase">Mission Title</label>
            <input 
              className="w-full bg-slate-800 p-3 rounded-lg mb-3 border border-slate-700 focus:border-blue-500 outline-none" 
              placeholder="e.g. Wash Windows" 
              value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})}
            />

            <div className="flex gap-2 mb-3">
              <div className="w-1/2">
                <label className="text-xs text-slate-500 font-bold uppercase">Reward (₹)</label>
                <input 
                  type="number" className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" 
                  value={newQuest.reward} onChange={e => setNewQuest({...newQuest, reward: Number(e.target.value)})}
                />
              </div>
              <div className="w-1/2">
                <label className="text-xs text-slate-500 font-bold uppercase">XP</label>
                <input 
                  type="number" className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700" 
                  value={newQuest.xp} onChange={e => setNewQuest({...newQuest, xp: Number(e.target.value)})}
                />
              </div>
            </div>

            <label className="text-xs text-slate-500 font-bold uppercase">Type</label>
            <div className="flex gap-2 mb-4">
               {['DUTY', 'WORK', 'JOB'].map(t => (
                 <button 
                   key={t}
                   onClick={() => setNewQuest({...newQuest, type: t, reward: t === 'DUTY' ? 0 : newQuest.reward})}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold ${newQuest.type === t ? 'bg-blue-600' : 'bg-slate-800'}`}
                 >
                   {t}
                 </button>
               ))}
            </div>

            <button onClick={handleAddQuest} className="w-full bg-green-600 py-3 rounded-lg font-bold">Create Mission</button>
          </div>
        </div>
      )}

      {/* --- MODAL: PIN PAD --- */}
      {showPinPad && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm text-center border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-red-500">Parent Access</h2>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4].map((_, i) => <div key={i} className={`h-4 w-4 rounded-full ${pinInput.length > i ? 'bg-white' : 'bg-slate-700'}`} />)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6,7,8,9,0].map(n => (
                <button key={n} onClick={() => setPinInput(p => (p + n).slice(0,4))} className="h-14 bg-slate-800 rounded-xl font-bold text-xl">{n}</button>
              ))}
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
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Family Bank</p>
                <p className="text-yellow-400 font-black text-lg">₹{kids.reduce((a, b) => a + b.credits, 0)}</p>
             </div>
             <button onClick={() => isParentMode ? setIsParentMode(false) : setShowPinPad(true)} className={`h-10 w-10 rounded-full flex items-center justify-center ${isParentMode ? 'bg-red-500 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
               {isParentMode ? <Unlock size={18} /> : <Lock size={18} />}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">

        {/* HERO CARD */}
        <div className={`rounded-3xl p-6 bg-gradient-to-br ${activeKid.color} shadow-lg relative overflow-hidden`}>
           <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="bg-black/20 text-[10px] font-bold px-2 py-1 rounded uppercase border border-white/10">Level {activeKid.level}</span>
                <h1 className="text-4xl font-black mt-1">{activeKid.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full border border-white/10">
                     <Flame size={12} className={activeKid.streak > 0 ? "text-orange-400 fill-orange-400" : "text-slate-400"} />
                     <span className="text-xs font-bold">{activeKid.streak} Day Streak</span>
                   </div>
                   {isParentMode && <button onClick={() => updateStat(activeKid.id, 'streak', 1)} className="bg-white/20 px-2 rounded text-[10px] font-bold">+1</button>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold opacity-80 uppercase">Wallet</span>
                <div className="text-4xl font-black drop-shadow-md">₹{activeKid.credits}</div>
              </div>
           </div>
           
           {/* PARENT QUICK ACTIONS */}
           {isParentMode && (
             <div className="mt-4 grid grid-cols-4 gap-2 bg-black/20 p-2 rounded-xl backdrop-blur-md">
               <button onClick={() => updateStat(activeKid.id, 'credits', -10)} className="bg-red-500/80 text-white py-2 rounded-lg text-xs font-bold">-₹10</button>
               <button onClick={() => updateStat(activeKid.id, 'credits', +5)} className="bg-white/20 text-white py-2 rounded-lg text-xs font-bold">+₹5</button>
               <button onClick={() => updateStat(activeKid.id, 'credits', +20)} className="bg-white/20 text-white py-2 rounded-lg text-xs font-bold">+₹20</button>
               <button onClick={() => updateStat(activeKid.id, 'xp', +50)} className="bg-blue-500/80 text-white py-2 rounded-lg text-xs font-bold">+XP</button>
             </div>
           )}

           {/* BATTERY */}
           <div className="mt-4 bg-black/30 rounded-xl p-3 border border-white/10">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-xs font-bold flex items-center gap-1"><Battery size={14}/> Energy</span>
                 <span className={`text-xs font-bold ${activeKid.battery < 30 ? 'text-red-300' : 'text-green-300'}`}>{activeKid.battery}%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${activeKid.battery < 30 ? 'bg-red-500' : 'bg-green-400'}`} style={{width: `${activeKid.battery}%`}}></div>
              </div>
              {isParentMode && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => updateStat(activeKid.id, 'battery', -20)} className="flex-1 bg-red-500/30 text-red-200 text-[10px] font-bold py-1 rounded">Drain (Bad Food)</button>
                  <button onClick={() => updateStat(activeKid.id, 'battery', +20)} className="flex-1 bg-green-500/30 text-green-200 text-[10px] font-bold py-1 rounded">Recharge (Sleep)</button>
                </div>
              )}
           </div>
        </div>

        {/* TABS: HQ (DUTY) */}
        {activeTab === 'HQ' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-center text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">MARAN BROTHERHOOD</h1>
            
            {/* REALISTIC DHARMA CARD */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
               <h2 className="text-sm font-bold text-slate-400 uppercase mb-4 flex gap-2"><Shield size={16} className="text-blue-400"/> Daily Dharma (Zero Pay)</h2>
               
               <div className="space-y-3">
                 {/* BED (ORDER) */}
                 <button onClick={() => toggleDharma('bed')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between ${activeKid.dharma.bed ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                   <div className="text-left">
                     <span className="text-xs font-bold uppercase block">1. Order</span>
                     <span className="text-[10px] opacity-70">Bed Made & Bag Packed</span>
                   </div>
                   {activeKid.dharma.bed ? <CheckCircle size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-slate-600"/>}
                 </button>

                 {/* PLATE (MANNERS) */}
                 <button onClick={() => toggleDharma('plate')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between ${activeKid.dharma.plate ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                   <div className="text-left">
                     <span className="text-xs font-bold uppercase block">2. Manners</span>
                     <span className="text-[10px] opacity-70">Clean Plate & Uniform Hung</span>
                   </div>
                   {activeKid.dharma.plate ? <CheckCircle size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-slate-600"/>}
                 </button>

                 {/* TEETH (HYGIENE) */}
                 <button onClick={() => toggleDharma('teeth')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between ${(activeKid.dharma as any).teeth ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                   <div className="text-left">
                     <span className="text-xs font-bold uppercase block">3. Hygiene</span>
                     <span className="text-[10px] opacity-70">Brushed Teeth & Shower</span>
                   </div>
                   {(activeKid.dharma as any).teeth ? <CheckCircle size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-slate-600"/>}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* TABS: WORK */}
        {activeTab === 'WORK' && (
           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              
              {/* ADD BUTTON (PARENT ONLY) */}
              {isParentMode && (
                <button onClick={() => setShowAddQuest(true)} className="w-full border-2 border-dashed border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-900 hover:text-white transition mb-4">
                  <Plus size={20} /> <span className="font-bold">Add New Mission</span>
                </button>
              )}

              {quests.map(q => (
                <div key={q.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl border border-slate-700">{q.icon}</div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{q.title}</h3>
                        <p className="text-[10px] text-slate-500">{q.desc}</p>
                        <div className="flex gap-2 mt-1">
                           <span className={`text-[10px] px-2 rounded font-bold ${q.reward > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-700 text-slate-400'}`}>
                             {q.reward > 0 ? `₹${q.reward}` : 'Duty'}
                           </span>
                           <span className="text-[10px] text-blue-400 font-bold bg-blue-500/20 px-2 rounded">+{q.xp} XP</span>
                        </div>
                      </div>
                   </div>
                   {isParentMode ? (
                     <div className="flex items-center gap-2">
                       <button onClick={() => handleDeleteQuest(q.id)} className="bg-slate-800 text-slate-600 p-2 rounded-lg hover:text-red-500"><Trash2 size={16}/></button>
                       <button onClick={() => { updateStat(activeKid.id, 'credits', q.reward); updateStat(activeKid.id, 'xp', q.xp); }} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg font-bold text-xs">Approve</button>
                     </div>
                   ) : <Lock size={16} className="text-slate-600"/>}
                </div>
              ))}
           </div>
        )}

        {/* TABS: SOUL */}
        {activeTab === 'SOUL' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-teal-950/30 border border-teal-900/50 p-6 rounded-2xl text-center mb-6">
              <Heart className="mx-auto text-teal-400 mb-2" size={32} />
              <h2 className="text-xl font-serif text-teal-200">Gratitude Journal</h2>
            </div>
            {/* NEW ENTRY INPUT */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
               <textarea 
                 value={newLog.text}
                 onChange={(e) => setNewLog({...newLog, text: e.target.value})}
                 placeholder="Type your answer here..."
                 className="w-full bg-slate-800 text-white p-3 rounded-lg text-sm border border-slate-700 mb-3 focus:outline-none focus:border-teal-500"
                 rows={3}
               />
               <div className="flex justify-between items-center">
                 <div className="flex gap-2">
                   {['Happy', 'Proud', 'Thankful'].map(m => (
                     <button key={m} onClick={() => setNewLog({...newLog, mood: m})} className={`p-2 rounded-full ${newLog.mood === m ? 'bg-teal-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                       {m === 'Happy' && <Smile size={16}/>}
                       {m === 'Proud' && <Star size={16}/>}
                       {m === 'Thankful' && <ThumbsUp size={16}/>}
                     </button>
                   ))}
                 </div>
                 <button onClick={addSoulLog} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-xs">Save</button>
               </div>
            </div>
            {/* LOG HISTORY */}
            <div className="space-y-3">
              {soulLogs.filter(l => l.kidId === activeKid.id).map(log => (
                <div key={log.id} className="bg-slate-900 p-4 rounded-xl border-l-2 border-teal-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-teal-500 uppercase">{log.mood} • {log.date}</span>
                  </div>
                  <p className="text-sm text-slate-300 italic">"{log.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2 rounded-2xl flex justify-between shadow-2xl z-50">
        {[
          { id: 'HQ', icon: <Crown size={20} />, label: 'HQ' },
          { id: 'WORK', icon: <Zap size={20} />, label: 'Work' },
          { id: 'SOUL', icon: <BookOpen size={20} />, label: 'Soul' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            {tab.icon} <span className="text-[10px] font-bold mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
