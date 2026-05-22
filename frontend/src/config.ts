export const API_BASE = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:8000'
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

export const API = {
  playgroundGenerate:  `${API_BASE}/api/playground/generate`,
  playgroundUploadRef: `${API_BASE}/api/playground/upload-ref`,
  playgroundHistory:   `${API_BASE}/api/playground/history`,
  playgroundClear:     `${API_BASE}/api/playground/clear`,
  playgroundApplyToSpeaker: `${API_BASE}/api/playground/apply-to-speaker`,
  playgroundDelete:    (id: string) => `${API_BASE}/api/playground/delete/${id}`,
  playgroundAudio:     (filename: string) => `${API_BASE}/api/playground/audio/${filename}`,
} as const;
