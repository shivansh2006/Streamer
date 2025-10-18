'use client'

import { useState } from 'react'

export function SettingsDrawer() {
  const [open, setOpen] = useState(false)
  const [subtitleLang, setSubtitleLang] = useState('en')
  const [autoplay, setAutoplay] = useState(true)
  const [quality, setQuality] = useState('auto')
  const [skipIntro, setSkipIntro] = useState(true)
  const [skipOutro, setSkipOutro] = useState(true)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setOpen((v) => !v)} 
        className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>
      {open && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--bg-primary)] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-[var(--bg-secondary)] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <button 
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Playback Settings */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Playback
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Autoplay next episode</span>
                    <input 
                      type="checkbox" 
                      checked={autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)}
                      className="w-5 h-5 accent-[var(--accent)]"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Skip intro</span>
                    <input 
                      type="checkbox" 
                      checked={skipIntro}
                      onChange={(e) => setSkipIntro(e.target.checked)}
                      className="w-5 h-5 accent-[var(--accent)]"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Skip outro</span>
                    <input 
                      type="checkbox" 
                      checked={skipOutro}
                      onChange={(e) => setSkipOutro(e.target.checked)}
                      className="w-5 h-5 accent-[var(--accent)]"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[var(--text-secondary)]">Default quality</span>
                    <select 
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="bg-[var(--bg-secondary)] text-white px-4 py-2 rounded-lg border border-white/10 focus:border-[var(--accent)] outline-none"
                    >
                      <option value="auto">Auto</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                    </select>
                  </label>
                </div>
              </section>

              {/* Subtitle Settings */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Subtitles
                  <span className="ml-auto px-2 py-0.5 text-xs bg-[var(--accent)] text-white rounded-full">OpenSubtitles</span>
                </h3>
                <div className="space-y-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-[var(--text-secondary)]">Preferred language</span>
                    <select 
                      value={subtitleLang}
                      onChange={(e) => setSubtitleLang(e.target.value)}
                      className="bg-[var(--bg-secondary)] text-white px-4 py-2 rounded-lg border border-white/10 focus:border-[var(--accent)] outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                      <option value="ar">Arabic</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </label>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-white/10">
                    <p className="text-sm text-[var(--text-secondary)]">
                      <strong className="text-white">OpenSubtitles Integration</strong><br/>
                      Automatic subtitle fetching from the world&apos;s largest subtitle database. 
                      Subtitles load automatically based on your language preference.
                    </p>
                  </div>
                </div>
              </section>

              {/* About */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-fuchsia-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">StreamParadise</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Version 2.0.0</p>
                      </div>
                    </div>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Professional streaming platform powered by TMDB and multiple reliable video servers.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
