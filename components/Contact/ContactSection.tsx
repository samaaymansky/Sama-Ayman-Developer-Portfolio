import React from 'react';
import { sounds } from '../../utils/audio';

export const ContactSection: React.FC = () => {
  return (
    <section className="block contact-block" id="contact-section" style={{ borderBottom: 'none' }}>
      <div className="angle-divider">
        <svg viewBox="0 0 1200 64" preserveAspectRatio="none">
          <polygon points="0,64 1200,0 1200,64" fill="#123a63" />
        </svg>
      </div>
      <div className="wrap" style={{ paddingTop: '12px' }}>
        <div className="block-head reveal in" style={{ marginBottom: 0 }}>
          <p className="block-eyebrow">04 — Contact</p>
          <h2 className="block-title">Let&apos;s talk</h2>
          <p className="block-sub">Open to collaborations, freelance work, and studio inquiries.</p>
        </div>
        <div className="contact-actions reveal in">
          <a 
            className="btn primary" 
            href="mailto:skyhelyn@gmail.com"
            onClick={() => sounds.playClick(600)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="14" rx="1.5" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            Email me
          </a>
          <a 
            className="btn" 
            href="#contact-section"
            onClick={() => sounds.playClick(500)}
          >
            Discord
          </a>
          <a 
            className="btn" 
            href="https://youtube.com" 
            target="_blank" 
            rel="noreferrer"
            onClick={() => sounds.playClick(500)}
          >
            YouTube
          </a>
          <a 
            className="btn" 
            href="#contact-section"
            onClick={() => sounds.playClick(500)}
          >
            X
          </a>
        </div>
      </div>
    </section>
  );
};
