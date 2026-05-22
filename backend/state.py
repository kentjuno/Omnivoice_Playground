"""Shared standalone server singletons."""
import os
import re

def normalize_speaker_id(speaker: str) -> str:
    """Normalize speaker name to be safe for filenames and JSON dict keys."""
    if not speaker:
        return ""
    s = str(speaker).lower().strip()
    s = re.sub(r'[^a-z0-9_]', '_', s)
    s = re.sub(r'_+', '_', s)
    return s.strip('_')

# Lazy load AudioGenerator to avoid slow initialization on CLI command loads
_audio_gen_instance = None

def get_audio_generator():
    global _audio_gen_instance
    if _audio_gen_instance is None:
        from audio_generator import AudioGenerator
        _audio_gen_instance = AudioGenerator()
    return _audio_gen_instance
