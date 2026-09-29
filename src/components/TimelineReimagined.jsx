import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   TimelineReimagined — "The River"
   An animated vertical SVG river that starts as one stream (2014),
   forks into two branches (Govt & Tech), GATE ×3 shown as momentum waves,
   then both converge back to 2017 — MNNIT Allahabad.
   ───────────────────────────────────────────────────────────────────────── */

const STYLES = `
  .tr-root {
    position: relative;
    width: 100%;
    font-family: var(--heading-font);
  }

  /* ── Header ── */
  .tr-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 28px 16px;
    flex-wrap: wrap; gap: 10px;
  }
  .tr-header-left { display: flex; align-items: center; gap: 14px; }
  .tr-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(124,58,237,0.06));
    border: 1px solid rgba(6,182,212,0.15);
    box-shadow: 0 0 20px rgba(6,182,212,0.05);
  }
  .tr-title {
    font-size: 1.1rem; font-weight: 800; color: #fff;
    letter-spacing: -0.02em;
  }
  .tr-sub {
    font-size: 0.73rem; color: rgba(148,163,184,0.55);
    margin-top: 2px; font-style: italic;
  }
  .tr-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 999px;
    font-family: var(--mono-font);
    font-size: 0.68rem; font-weight: 600;
    color: rgba(103,232,249,0.85);
    background: rgba(6,182,212,0.05);
    border: 1px solid rgba(6,182,212,0.12);
    letter-spacing: 0.04em;
  }

  /* ── SVG Container ── */
  .tr-svg-wrap {
    position: relative;
    width: 100%;
    padding: 0 28px;
    box-sizing: border-box;
  }
  .tr-svg { width: 100%; overflow: visible; display: block; }

  /* ── River path animations ── */
  .tr-path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .tr-path-draw {
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    transition: stroke-dashoffset 2.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .tr-path-draw.drawn { stroke-dashoffset: 0; }
  .tr-path-draw.delay-1 { transition-delay: 0.4s; }
  .tr-path-draw.delay-2 { transition-delay: 0.7s; }
  .tr-path-draw.delay-3 { transition-delay: 1.2s; }
  .tr-path-draw.delay-4 { transition-delay: 1.5s; }

  /* Flow shimmer — parallel wavy lines */
  .tr-flow-line {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 6 10;
    animation: tr-flow 3s linear infinite;
  }
  @keyframes tr-flow {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 48; }
  }
  .tr-flow-line.delay-a { animation-delay: -1s; }
  .tr-flow-line.delay-b { animation-delay: -2s; }

  /* Ripple / wave circles at milestone points */
  .tr-ripple {
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  .tr-ripple.visible { opacity: 1; }
  .tr-ripple-ring {
    fill: none; stroke-width: 1;
    animation: tr-ripple-anim 2.2s ease-out infinite;
    transform-origin: center;
  }
  @keyframes tr-ripple-anim {
    0%   { transform: scale(0.6); opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  .tr-ripple-ring.r2 { animation-delay: 0.5s; }
  .tr-ripple-ring.r3 { animation-delay: 1s; }

  /* Milestone dot */
  .tr-dot {
    transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
    opacity: 0;
  }
  .tr-dot.visible { opacity: 1; }

  /* Labels */
  .tr-year {
    font-family: var(--mono-font);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.04em;
  }
  .tr-label {
    font-family: var(--heading-font);
    font-size: 11.5px; font-weight: 700;
  }
  .tr-sublabel {
    font-family: var(--mono-font);
    font-size: 9px; letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .tr-tag-text {
    font-family: var(--mono-font);
    font-size: 8.5px; letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* ── Side cards ── */
  .tr-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 0 28px 20px;
  }
  .tr-card {
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(12,12,18,0.6);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                transform 0.7s cubic-bezier(0.22,1,0.36,1);
  }
  .tr-card.visible { opacity: 1; transform: translateY(0); }
  .tr-card.govt {
    border-color: rgba(16,185,129,0.12);
    transition-delay: 0.5s;
  }
  .tr-card.govt::before {
    content: ''; display: block; height: 2px; border-radius: 1px;
    background: linear-gradient(90deg, #10B981, transparent);
    margin-bottom: 10px;
  }
  .tr-card.tech {
    border-color: rgba(124,58,237,0.12);
    transition-delay: 0.7s;
  }
  .tr-card.tech::before {
    content: ''; display: block; height: 2px; border-radius: 1px;
    background: linear-gradient(90deg, #7C3AED, transparent);
    margin-bottom: 10px;
  }
  .tr-card-label {
    font-family: var(--mono-font);
    font-size: 0.6rem; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 5px;
  }
  .tr-card-title {
    font-size: 0.82rem; font-weight: 700; color: #fff;
    margin-bottom: 6px; letter-spacing: -0.01em;
  }
  .tr-card-items {
    display: flex; flex-direction: column; gap: 4px;
  }
  .tr-card-item {
    font-family: var(--mono-font);
    font-size: 0.68rem; color: rgba(148,163,184,0.7);
    display: flex; align-items: center; gap: 6px;
  }
  .tr-card-item::before {
    content: '→'; font-size: 0.6rem;
    flex-shrink: 0;
  }

  /* ── Quote bar ── */
  .tr-quote {
    margin: 4px 28px 24px;
    padding: 14px 18px 14px 22px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(6,182,212,0.04), rgba(124,58,237,0.02));
    border: 1px solid rgba(6,182,212,0.1);
    position: relative; overflow: hidden;
  }
  .tr-quote::after {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #06B6D4, rgba(6,182,212,0.15));
    border-radius: 3px 0 0 3px;
  }
  .tr-quote-text {
    position: relative;
    font-size: 0.79rem; color: rgba(241,245,249,0.78);
    font-style: italic; line-height: 1.7;
  }
  .tr-quote-text strong { color: #67E8F9; font-style: normal; font-weight: 600; }
`;

export default function TimelineReimagined() {
  const rootRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [milestones, setMilestones] = useState(false);
  const [cards, setCards] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          setTimeout(() => setMilestones(true), 1000);
          setTimeout(() => setCards(true), 1400);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── SVG geometry ──────────────────────────────────────────────────────
  // ViewBox: 400 × 560 (vertical river)
  // Origin (2014): (200, 40)
  // Fork point:    (200, 130)
  // Left branch (Govt):  end at (90, 360)
  // Right branch (Tech): end at (310, 360)
  // GATE wave markers on right branch: y=220, y=280, y=330
  // Rejoin:        (200, 460)
  // End (2017):    (200, 520)

  const VW = 400, VH = 560;
  const originX = 200, originY = 42;
  const forkX = 200,   forkY = 130;
  const govtX = 90,    govtY = 360;
  const techX = 310,   techY = 360;
  const rejoinX = 200, rejoinY = 460;
  const endX = 200,    endY = 520;

  // Main stem (origin → fork)
  const stemPath = `M ${originX} ${originY} C ${originX} ${originY+40}, ${forkX} ${forkY-40}, ${forkX} ${forkY}`;

  // Left branch (fork → govt destination)
  const leftPath = `M ${forkX} ${forkY} C ${forkX-30} ${forkY+60}, ${govtX+30} ${govtY-80}, ${govtX} ${govtY}`;

  // Right branch (fork → tech destination)
  const rightPath = `M ${forkX} ${forkY} C ${forkX+30} ${forkY+60}, ${techX-30} ${techY-80}, ${techX} ${techY}`;

  // Left rejoin (govt → rejoin)
  const leftRejoin = `M ${govtX} ${govtY} C ${govtX+20} ${govtY+50}, ${rejoinX-50} ${rejoinY-50}, ${rejoinX} ${rejoinY}`;

  // Right rejoin (tech → rejoin)
  const rightRejoin = `M ${techX} ${techY} C ${techX-20} ${techY+50}, ${rejoinX+50} ${rejoinY-50}, ${rejoinX} ${rejoinY}`;

  // End stem (rejoin → end)
  const endPath = `M ${rejoinX} ${rejoinY} C ${rejoinX} ${rejoinY+30}, ${endX} ${endY-30}, ${endX} ${endY}`;

  // GATE wave milestone positions on right branch (approximate path points)
  const gateWaves = [
    { cx: 288, cy: 218, year: '2015', label: 'GATE', delay: '1.2s' },
    { cx: 315, cy: 288, year: '2016', label: 'GATE', delay: '1.5s' },
    { cx: 318, cy: 345, year: '2017', label: 'GATE ✓', delay: '1.8s' },
  ];

  // CGPSC milestone on left branch
  const govtMilestone = { cx: 104, cy: 290, label: 'CGPSC', sublabel: 'CLEARED', delay: '1s' };

  return (
    <div ref={rootRef} className="tr-root">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="tr-header">
        <div className="tr-header-left">
          <div className="tr-icon">〰️</div>
          <div>
            <div className="tr-title">The River</div>
            <div className="tr-sub">a stream that chose its own course</div>
          </div>
        </div>
        <div className="tr-badge">
          <span style={{ color: '#06B6D4' }}>◆</span> 2014 – 2017
        </div>
      </div>

      {/* SVG River */}
      <div className="tr-svg-wrap">
        <svg className="tr-svg" viewBox={`0 0 ${VW} ${VH}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Glow filter for river */}
            <filter id="tr-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="tr-glow-green">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="tr-glow-purple">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="tr-glow-gold">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Wide river base (shadow/glow layer) ── */}
          <path d={stemPath}    className="tr-path" stroke="rgba(6,182,212,0.06)"  strokeWidth="20" />
          <path d={leftPath}   className="tr-path" stroke="rgba(16,185,129,0.05)" strokeWidth="16" />
          <path d={rightPath}  className="tr-path" stroke="rgba(124,58,237,0.05)" strokeWidth="16" />
          <path d={leftRejoin}  className="tr-path" stroke="rgba(245,158,11,0.04)" strokeWidth="14" />
          <path d={rightRejoin} className="tr-path" stroke="rgba(245,158,11,0.04)" strokeWidth="14" />
          <path d={endPath}    className="tr-path" stroke="rgba(6,182,212,0.06)"  strokeWidth="20" />

          {/* ── Main animated river paths ── */}
          {/* Stem */}
          <path d={stemPath}
            className={`tr-path tr-path-draw${drawn ? ' drawn' : ''}`}
            stroke="rgba(6,182,212,0.7)" strokeWidth="2.5"
            filter="url(#tr-glow-cyan)" />

          {/* Left (Govt) */}
          <path d={leftPath}
            className={`tr-path tr-path-draw delay-1${drawn ? ' drawn' : ''}`}
            stroke="rgba(16,185,129,0.7)" strokeWidth="2"
            filter="url(#tr-glow-green)" />

          {/* Right (Tech) */}
          <path d={rightPath}
            className={`tr-path tr-path-draw delay-2${drawn ? ' drawn' : ''}`}
            stroke="rgba(124,58,237,0.7)" strokeWidth="2"
            filter="url(#tr-glow-purple)" />

          {/* Rejoin paths */}
          <path d={leftRejoin}
            className={`tr-path tr-path-draw delay-3${drawn ? ' drawn' : ''}`}
            stroke="rgba(245,158,11,0.6)" strokeWidth="2"
            filter="url(#tr-glow-gold)" />
          <path d={rightRejoin}
            className={`tr-path tr-path-draw delay-3${drawn ? ' drawn' : ''}`}
            stroke="rgba(245,158,11,0.6)" strokeWidth="2"
            filter="url(#tr-glow-gold)" />

          {/* End stem */}
          <path d={endPath}
            className={`tr-path tr-path-draw delay-4${drawn ? ' drawn' : ''}`}
            stroke="rgba(6,182,212,0.7)" strokeWidth="2.5"
            filter="url(#tr-glow-cyan)" />

          {/* ── Flow shimmer lines (animated dash) ── */}
          <path d={stemPath}   className="tr-path tr-flow-line"
            stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
          <path d={leftPath}  className="tr-path tr-flow-line delay-a"
            stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" />
          <path d={rightPath} className="tr-path tr-flow-line delay-b"
            stroke="rgba(124,58,237,0.2)" strokeWidth="0.8" />
          <path d={endPath}   className="tr-path tr-flow-line"
            stroke="rgba(6,182,212,0.2)" strokeWidth="1" />

          {/* ── ORIGIN node ── */}
          <g className={`tr-dot${milestones ? ' visible' : ''}`}>
            <circle cx={originX} cy={originY} r="10"
              fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
            <circle cx={originX} cy={originY} r="5" fill="#06B6D4" />
            <text x={originX} y={originY - 16} textAnchor="middle"
              className="tr-year" fill="rgba(6,182,212,0.9)">2014</text>
            <text x={originX} y={originY - 6} textAnchor="middle"
              className="tr-sublabel" fill="rgba(6,182,212,0.4)">Left TCS</text>
          </g>

          {/* ── FORK label ── */}
          <g className={`tr-dot${milestones ? ' visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <text x={forkX} y={forkY + 18} textAnchor="middle"
              className="tr-sublabel" fill="rgba(255,255,255,0.15)">two roads</text>
          </g>

          {/* ── PATH labels ── */}
          <text x={govtX - 14} y={forkY + 55} textAnchor="middle"
            className="tr-tag-text" fill="rgba(16,185,129,0.45)">govt.</text>
          <text x={techX + 14} y={forkY + 55} textAnchor="middle"
            className="tr-tag-text" fill="rgba(124,58,237,0.45)">tech.</text>

          {/* ── CGPSC milestone (left branch) ── */}
          <g className={`tr-ripple${milestones ? ' visible' : ''}`}
            style={{ transitionDelay: govtMilestone.delay }}>
            <circle cx={govtMilestone.cx} cy={govtMilestone.cy} r="18"
              className="tr-ripple-ring" stroke="rgba(16,185,129,0.3)" />
            <circle cx={govtMilestone.cx} cy={govtMilestone.cy} r="18"
              className="tr-ripple-ring r2" stroke="rgba(16,185,129,0.2)" />
            <circle cx={govtMilestone.cx} cy={govtMilestone.cy} r="7"
              fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
            <circle cx={govtMilestone.cx} cy={govtMilestone.cy} r="3.5" fill="#10B981" />
            <text x={govtMilestone.cx - 18} y={govtMilestone.cy - 1} textAnchor="end"
              className="tr-tag-text" fill="rgba(16,185,129,0.8)">{govtMilestone.label}</text>
            <text x={govtMilestone.cx - 18} y={govtMilestone.cy + 9} textAnchor="end"
              className="tr-sublabel" fill="rgba(16,185,129,0.4)">{govtMilestone.sublabel}</text>
          </g>

          {/* ── GATE wave milestones (right branch) ── */}
          {gateWaves.map((w, i) => (
            <g key={i} className={`tr-ripple${milestones ? ' visible' : ''}`}
              style={{ transitionDelay: w.delay }}>
              <circle cx={w.cx} cy={w.cy} r={16 + i * 2}
                className="tr-ripple-ring" stroke="rgba(124,58,237,0.3)" />
              {i < 2 && (
                <circle cx={w.cx} cy={w.cy} r={16 + i * 2}
                  className="tr-ripple-ring r2" stroke="rgba(124,58,237,0.15)" />
              )}
              {/* Bigger glow on 3rd wave (momentum peak) */}
              <circle cx={w.cx} cy={w.cy} r={i === 2 ? 8 : 6}
                fill={i === 2 ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.12)'}
                stroke={i === 2 ? 'rgba(167,139,250,0.7)' : 'rgba(124,58,237,0.4)'}
                strokeWidth={i === 2 ? 2 : 1.5} />
              <circle cx={w.cx} cy={w.cy} r={i === 2 ? 4 : 3}
                fill={i === 2 ? '#A78BFA' : '#7C3AED'} />
              <text x={w.cx + 16} y={w.cy - 2} textAnchor="start"
                className="tr-tag-text" fill={i === 2 ? 'rgba(167,139,250,0.9)' : 'rgba(124,58,237,0.6)'}>
                {w.label}
              </text>
              <text x={w.cx + 16} y={w.cy + 8} textAnchor="start"
                className="tr-sublabel" fill="rgba(124,58,237,0.4)">{w.year}</text>
            </g>
          ))}

          {/* ── GOVT destination node ── */}
          <g className={`tr-dot${milestones ? ' visible' : ''}`} style={{ transitionDelay: '1.3s' }}>
            <circle cx={govtX} cy={govtY} r="12"
              fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
            <circle cx={govtX} cy={govtY} r="6" fill="rgba(16,185,129,0.5)" />
            <text x={govtX} y={govtY + 22} textAnchor="middle"
              className="tr-label" fill="rgba(16,185,129,0.7)" fontSize="10.5">Govt. Path</text>
            <text x={govtX} y={govtY + 34} textAnchor="middle"
              className="tr-sublabel" fill="rgba(16,185,129,0.35)">explored</text>
          </g>

          {/* ── TECH destination node ── */}
          <g className={`tr-dot${milestones ? ' visible' : ''}`} style={{ transitionDelay: '1.3s' }}>
            <circle cx={techX} cy={techY} r="12"
              fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.35)" strokeWidth="1.5" />
            <circle cx={techX} cy={techY} r="6" fill="#7C3AED" opacity="0.7" />
            <text x={techX} y={techY + 22} textAnchor="middle"
              className="tr-label" fill="rgba(167,139,250,0.7)" fontSize="10.5">Tech Path</text>
            <text x={techX} y={techY + 34} textAnchor="middle"
              className="tr-sublabel" fill="rgba(124,58,237,0.35)">chosen</text>
          </g>

          {/* ── Convergence label ── */}
          <g className={`tr-dot${milestones ? ' visible' : ''}`} style={{ transitionDelay: '1.8s' }}>
            <text x={rejoinX} y={rejoinY - 14} textAnchor="middle"
              className="tr-sublabel" fill="rgba(245,158,11,0.35)">paths merge</text>
          </g>

          {/* ── END node (2017 / MNNIT) ── */}
          <g className={`tr-dot${milestones ? ' visible' : ''}`} style={{ transitionDelay: '2s' }}>
            <circle cx={endX} cy={endY} r="16"
              fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
            <circle cx={endX} cy={endY} r="10"
              fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
            <circle cx={endX} cy={endY} r="5" fill="#F59E0B" />
            <circle cx={endX} cy={endY} r="2.5" fill="#fff" opacity="0.8" />
            <text x={endX} y={endY + 26} textAnchor="middle"
              className="tr-year" fill="rgba(245,158,11,0.9)">2017</text>
            <text x={endX} y={endY + 37} textAnchor="middle"
              className="tr-label" fill="rgba(255,255,255,0.6)" fontSize="10">MNNIT Allahabad</text>
          </g>

          {/* ── "3 waves building" wave guide label ── */}
          <text x={techX + 38} y={gateWaves[1].cy} textAnchor="start"
            className="tr-sublabel" fill="rgba(124,58,237,0.25)"
            style={{ writingMode: 'vertical-rl' }}>momentum ↑</text>

        </svg>
      </div>

      {/* Detail cards */}
      <div className="tr-cards">
        <div className={`tr-card govt${cards ? ' visible' : ''}`}>
          <div className="tr-card-label" style={{ color: 'rgba(16,185,129,0.7)' }}>🏛️ Govt. Path — Explored</div>
          <div className="tr-card-title">Government & Teaching</div>
          <div className="tr-card-items">
            <div className="tr-card-item" style={{ color: '#6EE7B7' }}>CGPSC Lecturer — Cleared</div>
            <div className="tr-card-item" style={{ color: '#6EE7B7' }}>Final interview round reached</div>
            <div className="tr-card-item" style={{ color: '#6EE7B7' }}>Official waiting list</div>
          </div>
        </div>
        <div className={`tr-card tech${cards ? ' visible' : ''}`}>
          <div className="tr-card-label" style={{ color: 'rgba(167,139,250,0.7)' }}>📡 Tech Path — Chosen</div>
          <div className="tr-card-title">Higher Education</div>
          <div className="tr-card-items">
            <div className="tr-card-item" style={{ color: '#C4B5FD' }}>GATE 2015 — Qualified</div>
            <div className="tr-card-item" style={{ color: '#C4B5FD' }}>GATE 2016 — Qualified</div>
            <div className="tr-card-item" style={{ color: '#C4B5FD' }}>GATE 2017 — Qualified ×3</div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="tr-quote">
        <div className="tr-quote-text">
          Three attempts. Three qualifications.{' '}
          <strong>Not failure — building momentum.</strong>{' '}
          The river didn't stop — it found a stronger current.
        </div>
      </div>
    </div>
  );
}
