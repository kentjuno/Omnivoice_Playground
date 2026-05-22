import React from 'react';
import { 
  Play, Square, Film, Eye, Download, Info, Settings, 
  Sparkles, AlertCircle, Maximize2, Volume2, AlignLeft
} from 'lucide-react';

interface PostProductionMockProps {
  onTriggerLicense: () => void;
}

export function PostProductionMock({ onTriggerLicense }: PostProductionMockProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-obsidian-dark select-none animate-tab-panel-enter">
      
      {/* Top Banner Alert */}
      <div className="bg-amber-cinematic/5 border-b border-amber-cinematic/10 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-amber-cinematic/90 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Bạn đang xem chế độ Demo giao diện Post-Production. Vui lòng nâng cấp bản quyền thương mại để sử dụng.</span>
        </div>
        <button 
          onClick={onTriggerLicense}
          className="text-[10px] font-black uppercase tracking-wider text-black bg-amber-cinematic px-2.5 py-1 rounded hover:bg-amber-glow transition-all active:scale-[0.97] cursor-pointer"
        >
          Kích hoạt ngay
        </button>
      </div>

      {/* Main split */}
      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        
        {/* Left Side: Video Previewer */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950/20 border-r border-zinc-900 relative">
          
          {/* Aspect-Ratio Box 9:16 representing cinematic phone layout */}
          <div 
            onClick={onTriggerLicense}
            className="w-full max-w-[340px] aspect-[9/16] bg-black rounded-xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden ring-1 ring-white/5 cursor-pointer group flex flex-col items-center justify-center"
          >
            
            {/* Aspect label overlay */}
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 border border-zinc-800/80 rounded text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
              9:16 Layout
            </div>

            <div className="absolute top-3 right-3 p-1.5 rounded bg-black/60 border border-zinc-800/80 text-zinc-400">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* Simulated Video Frame */}
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-cinematic shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Film className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Video Render Preview</h4>
              <p className="text-[10px] text-zinc-500 max-w-[200px] mx-auto">Click vào kịch bản hoạt cảnh để tải hoạt họa và xem thử hoạt ảnh thời gian thực.</p>
            </div>

            {/* Play bar overlay */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/60 border border-zinc-800/80 p-2.5 rounded-lg">
              <span className="text-[9px] font-mono text-zinc-400">00:00:02.40</span>
              <span className="text-[9px] font-mono text-amber-cinematic uppercase tracking-widest font-extrabold">Active</span>
            </div>

          </div>

          {/* Export metadata stats bar */}
          <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-zinc-500">
            <span>Vertical 9:16</span>
            <span>·</span>
            <span>1080×1920 HD</span>
            <span>·</span>
            <span>0:09</span>
            <span>·</span>
            <span>4 audio clips</span>
          </div>
        </div>

        {/* Right Side: Properties Inspector Mockup */}
        <div className="w-80 border-l border-zinc-900 bg-zinc-950/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-900 shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Thuộc tính hoạt cảnh</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* Visual description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Visual prompt hiện tại</label>
              <div 
                onClick={onTriggerLicense}
                className="w-full p-3 rounded-lg border border-zinc-850 bg-zinc-900/30 text-[11px] text-zinc-400 font-mono leading-relaxed cursor-pointer hover:border-zinc-700 transition-colors"
              >
                "Cinematic shot of a glowing core, dark energy veins pulsing on cold obsidian machinery..."
              </div>
            </div>

            {/* Stepper configurations */}
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-amber-cinematic" /> Tham số kết xuất video
              </span>

              <div className="space-y-3 opacity-60">
                <div className="flex justify-between text-[10px] py-1 border-b border-zinc-900/60">
                  <span className="text-zinc-500">FPS đầu ra</span>
                  <span className="text-zinc-300 font-bold font-mono">24 fps</span>
                </div>
                <div className="flex justify-between text-[10px] py-1 border-b border-zinc-900/60">
                  <span className="text-zinc-500">Độ phân giải</span>
                  <span className="text-zinc-300 font-bold font-mono">1080p (HD)</span>
                </div>
                <div className="flex justify-between text-[10px] py-1 border-b border-zinc-900/60">
                  <span className="text-zinc-500">Thuật toán nội suy</span>
                  <span className="text-zinc-300 font-bold font-mono">Flow-Guided v2</span>
                </div>
              </div>

              <button 
                onClick={onTriggerLicense}
                className="w-full py-2 bg-amber-cinematic/10 hover:bg-amber-cinematic text-amber-cinematic hover:text-black transition-all border border-amber-cinematic/20 rounded font-bold text-xs uppercase tracking-wide cursor-pointer"
              >
                Cấu hình tham chiếu
              </button>
            </div>

            {/* Actions list */}
            <div className="space-y-2.5">
              <button 
                onClick={onTriggerLicense}
                className="w-full py-3 bg-amber-cinematic hover:bg-amber-glow text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-cinematic/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 fill-black" /> Xuất Video Master thành phẩm
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom DAW timeline */}
      <div className="h-44 border-t border-zinc-900 bg-zinc-950 flex flex-col shrink-0">
        
        {/* Transport controls */}
        <div className="h-10 border-b border-zinc-900 px-4 flex items-center justify-between bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onTriggerLicense} className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
              <Play className="w-3 h-3 fill-zinc-400" />
            </button>
            <div className="text-[10px] font-mono font-bold text-zinc-500">
              00:00:02
            </div>
          </div>
        </div>

        {/* Tracks */}
        <div className="flex-1 p-3 space-y-2 bg-zinc-950/40 overflow-y-auto">
          
          {/* Video track */}
          <div onClick={onTriggerLicense} className="h-8 border border-zinc-900 bg-zinc-950/60 rounded-md flex items-center px-3 relative overflow-hidden group hover:border-amber-cinematic/20 cursor-pointer">
            <div className="w-20 shrink-0 flex items-center gap-1.5 border-r border-zinc-850 h-full text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              Video Track
            </div>
            <div className="flex-1 relative h-full flex items-center px-4">
              <div className="w-1/2 bg-amber-cinematic/10 border border-amber-cinematic/20 h-5 rounded flex items-center justify-between px-2 text-[8px] font-mono text-amber-cinematic font-bold">
                <span>scene_01_core.mp4</span>
                <span>4.5s</span>
              </div>
            </div>
          </div>

          {/* Audio track */}
          <div onClick={onTriggerLicense} className="h-8 border border-zinc-900 bg-zinc-950/60 rounded-md flex items-center px-3 relative overflow-hidden group hover:border-amber-cinematic/20 cursor-pointer">
            <div className="w-20 shrink-0 flex items-center gap-1.5 border-r border-zinc-850 h-full text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              Audio Track
            </div>
            <div className="flex-1 relative h-full flex items-center px-4">
              <div className="w-1/3 bg-zinc-900 border border-zinc-800 h-5 rounded flex items-center justify-between px-2 text-[8px] font-mono text-zinc-400 font-bold">
                <span>kael_voice_1.wav</span>
                <span>2.4s</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
