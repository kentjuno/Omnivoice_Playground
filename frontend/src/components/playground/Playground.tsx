import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Wand2, Loader2, Upload, Download, Trash2,
  ChevronDown, ChevronUp, Play, Pause,
  SlidersHorizontal, Globe, FastForward,
  Hourglass, FileText, Mic, UserCheck, X, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API } from '../../config';

interface SandboxRun {
  id: string;
  filename: string;
  text: string;
  mode: 'instruct' | 'clone';
  language: string;
  instruct?: string;
  ref_audio?: string;
  ref_text?: string;
  speed: number;
  duration_limit?: number;
  audio_duration: number;
  num_step: number;
  guidance_scale: number;
  denoise: boolean;
  postprocess_output: boolean;
  generation_time: number;
  timestamp: number;
}

export default function Playground() {
  // Input fields
  const [text, setText] = useState('Chào mừng đến với hệ thống thử nghiệm giọng nói nhân tạo OmniVoice Playground. Hệ thống được phát triển bởi Kent Juno, xây dựng dựa trên nền tảng mã nguồn mở của OmniVoiceAI, sử dụng AI để tạo ra giọng nói nhân tạo.');
  const [mode, setMode] = useState<'instruct' | 'clone'>('instruct');

  // Instruct Mode config
  const [instruct, setInstruct] = useState('female, moderate pitch, young adult');

  // Individual voice builder states
  const [instructGender, setInstructGender] = useState<'male' | 'female' | ''>('female');
  const [instructAge, setInstructAge] = useState<'child' | 'teenager' | 'young adult' | 'middle-aged' | 'elderly' | ''>('young adult');
  const [instructPitch, setInstructPitch] = useState<'very low pitch' | 'low pitch' | 'moderate pitch' | 'high pitch' | 'very high pitch' | ''>('moderate pitch');
  const [instructStyle, setInstructStyle] = useState<'whisper' | ''>('');
  const [instructAccent, setInstructAccent] = useState<string>('');

  // Clone Mode config (Vietnamese cloning needs reference files uploaded by users)
  const [refAudioFilename, setRefAudioFilename] = useState<string>('');
  const [refText, setRefText] = useState(''); // Kept empty as per user rule 3
  const [isUploadingRef, setIsUploadingRef] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced parameters
  const [language, setLanguage] = useState('Vietnamese');
  const [speed, setSpeed] = useState<number>(1.0);
  const [durationLimit, setDurationLimit] = useState<number | ''>('');
  const [numStep, setNumStep] = useState<number>(32);
  const [guidanceScale, setGuidanceScale] = useState<number>(2.0);
  const [denoise, setDenoise] = useState(true);
  const [postprocessOutput, setPostprocessOutput] = useState(true);

  // UI state
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<SandboxRun[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Dynamic split panel resizing state
  const [leftWidth, setLeftWidth] = useState(50); // Mặc định chia 50-50
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor screen size for responsive layouts
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle global mousemove and mouseup events for dragging
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidthPx = e.clientX - containerRect.left;
      const newWidthPct = (newWidthPx / containerRect.width) * 100;
      
      // Constrain between 30% and 70% as requested by the user
      const boundedPct = Math.max(30, Math.min(70, newWidthPct));
      setLeftWidth(boundedPct);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Adjust cursor style globally during resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Audio playback state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Quick expression tags for paralinguistic injects
  const expressionTags = [
    { label: '[sigh] thở dài 😔', value: '[sigh]' },
    { label: '[laughter] cười lớn 😂', value: '[laughter]' },
    { label: '[gasp] hít sâu 😲', value: '[gasp]' },
    { label: '[whisper] thì thầm 🤫', value: '[whisper]' },
    { label: '[dissatisfaction-hnn] bực dọc 😡', value: '[dissatisfaction-hnn]' },
    { label: '[surprise-oh] ngạc nhiên 😲', value: '[surprise-oh]' },
  ];

  // Vietnamese Presets for instruct descriptions
  const instructPresets = [
    { name: 'Thì Thầm Sâu Lắng 🤫', desc: 'female, whisper', tag: '[whisper]', descLabel: 'female, whisper + [whisper]' },
    { name: 'Buồn Bã Trầm Tư 😢', desc: 'female, low pitch, middle-aged', tag: '[sigh]', descLabel: 'female, low pitch, middle-aged + [sigh]' },
    { name: 'Giận Dữ Căng Thẳng 😡', desc: 'male, high pitch, young adult', tag: '[dissatisfaction-hnn]', descLabel: 'male, high pitch, young adult + [dissatisfaction-hnn]' },
    { name: 'Hân Hoan Ấm Áp 🥰', desc: 'female, high pitch, young adult', tag: '[laughter]', descLabel: 'female, high pitch, young adult + [laughter]' },
    { name: 'Kịch Tính Đe Dọa 🎭', desc: 'male, low pitch, elderly', tag: '[surprise-oh]', descLabel: 'male, low pitch, elderly + [surprise-oh]' },
  ];

  // Auto-compile individual voice states into the main instruct string
  useEffect(() => {
    const parts: string[] = [];
    if (instructGender) parts.push(instructGender);
    if (instructAge) parts.push(instructAge);
    if (instructPitch) parts.push(instructPitch);
    if (instructStyle) parts.push(instructStyle);
    if (instructAccent) parts.push(instructAccent);

    setInstruct(parts.join(', '));
  }, [instructGender, instructAge, instructPitch, instructStyle, instructAccent]);

  // Apply preset with emotion tag injection & voice parameters
  const applyPreset = (preset: { name: string, desc: string, tag?: string }) => {
    if (preset.tag) {
      setText(prev => {
        const matchTag = prev.match(/^\[.*?\]\s*/);
        if (matchTag) {
          return prev.replace(/^\[.*?\]\s*/, preset.tag + ' ');
        }
        return preset.tag + ' ' + prev;
      });
      toast.success(`Đã chọn preset: ${preset.name} và tự động chèn tag biểu cảm!`);
    } else {
      toast.success('Đã cấu hình giọng đọc thành công.');
    }

    const parts = preset.desc.split(', ');

    const hasGender = parts.find(p => p === 'male' || p === 'female');
    setInstructGender((hasGender as any) || '');

    const hasAge = parts.find(p => ['child', 'teenager', 'young adult', 'middle-aged', 'elderly'].includes(p));
    setInstructAge((hasAge as any) || '');

    const hasPitch = parts.find(p => p.includes('pitch'));
    setInstructPitch((hasPitch as any) || '');

    const hasStyle = parts.find(p => p === 'whisper');
    setInstructStyle((hasStyle as any) || '');

    const hasAccent = parts.find(p => p.includes('accent'));
    setInstructAccent(hasAccent || '');

    setInstruct(preset.desc);
  };

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await axios.get<SandboxRun[]>(API.playgroundHistory);
      setHistory(res.data);
    } catch (e) {
      console.error('[Playground] Lỗi tải lịch sử:', e);
      toast.error('Không thể kết nối API Playground.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle uploading custom WAV files
  const handleUploadRefFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.wav')) {
      toast.error('Chỉ chấp nhận file âm thanh định dạng .wav');
      return;
    }

    setIsUploadingRef(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post<{ filename: string }>(API.playgroundUploadRef, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRefAudioFilename(res.data.filename);
      toast.success(`Đã nạp file giọng mẫu: ${file.name}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Lỗi tải file giọng mẫu lên máy chủ.');
    } finally {
      setIsUploadingRef(false);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  // Generate Audio Action
  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Vui lòng nhập văn bản cần thử nghiệm.');
      return;
    }

    if (mode === 'clone' && !refAudioFilename) {
      toast.error('Vui lòng tải lên một file .wav giọng mẫu trước để nhân bản.');
      return;
    }

    setIsGenerating(true);

    const payload = {
      text,
      mode,
      language,
      instruct: mode === 'instruct' ? instruct : undefined,
      ref_audio_filename: mode === 'clone' ? refAudioFilename : undefined,
      ref_text: mode === 'clone' ? refText : undefined,
      speed,
      duration: durationLimit === '' ? undefined : Number(durationLimit),
      num_step: numStep,
      guidance_scale: guidanceScale,
      denoise,
      postprocess_output: postprocessOutput,
    };

    try {
      const res = await axios.post<SandboxRun>(API.playgroundGenerate, payload);
      setHistory(prev => [res.data, ...prev]);
      toast.success('Sinh âm thanh thành công!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Lỗi suy luận OmniVoice.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete history entry
  const handleDeleteEntry = async (id: string) => {
    try {
      await axios.delete(API.playgroundDelete(id));
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Đã xoá bản ghi.');
    } catch (e) {
      toast.error('Lỗi khi xoá bản ghi.');
    }
  };

  // Clear all history
  const handleClearHistory = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn dọn dẹp toàn bộ dữ liệu Sandbox?')) return;
    try {
      await axios.delete(API.playgroundClear);
      setHistory([]);
      setRefAudioFilename('');
      toast.success('Đã dọn dẹp sạch Sandbox!');
    } catch (e) {
      toast.error('Lỗi dọn dẹp Sandbox.');
    }
  };

  // Audio Playback Controls
  const togglePlayAudio = (runId: string, filename: string) => {
    const audioUrl = API.playgroundAudio(filename);

    // Stop currently playing audio if switching
    if (playingId && playingId !== runId) {
      const activeAudio = audioRefs.current[playingId];
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
    }

    let audio = audioRefs.current[runId];
    if (!audio) {
      audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => {
        setPlayingId(null);
      });
      audioRefs.current[runId] = audio;
    }

    if (playingId === runId) {
      audio.pause();
      setPlayingId(null);
    } else {
      audio.play().catch(e => {
        console.error(e);
        toast.error('Không thể phát file âm thanh.');
      });
      setPlayingId(runId);
    }
  };

  // Inject Paralinguistic tag
  const injectTag = (tag: string) => {
    setText(prev => {
      // Prepend or insert at cursor
      return tag + ' ' + prev;
    });
    toast.success(`Đã chèn thẻ biểu cảm: ${tag}`);
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col md:flex-row min-h-0 w-full overflow-hidden bg-obsidian-dark animate-tab-panel-enter">

      {/* LEFT SIDE: Inputs / Parameter Tuner */}
      <div 
        style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
        className="w-full flex flex-col min-w-0 bg-zinc-950/20 overflow-y-auto h-full"
      >
        <div className="p-6 space-y-6">

          {/* Section title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-white flex items-center gap-1.5 font-sans">
                <Wand2 className="w-4 h-4 text-amber-cinematic" /> Bảng thử nghiệm OmniVoice
              </h2>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Tùy biến tham số và so sánh hiệu năng trực tiếp</p>
            </div>

            {/* Mode selection buttons */}
            <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setMode('instruct')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${mode === 'instruct' ? 'bg-amber-cinematic text-black font-extrabold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                Instruct Mode
              </button>
              <button
                onClick={() => setMode('clone')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer ${mode === 'clone' ? 'bg-amber-cinematic text-black font-extrabold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                Cloning Mode
              </button>
            </div>
          </div>

          {/* Text Area Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Văn bản mô phỏng (Text)</label>
              <span className="text-[9px] text-zinc-500 font-mono">{text.length} ký tự</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-28 bg-zinc-950/80 border border-zinc-900 focus:border-amber-cinematic/50 text-zinc-200 rounded-xl p-3.5 text-xs font-medium font-sans leading-relaxed focus:outline-none transition-all placeholder-zinc-700"
              placeholder="Nhập nội dung thoại tiếng Việt cần mô phỏng..."
            />

            {/* Quick expression injector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Chèn biểu cảm paralinguistics</span>
              <div className="flex flex-wrap gap-1.5">
                {expressionTags.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => injectTag(tag.value)}
                    className="px-2 py-1 bg-zinc-900/60 border border-zinc-850 hover:border-amber-cinematic/30 text-zinc-400 hover:text-zinc-200 text-[10px] font-semibold rounded-md transition-all cursor-pointer"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration subpanels based on active mode */}
          {mode === 'instruct' ? (
            <div className="space-y-5">

              {/* Presets List */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gợi ý cấu hình nhanh (Presets)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {instructPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="p-2.5 text-left rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-amber-cinematic/30 transition-all flex flex-col justify-center cursor-pointer group"
                    >
                      <span className="text-[10px] font-bold text-zinc-300 group-hover:text-amber-cinematic transition-colors">{preset.name}</span>
                      <span className="text-[8px] text-zinc-500 font-mono mt-0.5">{preset.descLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Instruct Builder */}
              <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-cinematic" /> Bộ xây dựng giọng nói (Instruct Voice Builder)
                </span>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Giới tính (Gender)</label>
                    <select
                      value={instructGender}
                      onChange={(e) => setInstructGender(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-amber-cinematic/40"
                    >
                      <option value="female">Nữ (Female)</option>
                      <option value="male">Nam (Male)</option>
                      <option value="">Không bắt buộc</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Độ tuổi (Age)</label>
                    <select
                      value={instructAge}
                      onChange={(e) => setInstructAge(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-amber-cinematic/40"
                    >
                      <option value="young adult">Thanh niên (Young adult)</option>
                      <option value="middle-aged">Trung niên (Middle-aged)</option>
                      <option value="elderly">Người già (Elderly)</option>
                      <option value="teenager">Thiếu niên (Teenager)</option>
                      <option value="child">Trẻ em (Child)</option>
                      <option value="">Không bắt buộc</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Cao độ (Pitch)</label>
                    <select
                      value={instructPitch}
                      onChange={(e) => setInstructPitch(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-amber-cinematic/40"
                    >
                      <option value="moderate pitch">Trung bình (Moderate pitch)</option>
                      <option value="low pitch">Trầm (Low pitch)</option>
                      <option value="very low pitch">Rất trầm (Very low pitch)</option>
                      <option value="high pitch">Bổng (High pitch)</option>
                      <option value="very high pitch">Rất bổng (Very high pitch)</option>
                      <option value="">Không bắt buộc</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Phong cách (Style)</label>
                    <select
                      value={instructStyle}
                      onChange={(e) => setInstructStyle(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-amber-cinematic/40"
                    >
                      <option value="">Bình thường</option>
                      <option value="whisper">Thì thầm (Whisper)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Chuỗi Instruct Compiled</label>
                  <input
                    type="text"
                    value={instruct}
                    onChange={(e) => setInstruct(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 text-zinc-300 text-xs font-mono font-bold rounded p-2 focus:outline-none"
                    placeholder="e.g. female, moderate pitch, young adult"
                  />
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">

              {/* Voice Cloning Reference File Upload */}
              <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-cinematic" /> Nạp file mẫu để Nhân Bản (Voice Clone Input)
                </span>

                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-zinc-850 bg-zinc-950/30 rounded-lg text-center gap-3">
                  <input
                    type="file"
                    accept=".wav"
                    ref={fileInputRef}
                    onChange={handleUploadRefFile}
                    className="hidden"
                  />

                  {isUploadingRef ? (
                    <>
                      <Loader2 className="w-8 h-8 text-amber-cinematic animate-spin" />
                      <span className="text-xs text-zinc-400">Đang nạp file audio lên máy chủ...</span>
                    </>
                  ) : refAudioFilename ? (
                    <>
                      <div className="w-8 h-8 rounded bg-amber-cinematic/10 border border-amber-cinematic/30 flex items-center justify-center text-amber-cinematic text-xs font-mono font-bold">
                        WAV
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-200 truncate max-w-[240px]">
                          {refAudioFilename.split('_').slice(2).join('_') || refAudioFilename}
                        </p>
                        <p className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-wider flex items-center gap-1 justify-center">
                          <UserCheck className="w-3.5 h-3.5" /> Nạp thành công
                        </p>
                      </div>
                      <button
                        onClick={triggerSelectFile}
                        className="mt-1 px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold uppercase rounded cursor-pointer"
                      >
                        Nạp file khác
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-zinc-600 opacity-60" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-300">Tải lên file giọng mẫu (.wav)</p>
                        <p className="text-[9px] text-zinc-500 max-w-[200px]">Chỉ hỗ trợ .wav ngắn khoảng 5-15s ghi âm giọng nói rõ chữ.</p>
                      </div>
                      <button
                        onClick={triggerSelectFile}
                        className="mt-1.5 px-3 py-1.5 bg-amber-cinematic hover:bg-amber-glow text-black text-[10px] font-black uppercase rounded cursor-pointer"
                      >
                        Chọn file mẫu
                      </button>
                    </>
                  )}
                </div>

                {/* Reference phrase is kept empty by default as requested in Vietnamese rule 3 */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    Câu chuẩn (Reference Phrase)
                    <span className="text-[8px] text-zinc-500 font-normal normal-case">(Tùy chọn, để trống cho tiếng Việt)</span>
                  </label>
                  <input
                    type="text"
                    value={refText}
                    onChange={(e) => setRefText(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 text-zinc-300 text-xs font-medium rounded p-2.5 focus:outline-none focus:border-zinc-700 placeholder-zinc-700"
                    placeholder="Để trống theo mặc định tối ưu tiếng Việt..."
                  />
                </div>
              </div>

            </div>
          )}

          {/* Advanced collapsible section */}
          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-zinc-400 focus:outline-none cursor-pointer"
            >
              <span>Tham số suy luận nâng cao</span>
              {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isAdvancedOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-4 border-t border-zinc-900/60 animate-tab-panel-enter">

                {/* Language Select */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Ngôn ngữ (Language)
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="Vietnamese">Tiếng Việt (Vietnamese)</option>
                    <option value="English">Tiếng Anh (English)</option>
                    <option value="Auto">Tự động nhận diện (Auto)</option>
                  </select>
                </div>

                {/* Speed parameter */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <FastForward className="w-3.5 h-3.5" /> Tốc độ (Speed)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.0"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Duration Limit */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Hourglass className="w-3.5 h-3.5" /> Thời lượng giới hạn
                  </label>
                  <input
                    type="number"
                    placeholder="Không giới hạn"
                    value={durationLimit}
                    onChange={(e) => setDurationLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded p-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Steps slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Số bước nội suy (Steps)</span>
                    <span className="text-amber-cinematic">{numStep}</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    step="2"
                    value={numStep}
                    onChange={(e) => setNumStep(Number(e.target.value))}
                    className="w-full accent-amber-cinematic cursor-pointer bg-zinc-900 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Guidance Scale slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Cường độ (Guidance Scale)</span>
                    <span className="text-amber-cinematic">{guidanceScale}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(Number(e.target.value))}
                    className="w-full accent-amber-cinematic cursor-pointer bg-zinc-900 rounded-lg appearance-none h-1.5"
                  />
                </div>

                {/* Denoise & Postprocess toggles */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={denoise}
                      onChange={(e) => setDenoise(e.target.checked)}
                      className="accent-amber-cinematic rounded"
                    /> Denoise âm thanh
                  </label>

                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postprocessOutput}
                      onChange={(e) => setPostprocessOutput(e.target.checked)}
                      className="accent-amber-cinematic rounded"
                    /> Chuẩn hóa Output
                  </label>
                </div>

              </div>
            )}
          </div>

          {/* Trigger synthesis button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-xl bg-amber-cinematic hover:bg-amber-glow text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-amber-cinematic/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer border border-amber-cinematic/15"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" /> Đang tổng hợp giọng nói...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black fill-black" /> Bắt đầu kết xuất audio (Synthesize)
              </>
            )}
          </button>

        </div>
      </div>

      {/* DRAG HANDLE BAR (DESKTOP ONLY) */}
      {isDesktop && (
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`hidden md:flex items-center justify-center w-1 cursor-col-resize z-30 relative select-none group border-x border-zinc-900 bg-zinc-950 transition-all ${
            isResizing ? 'bg-amber-cinematic border-amber-cinematic' : 'hover:bg-amber-cinematic/40'
          }`}
          style={{
            marginLeft: '-2px',
            marginRight: '-2px',
          }}
        >
          {/* Visual premium mechanical notch */}
          <div className={`w-[2px] h-8 rounded-full transition-colors ${
            isResizing ? 'bg-black' : 'bg-zinc-800 group-hover:bg-amber-cinematic/80'
          }`} />
        </div>
      )}

      {/* RIGHT SIDE: Inference Results Comparison Board */}
      <div 
        style={{ width: isDesktop ? `${100 - leftWidth}%` : '100%' }}
        className="w-full h-full bg-zinc-950/40 flex flex-col min-w-0 overflow-hidden"
      >

        {/* Comparison Board Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950/60">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              Lịch sử thử nghiệm
            </span>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">So sánh và tải xuống clip âm thanh</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/30 border border-zinc-850 hover:border-red-900/40 text-zinc-500 hover:text-red-400 transition-all text-[9px] font-bold uppercase tracking-wide cursor-pointer"
            >
              Dọn dẹp
            </button>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoadingHistory ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin text-amber-cinematic" />
              <span className="text-xs uppercase font-bold tracking-wider">Đang tải danh sách lịch sử...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="h-64 border border-dashed border-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 gap-3">
              <FileText className="w-8 h-8 text-zinc-700 opacity-60" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-400 uppercase">Chưa có bản ghi kết xuất</h4>
                <p className="text-[10px] text-zinc-600 max-w-[200px] mx-auto leading-relaxed">Hãy nhập văn bản và tùy chỉnh tham số bên trái để sinh tệp âm thanh đầu tiên.</p>
              </div>
            </div>
          ) : (
            history.map((run) => (
              <div
                key={run.id}
                className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 flex flex-col gap-3.5 hover:border-zinc-800 transition-colors"
              >
                {/* Mode details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${run.mode === 'clone'
                        ? 'bg-amber-cinematic/10 border border-amber-cinematic/25 text-amber-cinematic'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                      }`}>
                      {run.mode === 'clone' ? 'Voice Clone' : 'Instruct'}
                    </span>

                    <span className="text-[9px] font-mono text-zinc-500">
                      {new Date(run.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteEntry(run.id)}
                    className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                    title="Xoá bản ghi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Text summary */}
                <p className="text-xs text-zinc-300 font-medium leading-relaxed italic">
                  "{run.text}"
                </p>

                {/* Params Summary row */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-950/30 p-2 rounded-lg border border-zinc-900 text-[9px] font-mono text-zinc-500">
                  <div>
                    <span className="block text-zinc-600 uppercase text-[8px]">Hậu kỳ / Pitch</span>
                    <span className="text-zinc-400 truncate block">
                      {run.mode === 'instruct' ? run.instruct : 'Cloned Voice'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-zinc-600 uppercase text-[8px]">Inference / Steps</span>
                    <span className="text-zinc-400 font-bold block">{run.generation_time}s ({run.num_step} st)</span>
                  </div>
                  <div>
                    <span className="block text-zinc-600 uppercase text-[8px]">Audio duration</span>
                    <span className="text-emerald-500 font-bold block">{run.audio_duration}s</span>
                  </div>
                </div>

                {/* Audio controls */}
                <div className="flex items-center justify-between gap-3 pt-1">

                  {/* Play audio button */}
                  <button
                    onClick={() => togglePlayAudio(run.id, run.filename)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${playingId === run.id
                        ? 'bg-amber-cinematic border-amber-cinematic text-black shadow-md shadow-amber-cinematic/10'
                        : 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700'
                      }`}
                  >
                    {playingId === run.id ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-black" /> Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" /> Nghe thử
                      </>
                    )}
                  </button>

                  {/* Download raw wav file */}
                  <a
                    href={API.playgroundAudio(run.filename)}
                    download={run.filename}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center"
                    title="Tải file WAV"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
