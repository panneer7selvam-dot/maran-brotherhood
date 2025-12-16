"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Crown, Heart, ShoppingBag, 
  BookOpen, Shield, Battery, Users, 
  CheckCircle, Lock, Unlock, Flame,
  Trash2, Plus, X, Star, Smile, Frown, 
  Thermometer, Activity, Brain, BicepsFlexed, RefreshCw
} from 'lucide-react';

// --- CONFIGURATION v6.1 ---

const APP_VERSION = "v6.1"; // CHANGE THIS when you update to force a visual change

const INITIAL_KIDS = [
  { 
    id: '1', name: 'Aniv', baseAvatar: '🦁', 
    credits: 150, xp: 850, level: 5, str: 20, eq: 15,
    battery: 80, streak: 4, dharma: { bed: false, plate: false, teeth: false }, 
    color: 'from-blue-600 to-indigo-600'
  },
  { 
    id: '2', name: 'Thiru', baseAvatar: '🐯', 
    credits: 50, xp: 420, level: 3, str: 10, eq: 10,
    battery: 90, streak: 12, dharma: { bed: false, plate: false, teeth: false }, 
    color: 'from-orange-500 to-red-600'
  }
];

const INITIAL_QUESTS = [
  { id: 1, title: 'Homework Finished', type: 'MIND', reward: 0, xp: 20, icon: '🧠', desc: 'Mental Gym.' },
  { id: 2, title: 'School Bag Ready', type: 'DUTY', reward: 0, xp: 10, icon: '🎒', desc: 'Preparation.' },
  { id: 3, title: 'Fold Laundry', type: 'WORK', reward: 5, xp: 15, icon: '👕', desc: 'Help the base.' },
  { id: 4, title: 'Car/Bike Wash', type: 'JOB', reward: 20, xp: 50, icon: '🚗', desc: 'Hard Labor.' },
];

const MOODS = [
  { label: 'Happy', icon: '😄', advice: 'Great! Share your joy with someone.' },
  { label: 'Angry', icon: '😡', advice: 'Protocol: Take 5 deep breaths. Count to 10.' },
  { label: 'Sad', icon: '😢', advice: 'Protocol: Ask Dad for a hug. It is okay to cry.' },
  { label: 'Scared', icon: '😨', advice: 'Protocol: Name one brave thing you did today.' },
];

const EXERCISES = [
  { id: 1, name: '10 Pushups', xp: 10, str: 5, icon: '💪' },
  { id: 2, name: '20 Jumping Jacks', xp: 10, str: 5, icon: '🏃' },
  { id: 3, name: '1 Min Plank', xp: 20, str: 10, icon: '🪵' },
];

export default function MaranHeroApp() {
  const [kids, setKids] = useState(INITIAL_KIDS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [soulLogs, setSoulLogs] = useState<{id: number, kidId: string, text: string, mood: string, date: string}[]>([]);
  
  const [selectedId, setSelectedId] = useState('1');
  const [activeTab, setActiveTab] = useState('HERO'); 
  const [isParentMode, setIsParentMode] = useState(false);
  
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: '', reward: 0, xp: 10, icon: '⭐', type: 'WORK' });
  
  const [newLog, setNewLog] = useState('');
  const [currentMoodAdvice, setCurrentMoodAdvice] = useState<string | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    // Load v6.1 data. If not found, use INITIAL
    const savedKids = localStorage.getItem('maran_kids_v6_1');
    const savedQuests = localStorage.getItem('maran_quests_v6_1');
    const savedLogs = localStorage.getItem('maran_logs_v6_1');
    
    if (savedKids) setKids(JSON.parse(savedKids));
    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedLogs) setSoulLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('maran_kids_v6_1', JSON.stringify(kids));
    localStorage.setItem('maran_quests_v6_1', JSON.stringify(quests));
    localStorage.setItem('maran_logs_v6_1', JSON.stringify(soulLogs));
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

  // FACTORY RESET (Fixes "Not Updating" bugs)
  const factoryReset = () => {
    if(confirm("RESET ALL DATA? This fixes bugs but deletes current progress.")) {
        localStorage.clear();
        window.location.reload();
    }
  }

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

  const handleMoodSelect = (mood: any) => {
    setCurrentMoodAdvice(mood.advice);
    updateStat(activeKid.id, 'eq', 2);
    setTimeout(() => setCurrentMoodAdvice(null), 8000);
  };

  const addSoulLog = () => {
    if(!newLog) return;
    const log = { id: Date.now(), kidId: activeKid.id, text: newLog, mood: 'Log', date: new Date().toLocaleDateString() };
    setSoulLogs([log, ...soulLogs]);
    setNewLog('');
    updateStat(activeKid.id, 'eq', 5);
  };

  const handleAddQuest = () => {
    if (!newQuest.title) return;
    const quest = { ...newQuest, id: Date.now(), desc: 'Custom Mission' };
    setQuests([...quests, quest]);
    setShowAddQuest(false);
  };
  
  const handleDeleteQuest = (id: number) => {
    if (confirm('Delete mission?')) setQuests(quests.filter(q => q.id !== id));
  };

  const getEvolvedAvatar = (base: string, level: number) => {
    if (level < 5) return base; 
    if (level < 10) return `${base}⚔️`; 
    return `${base}👑`; 
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white pb-28 select-none relative overflow-x-hidden">
      
      {/* ADD QUEST MODAL */}
      {showAddQuest && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700">
             <h2 className="text-xl font-bold mb-4">New Mission</h2>
             <input className="w-full bg-slate-800 p-3 rounded-lg mb-3 border border-slate-700" placeholder="Title" value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} />
             <div className="flex gap-2 mb-3">
               <input type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg border border-slate-700" placeholder="₹ Reward" value={newQuest.reward} onChange={e => setNewQuest({...newQuest, reward: Number(e.target.value)})} />
               <input type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg border border-slate-700" placeholder="XP" value={newQuest.xp} onChange={e => setNewQuest({...newQuest, xp: Number(e.target.value)})} />
             </div>
             <button onClick={handleAddQuest} className="w-full bg-green-600 py-3 rounded-lg font-bold">Create</button>
             <button onClick={() => setShowAddQuest(false)} className="w-full mt-2 text-slate-500 text-xs">Cancel</button>
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

        {/* --- SUPERHERO ID CARD --- */}
        <div className={`rounded-3xl p-1 bg-gradient-to-br ${activeKid.color} shadow-2xl relative`}>
           <div className="bg-slate-900/90 rounded-[22px] p-5 backdrop-blur-sm">
             <div className="flex justify-between items-start mb-6">
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

             <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Trophy size={16} className="mx-auto text-yellow-400 mb-1"/>
                   <div className="text-xs font-bold">{activeKid.xp}</div>
                   <div className="text-[8px] text-slate-500 uppercase">Rank</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <BicepsFlexed size={16} className="mx-auto text-red-400 mb-1"/>
                   <div className="text-xs font-bold">{activeKid.str}</div>
                   <div className="text-[8px] text-slate-500 uppercase">STR</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Heart size={16} className="mx-auto text-pink-400 mb-1"/>
                   <div className="text-xs font-bold">{activeKid.eq}</div>
                   <div className="text-[8px] text-slate-500 uppercase">EQ</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-center border border-slate-700">
                   <Battery size={16} className={`mx-auto mb-1 ${activeKid.battery < 30 ? 'text-red-500' : 'text-green-400'}`}/>
                   <div className="text-xs font-bold">{activeKid.battery}%</div>
                   <div className="text-[8px] text-slate-500 uppercase">Energy</div>
                </div>
             </div>

             {/* PARENT CONTROLS */}
             {isParentMode && (
               <div className="grid grid-cols-4 gap-1">
                 <button onClick={() => updateStat(activeKid.id, 'credits', 10)} className="bg-yellow-500/20 text-yellow-200 text-[10px] font-bold py-1 rounded">+₹10</button>
                 <button onClick={() => updateStat(activeKid.id, 'str', 5)} className="bg-red-500/20 text-red-200 text-[10px] font-bold py-1 rounded">+STR</button>
                 <button onClick={() => updateStat(activeKid.id, 'eq', 5)} className="bg-pink-500/20 text-pink-200 text-[10px] font-bold py-1 rounded">+EQ</button>
                 <button onClick={() => updateStat(activeKid.id, 'battery', -10)} className="bg-slate-700 text-white text-[10px] font-bold py-1 rounded">-Batt</button>
               </div>
             )}
           </div>
        </div>

        {/* HERO TAB */}
        {activeTab === 'HERO' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Daily Protocol</h2>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
              <button onClick={() => toggleDharma('bed')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${activeKid.dharma.bed ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg"><Shield size={18} className="text-blue-400"/></div>
                    <div className="text-left"><div className="text-sm font-bold">Make Bed</div><div className="text-[10px] text-slate-500">Order & Discipline</div></div>
                 </div>
                 {activeKid.dharma.bed ? <CheckCircle size={24} className="text-green-500"/> : <div className="h-6 w-6 rounded-full border-2 border-slate-700"/>}
              </button>
              <button onClick={() => toggleDharma('teeth')} className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${(activeKid.dharma as any).teeth ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-950 border-slate-800'}`}>
                 <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg"><Shield size={18} className="text-blue-400"/></div>
                    <div className="text-left"><div className="text-sm font-bold">Hygiene</div><div className="text-[10px] text-slate-500">Brush & Bath</div></div>
                 </div>
                 {(activeKid.dharma as any).teeth ? <CheckCircle size={24} className="text-green-500"/> : <div className="h-6 w-6 rounded-full border-2 border-slate-700"/>}
              </button>
            </div>
          </div>
        )}

        {/* DOJO TAB */}
        {activeTab === 'DOJO' && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl text-center mb-6">
                 <BicepsFlexed size={32} className="mx-auto text-red-500 mb-2"/>
                 <h2 className="text-xl font-black text-red-100 uppercase italic">The Dojo</h2>
                 <p className="text-xs text-red-300/70">"Pain is weakness leaving the body."</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 {EXERCISES.map(ex => (
                    <div key={ex.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-red-500/50 transition">
                       <div className="text-2xl mb-2">{ex.icon}</div>
                       <div className="font-bold text-sm">{ex.name}</div>
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

        {/* MIND TAB */}
        {activeTab === 'MIND' && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl text-center mb-6">
                 <Brain size={32} className="mx-auto text-indigo-400 mb-2"/>
                 <h2 className="text-xl font-black text-indigo-100 uppercase italic">Emotion Lab</h2>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6">
                 <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Mood Scanner</h3>
                 <div className="flex justify-between gap-2">
                    {MOODS.map(m => (
                       <button key={m.label} onClick={() => handleMoodSelect(m)} className="flex-1 flex flex-col items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
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

        {/* GUILD TAB */}
        {activeTab === 'GUILD' && (
           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              {isParentMode && <button onClick={() => setShowAddQuest(true)} className="w-full border-2 border-dashed border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-400 mb-2"><Plus size={16}/> <span className="font-bold text-xs">New Mission</span></button>}
              {quests.map(q => (
                <div key={q.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl border border-slate-700">{q.icon}</div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{q.title}</h3>
                        <div className="flex gap-2 mt-1">
                           <span className={`text-[10px] px-2 rounded font-bold ${q.reward > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-700 text-slate-400'}`}>{q.reward > 0 ? `₹${q.reward}` : 'Duty'}</span>
                           <span className="text-[10px] text-blue-400 font-bold bg-blue-500/20 px-2 rounded">+{q.xp} XP</span>
                        </div>
                      </div>
                   </div>
                   {isParentMode ? (
                     <div className="flex gap-1">
                        <button onClick={() => handleDeleteQuest(q.id)} className="p-2 text-slate-600"><Trash2 size={14}/></button>
                        <button onClick={() => { updateStat(activeKid.id, 'credits', q.reward); updateStat(activeKid.id, 'xp', q.xp); }} className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-xs">Approve</button>
                     </div>
                   ) : <Lock size={16} className="text-slate-600"/>}
                </div>
              ))}
           </div>
        )}
      
      {/* RESET BUTTON (IN PARENT MODE ONLY, BOTTOM OF SCREEN) */}
      {isParentMode && (
          <div className="text-center mt-10 opacity-50">
              <button onClick={factoryReset} className="text-[10px] text-red-500 flex items-center justify-center gap-1 mx-auto border border-red-900 p-2 rounded">
                  <RefreshCw size={10} /> Reset App Data
              </button>
              <p className="text-[8px] text-slate-600 mt-1">System {APP_VERSION}</p>
          </div>
      )}

      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2 rounded-2xl flex justify-between shadow-2xl z-50">
        {[
          { id: 'HERO', icon: <Crown size={20} />, label: 'Base' },
          { id: 'DOJO', icon: <BicepsFlexed size={20} />, label: 'Dojo' },
          { id: 'MIND', icon: <Brain size={20} />, label: 'Lab' },
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
