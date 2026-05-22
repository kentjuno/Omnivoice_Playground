import React from 'react';
import { 
  Network, Play, Plus, Trash2, ArrowRight, Sparkles, 
  Settings, Image, Video, Film, Eye, AlertCircle
} from 'lucide-react';

interface VideoStudioMockProps {
  onTriggerLicense: () => void;
}

export function VideoStudioMock({ onTriggerLicense }: VideoStudioMockProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-obsidian-dark select-none animate-tab-panel-enter">
      
      {/* Top Banner Alert */}
      <div className="bg-amber-cinematic/5 border-b border-amber-cinematic/10 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-amber-cinematic/90 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Bạn đang xem chế độ Demo giao diện Video Studio. Vui lòng nâng cấp bản quyền thương mại để sử dụng.</span>
        </div>
        <button 
          onClick={onTriggerLicense}
          className="text-[10px] font-black uppercase tracking-wider text-black bg-amber-cinematic px-2.5 py-1 rounded hover:bg-amber-glow transition-all active:scale-[0.97] cursor-pointer"
        >
          Kích hoạt ngay
        </button>
      </div>

      {/* Node Canvas Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* Connection canvas representation (Fake SVG Grid lines in background) */}
        <div className="absolute inset-0 bg-[#09090b] bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-80" />

        {/* Floating Tool Panel */}
        <div className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-zinc-950/80 border border-zinc-900 flex flex-col gap-2 shadow-2xl">
          <button onClick={onTriggerLicense} className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Auto arrange flowboard">
            <Network className="w-4 h-4" />
          </button>
          <button onClick={onTriggerLicense} className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Add Scene node">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Node Editor Simulation */}
        <div className="flex-1 relative overflow-auto p-12 flex items-center justify-center gap-20">
          
          {/* FAKE SVG GRAPH EDGES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {/* Curve 1: Node 1 to Node 2 */}
            <path d="M 280 250 C 350 250, 350 180, 420 180" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
            {/* Curve 2: Node 1 to Node 3 */}
            <path d="M 280 250 C 350 250, 350 320, 420 320" fill="none" stroke="#52525b" strokeWidth="2" />
            {/* Curve 3: Node 2 to Node 4 */}
            <path d="M 640 180 C 700 180, 700 250, 780 250" fill="none" stroke="#f59e0b" strokeWidth="2" />
          </svg>

          {/* Node 1: Scene Input Node */}
          <div 
            onClick={onTriggerLicense}
            className="w-64 rounded-xl border border-zinc-850 hover:border-amber-cinematic/30 bg-zinc-950/90 shadow-2xl p-4 flex flex-col gap-3 relative z-10 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phân cảnh #1</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-400">Scene 1</span>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Kịch bản thoại:</p>
              <p className="text-[11px] text-zinc-300 italic leading-relaxed">
                "Tiếng gầm thét của 'Lõi Ý thức' không giống với bất kỳ âm thanh cơ khí nào."
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
              <span>Lines: [1]</span>
              <span>Audio: 2.4s</span>
            </div>
          </div>

          {/* Column of Output Node branches */}
          <div className="flex flex-col gap-16 relative z-10">
            
            {/* Node 2: Prompt Node (AI Director) */}
            <div 
              onClick={onTriggerLicense}
              className="w-64 rounded-xl border border-amber-cinematic/30 bg-zinc-950/90 shadow-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-cinematic flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-amber-cinematic text-amber-cinematic" /> AI Director Prompt
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-cinematic/10 border border-amber-cinematic/20 text-[8px] font-bold text-amber-cinematic uppercase tracking-widest">Active</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Visual Prompt:</span>
                <p className="text-[10px] text-zinc-300 leading-relaxed font-mono bg-zinc-900/60 p-2 rounded border border-zinc-900">
                  "Cinematic shot of a glowing core, dark energy veins pulsing on cold obsidian machinery..."
                </p>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-mono text-zinc-400">
                  16:9
                </div>
                <div className="text-[9px] text-zinc-500">Camera panning shot</div>
              </div>
            </div>

            {/* Node 3: Speaker Asset Node */}
            <div 
              onClick={onTriggerLicense}
              className="w-64 rounded-xl border border-zinc-850 hover:border-amber-cinematic/30 bg-zinc-950/90 shadow-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all hover:scale-[1.01] opacity-70"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5" /> Character Asset
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-500">
                  K
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-zinc-200 uppercase">KAEL</h5>
                  <p className="text-[9px] text-zinc-500">Young male warrior archetype</p>
                </div>
              </div>
            </div>

          </div>

          {/* Node 4: Generated Video Clip node */}
          <div 
            onClick={onTriggerLicense}
            className="w-64 rounded-xl border border-zinc-850 hover:border-amber-cinematic/30 bg-zinc-950/90 shadow-2xl p-4 flex flex-col gap-3 relative z-10 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-amber-cinematic" /> Clip thành phẩm
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            {/* Fake video thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850 flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                <span className="text-[9px] font-mono text-zinc-300 font-bold uppercase">scene_01_raw.mp4</span>
              </div>
              <Video className="w-6 h-6 text-zinc-700 opacity-60" />
            </div>

            <div className="flex gap-2">
              <button onClick={onTriggerLicense} className="flex-1 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-zinc-300 flex items-center justify-center gap-1 cursor-pointer">
                <Eye className="w-3.5 h-3.5" /> Xem thử
              </button>
              <button onClick={onTriggerLicense} className="py-1.5 px-2.5 rounded bg-amber-cinematic hover:bg-amber-glow text-black text-[10px] font-extrabold uppercase tracking-wide cursor-pointer">
                Sync DAW
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
