import torch
import soundfile as sf
import os
import re
import transformers

transformers.logging.set_verbosity_error()

# Ensure we import OmniVoice safely
try:
    from omnivoice import OmniVoice
except ImportError:
    print("[OmniVoice] Warning: 'omnivoice' library not found in the environment yet.")

class AudioGenerator:
    def __init__(self):
        model_name = os.getenv("TTS_MODEL_NAME", "k2-fsa/OmniVoice")
        
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.dtype = torch.float16 if torch.cuda.is_available() else torch.float32
        
        # Check standard HuggingFace Hub cache path to alert user if a download is about to start
        try:
            from huggingface_hub.constants import HF_HUB_CACHE
            cache_dir = os.path.join(HF_HUB_CACHE, f"models--{model_name.replace('/', '--')}")
            is_cached = os.path.exists(cache_dir)
        except Exception:
            is_cached = False
            
        print("\n" + "#"*70)
        print(" 🤖 [OMNIVOICE PLAYGROUND] - SYSTEM INITIALIZATION")
        print("#"*70)
        print(f" Target Model: '{model_name}'")
        print(f" Device Map:  {self.device} | Precision: {self.dtype}")
        print(" ")
        print(" 📦 CACHE SETTINGS:")
        print("  - Caching weights in the default HuggingFace home directory.")
        if is_cached:
            print("  - [OK] Model weights already cached locally in HuggingFace Hub directory.")
            print("  - Loading weights now...")
        else:
            print("  - [FIRST BOOT] Model weights NOT found locally in cache.")
            print("  - HuggingFace will now download ~1.2 GB of weights from the hub.")
            print("  - Please ensure your internet connection is active.")
            print(" ")
            print(" ⚠️  CRITICAL: PLEASE KEEP THIS WINDOW OPEN AND ACTIVE.")
            print("  - Initialization may take 1 to 5 minutes depending on bandwidth.")
            print("  - DO NOT close the terminal during download.")
        print("#"*70 + "\n")
        
        try:
            self.model = OmniVoice.from_pretrained(
                model_name,
                device_map=self.device,
                dtype=self.dtype
            )
            print(f"\n[OmniVoice] Model weights verified and loaded successfully on: {self.device}\n")
        except Exception as e:
            print(f"\n[OmniVoice] Error initializing model: {e}")
            print("[OmniVoice] Running sandbox server in standalone [MOCK MODE] for frontend testing.")
            print("[OmniVoice] (No GPU/model weights required for mockup flowboard & DAW visuals)\n")
            self.model = None

    def generate(self, text, speed=1.0, ref_audio_path=None, ref_text=None, instruct=None, denoise=True, postprocess_output=True, num_step=32, guidance_scale=2.0, duration=None):
        """
        Synthesize audio. Returns numpy audio array or triggers fallback mockup voice.
        """
        if self.model is None:
            # Mock generating audio (sine wave) for lightweight local testing/sandboxing
            import numpy as np
            print("[OmniVoice] [MOCK MODE] Synthesizing mock voice output...")
            sample_rate = 24000
            duration_sec = duration if duration else 3.0
            t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False)
            audio_data = np.sin(2 * np.pi * 440 * t) * 0.5
            return [audio_data]

        # 1. Clean markdown & paralinguistic notations
        text = re.sub(r'\(.*?\)', '', text)       # Strip (laughter) etc.
        text = re.sub(r'\*.*?\*', '', text)       # Strip *whispers* etc.
        text = text.replace("...", ". ").replace("..", ". ")
        
        def process_text_parts(match):
            tag = match.group(1) or ""
            text_outside = match.group(2) or ""
            if tag:
                tag_inner = tag.strip("[]")
                # Normalize paralinguistic tags like [SIGH] to lowercase
                if not any(char.isdigit() or char.isspace() for char in tag_inner):
                    tag = f"[{tag_inner.lower()}]"
            return tag + text_outside
        
        parts = re.findall(r'(\[.*?\])?([^\[]*)', text)
        text = "".join(process_text_parts(re.match(r'(\[.*?\])?([^\[]*)', p[0] + p[1])) for p in parts if p[0] or p[1])
        text = text.replace("  ", " ").strip()
        
        kwargs = {
            "audio_chunk_duration": 10.0,
            "audio_chunk_threshold": 15.0,
            "speed": float(speed),
            "denoise": bool(denoise),
            "postprocess_output": bool(postprocess_output),
            "num_step": int(num_step),
            "guidance_scale": float(guidance_scale)
        }
        if duration:
            kwargs["duration"] = float(duration)
            
        if ref_audio_path and os.path.exists(ref_audio_path):
            print(f"[OmniVoice] Inference in [Cloning Mode] with ref audio: {ref_audio_path}")
            return self.model.generate(
                text=text,
                ref_audio=ref_audio_path,
                ref_text=ref_text if ref_text and ref_text.strip() else None,
                **kwargs
            )
        else:
            inst = instruct if instruct and instruct.strip() else "female, moderate pitch, young adult"
            print(f"[OmniVoice] Inference in [Instruct Mode] with layout: '{inst}'")
            return self.model.generate(
                text=text,
                instruct=inst,
                **kwargs
            )
