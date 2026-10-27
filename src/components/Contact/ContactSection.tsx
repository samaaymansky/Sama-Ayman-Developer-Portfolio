import React, { useState } from 'react';
import { Mail, Check, Copy, Send, MessageSquare, Youtube, Twitter } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { SectionGlowDivider } from '../Common/SectionGlowDivider';

interface ContactSectionProps {
  onOpenDrawer?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Game Design Collaboration',
    message: ''
  });

  const handleCopy = () => {
    sounds.playClick(600);
    navigator.clipboard?.writeText('skyhelyn@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick(880);
    setSent(true);
  };

  return (
    <section id="contact-section" className="py-24 relative overflow-hidden">
      {/* Cyan glow */}
      <div 
        className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionGlowDivider />
        
        {/* Section Heading */}
        <div className="mb-12 max-w-xl">
          <p className="font-mono text-xs text-blue-400 tracking-wider uppercase mb-2">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Let's talk</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Open to collaborations, freelance work, and studio inquiries for Limits Studios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Direct channels & Quick Action buttons */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-2xl bg-[#0c1424] border border-blue-500/20 space-y-4">
              <span className="font-mono text-xs text-blue-300 uppercase block">Direct Email</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 font-mono text-sm">
                <span className="text-white">skyhelyn@gmail.com</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-cyan-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="mailto:skyhelyn@gmail.com"
                  onClick={() => sounds.playClick(600)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md shadow-blue-600/25 border border-blue-400/40"
                >
                  <Mail className="w-4 h-4 text-blue-200" />
                  <span>Email me directly</span>
                </a>
              </div>
            </div>

            {/* Social channels */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.playClick(500)}
                className="p-4 rounded-xl bg-[#0c1424] border border-blue-500/20 hover:border-blue-400 text-center text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2"
              >
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Discord</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.playClick(500)}
                className="p-4 rounded-xl bg-[#0c1424] border border-blue-500/20 hover:border-blue-400 text-center text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2"
              >
                <Youtube className="w-5 h-5 text-blue-400" />
                <span>YouTube</span>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.playClick(500)}
                className="p-4 rounded-xl bg-[#0c1424] border border-blue-500/20 hover:border-blue-400 text-center text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm flex flex-col items-center gap-2"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span>X / Twitter</span>
              </a>
            </div>

          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7">
            <div className="p-7 rounded-2xl bg-[#0c1424] border border-blue-500/20 shadow-xl shadow-blue-950/40">
              {sent ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-sans">Message Dispatched</h4>
                  <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to Sama Ayman. I'll get back to you regarding Limits Studios inquiries shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-xs font-mono text-cyan-400 hover:underline pt-2 block mx-auto"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Liam Cross"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#070b14] border border-blue-900/60 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#070b14] border border-blue-900/60 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Inquiry Purpose</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#070b14] border border-blue-900/60 text-white focus:border-blue-400 focus:outline-none"
                    >
                      <option>Game Design &amp; Systems Collaboration</option>
                      <option>Joining Limits Studios / Team Inquiries</option>
                      <option>Horror Atmosphere &amp; Task Prototyping</option>
                      <option>General Connect &amp; Industry Chat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project, timeline, or design challenges..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#070b14] border border-blue-900/60 text-white focus:border-blue-400 focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium font-sans text-xs rounded-xl transition-all shadow-md shadow-blue-600/30 border border-blue-400/40 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-blue-200" />
                    <span>Send Message to Sama</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
