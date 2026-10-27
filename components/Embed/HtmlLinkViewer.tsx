import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Maximize2, Minimize2, Globe, Code, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface HtmlLinkViewerProps {
  initialUrl?: string;
  initialHtml?: string;
  onClose?: () => void;
}

export const HtmlLinkViewer: React.FC<HtmlLinkViewerProps> = ({
  initialUrl = '',
  initialHtml = '',
  onClose
}) => {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [activeUrl, setActiveUrl] = useState(initialUrl);
  const [htmlInput, setHtmlInput] = useState(initialHtml);
  const [mode, setMode] = useState<'url' | 'html'>(initialHtml ? 'html' : 'url');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  const handleLoadUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    sounds.playClick();
    let target = urlInput.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('/')) {
      target = 'https://' + target;
    }
    setActiveUrl(target);
  };

  const handleRefresh = () => {
    sounds.playClick();
    setKey((prev) => prev + 1);
  };

  return (
    <div
      className={`bg-[#06080d] border border-cyan-500/30 rounded-xl overflow-hidden transition-all shadow-2xl ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none flex flex-col bg-black'
          : 'relative my-8'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-[#0c101a] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono tracking-wider text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> HTML Link Display Frame
          </span>
          <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/10 ml-2">
            <button
              onClick={() => {
                sounds.playClick();
                setMode('url');
              }}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                mode === 'url'
                  ? 'bg-cyan-500 text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              URL Link
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setMode('html');
              }}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                mode === 'html'
                  ? 'bg-cyan-500 text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3 inline mr-1" /> Raw HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeUrl && mode === 'url' && (
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-400 hover:text-cyan-300 transition-colors rounded hover:bg-white/5 text-xs flex items-center gap-1"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open Tab</span>
            </a>
          )}
          <button
            onClick={handleRefresh}
            className="p-1.5 text-zinc-400 hover:text-cyan-300 transition-colors rounded hover:bg-white/5"
            title="Reload frame"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setIsFullscreen(!isFullscreen);
            }}
            className="p-1.5 text-zinc-400 hover:text-cyan-300 transition-colors rounded hover:bg-white/5"
            title={isFullscreen ? 'Exit full screen' : 'Expand full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* URL or HTML Input controls */}
      <div className="bg-[#090d15] px-4 py-2.5 border-b border-white/5">
        {mode === 'url' ? (
          <form onSubmit={handleLoadUrl} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste the HTML link / URL here (e.g. https://... or any link)..."
                className="w-full bg-black/60 border border-white/15 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Display Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste raw HTML/CSS/JS here to display..."
              rows={3}
              className="w-full bg-black/60 border border-white/15 rounded-lg p-2.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}
      </div>

      {/* Frame / Display Area */}
      <div className={`relative bg-black ${isFullscreen ? 'flex-1 h-full' : 'h-[640px]'}`}>
        {mode === 'url' && activeUrl ? (
          <iframe
            key={key}
            src={activeUrl}
            title="Provided HTML Link"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          />
        ) : mode === 'html' && htmlInput ? (
          <iframe
            key={key}
            srcDoc={htmlInput}
            title="Provided HTML Content"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-radial from-cyan-950/20 to-black">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
              <Globe className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white mb-2">
              Ready to Display Your HTML Link
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
              Your link was not detected in the chat message. Paste any URL or HTML above or reply with it in chat, and it will render right here.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              <button
                onClick={() => {
                  setUrlInput('https://roblox.com');
                  setActiveUrl('https://roblox.com');
                  setMode('url');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 text-xs text-zinc-300 hover:text-white transition-all font-mono"
              >
                Roblox Experience
              </button>
              <button
                onClick={() => {
                  setUrlInput('https://youtube.com');
                  setActiveUrl('https://youtube.com');
                  setMode('url');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 text-xs text-zinc-300 hover:text-white transition-all font-mono"
              >
                Trailer Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
