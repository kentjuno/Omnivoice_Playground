import React from 'react';
import { Mic, Video, Settings, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: 'audio' | 'video' | 'post-production' | 'playground';
  setActiveTab: (tab: 'audio' | 'video' | 'post-production' | 'playground') => void;
  onTriggerLicense: () => void;
}

export function Header({ activeTab, setActiveTab, onTriggerLicense }: HeaderProps) {
  
  const handleContactTelegram = () => {
    window.open('https://t.me/Kentjuno', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-obsidian-dark shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Studio Pulse Symbol */}
          <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-center relative overflow-hidden group shrink-0 shadow-inner">
            <div className="flex gap-[2px] items-center">
              <div className="w-[2px] h-2 bg-amber-cinematic rounded-sm animate-pulse" />
              <div className="w-[2px] h-4 bg-amber-glow rounded-sm animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-[2px] h-3 bg-zinc-400 rounded-sm animate-pulse" style={{ animationDelay: '300ms' }} />
              <div className="w-[2px] h-1 bg-zinc-600 rounded-sm" />
            </div>
          </div>
          <h1 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-sans shrink-0">
            Studio <span className="text-amber-cinematic">Noir</span>
          </h1>
        </div>

        {/* Center: Workspace Tab Switcher */}
        <div className="flex bg-zinc-950 p-0.5 border border-zinc-900 justify-self-center rounded-lg">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'playground'
                ? 'bg-amber-cinematic text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> OmniVoice Playground
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-amber-cinematic text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Audio Studio
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video'
                ? 'bg-amber-cinematic text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Video Studio
          </button>

          <button
            onClick={() => setActiveTab('post-production')}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'post-production'
                ? 'bg-amber-cinematic text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Post-Production
          </button>
        </div>

        {/* Right Side: Active Contact trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onTriggerLicense}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-cinematic animate-pulse" /> Buy License
          </button>

          <button 
            onClick={handleContactTelegram}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-cinematic hover:bg-amber-glow text-black font-extrabold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-amber-cinematic/10"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-black" /> Support
          </button>
        </div>

      </div>
    </header>
  );
}
