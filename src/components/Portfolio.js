import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mail, MapPin, Linkedin, Github, Globe, ChevronDown,
  Code, GraduationCap,
  ExternalLink, Target, Phone, Menu, X,
  ShieldCheck, Workflow, Gauge, ArrowUpRight, Terminal,
  Layers
} from 'lucide-react';
import BlurText from './BlurText';
import CountUp from './CountUp';
import Magnet from './Magnet';

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --obsidian:    #0A0A0F;
    --obsidian-2:  #111118;
    --obsidian-3:  #16161F;
    --surface-1:   rgba(255,255,255,0.03);
    --surface-2:   rgba(255,255,255,0.06);
    --surface-3:   rgba(255,255,255,0.09);
    --border:      rgba(255,255,255,0.06);
    --border-2:    rgba(255,255,255,0.10);
    --violet:      #7C3AED;
    --violet-lt:   #A78BFA;
    --violet-glow: rgba(124,58,237,0.25);
    --cyan:        #06B6D4;
    --cyan-lt:     #67E8F9;
    --cyan-glow:   rgba(6,182,212,0.2);
    --pearl:       #F1F5F9;
    --muted:       #64748B;
    --faint:       #334155;
    --green:       #10B981;
    --amber:       #F59E0B;
    --pink:        #EC4899;
    --heading-font:'Outfit', sans-serif;
    --body-font:   'Inter', sans-serif;
    --mono-font:   'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--body-font);
    background: var(--obsidian);
    color: var(--pearl);
    overflow-x: hidden;
  }

  /* ── Scroll Progress ── */
  #scroll-progress {
    position: fixed; top: 0; left: 0; z-index: 1000;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, var(--violet), var(--cyan));
    transition: width 0.1s linear;
    box-shadow: 0 0 8px var(--violet-glow);
  }

  /* ── Custom Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--obsidian); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(var(--violet), var(--cyan)); border-radius: 4px; }
  ::selection { background: rgba(124,58,237,0.35); color: var(--pearl); }

  /* ── Noise texture overlay ── */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: -1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4; pointer-events: none;
  }

  /* ── Dot grid bg ── */
  .dot-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }

  /* ── Reveal animations ── */
  .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }

  /* ── Nav ── */
  .nav-root {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 18px 40px;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.4s ease;
  }
  .nav-root.scrolled {
    padding: 12px 40px;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--heading-font);
    font-size: 1.25rem; font-weight: 800;
    background: linear-gradient(135deg, var(--violet-lt), var(--cyan-lt));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; letter-spacing: -0.02em;
  }
  .nav-links { display: flex; align-items: center; gap: 4px; }
  .nav-link {
    padding: 7px 16px; border-radius: 999px;
    font-size: 0.82rem; font-weight: 500;
    color: var(--muted); background: none; border: none;
    cursor: pointer; transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }
  .nav-link:hover { color: var(--pearl); background: var(--surface-2); }
  .nav-link.active {
    color: var(--pearl); background: var(--surface-3);
    border: 1px solid var(--border-2);
  }
  .nav-cta {
    padding: 8px 20px; border-radius: 999px;
    font-size: 0.82rem; font-weight: 600;
    background: linear-gradient(135deg, var(--violet), #6D28D9);
    color: #fff; border: none; cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 0 20px var(--violet-glow);
    text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
  }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 0 30px var(--violet-glow); filter: brightness(1.1); }

  /* Mobile nav */
  .mobile-menu-btn {
    display: none; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 10px;
    border: 1px solid var(--border-2); background: var(--surface-2);
    color: var(--muted); cursor: pointer;
    transition: all 0.2s;
  }
  .mobile-menu-btn:hover { color: var(--pearl); border-color: var(--border-2); }
  .mobile-panel {
    display: none; position: fixed; top: 68px; left: 16px; right: 16px; z-index: 99;
    padding: 16px; border-radius: 16px;
    background: rgba(10,10,15,0.96); border: 1px solid var(--border-2);
    backdrop-filter: blur(24px); box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .mobile-panel.open { display: block; }
  .mobile-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .mobile-nav-btn {
    padding: 12px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface-1); color: var(--muted);
    font-weight: 600; font-size: 0.85rem; cursor: pointer;
    transition: all 0.2s;
  }
  .mobile-nav-btn.active { color: var(--pearl); border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.12); }
  @media (max-width: 860px) {
    .nav-links { display: none; }
    .mobile-menu-btn { display: flex; }
    .nav-root { padding: 14px 20px; }
    .nav-root.scrolled { padding: 10px 20px; }
  }

  /* ── Hero ── */
  .hero-section {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 100px 24px 80px; overflow: hidden;
    text-align: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 999px;
    border: 1px solid rgba(124,58,237,0.3);
    background: rgba(124,58,237,0.08);
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--violet-lt);
    margin-bottom: 28px;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px rgba(16,185,129,0.8);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { box-shadow: 0 0 8px rgba(16,185,129,0.8); }
    50% { box-shadow: 0 0 16px rgba(16,185,129,1), 0 0 24px rgba(16,185,129,0.4); }
  }
  .hero-name {
    font-family: var(--heading-font);
    font-size: clamp(3.5rem, 10vw, 8rem);
    font-weight: 900; line-height: 0.92;
    letter-spacing: -0.04em; margin-bottom: 24px;
  }
  .hero-name .line-1 { display: block; color: var(--pearl); }
  .hero-name .line-2 {
    display: block;
    background: linear-gradient(135deg, var(--violet-lt) 0%, var(--cyan-lt) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-role {
    font-size: 1.1rem; font-weight: 400; color: var(--muted);
    margin-bottom: 40px; letter-spacing: 0.02em;
  }
  .hero-role strong { color: var(--pearl); font-weight: 600; }

  /* Photo */
  .hero-photo-wrap {
    position: relative; width: 156px; height: 156px; margin: 0 auto 36px;
  }
  /* Outer slow-spin conic gradient ring */
  .hero-photo-ring-outer {
    position: absolute; inset: -6px; border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      var(--violet) 60deg,
      var(--cyan) 120deg,
      transparent 180deg,
      transparent 240deg,
      var(--violet) 300deg,
      transparent 360deg
    );
    animation: conic-spin 4s linear infinite;
    filter: blur(1px);
    opacity: 0.85;
  }
  @keyframes conic-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  /* Middle glow ring */
  .hero-photo-ring {
    position: absolute; inset: 0; border-radius: 50%;
    background: conic-gradient(
      from 180deg,
      var(--cyan), var(--violet), var(--cyan)
    );
    padding: 3px;
    display: flex; align-items: center; justify-content: center;
    animation: conic-spin 6s linear infinite reverse;
    box-shadow:
      0 0 24px rgba(124,58,237,0.5),
      0 0 48px rgba(6,182,212,0.2),
      inset 0 0 16px rgba(124,58,237,0.15);
  }
  .hero-photo-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: var(--obsidian);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    /* counter-rotate to keep photo upright */
    animation: conic-spin 6s linear infinite;
  }
  .hero-photo-inner img {
    width: 148px; height: 148px; border-radius: 50%;
    object-fit: cover; object-position: center top;
    display: block;
    /* counter-rotate to cancel both parent rotations */
    flex-shrink: 0;
  }
  .hero-online-dot {
    position: absolute; bottom: 10px; right: 10px;
    width: 16px; height: 16px; border-radius: 50%; z-index: 2;
    background: var(--green); border: 3px solid var(--obsidian);
    box-shadow: 0 0 12px rgba(16,185,129,0.7);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  /* Stats row */
  .hero-stats {
    display: flex; justify-content: center; gap: 6px;
    flex-wrap: wrap; margin-bottom: 36px;
  }
  .stat-chip {
    padding: 10px 20px; border-radius: 12px;
    border: 1px solid var(--border-2); background: var(--surface-1);
    text-align: center;
  }
  .stat-chip-val { font-family: var(--heading-font); font-size: 1.15rem; font-weight: 700; color: var(--violet-lt); }
  .stat-chip-lbl { font-size: 0.7rem; color: var(--muted); margin-top: 2px; font-weight: 500; }

  /* CTA row */
  .hero-cta-row { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px; font-weight: 600; font-size: 0.9rem;
    background: linear-gradient(135deg, var(--violet), #6D28D9); color: #fff;
    border: none; cursor: pointer; text-decoration: none;
    transition: all 0.25s ease; box-shadow: 0 4px 24px var(--violet-glow);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(124,58,237,0.45); filter: brightness(1.1); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; border-radius: 12px; font-weight: 600; font-size: 0.9rem;
    background: var(--surface-1); color: var(--violet-lt);
    border: 1px solid rgba(124,58,237,0.3); cursor: pointer; text-decoration: none;
    transition: all 0.25s ease;
  }
  .btn-ghost:hover { background: rgba(124,58,237,0.12); border-color: rgba(124,58,237,0.5); transform: translateY(-2px); }

  /* Socials */
  .social-row { display: flex; justify-content: center; gap: 10px; }
  .social-icon {
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; border-radius: 12px;
    border: 1px solid var(--border-2); background: var(--surface-1);
    color: var(--muted); transition: all 0.25s ease; text-decoration: none;
  }
  .social-icon:hover { color: var(--pearl); background: var(--surface-2); border-color: var(--border-2); transform: translateY(-3px); }

  /* Scroll cue */
  .scroll-cue {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: var(--faint); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
    animation: float-cue 2.5s ease-in-out infinite; cursor: pointer; background: none; border: none;
  }
  @keyframes float-cue { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(6px);} }

  /* ── Marquee / Ticker ── */
  .marquee-section {
    padding: 0; overflow: hidden;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--obsidian-2);
  }
  .marquee-track {
    display: flex; width: max-content;
    animation: marquee-scroll 28s linear infinite;
    padding: 16px 0;
  }
  .marquee-track:hover { animation-play-state: paused; }
  @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .marquee-item {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 0 28px; white-space: nowrap;
    font-size: 0.82rem; font-weight: 500; color: var(--muted);
    letter-spacing: 0.04em;
  }
  .marquee-item .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--violet); flex-shrink: 0; }

  /* ── Section commons ── */
  .section-root {
    padding: 110px 24px;
    position: relative;
  }
  .section-root.alt { background: var(--obsidian-2); }
  .section-inner { max-width: 1000px; margin: 0 auto; }
  .section-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--violet-lt);
    margin-bottom: 14px;
  }
  .section-label-line { width: 24px; height: 1px; background: var(--violet-lt); opacity: 0.6; }
  .section-title {
    font-family: var(--heading-font);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800; letter-spacing: -0.03em;
    color: var(--pearl); margin-bottom: 16px; line-height: 1.1;
  }
  .section-subtitle { color: var(--muted); font-size: 1rem; line-height: 1.7; max-width: 520px; }

  /* ── Glass Card ── */
  .glass-card {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 20px;
    position: relative; overflow: hidden;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .glass-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(124,58,237,0.08), transparent 60%);
    opacity: 0; transition: opacity 0.4s; pointer-events: none;
  }
  .glass-card:hover::before { opacity: 1; }
  .glass-card:hover {
    border-color: rgba(124,58,237,0.25);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.1);
  }

  /* ── Bento Grid ── */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 16px;
  }
  .bento-cell { border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
  .bento-cell.span-2 { grid-column: span 2; }
  .bento-cell.span-full { grid-column: span 3; }
  .bento-cell-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; font-size: 1.2rem;
  }
  .bento-cell-title {
    font-family: var(--heading-font);
    font-size: 1.05rem; font-weight: 700; color: var(--pearl);
    margin-bottom: 8px;
  }
  .bento-cell-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.65; }
  @media (max-width: 768px) {
    .bento-grid { grid-template-columns: 1fr; }
    .bento-cell.span-2, .bento-cell.span-full { grid-column: span 1; }
  }
  @media (min-width: 769px) and (max-width: 900px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .bento-cell.span-full { grid-column: span 2; }
  }

  /* ── Skills ── */
  .skills-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
  .skill-tag {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 999px;
    border: 1px solid var(--border-2); background: var(--surface-1);
    font-size: 0.855rem; font-weight: 500; color: var(--muted);
    cursor: default; transition: all 0.25s ease;
  }
  .skill-tag:hover {
    color: var(--pearl); border-color: rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.1);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 20px var(--violet-glow);
  }
  .skill-tag .emoji { font-size: 1rem; }

  /* ── Timeline (Experience) ── */
  .timeline { position: relative; }
  .timeline::before {
    content: ''; position: absolute; left: 27px; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, var(--violet), rgba(6,182,212,0.2));
  }
  .timeline-item { display: flex; gap: 28px; align-items: flex-start; position: relative; }
  .timeline-dot {
    width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; position: relative; z-index: 2;
    border: 1px solid var(--border-2);
    box-shadow: 0 0 0 4px var(--obsidian), 0 0 20px rgba(124,58,237,0.15);
  }
  .timeline-card { flex: 1; padding: 24px 28px; }
  .timeline-period {
    font-family: var(--mono-font);
    font-size: 0.72rem; color: var(--violet-lt);
    letter-spacing: 0.05em; margin-bottom: 10px; display: block;
  }
  .timeline-title { font-family: var(--heading-font); font-size: 1.1rem; font-weight: 700; color: var(--pearl); margin-bottom: 4px; }
  .timeline-company { font-size: 0.9rem; font-weight: 600; color: var(--violet-lt); margin-bottom: 6px; }
  .timeline-loc { font-size: 0.78rem; color: var(--muted); display: flex; align-items: center; gap: 4px; margin-bottom: 16px; }
  .timeline-bullets { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .timeline-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; color: var(--muted); line-height: 1.65; }
  .timeline-bullet::before { content: '→'; color: var(--cyan); flex-shrink: 0; margin-top: 1px; font-size: 0.8rem; font-family: var(--mono-font); }

  /* ── Education Cards ── */
  .edu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; }
  .edu-card { padding: 28px; }
  .edu-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 18px; }
  .edu-degree { font-family: var(--heading-font); font-size: 0.98rem; font-weight: 700; color: var(--pearl); line-height: 1.4; margin-bottom: 8px; }
  .edu-institution { font-size: 0.88rem; font-weight: 600; color: var(--cyan-lt); margin-bottom: 6px; }
  .edu-loc { font-size: 0.78rem; color: var(--muted); display: flex; align-items: center; gap: 4px; margin-bottom: 14px; }
  .edu-grade { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: rgba(16,185,129,0.12); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }

  /* ── Projects ── */
  .project-card { padding: 28px; }
  .project-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
  .project-icon-wrap { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
  .project-title { font-family: var(--heading-font); font-size: 1.1rem; font-weight: 700; color: var(--pearl); }
  .project-subtitle { font-size: 0.82rem; color: var(--muted); margin-top: 2px; }
  .project-view-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
    background: rgba(124,58,237,0.1); color: var(--violet-lt);
    border: 1px solid rgba(124,58,237,0.25); text-decoration: none;
    transition: all 0.2s ease; white-space: nowrap;
  }
  .project-view-btn:hover { background: rgba(124,58,237,0.2); border-color: rgba(124,58,237,0.5); }
  .project-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
  .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tech-tag { padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; background: rgba(139,92,246,0.1); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2); }

  /* ── GitHub Native Stats Card ── */
  .gh-card {
    border-radius: 20px; overflow: hidden;
    border: 1px solid var(--border-2);
    background: var(--surface-1);
  }
  .gh-topbar {
    padding: 13px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
    background: var(--surface-2);
  }
  .gh-dot { width: 12px; height: 12px; border-radius: 50%; }
  .gh-topbar-title {
    font-family: var(--mono-font); font-size: 0.78rem; color: var(--muted);
    margin-left: 4px; letter-spacing: 0.03em;
  }
  .gh-body { padding: 28px; }
  .gh-stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 28px;
  }
  .gh-stat-chip {
    padding: 16px 12px; border-radius: 14px;
    border: 1px solid var(--border-2);
    background: var(--obsidian-3);
    text-align: center;
    transition: all 0.25s ease;
  }
  .gh-stat-chip:hover { border-color: rgba(124,58,237,0.3); background: rgba(124,58,237,0.06); transform: translateY(-2px); }
  .gh-stat-val { font-family: var(--heading-font); font-size: 1.5rem; font-weight: 800; color: var(--violet-lt); }
  .gh-stat-lbl { font-size: 0.72rem; color: var(--muted); margin-top: 4px; font-weight: 500; letter-spacing: 0.03em; }
  .gh-langs-title { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
  .gh-lang-bar-wrap { display: flex; height: 8px; border-radius: 999px; overflow: hidden; gap: 2px; margin-bottom: 16px; }
  .gh-lang-segment { height: 100%; border-radius: 999px; transition: flex 0.5s ease; }
  .gh-lang-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .gh-lang-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 999px;
    border: 1px solid var(--border); background: var(--obsidian-3);
    font-size: 0.75rem; font-weight: 600; color: var(--muted);
  }
  .gh-lang-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .gh-contrib-wrap { border-top: 1px solid var(--border); padding: 20px; }
  .gh-contrib-wrap img { width: 100%; border-radius: 10px; display: block; }
  .gh-footer {
    padding: 14px 20px; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 8px;
  }
  .gh-note { font-size: 0.75rem; color: var(--faint); font-style: italic; }
  .gh-link { font-size: 0.78rem; color: var(--violet-lt); text-decoration: none; display: flex; align-items: center; gap: 4px; }
  .gh-link:hover { color: var(--cyan-lt); }
  @media (max-width: 600px) { .gh-stats-row { grid-template-columns: repeat(2, 1fr); } }

  /* ── Achievements ── */
  .ach-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; }
  .ach-card { padding: 28px; }
  .ach-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .ach-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .ach-title { font-family: var(--heading-font); font-size: 1rem; font-weight: 700; color: var(--pearl); }
  .ach-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .ach-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; color: var(--muted); line-height: 1.6; }
  .ach-item-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 7px; }

  /* ── Terminal Contact ── */
  .terminal-card {
    border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border-2);
    background: #0D0D14;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  }
  .terminal-bar {
    padding: 12px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.03);
  }
  .terminal-body { padding: 24px; font-family: var(--mono-font); font-size: 0.85rem; line-height: 1.9; }
  .t-prompt { color: var(--green); }
  .t-cmd { color: var(--pearl); }
  .t-out { color: var(--muted); }
  .t-key { color: var(--violet-lt); }
  .t-val { color: var(--cyan-lt); }
  .t-cursor { display: inline-block; width: 8px; height: 15px; background: var(--violet-lt); margin-left: 3px; vertical-align: middle; animation: blink 1s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }

  /* Contact section */
  .contact-links-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-top: 32px; }
  .contact-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px;
    border: 1px solid var(--border-2); background: var(--surface-1);
    font-size: 0.85rem; color: var(--muted);
    transition: all 0.2s; text-decoration: none;
  }
  .contact-chip:hover { color: var(--pearl); border-color: rgba(124,58,237,0.3); background: rgba(124,58,237,0.08); }

  /* ── Footer ── */
  .footer {
    padding: 28px 24px; border-top: 1px solid var(--border);
    text-align: center; background: var(--obsidian);
  }
  .footer p { font-size: 0.8rem; color: var(--faint); }
  .footer span { color: var(--violet-lt); }

  /* ── Cursor blink for typed ── */
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
  .cursor-blink { display: inline-block; width: 2px; height: 1em; background: var(--violet-lt); margin-left: 3px; vertical-align: text-bottom; animation: blink 1s step-end infinite; border-radius: 1px; }

  /* ── Glow blob bg ── */
  .glow-blob {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(100px);
  }

  @media (max-width: 640px) {
    .hero-name { font-size: clamp(2.8rem, 13vw, 5rem); }
    .timeline::before { display: none; }
    .timeline-item { flex-direction: column; gap: 10px; }
    .timeline-dot { width: 44px; height: 44px; font-size: 1.1rem; }
    .edu-grid, .ach-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── Hooks ─────────────────────────────────────────────────────────────── */
const useScrollReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const useTyped = (words, speed = 90, pause = 2000) => {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(w => (w + 1) % words.length); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
};

/* ─── ParticleCanvas ─────────────────────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const PARTICLE_COUNT = Math.floor((W * H) / 9000);
    const MAX_DIST = 130;
    const MOUSE_DIST = 160;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.15,
    }));

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    window.addEventListener('resize', onResize);
    canvas.parentElement.addEventListener('mousemove', onMouseMove);
    canvas.parentElement.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Update & draw particles
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Mouse repel
        const dMx = p.x - mx;
        const dMy = p.y - my;
        const distM = Math.sqrt(dMx * dMx + dMy * dMy);
        if (distM < MOUSE_DIST) {
          const force = (MOUSE_DIST - distM) / MOUSE_DIST;
          p.x += (dMx / distM) * force * 1.8;
          p.y += (dMy / distM) * force * 1.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const op = (1 - dist / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${op})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        // Mouse connections
        const dx = particles[i].x - mx;
        const dy = particles[i].y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const op = (1 - dist / MOUSE_DIST) * 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(6,182,212,${op})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
};

/* ─── GitHubStatsCard ────────────────────────────────────────────────────── */
const LANG_COLORS = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3776AB',
  Java: '#ED8B00', HTML: '#E34C26', CSS: '#563D7C',
  'C++': '#00599C', C: '#A8B9CC', 'C#': '#239120', Go: '#00ADD8',
  Rust: '#DEA584', Ruby: '#CC342D', Shell: '#89E051',
  Kotlin: '#A97BFF', Swift: '#FA7343', Dart: '#00B4AB',
  Vue: '#42B883', SCSS: '#CC6699', PHP: '#777BB4',
};

const GitHubStatsCard = () => {
  const [stats, setStats] = useState(null);
  const [langs, setLangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const username = 'ashishumrey009';
    const fetchStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('API error');
        const user = await userRes.json();
        const repos = await reposRes.json();

        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        const langMap = {};
        repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
        const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
        const total = sortedLangs.reduce((s, [, c]) => s + c, 0);
        const langData = sortedLangs.map(([name, count]) => ({
          name, count,
          pct: Math.round((count / total) * 100),
          color: LANG_COLORS[name] || '#7C3AED',
        }));

        setStats({ repos: user.public_repos, followers: user.followers, following: user.following, stars: totalStars });
        setLangs(langData);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="gh-card reveal">
      {/* macOS-style topbar */}
      <div className="gh-topbar">
        <div className="gh-dot" style={{ background: '#FF5F57' }} />
        <div className="gh-dot" style={{ background: '#FEBC2E' }} />
        <div className="gh-dot" style={{ background: '#28C840' }} />
        <div className="gh-topbar-title">
          <Github size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          github.com/ashishumrey009 — contribution dashboard
        </div>
      </div>

      <div className="gh-body">
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontFamily: 'var(--mono-font)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--violet-lt)' }}>$</span> fetching github stats<span className="t-cursor" />
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
            Rate limited — <a href="https://github.com/ashishumrey009" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--violet-lt)' }}>view on GitHub →</a>
          </div>
        )}
        {stats && !loading && (
          <>
            <div className="gh-stats-row">
              {[
                { val: stats.repos, lbl: 'Public Repos' },
                { val: stats.stars, lbl: 'Total Stars' },
                { val: stats.followers, lbl: 'Followers' },
                { val: stats.following, lbl: 'Following' },
              ].map(s => (
                <div key={s.lbl} className="gh-stat-chip">
                  <div className="gh-stat-val">{s.val}</div>
                  <div className="gh-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
            {langs.length > 0 && (
              <>
                <div className="gh-langs-title">Top Languages</div>
                <div className="gh-lang-bar-wrap">
                  {langs.map(l => (
                    <div key={l.name} className="gh-lang-segment"
                      style={{ flex: l.pct, background: l.color, opacity: 0.85 }} />
                  ))}
                </div>
                <div className="gh-lang-list">
                  {langs.map(l => (
                    <span key={l.name} className="gh-lang-pill">
                      <span className="gh-lang-dot" style={{ background: l.color }} />
                      {l.name} <span style={{ color: 'var(--faint)' }}>{l.pct}%</span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Contribution graph */}
      <div className="gh-contrib-wrap">
        <img
          src="https://ghchart.rshah.org/7C3AED/ashishumrey009"
          alt="GitHub Contribution Graph"
          loading="lazy"
          style={{ filter: 'brightness(0.95) contrast(1.05)' }}
        />
      </div>

      <div className="gh-footer">
        <span className="gh-note">Most work happens in private enterprise repos at Athenahealth.</span>
        <a href="https://github.com/ashishumrey009" target="_blank" rel="noopener noreferrer" className="gh-link">
          View full profile <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
};

/* ─── Sub-components ────────────────────────────────────────────────────── */

/* ─── CustomCursor ────────────────────────────────────────────────── */
const CURSOR_STYLES = `
  *, *::before, *::after { cursor: none !important; }
  .c-dot {
    position: fixed; top: 0; left: 0; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: #A78BFA;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: background 0.2s, width 0.2s, height 0.2s;
    mix-blend-mode: difference;
  }
  .c-ring {
    position: fixed; top: 0; left: 0; z-index: 9998;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid rgba(167,139,250,0.55);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: width 0.25s, height 0.25s, border-color 0.25s, opacity 0.25s;
    backdrop-filter: invert(5%);
  }
  .c-dot.hov  { width: 12px; height: 12px; background: #67E8F9; }
  .c-ring.hov { width: 54px; height: 54px; border-color: rgba(103,232,249,0.45); }
  .c-dot.click  { width: 6px; height: 6px; }
  .c-ring.click { width: 24px; height: 24px; }
  @media (hover: none) { .c-dot, .c-ring { display: none; } }
`;

const CustomCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf  = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const rng  = ringRef.current;
    if (!dot || !rng) return;

    const onMove = e => { pos.current = { x: e.clientX, y: e.clientY }; dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; };
    const onEnter = () => { dot.classList.add('hov'); rng.classList.add('hov'); };
    const onLeave = () => { dot.classList.remove('hov'); rng.classList.remove('hov'); };
    const onDown  = () => { dot.classList.add('click'); rng.classList.add('click'); };
    const onUp    = () => { dot.classList.remove('click'); rng.classList.remove('click'); };

    const hoverEls = ['a', 'button', '.skill-tag', '.gh-stat-chip', '.social-icon', '.nav-link', '.nav-cta', '.bento-cell', '.glass-card'];
    const addHover = () => {
      document.querySelectorAll(hoverEls.join(',')).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    addHover();
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    // Ring lerp loop
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
      rng.style.left = ring.current.x + 'px';
      rng.style.top  = ring.current.y + 'px';
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    return () => {
      cancelAnimationFrame(raf.current);
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  return (
    <>
      <style>{CURSOR_STYLES}</style>
      <div ref={dotRef}  className="c-dot"  />
      <div ref={ringRef} className="c-ring" />
    </>
  );
};

/* ─── FloatingCTA ─────────────────────────────────────────────────── */
const FLOAT_CTA_STYLES = `
  .float-cta {
    position: fixed; bottom: 32px; right: 32px; z-index: 200;
    display: flex; align-items: center; gap: 10px;
    padding: 14px 22px; border-radius: 999px;
    background: linear-gradient(135deg, #7C3AED, #6D28D9);
    color: #fff; font-weight: 700; font-size: 0.88rem;
    border: none; cursor: none; text-decoration: none;
    box-shadow: 0 0 0 0 rgba(124,58,237,0.5);
    animation: float-pulse 2.5s ease-in-out infinite;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease;
    opacity: 0; transform: translateY(16px) scale(0.9);
    font-family: var(--heading-font);
    letter-spacing: 0.01em;
  }
  .float-cta.show { opacity: 1; transform: translateY(0) scale(1); }
  .float-cta:hover {
    transform: translateY(-3px) scale(1.05) !important;
    box-shadow: 0 0 40px rgba(124,58,237,0.6), 0 0 0 0 rgba(124,58,237,0);
    animation: none;
  }
  @keyframes float-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
    70%  { box-shadow: 0 0 0 14px rgba(124,58,237,0); }
    100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
  }
  .float-cta-ring {
    position: absolute; inset: -6px; border-radius: 999px;
    border: 2px solid rgba(167,139,250,0.3);
    animation: float-ring 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes float-ring {
    0%,100% { transform: scale(1); opacity: 0.6; }
    50%     { transform: scale(1.08); opacity: 0.2; }
  }
  @media (max-width: 480px) { .float-cta { bottom: 20px; right: 20px; padding: 12px 18px; font-size: 0.8rem; } }
`;

const FloatingCTA = ({ show }) => (
  <>
    <style>{FLOAT_CTA_STYLES}</style>
    <a
      href="mailto:ashishumrey009@gmail.com"
      className={`float-cta${show ? ' show' : ''}`}
    >
      <div className="float-cta-ring" />
      <Mail size={16} />
      Hire Me
    </a>
  </>
);

const GlassCard = ({ children, style = {}, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const onMove = useCallback(e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);
  return (
    <div
      ref={ref} onMouseMove={onMove}
      className={`glass-card reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <div className="section-label reveal">
    <span className="section-label-line" />
    {children}
    <span className="section-label-line" />
  </div>
);

/* ─── Main Portfolio ─────────────────────────────────────────────────────── */
const Portfolio = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFloatCTA, setShowFloatCTA] = useState(false);
  const spotlightRef = useRef(null);

  const typed = useTyped(
    ['Senior Software Engineer', 'Backend Developer', 'React Developer', 'Scrum Master'],
    80, 1800
  );
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 30);
      setScrollPct(docH > 0 ? (scrollTop / docH) * 100 : 0);
      setShowFloatCTA(scrollTop > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mouse spotlight effect
  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    const onMove = e => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124,58,237,0.06) 0%, transparent 70%)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4 }
    );
    ['about', 'skills', 'experience', 'education', 'projects', 'achievements', 'contact']
      .forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navItems = ['about', 'experience', 'education', 'projects', 'achievements', 'contact'];

  /* ── DATA ── */
  const marqueeItems = [
    'Senior Software Engineer', 'React Developer', 'Java Spring Boot',
    'Healthcare Platforms', 'Scrum Master', 'Microservices',
    'REST APIs', 'MNNIT Allahabad', 'GATE Qualified', 'Athenahealth'
  ];

  const bentoItems = [
    {
      icon: <Code size={20} />, iconBg: 'rgba(124,58,237,0.15)', iconColor: '#A78BFA',
      title: 'Frontend Development',
      desc: 'Building pixel-perfect React UIs that feel alive. From complex authorization flows to component libraries.',
      span: '',
    },
    {
      icon: <Layers size={20} />, iconBg: 'rgba(6,182,212,0.15)', iconColor: '#67E8F9',
      title: 'Backend & APIs',
      desc: 'Scalable Java Spring Boot microservices and RESTful APIs for critical healthcare workflows.',
      span: '',
    },
    {
      icon: <Workflow size={20} />, iconBg: 'rgba(16,185,129,0.15)', iconColor: '#34d399',
      title: 'Scrum Mastery',
      desc: 'Keeping teams unblocked, work visible, and tied to measurable product outcomes since Nov 2024.',
      span: '',
    },
    {
      icon: <ShieldCheck size={20} />, iconBg: 'rgba(245,158,11,0.15)', iconColor: '#FCD34D',
      title: 'Healthcare Domain',
      desc: '5+ years shipping in healthcare platforms — where reliability and compliance matter more than clever tricks.',
      span: 'span-2',
    },
    {
      icon: <Gauge size={20} />, iconBg: 'rgba(236,72,153,0.15)', iconColor: '#F9A8D4',
      title: 'Performance Engineering',
      desc: 'Reduced BPO agent task time by 25% and boosted efficiency 20% via Z-pattern UI redesign.',
      span: '',
    },
  ];

  const skills = [
    { name: 'JavaScript', emoji: '⚡' }, { name: 'React', emoji: '⚛️' },
    { name: 'Redux', emoji: '🔄' }, { name: 'Java Spring Boot', emoji: '☕' },
    { name: 'REST API', emoji: '🔗' }, { name: 'SAP UI5', emoji: '🔷' },
    { name: 'HTML / CSS', emoji: '🎨' }, { name: 'AWS', emoji: '☁️' },
    { name: 'Microservices', emoji: '🧩' }, { name: 'JIRA / Agile', emoji: '📋' },
    { name: 'GitHub', emoji: '🐙' }, { name: 'Data Structures & Algorithms', emoji: '📊' },
    { name: 'PostgreSQL', emoji: '🗄️' }, { name: 'Docker', emoji: '🐳' },
  ];

  const experiences = [
    {
      title: 'Senior Member of Technical Staff', company: 'Athenahealth',
      period: 'Apr 2025 – Present', location: 'Chennai, India', logo: '🏥',
      bg: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
      desc: [
        'Transitioned to backend development, building scalable microservices using Java Spring Boot',
        'Designed and implemented RESTful APIs for critical healthcare workflows',
        'Collaborated cross-functionally to integrate backend services with React-based frontends',
      ],
    },
    {
      title: 'Member of Technical Staff', company: 'Athenahealth',
      period: 'Mar 2021 – Mar 2025', location: 'Chennai, India', logo: '🏥',
      bg: 'linear-gradient(135deg,#6366F1,#4F46E5)',
      desc: [
        'Developed Product Authops — an authorization system for medical claims',
        'Revolutionized UI with Z-pattern framework, boosting BPO agent efficiency by 20% & reducing task time by 25%',
        'Implemented React + Forge components for agents to process medical claims',
        'Integrated APIs to retrieve data and populate interface screens',
      ],
    },
    {
      title: 'Software Engineer', company: 'Oracle Cerner',
      period: 'Nov 2020 – Mar 2021', location: 'Bangalore, India', logo: '🔮',
      bg: 'linear-gradient(135deg,#EC4899,#DB2777)',
      desc: ['Contributed as a software engineer on the Partogram Project built with React'],
    },
    {
      title: 'Intern', company: 'SAP Labs',
      period: '2018 – 2019', location: 'Bangalore, India', logo: '💼',
      bg: 'linear-gradient(135deg,#10B981,#059669)',
      desc: [
        'Built enterprise-ready web applications using SAP UI5',
        'Gained hands-on experience with SAP technologies and agile development practices',
      ],
    },
  ];

  const education = [
    {
      degree: 'Master of Technology — Software Engineering',
      institution: 'Motilal Nehru National Institute of Technology',
      location: 'Allahabad, U.P.', grade: 'CPI: 8.2 / 10', icon: '🎓',
      bg: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
    },
    {
      degree: 'Bachelor of Technology — Computer Science & Engineering',
      institution: 'Bhilai Institute of Technology',
      location: 'Durg, C.G.', grade: 'CGPA: 7.92 / 10', icon: '💻',
      bg: 'linear-gradient(135deg,#10B981,#06B6D4)',
    },
  ];

  const projects = [
    {
      title: 'Pdhantu Classes', subtitle: 'Online Test Platform',
      description: 'A web platform for students to take tests and track their performance in real time.',
      link: 'https://github.com/Pdhantu-Classes',
      tech: ['React', 'JavaScript', 'Flask (Python)', 'REST API'],
      icon: '📚', bg: 'linear-gradient(135deg,#7C3AED,#A78BFA)',
    },
    {
      title: 'Network Traffic Classifier', subtitle: 'ML Research Project',
      description: "M.Tech thesis — implemented & compared ML techniques for network traffic classification, achieving high accuracy on benchmark datasets.",
      link: null,
      tech: ['Python', 'scikit-learn', 'Machine Learning', 'Data Analysis'],
      icon: '🧠', bg: 'linear-gradient(135deg,#EC4899,#F97316)',
    },
  ];

  const achievements = [
    {
      category: 'Professional', icon: <Target size={18} />,
      iconBg: 'rgba(245,158,11,0.15)', iconColor: '#FCD34D', dotColor: '#F59E0B',
      items: [
        { text: 'Passed CGPSC exam for Lecturer position (2015–16) & reached final interview (waiting list).', link: { href: 'https://psc.cg.gov.in/pdf/RESULT/SL_LE2015.pdf', label: 'Official List' } },
        { text: 'GATE Qualified: 2015, 2016, 2017 — strong CS algorithms & theory foundation' },
        { text: 'Serving as Scrum Master since November 2024' },
        { text: 'Active on LeetCode — practising DSA.', link: { href: 'https://leetcode.com/u/ashishumrey009/', label: 'View Profile →' } },
      ],
    },
    {
      category: 'Leadership & Teaching', icon: <GraduationCap size={18} />,
      iconBg: 'rgba(124,58,237,0.15)', iconColor: '#A78BFA', dotColor: '#7C3AED',
      items: [
        { text: 'Teaching Assistant / Lab Assistant at MNNIT Allahabad' },
        { text: 'Thesis: Network Traffic Classification Techniques using ML' },
        { text: 'Mentor: Dr. Anil Kumar Singh (HOD CSE Dept., MNNIT Allahabad)' },
      ],
    },
  ];

  /* ── RENDER ── */
  return (
    <>
      <style>{STYLES}</style>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Mouse spotlight — full page */}
      <div ref={spotlightRef} style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        transition: 'background 0.1s linear',
      }} />

      {/* Scroll Progress Bar */}
      <div id="scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* Floating Hire Me CTA */}
      <FloatingCTA show={showFloatCTA} />

      {/* NAV */}
      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">AU.</div>

        <div className="nav-links">
          {navItems.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`nav-link${activeSection === s ? ' active' : ''}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <a href="mailto:ashishumrey009@gmail.com" className="nav-cta" style={{ marginLeft: 8 }}>
            <Mail size={14} /> Hire Me
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Panel */}
      <div className={`mobile-panel${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-nav-grid">
          {navItems.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`mobile-nav-btn${activeSection === s ? ' active' : ''}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section id="about" className="hero-section">
        {/* Particle canvas — interactive background */}
        <ParticleCanvas />
        {/* soft ambient glows behind particles */}
        <div className="glow-blob" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 65%)', top: -180, left: -180, zIndex: 0 }} />
        <div className="glow-blob" style={{ width: 550, height: 550, background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)', bottom: -60, right: -120, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 750, width: '100%' }}>
          {/* Photo — double conic ring */}
          <div className="hero-photo-wrap">
            {/* outer fast ring */}
            <div className="hero-photo-ring-outer" />
            {/* inner slower ring + photo */}
            <div className="hero-photo-ring">
              <div className="hero-photo-inner">
                <img src={process.env.PUBLIC_URL + '/ashish-pic.jpeg'} alt="Ashish Umrey" />
              </div>
            </div>
            <div className="hero-online-dot" />
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              Available for opportunities
            </div>
          </div>

          {/* Name */}
          <h1 className="hero-name">
            <BlurText text="Ashish" delay={100} stepDuration={0.45} animateBy="letters" direction="top" className="line-1" />
            <BlurText text="Umrey" delay={100} stepDuration={0.45} animateBy="letters" direction="top" className="line-2" />
          </h1>

          {/* Role typed */}
          <p className="hero-role">
            <strong>{typed}</strong><span className="cursor-blink" />
            {' '}· Senior Software Engineer
          </p>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { val: <><CountUp from={0} to={5} suffix="+" duration={1.6} />Y</>, lbl: 'Experience' },
              { val: '3', lbl: 'Companies' },
              { val: 'GATE ×3', lbl: 'Qualified' },
              { val: 'Healthcare', lbl: 'Domain' },
            ].map((s, i) => (
              <div key={i} className="stat-chip">
                <div className="stat-chip-val">{s.val}</div>
                <div className="stat-chip-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-cta-row">
            <Magnet magnetStrength={0.5}>
              <a href="mailto:ashishumrey009@gmail.com" className="btn-primary">
                <Mail size={16} /> Get In Touch
              </a>
            </Magnet>
            <Magnet magnetStrength={0.5}>
              <a href="https://www.linkedin.com/in/ashishumrey/" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Linkedin size={16} /> LinkedIn
              </a>
            </Magnet>
          </div>

          {/* Socials */}
          <div className="social-row">
            <Magnet magnetStrength={0.4}>
              <a href="https://www.linkedin.com/in/ashishumrey/" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            </Magnet>
            <Magnet magnetStrength={0.4}>
              <a href="https://github.com/ashishumrey009" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                <Github size={18} />
              </a>
            </Magnet>
            <a href="https://leetcode.com/u/ashishumrey009/" target="_blank" rel="noopener noreferrer" className="social-icon" title="LeetCode" style={{ color: '#F59E0B' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
              </svg>
            </a>
            <a href="https://ashishumrey009.github.io/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Portfolio">
              <Globe size={18} />
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <button className="scroll-cue" onClick={() => scrollTo('skills')}>
          <ChevronDown size={18} />
          <span>Scroll</span>
        </button>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══ WHAT I DO — Bento ══ */}
      <section id="skills" className="section-root">
        <div className="section-inner">
          <SectionLabel>What I Do</SectionLabel>
          <h2 className="section-title reveal">Crafting experiences<br />that actually matter.</h2>
          <p className="section-subtitle reveal" style={{ marginBottom: '3rem' }}>
            From pixel-perfect frontends to bulletproof backend APIs — I build software that holds up in production.
          </p>

          <div className="bento-grid reveal">
            {bentoItems.map((item, i) => (
              <div key={i} className={`bento-cell glass-card ${item.span}`}
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="bento-cell-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                  {item.icon}
                </div>
                <div className="bento-cell-title">{item.title}</div>
                <div className="bento-cell-desc">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Skills cloud */}
          <div style={{ marginTop: '3.5rem' }}>
            <p className="reveal" style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet-lt)', marginBottom: 16 }}>
              Tech Stack
            </p>
            <div className="skills-cloud reveal">
              {skills.map((s, i) => (
                <Magnet key={s.name} magnetStrength={0.25} padding={20}>
                  <span className="skill-tag" style={{ transitionDelay: `${i * 40}ms` }}>
                    <span className="emoji">{s.emoji}</span> {s.name}
                  </span>
                </Magnet>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section id="experience" className="section-root alt">
        <div className="section-inner">
          <SectionLabel>Professional Journey</SectionLabel>
          <h2 className="section-title reveal">Where I've built,<br />shipped, and grown.</h2>
          <p className="section-subtitle reveal" style={{ marginBottom: '3.5rem' }}>
            5+ years across healthcare, enterprise SaaS, and cutting-edge product companies.
          </p>

          <div className="timeline" style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {experiences.map((exp, idx) => (
              <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="timeline-dot" style={{ background: exp.bg }}>
                  {exp.logo}
                </div>
                <GlassCard className="timeline-card" style={{ flex: 1, padding: 0 }}>
                  <div className="timeline-card">
                    <span className="timeline-period">{exp.period}</span>
                    <div className="timeline-title">{exp.title}</div>
                    <div className="timeline-company">{exp.company}</div>
                    <div className="timeline-loc"><MapPin size={11} />{exp.location}</div>
                    <ul className="timeline-bullets">
                      {exp.desc.map((d, i) => (
                        <li key={i} className="timeline-bullet">{d}</li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EDUCATION ══ */}
      <section id="education" className="section-root">
        <div className="section-inner">
          <SectionLabel>Education</SectionLabel>
          <h2 className="section-title reveal">The foundation<br />of everything.</h2>
          <p className="section-subtitle reveal" style={{ marginBottom: '3rem' }}>
            Strong academic roots in computer science & software engineering.
          </p>

          <div className="edu-grid">
            {education.map((edu, idx) => (
              <GlassCard key={idx} className="edu-card" delay={idx * 100}>
                <div className="edu-icon" style={{ background: edu.bg }}>{edu.icon}</div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-loc"><MapPin size={12} />{edu.location}</div>
                <span className="edu-grade">{edu.grade}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" className="section-root alt">
        <div className="section-inner">
          <SectionLabel>Featured Work</SectionLabel>
          <h2 className="section-title reveal">Projects I'm proud<br />to have built.</h2>
          <p className="section-subtitle reveal" style={{ marginBottom: '3rem' }}>
            Selected projects ranging from student platforms to ML research.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {projects.map((p, idx) => (
              <GlassCard key={idx} className="project-card" delay={idx * 100}>
                <div className="project-header">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div className="project-icon-wrap" style={{ background: p.bg }}>{p.icon}</div>
                    <div>
                      <div className="project-title">{p.title}</div>
                      <div className="project-subtitle">{p.subtitle}</div>
                    </div>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-view-btn">
                      <ExternalLink size={13} /> View
                    </a>
                  )}
                </div>
                <p className="project-desc">{p.description}</p>
                <div className="tech-tags">
                  {p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GITHUB DASHBOARD ══ */}
      <section className="section-root" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <GitHubStatsCard />
        </div>
      </section>

      {/* ══ ACHIEVEMENTS ══ */}
      <section id="achievements" className="section-root alt">
        <div className="section-inner">
          <SectionLabel>Recognition</SectionLabel>
          <h2 className="section-title reveal">Achievements &<br />milestones.</h2>
          <p className="section-subtitle reveal" style={{ marginBottom: '3rem' }}>
            Beyond the day job — exams cleared, research done, teams led.
          </p>

          <div className="ach-grid">
            {achievements.map((a, idx) => (
              <GlassCard key={idx} className="ach-card" delay={idx * 100}>
                <div className="ach-header">
                  <div className="ach-icon" style={{ background: a.iconBg, color: a.iconColor }}>
                    {a.icon}
                  </div>
                  <div className="ach-title">{a.category}</div>
                </div>
                <ul className="ach-list">
                  {a.items.map((item, i) => (
                    <li key={i} className="ach-item">
                      <div className="ach-item-dot" style={{ background: a.dotColor }} />
                      <span>
                        {item.text}
                        {item.link && (
                          <> <a href={item.link.href} target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--violet-lt)', textDecoration: 'underline' }}>
                            {item.link.label}
                          </a></>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="section-root">
        <div className="section-inner" style={{ maxWidth: 680 }}>
          <SectionLabel>Contact</SectionLabel>
          <h2 className="section-title reveal" style={{ textAlign: 'center' }}>
            Let's build something<br />remarkable.
          </h2>
          <p className="reveal" style={{ color: 'var(--muted)', textAlign: 'center', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Open to exciting opportunities, interesting challenges, and good conversations. Drop me a line!
          </p>

          {/* Terminal card */}
          <div className="reveal" style={{ marginBottom: 32 }}>
            <div className="terminal-card">
              <div className="terminal-bar">
                <div className="topbar-dot" style={{ background: '#FF5F57' }} />
                <div className="topbar-dot" style={{ background: '#FEBC2E' }} />
                <div className="topbar-dot" style={{ background: '#28C840' }} />
                <div style={{ marginLeft: 8, fontFamily: 'var(--mono-font)', fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Terminal size={12} /> ashish@portfolio ~
                </div>
              </div>
              <div className="terminal-body">
                <div><span className="t-prompt">→</span> <span className="t-cmd">contact --info</span></div>
                <div className="t-out">
                  &nbsp;&nbsp;<span className="t-key">email</span>
                  {'   '}<span className="t-val">ashishumrey009@gmail.com</span>
                </div>
                <div className="t-out">
                  &nbsp;&nbsp;<span className="t-key">phone</span>
                  {'   '}<span className="t-val">+91 8435389995</span>
                </div>
                <div className="t-out">
                  &nbsp;&nbsp;<span className="t-key">location</span>
                  {'  '}<span className="t-val">Chennai, Tamil Nadu, India</span>
                </div>
                <div className="t-out">
                  &nbsp;&nbsp;<span className="t-key">linkedin</span>
                  {'  '}<span className="t-val">linkedin.com/in/ashishumrey</span>
                </div>
                <div><span className="t-prompt">→</span> <span className="t-cmd">status</span></div>
                <div className="t-out">
                  &nbsp;&nbsp;<span style={{ color: '#10B981' }}>✓</span> <span className="t-val">Open to full-time & remote opportunities</span>
                </div>
                <div><span className="t-prompt">→</span> <span className="t-cmd">reach_out</span><span className="t-cursor" /></div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <a href="mailto:ashishumrey009@gmail.com" className="btn-primary">
              <Mail size={16} /> Send Email
            </a>
            <a href="https://www.linkedin.com/in/ashishumrey/" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <Linkedin size={16} /> Connect on LinkedIn
            </a>
          </div>

          {/* contact chips */}
          <div className="contact-links-row reveal">
            <a href="mailto:ashishumrey009@gmail.com" className="contact-chip">
              <Mail size={14} style={{ color: 'var(--violet-lt)' }} /> ashishumrey009@gmail.com
            </a>
            <a href="tel:8435389995" className="contact-chip">
              <Phone size={14} style={{ color: 'var(--cyan-lt)' }} /> 8435389995
            </a>
            <span className="contact-chip">
              <MapPin size={14} style={{ color: '#F9A8D4' }} /> Chennai, India
            </span>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <p>© 2026 <span>Ashish Umrey</span> · Crafted with <span>React</span> · Designed with ♥</p>
      </footer>
    </>
  );
};

export default Portfolio;
