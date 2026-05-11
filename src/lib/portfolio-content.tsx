'use client';

import { useDesktopStore } from '@/store/desktop';
import { portfolioData } from '@/data/portfolio';
import { Code, Mail, ExternalLink, ChevronDown, Sparkles, Terminal, Globe, Layers } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return isVisible;
}

function FadeInSection({ children, className = '', delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const TECH_ICONS: Record<string, string> = {
  'React': '⚛️', 'Next.js': '▲', 'TypeScript': '🔷', 'Tailwind CSS': '🎨',
  'Zustand': '🐻', 'Node.js': '🟢', 'Docker': '🐳', 'Git': '🔀',
  'Linux': '🐧', 'Vitest': '⚡', 'Playwright': '🎭', 'WebSocket': '🔌',
  'D3.js': '📊', 'Commander.js': '⌨️',
  'Python': '🐍', 'C#': '💠', 'C++': '👾', 'Java': '☕',
  'Android': '🤖', 'FastAPI': '⚡', 'Unity': '🎮', 'Spring Boot': '🍃',
  'Flutter': '🐦', 'AWS': '☁️', 'PyTorch': '🔥', 'LLM': '🧠',
  'Computer Vision': '👁️', 'PostgreSQL': '🐘', 'MySQL': '🐬', 'SQLite': '🗄️',
  'HTML/CSS/JS': '🌐', 'GSAP': '🪄', 'Three.js': '🧊', 'LangChain': '🦜',
  'OpenAI': '🤖', 'EasyOCR': '👁️', 'PyMuPDF': '📄', 'ReportLab': '🛠️',
};

const PROJECT_ICONS = [
  <Globe key="g" size={22} />,
  <Layers key="l" size={22} />,
  <Terminal key="t" size={22} />,
  <Sparkles key="s" size={22} />,
  <Code key="c" size={22} />
];

export default function PortfolioContent() {
  const locale = useDesktopStore((s) => s.locale);
  const isKo = locale === 'ko';
  const d = portfolioData;

  return (
    <div className="portfolio-root" data-testid="portfolio-content">
      <style>{`
        .portfolio-root {
          --accent: #a78bfa;
          --accent2: #6ee7b7;
          --accent3: #f472b6;
          --bg-deep: #0a0a1a;
          --bg-card: rgba(255,255,255,0.04);
          --bg-card-hover: rgba(255,255,255,0.08);
          --border-subtle: rgba(255,255,255,0.08);
          --border-hover: rgba(167,139,250,0.4);
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          min-height: 100%;
          background: var(--bg-deep);
          color: var(--text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
          position: relative;
        }
        .portfolio-root * { box-sizing: border-box; }

        /* ── Animated gradient mesh background ── */
        .portfolio-bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .portfolio-bg-mesh::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          top: -120px; left: -100px;
          background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
          animation: pf-float-1 18s ease-in-out infinite;
        }
        .portfolio-bg-mesh::after {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          bottom: -80px; right: -80px;
          background: radial-gradient(circle, rgba(110,231,183,0.1) 0%, transparent 70%);
          animation: pf-float-2 22s ease-in-out infinite;
        }
        @keyframes pf-float-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(80px,50px) scale(1.1); }
          66% { transform: translate(-30px,80px) scale(0.95); }
        }
        @keyframes pf-float-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-60px,-40px) scale(1.05); }
          66% { transform: translate(40px,-60px) scale(0.9); }
        }

        /* ── Noise texture overlay ── */
        .portfolio-noise {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        /* ── Content wrapper ── */
        .portfolio-content {
          position: relative;
          z-index: 2;
        }

        /* ── Hero ── */
        .pf-hero {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px 48px;
          text-align: center;
          position: relative;
        }
        .pf-hero-glow {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: pf-pulse 4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pf-pulse {
          0%,100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
        }

        .pf-avatar {
          width: 96px; height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa 0%, #6ee7b7 50%, #f472b6 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 40px;
          margin-bottom: 24px;
          position: relative;
          box-shadow: 0 0 40px rgba(167,139,250,0.25);
          animation: pf-avatar-spin 8s linear infinite;
          background-size: 200% 200%;
        }
        @keyframes pf-avatar-spin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .pf-hero h1 {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
          background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pf-hero-title {
          font-size: 16px;
          font-weight: 500;
          color: var(--accent);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }
        .pf-hero-tagline {
          font-size: 14px;
          color: var(--text-secondary);
          max-width: 400px;
        }
        .pf-scroll-hint {
          margin-top: 40px;
          animation: pf-bounce 2s ease-in-out infinite;
          color: var(--text-muted);
        }
        @keyframes pf-bounce {
          0%,100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(8px); opacity: 0.8; }
        }

        /* ── Sections ── */
        .pf-section {
          padding: 48px 24px;
          max-width: 720px;
          margin: 0 auto;
        }
        .pf-section-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pf-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--border-subtle), transparent);
        }
        .pf-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-subtle), transparent);
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── About ── */
        .pf-about-text {
          font-size: 15px;
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .pf-about-text::first-line {
          color: var(--text-primary);
          font-weight: 500;
        }

        /* ── Tech Stack ── */
        .pf-tech-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pf-tech-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          font-size: 13px;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          cursor: default;
        }
        .pf-tech-pill:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-hover);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(167,139,250,0.1);
        }
        .pf-tech-icon {
          font-size: 14px;
          line-height: 1;
        }

        .pf-category-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
          opacity: 0.9;
        }

        /* ── Projects ── */
        .pf-projects-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pf-project-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          position: relative;
          overflow: hidden;
          cursor: default;
        }
        .pf-project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(167,139,250,0.05), rgba(110,231,183,0.05));
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .pf-project-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(167,139,250,0.15);
        }
        .pf-project-card:hover::before { opacity: 1; }

        .pf-project-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .pf-project-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(167,139,250,0.15), rgba(110,231,183,0.1));
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }
        .pf-project-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .pf-project-desc {
          font-size: 13px;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .pf-project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          position: relative;
          z-index: 1;
        }
        .pf-project-tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(167,139,250,0.1);
          color: var(--accent);
          border: 1px solid rgba(167,139,250,0.15);
          font-weight: 500;
        }
        .pf-project-link-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s ease;
          padding: 6px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
        }
        .pf-project-link-icon:hover {
          color: var(--accent);
          background: rgba(167,139,250,0.1);
          border-color: rgba(167,139,250,0.2);
          transform: translateY(-1px) scale(1.05);
        }

        /* ── Contact ── */
        .pf-contact-grid {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .pf-contact-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .pf-contact-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-hover);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(167,139,250,0.15);
        }

        /* ── Footer ── */
        .pf-footer {
          text-align: center;
          padding: 32px 24px;
          color: var(--text-muted);
          font-size: 12px;
        }
        .pf-footer span {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
        }

        /* ── Status bar ── */
        .pf-status-bar {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 32px;
        }
        .pf-status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .pf-status-value {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pf-status-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-weight: 600;
        }
      `}</style>

      {/* Animated mesh background */}
      <div className="portfolio-bg-mesh" />
      <div className="portfolio-noise" />

      <div className="portfolio-content">
        {/* ─── Hero ─── */}
        <section className="pf-hero" aria-label="hero">
          <div className="pf-hero-glow" />
          <FadeInSection>
            <div className="pf-avatar">👩‍💻</div>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <h1>{isKo ? d.hero.name.ko : d.hero.name.en}</h1>
          </FadeInSection>
          <FadeInSection delay={0.2}>
            <div className="pf-hero-title">
              <Sparkles size={14} />
              {isKo ? d.hero.title.ko : d.hero.title.en}
            </div>
          </FadeInSection>
          <FadeInSection delay={0.3}>
            <p className="pf-hero-tagline">{isKo ? d.hero.tagline.ko : d.hero.tagline.en}</p>
          </FadeInSection>

          <FadeInSection delay={0.5}>
            <div className="pf-status-bar">
              <div className="pf-status-item">
                <span className="pf-status-value">
                  {new Set(d.techStack.flatMap(cat => cat.skills.map(s => s.name))).size}
                </span>
                <span className="pf-status-label">{isKo ? '기술 스택' : 'Tech Stack'}</span>
              </div>
              <div className="pf-status-item">
                <span className="pf-status-value">{d.projects.length}</span>
                <span className="pf-status-label">{isKo ? '프로젝트' : 'Projects'}</span>
              </div>
              <div className="pf-status-item">
                <span className="pf-status-value">∞</span>
                <span className="pf-status-label">{isKo ? '열정' : 'Passion'}</span>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.7}>
            <div className="pf-scroll-hint">
              <ChevronDown size={20} />
            </div>
          </FadeInSection>
        </section>

        <div className="pf-divider" />

        {/* ─── About ─── */}
        <FadeInSection className="pf-section">
          <div className="pf-section-title">
            {isKo ? '소개' : 'About'}
          </div>
          <p className="pf-about-text">
            {isKo ? d.about.ko : d.about.en}
          </p>
        </FadeInSection>

        <div className="pf-divider" />

        {/* ─── Tech Stack ─── */}
        <FadeInSection className="pf-section">
          <div className="pf-section-title">
            {isKo ? '기술 스택' : 'Tech Stack'}
          </div>
          <div className="pf-category-list">
            {d.techStack.map((category, catIdx) => (
              <div key={category.title.en} className="pf-category-group" style={{ marginBottom: catIdx === d.techStack.length - 1 ? 0 : '24px' }}>
                <h3 className="pf-category-title">{isKo ? category.title.ko : category.title.en}</h3>
                <div className="pf-tech-grid" data-testid={`tech-stack-${category.title.en.toLowerCase().replace(/\s+/g, '-')}`}>
                  {category.skills.map((tech, i) => (
                    <FadeInSection key={tech.name + i} delay={i * 0.04}>
                      <div className="pf-tech-pill">
                        <span className="pf-tech-icon">{TECH_ICONS[tech.name] || '🔧'}</span>
                        {tech.name}
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>

        <div className="pf-divider" />

        {/* ─── Projects ─── */}
        <FadeInSection className="pf-section">
          <div className="pf-section-title">
            {isKo ? '프로젝트' : 'Projects'}
          </div>
          <div className="pf-projects-grid">
            {d.projects.map((project, i) => (
              <FadeInSection key={project.title} delay={i * 0.12}>
                <div className="pf-project-card">
                  <div className="pf-project-header">
                    <div className="pf-project-icon">
                      {PROJECT_ICONS[i] || <Layers size={22} />}
                    </div>
                    <div className="pf-project-name">{project.title}</div>
                    {project.link && (
                      <a
                        href={project.link}
                        className="pf-project-link-icon"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={isKo ? '보기' : 'View'}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <p className="pf-project-desc">
                    {isKo ? project.description.ko : project.description.en}
                  </p>
                  <div className="pf-project-tags">
                    {project.tech.map((t) => (
                      <span key={t} className="pf-project-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </FadeInSection>

        <div className="pf-divider" />

        {/* ─── Contact ─── */}
        <FadeInSection className="pf-section" style={{ textAlign: 'center' } as React.CSSProperties}>
          <div className="pf-section-title" style={{ justifyContent: 'center' }}>
            {isKo ? '연락처' : 'Contact'}
          </div>
          <div className="pf-contact-grid">
            {d.contact.github && (
              <a href={d.contact.github} className="pf-contact-btn" target="_blank" rel="noopener noreferrer">
                <Code size={18} /> GitHub
              </a>
            )}
            {d.contact.email && (
              <a href={`mailto:${d.contact.email}`} className="pf-contact-btn">
                <Mail size={18} /> Email
              </a>
            )}
          </div>
        </FadeInSection>

        {/* ─── Footer ─── */}
        <div className="pf-footer">
          {isKo
            ? <>© 2026 <span>hanaoverride</span>. 모든 권리 보유.</>
            : <>© 2026 <span>hanaoverride</span>. All rights reserved.</>}
        </div>
      </div>
    </div>
  );
}
