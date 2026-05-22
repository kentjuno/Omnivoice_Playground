import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import Playground from './components/playground/Playground';
import { AudioStudioMock } from './components/mocks/AudioStudioMock';
import { VideoStudioMock } from './components/mocks/VideoStudioMock';
import { PostProductionMock } from './components/mocks/PostProductionMock';
import { LicenseModal } from './components/layout/LicenseModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'audio' | 'video' | 'post-production'>('playground');
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [licenseTitle, setLicenseTitle] = useState('Tính năng này yêu cầu bản quyền thương mại');

  const triggerLicense = (title?: string) => {
    if (title) {
      setLicenseTitle(title);
    } else {
      setLicenseTitle('Tính năng này yêu cầu bản quyền thương mại');
    }
    setIsLicenseOpen(true);
  };

  return (
    <div className="min-h-screen bg-obsidian-dark text-zinc-200 flex flex-col font-sans selection:bg-amber-cinematic selection:text-black">
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#121214',
            color: '#e4e4e7',
            border: '1px solid #27272a',
            fontSize: '12px',
            fontFamily: 'system-ui',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#000000',
            },
          },
        }}
      />

      {/* Header Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'playground') {
            setActiveTab(tab);
          } else {
            // Trigger license gate but still show mock
            setActiveTab(tab);
          }
        }} 
        onTriggerLicense={() => triggerLicense('Đăng ký bản quyền Studio Noir Full Suite')}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        {activeTab === 'playground' && <Playground />}
        {activeTab === 'audio' && <AudioStudioMock onTriggerLicense={() => triggerLicense('Đăng ký bản quyền Audio Studio DAW')} />}
        {activeTab === 'video' && <VideoStudioMock onTriggerLicense={() => triggerLicense('Đăng ký bản quyền Video Studio Flowboard')} />}
        {activeTab === 'post-production' && <PostProductionMock onTriggerLicense={() => triggerLicense('Đăng ký bản quyền Post-Production Video Renderer')} />}
      </main>

      {/* Glassmorphic Upgrade Call to Action Gate */}
      <LicenseModal 
        isOpen={isLicenseOpen} 
        onClose={() => setIsLicenseOpen(false)} 
        title={licenseTitle}
      />
    </div>
  );
}
