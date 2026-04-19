'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const features = [
  {
    id: 1,
    title: 'REAL-TIME SYNC',
    tag: 'CORE FEATURE',
    tagColor: '#2563EB',
    description: 'Every keystroke syncs instantly across all collaborators. Zero lag, zero conflict.',
    preview: {
      icon: '',
      headline: 'Real-Time Sync',
      sub: 'Operational Transforms · WebSocket · CRDTs',
      detail: 'See every change as it happens, across every device.',
    },
  },
  {
    id: 2,
    title: 'LIVE CURSORS',
    tag: 'PRESENCE',
    tagColor: '#7C3AED',
    description: 'See exactly where your teammates are, with named cursors and color identities.',
    preview: {
      icon: '',
      headline: 'Live Cursors',
      sub: 'Presence Awareness · Named Cursors',
      detail: "Know who's working on what, in real time.",
    },
  },
  {
    id: 3,
    title: 'SMART EDITOR',
    tag: 'OPEN EDITOR',
    tagColor: '#2563EB',
    description: 'A rich, block-based editor with markdown support, embeds and slash commands.',
    preview: {
      icon: '',
      headline: 'Smart Editor',
      sub: 'Block Editor · Markdown · Slash Commands',
      detail: 'Write beautifully with powerful formatting tools.',
    },
  },
  {
    id: 4,
    title: 'WORKSPACES',
    tag: 'ORGANIZE',
    tagColor: '#059669',
    description: 'Organize projects, docs and teams inside dedicated workspaces.',
    preview: {
      icon: '',
      headline: 'Workspaces',
      sub: 'Teams · Projects · Permissions',
      detail: 'Structure your work the way your team thinks.',
    },
  },
  {
    id: 5,
    title: 'VERSION HISTORY',
    tag: 'TIME TRAVEL',
    tagColor: '#DC2626',
    description: 'Never lose a word. Browse, restore and diff any version of your document.',
    preview: {
      icon: '',
      headline: 'Version History',
      sub: 'Snapshots · Diff View · Restore',
      detail: 'Go back in time and recover anything you need.',
    },
  },
  {
    id: 6,
    title: 'COMMENTS',
    tag: 'DISCUSS',
    tagColor: '#D97706',
    description: 'Leave inline comments, resolve threads and keep feedback in context.',
    preview: {
      icon: '',
      headline: 'Comments',
      sub: 'Threads · Inline · Resolve',
      detail: 'Collaborate on ideas without leaving your document.',
    },
  },
  {
    id: 7,
    title: 'SECURE ACCESS',
    tag: 'ENTERPRISE',
    tagColor: '#6D28D9',
    description: 'Role-based access controls, SSO, and encrypted document storage.',
    preview: {
      icon: '',
      headline: 'Secure Access',
      sub: 'RBAC · SSO · E2E Encryption',
      detail: 'Enterprise-grade security for your sensitive documents.',
    },
  },
];

export default function HomePage() {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Smooth cursor-following for the preview card
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.1);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.1);
      setPreviewPos({ x: currentPos.current.x, y: currentPos.current.y });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const hoveredFeature = features.find((f) => f.id === hovered);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100%; }

        .landing-root {
          min-height: 100vh;
          background: #f0f0ee;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ── Noise texture overlay ── */
        .landing-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        /* ── Navbar ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 36px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555;
        }

        .nav-logo { color: #111; font-weight: 800; letter-spacing: 0.05em; font-size: 13px; }

        .nav-links { display: flex; gap: 40px; }

        .nav-link {
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
          color: #555;
        }
        .nav-link:hover { color: #111; }

        .nav-cta {
          background: #111;
          color: #fff;
          padding: 8px 18px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-cta:hover { background: #2563EB; transform: translateY(-1px); }

        /* ── Feature list container ── */
        .list-container {
          position: relative;
          z-index: 10;
          padding: 100px 48px 60px 48px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* ── Individual feature row ── */
        .feature-row {
          display: flex;
          align-items: center;
          line-height: 1;
          padding: 4px 0;
          cursor: default;
          position: relative;
          user-select: none;
        }

        .feature-text {
          font-size: clamp(48px, 8vw, 112px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #c8c8c6;
          transition: color 0.25s ease, font-weight 0.15s ease, transform 0.2s ease;
          display: inline-block;
          transform-origin: left center;
          will-change: transform, color;
        }

        .feature-row.is-hovered .feature-text {
          color: #111;
          font-weight: 900;
          transform: translateX(6px);
        }

        /* Dim all other rows when any is hovered */
        .list-container.any-hovered .feature-row:not(.is-hovered) .feature-text {
          color: #d8d8d6;
          opacity: 0.45;
        }

        .feature-tag {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          margin-left: 18px;
          opacity: 0;
          transform: translateY(4px) scale(0.95);
          transition: opacity 0.25s ease, transform 0.25s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .feature-row.is-hovered .feature-tag {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Floating preview card ── */
        .preview-card {
          position: absolute;
          width: 340px;
          background: #111;
          border-radius: 14px;
          overflow: hidden;
          pointer-events: none;
          z-index: 50;
          box-shadow: 0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .preview-card.visible {
          opacity: 1;
          transform: scale(1);
        }
        .preview-card.hidden {
          opacity: 0;
          transform: scale(0.92);
          pointer-events: none;
        }

        .preview-inner {
          padding: 28px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 200px;
          position: relative;
          overflow: hidden;
        }

        .preview-inner::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.15);
          filter: blur(30px);
        }

        .preview-icon {
          font-size: 42px;
          margin-bottom: 16px;
          display: block;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
        }

        .preview-headline {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .preview-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .preview-detail {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
        }

        .preview-footer {
          padding: 14px 28px;
          background: rgba(255,255,255,0.04);
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .preview-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }

        .preview-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        /* ── Bottom CTA ── */
        .bottom-cta {
          position: fixed;
          bottom: 36px; right: 48px;
          z-index: 100;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .cta-btn {
          padding: 12px 28px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cta-primary {
          background: #2563EB;
          color: #fff;
          box-shadow: 0 8px 24px rgba(37,99,235,0.35);
        }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(37,99,235,0.45); }

        .cta-secondary {
          background: rgba(0,0,0,0.06);
          color: #111;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .cta-secondary:hover { transform: translateY(-2px); background: rgba(0,0,0,0.1); }

        /* ── Scroll hint ── */
        .scroll-hint {
          position: fixed;
          bottom: 42px; left: 48px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #aaa;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 100;
        }

        .scroll-line {
          width: 32px;
          height: 1px;
          background: #aaa;
        }
      `}</style>

      <div className="landing-root" ref={containerRef} onMouseMove={handleMouseMove}>
        {/* Navbar */}
        <nav className="nav">
          <span className="nav-logo">SYNCSPACE</span>
          <div className="nav-links">
            <a className="nav-link" href="#">Features</a>
            <a className="nav-link" href="#">Docs</a>
            <a className="nav-link" href="#">Pricing</a>
          </div>
          <Link href="/login" className="nav-cta">GET STARTED →</Link>
        </nav>

        {/* Feature List */}
        <div className={`list-container ${hovered !== null ? 'any-hovered' : ''}`}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-row ${hovered === feature.id ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHovered(feature.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="feature-text">{feature.title}</span>
              <span
                className="feature-tag"
                style={{ background: feature.tagColor }}
              >
                {feature.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Floating Preview Card — follows cursor */}
        {hoveredFeature && (
          <div
            className={`preview-card ${hovered !== null ? 'visible' : 'hidden'}`}
            style={{
              left: previewPos.x + 30,
              top: Math.max(80, Math.min(previewPos.y - 100, (containerRef.current?.offsetHeight ?? 600) - 280)),
              transform: hovered !== null ? 'scale(1)' : 'scale(0.92)',
            }}
          >
            <div className="preview-inner">
              <span className="preview-icon">{hoveredFeature.preview.icon}</span>
              <div className="preview-headline">{hoveredFeature.preview.headline}</div>
              <div className="preview-sub">{hoveredFeature.preview.sub}</div>
              <div className="preview-detail">{hoveredFeature.preview.detail}</div>
            </div>
            <div className="preview-footer">
              <span className="preview-badge">SyncSpace · Live</span>
              <div className="preview-dot" />
            </div>
          </div>
        )}

        {/* Scroll Hint */}
        <div className="scroll-hint">
          <div className="scroll-line" />
          EXPLORE FEATURES
        </div>

        {/* Bottom CTA */}
        <div className="bottom-cta">
          <Link href="/login" className="cta-btn cta-secondary">Sign In</Link>
          <Link href="/login" className="cta-btn cta-primary">Start Collaborating ↗</Link>
        </div>
      </div>
    </>
  );
}