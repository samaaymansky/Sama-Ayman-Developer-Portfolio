import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Check, Download, MapPin, Copy, Calendar } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    roleType: 'Full-Time Lead / Senior Tech Designer',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sounds.playClick(440);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick(880);
    setSubmitted(true);
  };

  const copyEmail = () => {
    sounds.playClick(600);
    navigator.clipboard?.writeText('aiden.vance.games@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleDownloadResume = () => {
    sounds.playClick(720);
    // Create simulated text resume download
    const resumeText = `AIDEN VANCE - TECHNICAL GAME DESIGNER & SYSTEMS ARCHITECT
Email: aiden.vance.games@gmail.com
Location: Seattle, WA (Open to Remote / Relocation)
Portfolio: Live Web Systems Portfolio

SUMMARY:
Technical Game Designer with 8+ years experience specializing in 3C controller feel, animation motion warping, procedural level generation (WFC), and deterministic combat math in Unreal Engine 5 (C++/GAS) and Unity (C#/DOTS).

CORE SKILLS:
- Engines: Unreal Engine 5.1-5.4, Unity 2022-6.0, Godot 4
- Languages: C++, C#, HLSL, Python
- Systems: Gameplay Ability System (GAS), Behavior Trees, State Trees, Wave Function Collapse
- Math: Physics integration, combat damage models, Monte Carlo loot balancing

SHIPPED TITLES & HIGHLIGHTS:
- Aetherfall: Fracture (UE5.3) - Lead Technical Designer
- Chronocore: Zero (Unity DOTS) - Senior Systems & Combat Designer
- Cartographer's Remnant (Godot) - ProcGen & Technical Level Designer
`;
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Aiden_Vance_Technical_Game_Designer_Resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect &amp; Production Inquiries</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick(440);
              onClose();
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Availability Status */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for New Roles &amp; Contracts</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Lead / Senior Technical Game Designer · Full-time or Principal Consulting
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadResume}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Resume</span>
            </button>
          </div>

          {/* Quick Direct Email Copy */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Direct Email:</span>
            <button
              type="button"
              onClick={copyEmail}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <span>aiden.vance.games@gmail.com</span>
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Form or Success State */}
          {submitted ? (
            <div className="p-6 bg-slate-950/90 rounded-xl border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">Inquiry Transmitted</h4>
              <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. Aiden responds to technical inquiries and portfolio walkthrough requests within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-mono text-amber-400 underline hover:text-amber-300 pt-2 block mx-auto"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Studio / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Respawn / Indie Studio"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Engagement Type</label>
                <select
                  value={formData.roleType}
                  onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:border-amber-400 focus:outline-none"
                >
                  <option>Full-Time Lead / Senior Tech Designer</option>
                  <option>Combat Systems Design Consultation</option>
                  <option>3C Feel &amp; Game Juice Workshop / Audit</option>
                  <option>Procedural Generation (WFC) Architecture</option>
                  <option>General Studio Chat / Portfolio Walkthrough</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Project Brief / Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details on your engine stack, project phase, and specific technical game design needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:border-amber-400 focus:outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-bold text-xs rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Inquiry</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
