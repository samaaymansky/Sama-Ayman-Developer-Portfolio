import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="block" id="about-section">
      <div className="wrap">
        <div className="scroll-glow in" />
        <p className="block-eyebrow reveal in" style={{ marginBottom: '36px' }}>
          01 — About
        </p>
        <div className="about-grid">
          <div className="about-copy reveal in">
            <p className="lede">
              Founder of Limits Studios, focused on horror games — including SOLITUDE — that blend narrative tension, level design, and experimental mechanics.
            </p>
            <p>
              I&rsquo;m expanding my work beyond the platform I started on as I develop my design style, build stronger technical foundations, and shape the identity of Limits as a studio that creates atmospheric, story-driven experiences. Connect with us on our socials, or reach out about joining the team.
            </p>
          </div>
          <div className="facts-list reveal in">
            <div className="fact-row">
              <span className="f-label">Role</span>
              <span className="f-value">Technical Game Designer</span>
            </div>
            <div className="fact-row">
              <span className="f-label">Studio</span>
              <span className="f-value">Limits Studios (Founder)</span>
            </div>
            <div className="fact-row">
              <span className="f-label">Focus</span>
              <span className="f-value">Horror games</span>
            </div>
            <div className="contact-row-list" id="contact-mini">
              <a href="mailto:skyhelyn@gmail.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="1.5" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                skyhelyn@gmail.com
              </a>
              <a href="#">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="6" width="18" height="13" rx="3" />
                  <path d="M8 10v3M16 10v3M8 19l1.5-2h5L16 19" />
                </svg>
                Discord
              </a>
              <a href="#">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="1.5" />
                  <path d="M9 9l6 3-6 3V9z" />
                </svg>
                YouTube
              </a>
              <a href="#">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 4l16 16M20 4L4 20" />
                </svg>
                X
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
