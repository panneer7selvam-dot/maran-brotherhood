"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Crown, Heart, ShoppingBag, 
  BookOpen, Shield, Battery, Users, 
  CheckCircle, Lock, Unlock, Flame,
  Dumbbell, Swords, Plus, X, Trash2
} from 'lucide-react';

// --- INITIAL DATA (Used only first time) ---
const INITIAL_KIDS = [
  { 
    id: '1', name: 'Aniv', baseAvatar: '🦁', credits: 500, xp: 350, level: 3, battery: 40, streak: 4, 
    dharma: { bed: true, plate: false }, color: 'from-blue-600 to-indigo-600'
  },
  { 
    id: '2', name: 'Thiru', baseAvatar: '🐯', credits: 300, xp: 150, level: 1, battery: 90, streak: 12,
    dharma: { bed: true, plate: true }, color: 'from-orange-500 to-red-600'
  }
];

const INITIAL_QUESTS = [
  { id: 1, title: 'Night Shift (Pack Bag)', type: 'DAILY', reward: 10, xp: 5, icon: '🎒' },
  { id: 2, title: 'Feynman 5 (Teach Dad)', type: 'DAILY', reward: 20, xp: 15, icon: '🧠' },
  { id: 3, title: 'The Truth Bomb', type: 'IRON', reward: 50, xp: 200, icon: '💣' },
];

const SHOP_ITEMS = [
  { id: 1, name: 'Late Pass', cost: 100, emoji: '🌙' },
  { id: 2, name: 'Golden Goose', cost: 500, emoji: '🦢', desc: 'Invest' },
  { id: 3, name: 'Mystery Chest', cost: 50, emoji: '🎁' },
];

export default function MaranBrotherhoodApp() {
  // --- STATE ---
  const [kids, setKids] = useState(INITIAL_KIDS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [selectedId, setSelectedId] = useState('1');
  const [activeTab, setActiveTab] = useState('HQ'); 
  const [isParentMode, setIsParentMode] = useState(false);
  
  // Modals
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: '', reward: 10, xp: 10, icon: '⭐' });

  // --- LOCAL STORAGE (PERSISTENCE) ---
  useEffect(() => {
    // Load data on startup
    const savedKids = localStorage.getItem('maran_kids');
    const savedQuests = localStorage.getItem('maran_quests');
    if (savedKids) setKids(JSON.parse(savedKids));
    if (savedQuests) setQuests(JSON.parse(savedQuests));
  }, []);

  useEffect(() => {
    // Save data whenever it changes
    localStorage.setItem('maran_kids', JSON.stringify(kids));
    localStorage.setItem('maran_quests', JSON.stringify(quests));
  }, [kids, quests]);

  // --- HELPERS ---
  const activeKid = kids.find(k => k.id === selectedId) || kids[0];
  const teamWealth = kids.reduce((acc, k) => acc + k.credits, 0);

  const getEvolvedAvatar = (base: string, level: number) => {
    if (level < 5) return base; 
    if (level < 10) return `${base}⚔️`; 
    return `${base}👑`; 
  };

  // --- ACTIONS ---
  const handlePinSubmit = () => {
    if (pinInput === '1234') { // <--- CHANGE YOUR PIN HERE
      setIsParentMode(true);
      setShowPinPad(false);
      setPinInput('');
    } else {
      alert('Access Denied. Security Alert Triggered.');
      setPinInput('');
    }
  };

  const updateStat = (id: string, field: string, value: number) => {
    setKids(kids.map(k => {
      if (k.id !== id) return k;
      let newVal = (k[field as keyof typeof k] as number) + value;
      if (field === 'battery') newVal = Math.min(100, Math.max(0, newVal));
      
      // XP Level Logic
      let newLevel = k.level;
      if (field === 'xp') newLevel = Math.floor(newVal / 100) + 1;

      return { ...k, [field]: newVal, level: newLevel };
    }));
  };

  const addCustomQuest = () => {
    if (!newQuest.title) return;
    const q = { ...newQuest, id: Date.now(), type: 'CUSTOM' };
    setQuests([...quests, q]);
    setShowAddQuest(false);
    setNewQuest({ title: '', reward: 10, xp: 10, icon: '⭐' });
  };

  const deleteQuest = (id: number) => {
    if(confirm('Delete this mission?')) {
      setQuests(quests.filter(q => q.id !== id));
    }
  };

  const toggleDharma = (task: string) => {
    setKids(kids.map(k => k.id === activeKid.id ? {
      ...k, dharma: { ...k.dharma, [task]: !k.dharma[task as keyof typeof k.dharma] }
    } : k));
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white pb-24 select-none relative">
      
      {/* --- PIN PAD MODAL --- */}
      {showPinPad && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700 text-center">
            <h2 className="text-xl font-bold mb-4 text-red-500">Security Clearance</h2>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4].map((_, i) => (
                <div key={i} className={`h-4 w-4 rounded-full ${pinInput.length > i ? 'bg-white' : 'bg-slate-700'}`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} onClick={() => setPinInput(prev => (prev + n).slice(0,4))} className="h-16 rounded-xl bg-slate-800 text-2xl font-bold active:bg-slate-700">{n}</button>
              ))}
              <button onClick={() => setShowPinPad(false)} className="h-16 rounded-xl bg-red-900/30 text-red-400 font-bold">X</button>
              <button onClick={() => setPinInput(prev => (prev + '0').slice(0,4))} className="h-16 rounded-xl bg-slate-800 text-2xl font-bold">0</button>
              <button onClick={handlePinSubmit} className="h-16 rounded-xl bg-green-600 text-white font-bold">GO</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD QUEST MODAL --- */}
      {showAddQuest && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add New Mission</h2>
            <input 
              className="w-full bg-slate-800 p-3 rounded-lg mb-3 text-white border border-slate-700" 
              placeholder="Task Name (e.g. Clean Fan)" 
              value={newQuest.title}
              onChange={e => setNewQuest({...newQuest, title: e.target.value})}
            />
            <div className="flex gap-2 mb-3">
              <input 
                type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg text-white border border-slate-700" 
                placeholder="Credits" value={newQuest.reward}
                onChange={e => setNewQuest({...newQuest, reward: Number(e.target.value)})}
              />
              <input 
                type="number" className="w-1/2 bg-slate-800 p-3 rounded-lg text-white border border-slate-700" 
                placeholder="XP" value={newQuest.xp}
                onChange={e => setNewQuest({...newQuest, xp: Number(e.target.value)})}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddQuest(false)} className="flex-1 bg-slate-700 p-3 rounded-lg font-bold">Cancel</button>
              <button onClick={addCustomQuest} className="flex-1 bg-green-600 p-3 rounded-lg font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP BAR --- */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 shadow-2xl">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex gap-2">
            {kids.map(kid => (
              <button 
                key={kid.id} onClick={() => setSelectedId(kid.id)}
                className={`relative transition-all duration-300 ${activeKid.id === kid.id ? 'scale-110 z-10' : 'opacity-50 scale-90'}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${kid.color} ring-2 ring-white/20`}>
                  {getEvolvedAvatar(kid.baseAvatar, kid.level)}
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Wealth</span>
              <div className="flex items-center gap-2 text-yellow-400 font-black text-xl">
                <Users size={16} /> <span>{teamWealth}</span>
              </div>
            </div>
            
            <button 
              onClick={() => isParentMode ? setIsParentMode(false) : setShowPinPad(true)}
              className={`h-10 w-10 flex items-center justify-center rounded-full transition-colors ${isParentMode ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}
            >
              {isParentMode ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">

        {/* --- MAIN CARD --- */}
        <div className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${activeKid.color} shadow-lg shadow-indigo-500/20`}>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold uppercase backdrop-blur-md border border-white/10 mb-2">
                  Lvl {activeKid.level} {activeKid.level >= 10 ? 'King' : activeKid.level >= 5 ? 'Warrior' : 'Cub'}
                </span>
                <h1 className="text-4xl font-black mb-1">{activeKid.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold border bg-black/20 border-white/10`}>
                     <Flame size={12} className={activeKid.streak > 3 ? "fill-orange-500 text-orange-500" : "text-slate-300"} />
                     <span className="ml-1 text-white">{activeKid.streak} Day Streak</span>
                   </div>
                   {isParentMode && (
                     <button onClick={() => updateStat(activeKid.id, 'streak', 1)} className="text-[10px] bg-white/20 px-2 py-1 rounded hover:bg-white/40">+1</button>
                   )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase opacity-70 font-bold">Credits</span>
                <div className="text-4xl font-black text-white drop-shadow-md">{activeKid.credits}</div>
              </div>
            </div>

            {/* PARENT CONTROLS: QUICK ACTIONS */}
            {isParentMode && (
              <div className="mt-4 grid grid-cols-4 gap-2 bg-black/20 p-2 rounded-xl backdrop-blur-md">
                <button onClick={() => updateStat(activeKid.id, 'credits', -50)} className="bg-red-500/80 hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold">-50</button>
                <button onClick={() => updateStat(activeKid.id, 'credits', +10)} className="bg-white/20 hover:bg-white/40 text-white py-2 rounded-lg text-xs font-bold">+10</button>
                <button onClick={() => updateStat(activeKid.id, 'credits', +50)} className="bg-white/20 hover:bg-white/40 text-white py-2 rounded-lg text-xs font-bold">+50</button>
                <button onClick={() => updateStat(activeKid.id, 'credits', +100)} className="bg-yellow-500/80 hover:bg-yellow-500 text-black py-2 rounded-lg text-xs font-bold">+100</button>
              </div>
            )}

            {/* BATTERY */}
            <div className="mt-4 bg-black/30 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Battery size={16} className={activeKid.battery < 50 ? "text-red-400" : "text-green-400"} />
                  <span className="text-xs font-bold uppercase tracking-wider">Bio-Battery</span>
                </div>
                <span className="text-xs font-bold">{activeKid.battery}%</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${activeKid.battery < 50 ? 'bg-red-500' : 'bg-green-400'}`} style={{width: `${activeKid.battery}%`}}></div>
              </div>
              {isParentMode && (
                <div className="mt-2 flex gap-2">
                   <button onClick={() => updateStat(activeKid.id, 'battery', -10)} className="bg-red-500/40 px-3 py-1 rounded text-[10px] font-bold">-10%</button>
                   <button onClick={() => updateStat(activeKid.id, 'battery', +10)} className="bg-green-500/40 px-3 py-1 rounded text-[10px] font-bold">+10%</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- TABS CONTENT --- */}
        
        {/* HQ TAB */}
        {activeTab === 'HQ' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-center text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
              MARAN BROTHERHOOD
            </h1>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={14} className="text-blue-400"/> Daily Dharma
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => toggleDharma('bed')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${activeKid.dharma.bed ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                   <div className="text-xs font-bold uppercase">Make Bed</div>
                   {activeKid.dharma.bed ? <CheckCircle size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-slate-600"/>}
                </button>
                <button onClick={() => toggleDharma('plate')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${activeKid.dharma.plate ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                   <div className="text-xs font-bold uppercase">Clean Plate</div>
                   {activeKid.dharma.plate ? <CheckCircle size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-slate-600"/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MISSIONS TAB */}
        {activeTab === 'MISSIONS' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
            
            {/* ADD MISSION BUTTON (PARENT ONLY) */}
            {isParentMode && (
              <button 
                onClick={() => setShowAddQuest(true)}
                className="w-full border-2 border-dashed border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-900 hover:text-white transition"
              >
                <PlusCircle size={20} /> <span className="font-bold">Create New Mission</span>
              </button>
            )}

            {/* QUEST LIST */}
            {quests.map(q => (
              <div key={q.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-slate-700">
                    {q.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{q.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold border border-slate-700">{q.type}</span>
                      <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1"><Zap size={10} /> +{q.reward}</span>
                    </div>
                  </div>
                </div>
                
                {isParentMode ? (
                  <div className="flex gap-2">
                     <button onClick={() => deleteQuest(q.id)} className="bg-slate-800 text-slate-500 p-2 rounded-lg"><Trash2 size={16} /></button>
                     <button onClick={() => { updateStat(activeKid.id, 'credits', q.reward); updateStat(activeKid.id, 'xp', q.xp); }} className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-xs">
                       Approve
                     </button>
                  </div>
                ) : (
                  <Lock size={14} className="text-slate-600"/>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'SHOP' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 grid grid-cols-2 gap-3">
             {SHOP_ITEMS.map(item => (
               <div key={item.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                 <div className="text-2xl mb-2">{item.emoji}</div>
                 <div className="font-bold text-sm">{item.name}</div>
                 {isParentMode ? (
                   <button onClick={() => updateStat(activeKid.id, 'credits', -item.cost)} className="mt-2 w-full bg-red-900/50 text-red-200 text-xs font-bold py-2 rounded border border-red-900">
                     Buy (-{item.cost})
                   </button>
                 ) : (
                   <div className="text-xs text-slate-500 mt-2 font-bold">{item.cost} Credits</div>
                 )}
               </div>
             ))}
           </div>
        )}

        {/* SOUL TAB */}
        {activeTab === 'SOUL' && (
          <div className="text-center py-10 bg-slate-900 rounded-xl border border-slate-800">
            <Heart className="mx-auto text-teal-400 mb-4" size={32} />
            <h2 className="text-xl font-serif text-teal-200">The Inner Citadel</h2>
            <p className="text-xs text-slate-400 mt-2 px-6">
              "Knowing others is intelligence; knowing yourself is true wisdom."
            </p>
            {isParentMode && (
              <button className="mt-4 bg-teal-800 text-teal-100 text-xs font-bold px-4 py-2 rounded-lg">
                + Add Entry
              </button>
            )}
          </div>
        )}

      </div>

      {/* --- BOTTOM NAV --- */}
      <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2 rounded-2xl flex justify-between shadow-2xl z-50">
        {[
          { id: 'HQ', icon: <Crown size={20} />, label: 'HQ' },
          { id: 'MISSIONS', icon: <Zap size={20} />, label: 'Work' },
          { id: 'SHOP', icon: <ShoppingBag size={20} />, label: 'Shop' },
          { id: 'SOUL', icon: <BookOpen size={20} />, label: 'Soul' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold mt-1">{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}

// Simple Icon Component needed for the 'PlusCircle' used in the code above
function PlusCircle({ size }: { size: number }) {
  return <Plus size={size} />; 
}