import React from 'react';
import { 
  Play, Square, Volume2, Sliders, Music, Plus, 
  Trash2, Sparkles, AlertCircle, Save, AlignLeft 
} from 'lucide-react';

interface AudioStudioMockProps {
  onTriggerLicense: () => void;
}

export function AudioStudioMock({ onTriggerLicense }: AudioStudioMockProps) {
  // Dummy script lines
  const scriptLines = [
    { id: 1, speaker: "narration", text: "Tiếng gầm thét của 'Lõi Ý thức' không giống với bất kỳ âm thanh cơ khí nào." },
    { id: 2, speaker: "kael", text: "Vậy tôi phải làm gì? Nó sắp tan vỡ hoàn toàn!" },
    { id: 3, speaker: "elara", text: "Cậu không thể là người 'làm' mọi việc. Cậu phải là người 'hướng dẫn'." },
    { id: 4, speaker: "kael", text: "Nhưng nếu tôi dừng lại... thời gian cũng sẽ dừng lại..." }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-obsidian-dark select-none animate-tab-panel-enter">
      
      {/* Top Banner Alert */}
      <div className="bg-amber-cinematic/5 border-b border-amber-cinematic/10 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-amber-cinematic/90 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Bạn đang xem chế độ Demo giao diện Audio Studio. Vui lòng nâng cấp bản quyền thương mại để sử dụng.</span>
        </div>
        <button 
          onClick={onTriggerLicense}
          className="text-[10px] font-black uppercase tracking-wider text-black bg-amber-cinematic px-2.5 py-1 rounded hover:bg-amber-glow transition-all active:scale-[0.97] cursor-pointer"
        >
          Kích hoạt ngay
        </button>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        
        {/* Left Side: Script List */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-900 bg-zinc-950/20">
          <div className="p-4 border-b border-zinc-900 flex items-center justify-between shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Kịch bản phân đoạn</span>
            <button onClick={onTriggerLicense} className="p-1 px-2 text-[10px] font-bold text-zinc-400 border border-zinc-850 rounded hover:border-zinc-700 transition-colors flex items-center gap-1 cursor-pointer">
              <Plus className="w-3 h-3" /> Thêm câu thoại
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {scriptLines.map((line) => (
              <div 
                key={line.id}
                onClick={onTriggerLicense}
                className="group p-4 rounded-xl border border-zinc-900 hover:border-amber-cinematic/30 bg-zinc-950/40 hover:bg-zinc-900/10 transition-all cursor-pointer flex gap-4 items-start"
              >
                <div className="shrink-0 flex flex-col items-center gap-1 mt-0.5">
                  <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider shadow-inner group-hover:border-amber-cinematic/20 group-hover:text-amber-cinematic">
                    {line.speaker[0]}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{line.speaker}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 group-hover:text-zinc-100 transition-colors leading-relaxed font-sans font-medium">
                    {line.text}
                  </p>
                  
                  {/* Fake Audio Wave / Render Status */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-6 flex-1 max-w-[200px] flex items-center gap-[2px] opacity-40 group-hover:opacity-60 transition-opacity">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const h = Math.abs(Math.sin(i * 0.4)) * 100;
                        return (
                          <div 
                            key={i} 
                            style={{ height: `${Math.max(15, h)}%` }} 
                            className="w-[2px] bg-zinc-500 rounded-full" 
                          />
                        );
                      })}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">2.4s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Voice Casting Panel */}
        <div className="w-80 border-l border-zinc-900 bg-zinc-950/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-900 shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Thiết lập giọng nói</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* Active Character Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nhân vật đang chọn</label>
              <div onClick={onTriggerLicense} className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all text-xs font-bold text-zinc-300 flex items-center justify-between cursor-pointer">
                <span>KAEL (Giọng Nam chính)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-cinematic shadow-[0_0_6px_#f59e0b]" />
              </div>
            </div>

            {/* TTS Preset parameters */}
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-cinematic" /> Cấu hình nâng cao
                </span>
                <span className="text-[9px] font-mono text-amber-cinematic uppercase tracking-widest font-bold">Lock Pro</span>
              </div>

              <div className="space-y-3 opacity-60">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Giới tính (Gender)</span>
                    <span className="text-zinc-300 font-bold">Male</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden">
                    <div className="h-full bg-amber-cinematic w-[70%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Tốc độ (Speed)</span>
                    <span className="text-zinc-300 font-bold">1.0x</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden">
                    <div className="h-full bg-zinc-700 w-[50%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Cường độ (Guidance Scale)</span>
                    <span className="text-zinc-300 font-bold">2.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden">
                    <div className="h-full bg-zinc-700 w-[40%]" />
                  </div>
                </div>
              </div>

              <button 
                onClick={onTriggerLicense}
                className="w-full py-2 bg-amber-cinematic/10 hover:bg-amber-cinematic text-amber-cinematic hover:text-black transition-all border border-amber-cinematic/20 rounded font-bold text-xs uppercase tracking-wide cursor-pointer"
              >
                Lưu cấu hình nhân vật
              </button>
            </div>

            {/* Locked Project profile options */}
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-3 opacity-70">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Xuất bản Audio</span>
              <button onClick={onTriggerLicense} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-white rounded font-bold text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5">
                <Music className="w-3.5 h-3.5" /> Ghép nối & Xuất MP3
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom DAW Timeline Section */}
      <div className="h-72 border-t border-zinc-900 bg-zinc-950 flex flex-col shrink-0">
        
        {/* DAW Controls Transport bar */}
        <div className="h-12 border-b border-zinc-900 px-4 flex items-center justify-between bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onTriggerLicense} className="w-7 h-7 rounded bg-amber-cinematic hover:bg-amber-glow text-black flex items-center justify-center transition-all cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-black" />
            </button>
            <button onClick={onTriggerLicense} className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
              <Square className="w-3.5 h-3.5 fill-zinc-400" />
            </button>
            
            <div className="h-4 w-px bg-zinc-850" />
            
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-cinematic tracking-widest">
              <span>00:00:02</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-500">00:00:09</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onTriggerLicense} className="px-2.5 py-1.5 text-[10px] font-bold text-amber-cinematic bg-zinc-950 border border-zinc-800 hover:border-amber-cinematic/40 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
              <AlignLeft className="w-3.5 h-3.5" /> Sắp Xếp (DAW Gap 0.2s)
            </button>
            <button onClick={onTriggerLicense} className="px-2.5 py-1.5 text-[10px] font-bold text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded flex items-center gap-1.5 transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Thêm track nhạc
            </button>
          </div>
        </div>

        {/* DAW Timeline Tracks */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950/40">
          
          {/* Track 1 */}
          <div onClick={onTriggerLicense} className="h-12 border border-zinc-900 bg-zinc-950/60 rounded-lg flex items-center px-4 relative overflow-hidden group hover:border-amber-cinematic/20 cursor-pointer">
            <div className="w-24 shrink-0 flex items-center gap-2 border-r border-zinc-850 h-full text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <Volume2 className="w-3.5 h-3.5 text-zinc-600" /> Track 1 (Ka)
            </div>
            
            {/* DAW Audio Clips */}
            <div className="flex-1 relative h-full flex items-center px-4">
              <div className="w-1/3 bg-amber-cinematic/10 border border-amber-cinematic/30 h-8 rounded px-2.5 flex items-center justify-between text-[9px] font-mono text-amber-cinematic font-bold">
                <span>kael_line_1.wav</span>
                <span>2.4s</span>
              </div>
            </div>
          </div>

          {/* Track 2 */}
          <div onClick={onTriggerLicense} className="h-12 border border-zinc-900 bg-zinc-950/60 rounded-lg flex items-center px-4 relative overflow-hidden group hover:border-amber-cinematic/20 cursor-pointer">
            <div className="w-24 shrink-0 flex items-center gap-2 border-r border-zinc-850 h-full text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <Volume2 className="w-3.5 h-3.5 text-zinc-600" /> Track 2 (El)
            </div>
            
            <div className="flex-1 relative h-full flex items-center px-4">
              <div className="w-1/4 ml-[35%] bg-zinc-900 border border-zinc-800 h-8 rounded px-2.5 flex items-center justify-between text-[9px] font-mono text-zinc-400 font-bold">
                <span>elara_line_2.wav</span>
                <span>1.8s</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
