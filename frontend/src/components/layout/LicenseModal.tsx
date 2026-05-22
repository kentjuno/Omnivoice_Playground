import React from 'react';
import { X, Check, ShieldAlert, Sparkles, Zap, MessageSquare } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function LicenseModal({ isOpen, onClose, title = "Tính năng này yêu cầu bản quyền thương mại" }: LicenseModalProps) {
  if (!isOpen) return null;

  const handleContact = () => {
    window.open('https://t.me/Kentjuno', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Premium Glass Card */}
      <div className="relative w-full max-w-4xl glass-modal rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col md:flex-row border border-amber-cinematic/20 animate-tab-panel-enter z-10 bg-zinc-950/90">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-900/60 hover:bg-zinc-800 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side Info / Branding */}
        <div className="flex-1 p-8 flex flex-col justify-between bg-gradient-to-br from-zinc-950 to-zinc-900 border-r border-zinc-800/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-cinematic/10 border border-amber-cinematic/20 text-amber-cinematic text-[10px] font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3 h-3 animate-pulse" /> Studio Noir Suite
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-tight uppercase font-sans mb-3">
              Mở khoá toàn bộ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-cinematic to-amber-glow">
                Audiobook Factory
              </span>
            </h2>
            
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Bạn đang ở trong môi trường thử nghiệm Sandbox Playground. Để sử dụng các công cụ chuyên nghiệp như **Audio Studio (DAW)**, **Video Studio (Flowboard Nodes)** và **Post-Production Video rendering**, bạn cần nâng cấp bản quyền thương mại.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-amber-cinematic/10 border border-amber-cinematic/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-amber-cinematic" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Không giới hạn xử lý (Unlimited Pipeline)</h4>
                  <p className="text-[10px] text-zinc-500">Render đồng thời hàng ngàn câu thoại dài, xử lý thông suốt hoàn toàn tự động.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-amber-cinematic/10 border border-amber-cinematic/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-amber-cinematic" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Dàn dựng Clip & Node-Based Video Studio</h4>
                  <p className="text-[10px] text-zinc-500">Tự động hóa toàn bộ A/B Roll, liên kết kịch bản chữ, thoại và video hoạt cảnh thông minh.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-amber-cinematic/10 border border-amber-cinematic/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-amber-cinematic" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Mã hóa độc lập (Standalone Deployment)</h4>
                  <p className="text-[10px] text-zinc-500">Cài đặt trực tiếp offline trên cụm máy khách hàng, tự quản trị tài nguyên 100%.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-cinematic" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-zinc-500">HỖ TRỢ TRỰC TIẾP</div>
              <div className="text-xs font-bold text-zinc-300">Đội ngũ kỹ thuật hỗ trợ 24/7</div>
            </div>
          </div>
        </div>

        {/* Right Side Pricing Options */}
        <div className="flex-1 p-8 flex flex-col justify-between bg-zinc-950/60">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Bảng giá tham khảo</h3>

            {/* Plan 1 */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between hover:border-zinc-700/60 transition-colors">
              <div>
                <div className="text-xs font-bold text-zinc-300">Starter Playground</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Dành cho cá nhân trải nghiệm OmniVoice</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">$0</div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Miễn Phí</div>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="p-4 rounded-xl border border-amber-cinematic/20 bg-amber-cinematic/5 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-cinematic text-black text-[8px] font-black uppercase tracking-widest rounded-bl">
                Popular
              </div>
              <div>
                <div className="text-xs font-bold text-amber-cinematic flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-cinematic text-amber-cinematic" /> Pro Studio Suite
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Xử lý sách nói & A/B roll tự động</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">Contact</div>
                <div className="text-[9px] text-amber-cinematic font-bold">Kentjuno</div>
              </div>
            </div>

            {/* Plan 3 */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between hover:border-zinc-700/60 transition-colors">
              <div>
                <div className="text-xs font-bold text-zinc-300">Enterprise deployment</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Standalone cài đặt máy chủ riêng</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-white">Custom</div>
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Trọn Gói</div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button 
              onClick={handleContact}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-cinematic hover:bg-amber-glow text-black font-extrabold shadow-lg shadow-amber-cinematic/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide uppercase"
            >
              <MessageSquare className="w-4 h-4 fill-black" /> Liên hệ Kent qua Telegram
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-transparent border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer"
            >
              Quay lại thử nghiệm Playground
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
