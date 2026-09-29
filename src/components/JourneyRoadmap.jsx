import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   JourneyRoadmap — "The Roads I Took" v2
   An interactive SVG map showing the 2014–2017 exploration as two roads
   that fork, each leading to a destination, then reunite at 2017.
   ───────────────────────────────────────────────────────────────────────── */

const STYLES = `
  .jr-map-root {
    position: relative;
    width: 100%;
    font-family: var(--heading-font);
    user-select: none;
  }

  /* ── Map Header ── */
  .jr-map-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 28px 0;
    flex-wrap: wrap; gap: 10px;
  }
  .jr-map-header-left { display: flex; align-items: center; gap: 14px; }
  .jr-map-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(124,58,237,0.06));
    border: 1px solid rgba(245,158,11,0.12);
    box-shadow: 0 0 20px rgba(245,158,11,0.06);
  }
  .jr-map-title {
    font-size: 1.1rem; font-weight: 800; color: #fff;
    letter-spacing: -0.02em;
  }
  .jr-map-sub {
    font-size: 0.74rem; color: rgba(148,163,184,0.6);
    margin-top: 2px; font-style: italic;
  }
  .jr-map-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 999px;
    font-family: var(--mono-font);
    font-size: 0.68rem; font-weight: 600;
    color: rgba(252,211,77,0.85);
    background: rgba(245,158,11,0.05);
    border: 1px solid rgba(245,158,11,0.12);
    letter-spacing: 0.03em;
  }

  /* ── SVG Container ── */
  .jr-map-svg-wrap {
    position: relative;
    width: 100%;
    padding: 8px 0 0;
  }
  .jr-map-svg {
    width: 100%;
    overflow: visible;
  }

  /* ── Road paths ── */
  .jr-road-base {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .jr-road-main {
    stroke: rgba(255,255,255,0.06);
    stroke-width: 20;
  }
  .jr-road-center {
    stroke-dasharray: 8 12;
    stroke-width: 1.5;
    animation: jr-dash-flow 2s linear infinite;
  }
  @keyframes jr-dash-flow {
    to { stroke-dashoffset: -40; }
  }
  .jr-road-draw {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
    transition: stroke-dashoffset 2.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .jr-road-draw.drawn {
    stroke-dashoffset: 0;
  }
  .jr-road-left-draw {
    transition-delay: 0.3s;
  }
  .jr-road-right-draw {
    transition-delay: 0.6s;
  }
  .jr-road-rejoin-draw {
    transition-delay: 1.2s;
  }

  /* ── Destination nodes ── */
  .jr-node {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .jr-node-icon {
    font-size: 1.4rem;
    pointer-events: none;
  }

  /* ── Tooltip popups ── */
  .jr-tooltip {
    position: absolute;
    background: rgba(10, 10, 20, 0.95);
    backdrop-filter: blur(16px);
    border-radius: 14px;
    padding: 16px 18px;
    min-width: 220px;
    max-width: 260px;
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  }
  .jr-tooltip.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .jr-tooltip-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 999px;
    font-size: 0.58rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 10px;
  }
  .jr-tooltip-title {
    font-size: 0.9rem; font-weight: 700; color: #fff;
    margin-bottom: 5px; letter-spacing: -0.01em;
  }
  .jr-tooltip-desc {
    font-size: 0.73rem; color: rgba(148,163,184,0.8);
    line-height: 1.6; margin-bottom: 12px;
  }
  .jr-tooltip-items { display: flex; flex-direction: column; gap: 5px; }
  .jr-tooltip-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.72rem; color: rgba(203,213,225,0.85);
  }
  .jr-tooltip-check {
    width: 16px; height: 16px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; flex-shrink: 0;
  }

  /* ── Terrain / topo lines ── */
  .jr-topo { opacity: 0.04; }

  /* ── Labels on map ── */
  .jr-map-label {
    font-family: var(--mono-font);
    font-size: 9px; fill: rgba(148,163,184,0.4);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .jr-year-label {
    font-family: var(--mono-font);
    font-size: 10px;
    font-weight: 600;
    fill: rgba(245,158,11,0.7);
    letter-spacing: 0.04em;
  }
  .jr-dest-label {
    font-family: var(--heading-font);
    font-size: 11px;
    font-weight: 700;
    fill: rgba(255,255,255,0.7);
  }

  /* ── Legend ── */
  .jr-legend {
    display: flex; align-items: center; justify-content: center;
    gap: 20px; flex-wrap: wrap;
    padding: 8px 28px 22px;
  }
  .jr-legend-item {
    display: flex; align-items: center; gap: 7px;
    font-family: var(--mono-font);
    font-size: 0.65rem; color: rgba(148,163,184,0.5);
    letter-spacing: 0.04em;
  }
  .jr-legend-dot {
    width: 8px; height: 8px; border-radius: 50%;
  }

  /* ── Quote bar ── */
  .jr-map-quote {
    margin: 0 28px 24px;
    padding: 16px 20px 16px 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(245,158,11,0.04), rgba(124,58,237,0.02));
    border: 1px solid rgba(245,158,11,0.1);
    position: relative;
    overflow: hidden;
  }
  .jr-map-quote::after {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #F59E0B, rgba(245,158,11,0.2));
    border-radius: 3px 0 0 3px;
  }
  .jr-map-quote-text {
    font-size: 0.8rem; color: rgba(241,245,249,0.8);
    font-style: italic; line-height: 1.7;
    position: relative;
  }
  .jr-map-quote-text strong { color: #FCD34D; font-style: normal; font-weight: 600; }
`;

const GOVT_DATA = {
  tag: 'Explored',
  tagColor: '#10B981',
  tagBg: 'rgba(16,185,129,0.1)',
  tagBorder: 'rgba(16,185,129,0.2)',
  title: 'Government & Teaching',
  desc: 'Rigorously prepared for competitive exams to serve in public education and administration.',
  items: [
    { text: 'CGPSC Lecturer exam — Cleared', done: true },
    { text: 'Reached the final interview round', done: true },
    { text: 'Placed on official waiting list', done: true },
    { text: 'Proved discipline & depth of study', done: true },
  ],
  color: '#10B981',
};

const TECH_DATA = {
  tag: 'Chosen',
  tagColor: '#A78BFA',
  tagBg: 'rgba(124,58,237,0.1)',
  tagBorder: 'rgba(124,58,237,0.2)',
  title: 'Higher Education in Tech',
  desc: 'Simultaneously cracked GATE three times, securing admission to M.Tech at NIT Raipur.',
  items: [
    { text: 'GATE 2015 — Qualified', done: true },
    { text: 'GATE 2016 — Qualified', done: true },
    { text: 'GATE 2017 — Qualified (3rd attempt)', done: true },
    { text: 'M.Tech @ MNNIT Allahabad — Admitted', done: true },
  ],
  color: '#7C3AED',
};

function Tooltip({ data, style, visible }) {
  return (
    <div className={`jr-tooltip${visible ? ' visible' : ''}`} style={style}>
      <div className="jr-tooltip-tag" style={{
        background: data.tagBg,
        color: data.tagColor,
        border: `1px solid ${data.tagBorder}`,
      }}>
        {data.tag === 'Explored' ? '✓' : '★'} {data.tag}
      </div>
      <div className="jr-tooltip-title">{data.title}</div>
      <div className="jr-tooltip-desc">{data.desc}</div>
      <div className="jr-tooltip-items">
        {data.items.map((item, i) => (
          <div key={i} className="jr-tooltip-item">
            <div className="jr-tooltip-check" style={{
              background: item.done ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${item.done ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
              color: item.done ? '#6EE7B7' : 'rgba(148,163,184,0.4)',
            }}>
              {item.done ? '✓' : '○'}
            </div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JourneyRoadmap() {
  const rootRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [hovered, setHovered] = useState(null); // 'govt' | 'tech' | null
  const [tooltipPos, setTooltipPos] = useState({ govt: {}, tech: {} });

  // Trigger draw animation on scroll into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setDrawn(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Calculate tooltip positions relative to SVG nodes
  const govtNodeCenter = { x: 0.22, y: 0.52 }; // as fraction of SVG viewBox 640×380
  const techNodeCenter = { x: 0.78, y: 0.52 };

  const handleNodeEnter = (which, e) => {
    setHovered(which);
    const rect = rootRef.current.getBoundingClientRect();
    const svgEl = rootRef.current.querySelector('.jr-map-svg');
    const svgRect = svgEl.getBoundingClientRect();
    const fraction = which === 'govt' ? govtNodeCenter : techNodeCenter;

    let left = svgRect.left - rect.left + fraction.x * svgRect.width;
    let top = svgRect.top - rect.top + fraction.y * svgRect.height;

    // Adjust so tooltip doesn't overflow
    const tipW = 240;
    if (which === 'govt') {
      left = left + 24;
    } else {
      left = left - tipW - 24;
    }

    setTooltipPos(prev => ({ ...prev, [which]: { left, top: top - 60 } }));
  };

  const handleNodeLeave = () => setHovered(null);

  // SVG viewBox: 640 x 380
  // Origin point (START): (320, 50)
  // Govt destination: (145, 200)
  // Tech destination: (495, 200)
  // Reunion point (END): (320, 320)

  const startX = 320, startY = 55;
  const govtX = 145, govtY = 200;
  const techX = 495, techY = 200;
  const endX = 320, endY = 320;

  // Road paths (cubic bezier for natural curves)
  const leftPath = `M ${startX} ${startY} C ${startX - 60} ${startY + 60}, ${govtX + 80} ${govtY - 60}, ${govtX} ${govtY}`;
  const rightPath = `M ${startX} ${startY} C ${startX + 60} ${startY + 60}, ${techX - 80} ${techY - 60}, ${techX} ${techY}`;
  const rejoinLeft = `M ${govtX} ${govtY} C ${govtX + 60} ${govtY + 80}, ${endX - 80} ${endY - 60}, ${endX} ${endY}`;
  const rejoinRight = `M ${techX} ${techY} C ${techX - 60} ${techY + 80}, ${endX + 80} ${endY - 60}, ${endX} ${endY}`;

  // Topo circles (decorative terrain lines)
  const topoCircles = [
    { cx: 145, cy: 200, r: 55 },
    { cx: 145, cy: 200, r: 75 },
    { cx: 145, cy: 200, r: 95 },
    { cx: 495, cy: 200, r: 55 },
    { cx: 495, cy: 200, r: 75 },
    { cx: 495, cy: 200, r: 95 },
    { cx: 320, cy: 320, r: 40 },
    { cx: 320, cy: 320, r: 60 },
  ];

  return (
    <div ref={rootRef} className="jr-map-root">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="jr-map-header">
        <div className="jr-map-header-left">
          <div className="jr-map-icon">🗺️</div>
          <div>
            <div className="jr-map-title">The Roads I Took</div>
            <div className="jr-map-sub">An explorer's map of 2014–2017</div>
          </div>
        </div>
        <div className="jr-map-badge">
          <span style={{ color: '#F59E0B' }}>◆</span> 2014 – 2017
        </div>
      </div>

      {/* SVG Map */}
      <div className="jr-map-svg-wrap">
        <svg
          className="jr-map-svg"
          viewBox="0 0 640 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Topographic terrain rings ── */}
          <g className="jr-topo">
            {topoCircles.map((c, i) => (
              <circle key={i} cx={c.cx} cy={c.cy} r={c.r}
                stroke="rgba(255,255,255,1)" strokeWidth="1" fill="none" />
            ))}
            {/* Grid lines */}
            {[80, 160, 240, 320, 400, 480, 560].map(x => (
              <line key={x} x1={x} y1={0} x2={x} y2={380}
                stroke="rgba(255,255,255,1)" strokeWidth="0.5" />
            ))}
            {[60, 120, 180, 240, 300].map(y => (
              <line key={y} x1={0} y1={y} x2={640} y2={y}
                stroke="rgba(255,255,255,1)" strokeWidth="0.5" />
            ))}
          </g>

          {/* ── Road base (width) ── */}
          <path d={leftPath} className="jr-road-base jr-road-main" />
          <path d={rightPath} className="jr-road-base jr-road-main" />
          <path d={rejoinLeft} className="jr-road-base jr-road-main" />
          <path d={rejoinRight} className="jr-road-base jr-road-main" />

          {/* ── Animated road draws ── */}
          {/* Left road */}
          <path d={leftPath}
            className={`jr-road-draw jr-road-left-draw${drawn ? ' drawn' : ''}`}
            stroke="#10B981" strokeWidth="2.5" strokeDasharray="1200" />
          {/* Right road */}
          <path d={rightPath}
            className={`jr-road-draw jr-road-right-draw${drawn ? ' drawn' : ''}`}
            stroke="#7C3AED" strokeWidth="2.5" strokeDasharray="1200" />
          {/* Rejoin roads */}
          <path d={rejoinLeft}
            className={`jr-road-draw jr-road-rejoin-draw${drawn ? ' drawn' : ''}`}
            stroke="rgba(245,158,11,0.7)" strokeWidth="2" strokeDasharray="1200" />
          <path d={rejoinRight}
            className={`jr-road-draw jr-road-rejoin-draw${drawn ? ' drawn' : ''}`}
            stroke="rgba(245,158,11,0.7)" strokeWidth="2" strokeDasharray="1200" />

          {/* ── Dashed center lines (animated flow) ── */}
          <path d={leftPath}
            className="jr-road-base jr-road-center"
            stroke="rgba(16,185,129,0.35)"
            style={{ strokeDashoffset: drawn ? 0 : 1200, transition: drawn ? 'stroke-dashoffset 2.2s 0.3s ease' : 'none' }} />
          <path d={rightPath}
            className="jr-road-base jr-road-center"
            stroke="rgba(124,58,237,0.35)"
            style={{ strokeDashoffset: drawn ? 0 : 1200, transition: drawn ? 'stroke-dashoffset 2.2s 0.6s ease' : 'none' }} />

          {/* ── Compass rose (top right) ── */}
          <g transform="translate(598, 42)" opacity="0.18">
            <circle cx="0" cy="0" r="18" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" fill="none"/>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(255,255,255,0.8)" strokeWidth="1"/>
            <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1"/>
            <text x="0" y="-18" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="7" fontWeight="700">N</text>
            <text x="18" y="3" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5">E</text>
            <text x="-18" y="3" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5">W</text>
            <text x="0" y="24" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5">S</text>
            <polygon points="0,-10 3,0 0,4 -3,0" fill="rgba(255,255,255,0.8)"/>
            <polygon points="0,10 3,0 0,-4 -3,0" fill="rgba(255,255,255,0.3)"/>
          </g>

          {/* ── START node ── */}
          <g transform={`translate(${startX}, ${startY})`}>
            {/* Pulse rings */}
            <circle r="22" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.12)" strokeWidth="1" />
            <circle r="14" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
            <circle r="8" fill="#F59E0B" opacity="0.9" />
            <text x="0" y="-30" textAnchor="middle" className="jr-year-label">2014</text>
            <text x="0" y="-20" textAnchor="middle" style={{ font: '9px var(--mono-font)', fill: 'rgba(245,158,11,0.5)' }}>LEFT TCS</text>
          </g>

          {/* ── GOVT destination node ── */}
          <g
            className="jr-node"
            transform={`translate(${govtX}, ${govtY})`}
            onMouseEnter={(e) => handleNodeEnter('govt', e)}
            onMouseLeave={handleNodeLeave}
          >
            {/* Hover glow */}
            <circle r="50" fill={hovered === 'govt' ? 'rgba(16,185,129,0.04)' : 'transparent'}
              style={{ transition: 'fill 0.3s ease' }} />
            {/* Terrain ring */}
            <circle r="34" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="4 3" />
            {/* Main circle */}
            <circle r="24" fill="rgba(10,10,20,0.8)"
              stroke={hovered === 'govt' ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.2)'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.3s ease' }} />
            <text x="0" y="8" textAnchor="middle" style={{ fontSize: '20px', fontFamily: 'sans-serif' }}>🏛️</text>
            <text x="0" y="-34" textAnchor="middle" className="jr-dest-label" fill="rgba(16,185,129,0.85)">Govt. Path</text>
            <text x="0" y="46" textAnchor="middle" style={{ font: '9px var(--mono-font)', fill: 'rgba(16,185,129,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>HOVER TO EXPLORE</text>
          </g>

          {/* ── TECH destination node ── */}
          <g
            className="jr-node"
            transform={`translate(${techX}, ${techY})`}
            onMouseEnter={(e) => handleNodeEnter('tech', e)}
            onMouseLeave={handleNodeLeave}
          >
            <circle r="50" fill={hovered === 'tech' ? 'rgba(124,58,237,0.04)' : 'transparent'}
              style={{ transition: 'fill 0.3s ease' }} />
            <circle r="34" fill="rgba(124,58,237,0.05)" stroke="rgba(124,58,237,0.15)" strokeWidth="1" strokeDasharray="4 3" />
            <circle r="24" fill="rgba(10,10,20,0.8)"
              stroke={hovered === 'tech' ? 'rgba(124,58,237,0.6)' : 'rgba(124,58,237,0.25)'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.3s ease' }} />
            <text x="0" y="8" textAnchor="middle" style={{ fontSize: '20px', fontFamily: 'sans-serif' }}>🎓</text>
            <text x="0" y="-34" textAnchor="middle" className="jr-dest-label" fill="rgba(167,139,250,0.85)">Tech Path</text>
            <text x="0" y="46" textAnchor="middle" style={{ font: '9px var(--mono-font)', fill: 'rgba(124,58,237,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>HOVER TO EXPLORE</text>
          </g>

          {/* ── REUNION end node ── */}
          <g transform={`translate(${endX}, ${endY})`}>
            <circle r="28" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
            <circle r="18" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
            <circle r="10" fill="rgba(245,158,11,0.85)" />
            <circle r="5" fill="#fff" opacity="0.8" />
            <text x="0" y="-36" textAnchor="middle" className="jr-year-label">2017</text>
            <text x="0" y="-26" textAnchor="middle" style={{ font: '9px var(--mono-font)', fill: 'rgba(245,158,11,0.5)' }}>MNNIT ALLAHABAD</text>
          </g>

          {/* ── Map labels ── */}
          <text x="42" y="365" className="jr-map-label">scale 1:∞ · explorer's edition</text>
          <text x="560" y="365" textAnchor="end" className="jr-map-label">chhattisgarh · india</text>

          {/* ── Distance markers on roads ── */}
          <text x="200" y="112" textAnchor="middle" className="jr-map-label"
            transform="rotate(-25 200 112)" fill="rgba(16,185,129,0.3)">3 yrs</text>
          <text x="440" y="112" textAnchor="middle" className="jr-map-label"
            transform="rotate(25 440 112)" fill="rgba(124,58,237,0.3)">GATE ×3</text>
        </svg>

        {/* Tooltip for Govt */}
        <Tooltip
          data={GOVT_DATA}
          visible={hovered === 'govt'}
          style={tooltipPos.govt}
        />
        {/* Tooltip for Tech */}
        <Tooltip
          data={TECH_DATA}
          visible={hovered === 'tech'}
          style={tooltipPos.tech}
        />
      </div>

      {/* Legend */}
      <div className="jr-legend">
        <div className="jr-legend-item">
          <div className="jr-legend-dot" style={{ background: '#F59E0B' }} />
          Milestone point
        </div>
        <div className="jr-legend-item">
          <div className="jr-legend-dot" style={{ background: '#10B981' }} />
          Govt. road explored
        </div>
        <div className="jr-legend-item">
          <div className="jr-legend-dot" style={{ background: '#7C3AED' }} />
          Tech road chosen
        </div>
        <div className="jr-legend-item">
          <div style={{ width: 18, height: 2, background: 'rgba(245,158,11,0.6)', borderRadius: 1 }} />
          Roads converge
        </div>
      </div>

      {/* Quote */}
      <div className="jr-map-quote">
        <div className="jr-map-quote-text">
          The gap wasn't empty — it was a deliberate exploration.{' '}
          <strong>I walked two roads simultaneously,</strong>{' '}
          proved I could succeed on both, and chose the one that would push me furthest.
        </div>
      </div>
    </div>
  );
}
