import React, { useState, useEffect, useRef } from 'react';
import {
  Mail, MapPin, Linkedin, Github, Globe, ChevronDown,
  Code, Briefcase, GraduationCap, Award, MessageSquare,
  ExternalLink, Star, Target, Phone, Sun, Moon
} from 'lucide-react';

/* ─── CSS: theme tokens + all component styles ───────────────────────── */
const buildStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  /* ── Theme tokens ── */
  :root {
    --bg:           ${dark ? '#080b14'        : '#f8faff'};
    --bg-soft:      ${dark ? 'rgba(255,255,255,0.015)' : 'rgba(99,102,241,0.03)'};
    --surface:      ${dark ? 'rgba(255,255,255,0.04)'  : 'rgba(255,255,255,0.95)'};
    --border:       ${dark ? 'rgba(255,255,255,0.08)'  : 'rgba(99,102,241,0.15)'};
    --border-hover: ${dark ? 'rgba(99,102,241,0.35)'   : 'rgba(99,102,241,0.4)'};
    --text-primary: ${dark ? '#e2e8f0'  : '#0f172a'};
    --text-muted:   ${dark ? '#94a3b8'  : '#475569'};
    --text-faint:   ${dark ? '#475569'  : '#94a3b8'};
    --nav-bg:       ${dark ? 'rgba(8,11,20,0.75)'  : 'rgba(248,250,255,0.85)'};
    --nav-border:   ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.1)'};
    --nav-text:     ${dark ? '#94a3b8'  : '#64748b'};
    --pill-bg:      ${dark ? 'rgba(255,255,255,0.05)'  : 'rgba(99,102,241,0.06)'};
    --pill-border:  ${dark ? 'rgba(255,255,255,0.10)'  : 'rgba(99,102,241,0.18)'};
    --pill-color:   ${dark ? '#c4b5fd'  : '#6366f1'};
    --card-shadow:  ${dark ? '0 24px 60px rgba(99,102,241,0.2)' : '0 24px 60px rgba(99,102,241,0.12)'};
    --social-bg:    ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.07)'};
    --social-border:${dark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.18)'};
    --social-color: ${dark ? '#94a3b8'  : '#6366f1'};
    --chip-bg:      ${dark ? 'rgba(255,255,255,0.05)'  : 'rgba(99,102,241,0.06)'};
    --chip-border:  ${dark ? 'rgba(255,255,255,0.08)'  : 'rgba(99,102,241,0.12)'};
    --chip-color:   ${dark ? '#94a3b8'  : '#475569'};
    --badge-bg:     ${dark ? 'rgba(99,102,241,0.2)'   : 'rgba(99,102,241,0.1)'};
    --badge-color:  ${dark ? '#a5b4fc'  : '#6366f1'};
    --badge-border: ${dark ? 'rgba(99,102,241,0.35)'  : 'rgba(99,102,241,0.3)'};
    --footer-bg:    ${dark ? 'rgba(0,0,0,0.3)'  : 'rgba(99,102,241,0.04)'};
    --footer-text:  ${dark ? '#334155'  : '#94a3b8'};
    --timeline-line:${dark ? '#6366f1'  : '#818cf8'};
    --photo-border: ${dark ? '#080b14'  : '#fff'};
    --status-border:${dark ? '#080b14'  : '#fff'};
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text-primary);
    overflow-x: hidden;
    transition: background 0.4s ease, color 0.4s ease;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }

  /* ── blobs ── */
  @keyframes blobFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.08); }
    66%      { transform: translate(-20px,20px) scale(0.95); }
  }
  .blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: ${dark ? 0.35 : 0.18};
    animation: blobFloat 12s ease-in-out infinite;
  }
  .blob-1 { width:500px;height:500px;background:#6366f1;top:-120px;left:-100px;animation-delay:0s; }
  .blob-2 { width:400px;height:400px;background:#8b5cf6;top:200px;right:-80px;animation-delay:4s; }
  .blob-3 { width:300px;height:300px;background:#06b6d4;bottom:0;left:30%;animation-delay:8s; }

  /* ── cursor blink ── */
  @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0;} }
  .cursor { display:inline-block;width:3px;height:1.1em;background:#818cf8;margin-left:4px;vertical-align:text-bottom;animation:blink 1s step-end infinite;border-radius:2px; }

  /* ── scroll reveal ── */
  .reveal { opacity:0; transform:translateY(40px); transition:opacity 0.7s ease,transform 0.7s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ── glow card ── */
  .glow-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.4s ease;
  }
  .glow-card::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(99,102,241,0.12), transparent 60%);
    opacity:0; transition:opacity 0.4s; pointer-events:none;
  }
  .glow-card:hover::before { opacity:1; }
  .glow-card:hover { transform:translateY(-4px); box-shadow:var(--card-shadow); border-color:var(--border-hover); }

  /* ── skill pill ── */
  .skill-pill {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 18px; border-radius:999px;
    border:1px solid var(--pill-border);
    background: var(--pill-bg);
    font-size:0.875rem; font-weight:500;
    color: var(--pill-color);
    cursor:default; transition:all 0.25s ease; backdrop-filter:blur(6px);
  }
  .skill-pill:hover {
    background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.6);
    color:${dark ? '#fff' : '#4f46e5'};
    transform:translateY(-2px) scale(1.04); box-shadow:0 0 20px rgba(99,102,241,0.25);
  }

  /* ── timeline dot ── */
  .timeline-dot {
    width:52px;height:52px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:1.4rem; flex-shrink:0;
    box-shadow:0 0 0 4px rgba(99,102,241,0.2),0 0 20px rgba(99,102,241,0.25);
    position:relative; z-index:2;
    border:2px solid rgba(99,102,241,0.5);
  }

  /* ── nav pill ── */
  .nav-pill {
    padding:7px 18px; border-radius:999px;
    font-size:0.8rem; font-weight:500; letter-spacing:0.03em;
    transition:all 0.25s ease; color:var(--nav-text);
    border:1px solid transparent; cursor:pointer; background:none;
  }
  .nav-pill:hover { color:#818cf8; background:rgba(99,102,241,0.1); }
  .nav-pill.active { color:${dark ? '#fff' : '#4f46e5'}; background:rgba(99,102,241,0.18); border-color:rgba(99,102,241,0.4); box-shadow:0 0 14px rgba(99,102,241,0.2); }

  /* ── photo ring pulse ── */
  @keyframes ringPulse {
    0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5);}
    50%     {box-shadow:0 0 0 16px rgba(99,102,241,0);}
  }
  .photo-ring { animation:ringPulse 3s ease-in-out infinite; }

  /* ── section heading ── */
  .section-heading { position:relative; display:inline-block; }
  .section-heading::after {
    content:''; position:absolute; left:50%; bottom:-10px;
    transform:translateX(-50%); width:48px; height:3px;
    background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:2px;
  }

  /* ── social btn ── */
  .social-btn {
    display:flex; align-items:center; justify-content:center;
    width:48px; height:48px; border-radius:14px;
    transition:all 0.25s ease;
    border:1px solid var(--social-border);
    background:var(--social-bg); color:var(--social-color);
  }
  .social-btn:hover { transform:translateY(-3px) scale(1.08); color:#fff; box-shadow:0 8px 24px rgba(99,102,241,0.35); background:rgba(99,102,241,0.3); border-color:rgba(99,102,241,0.5); }

  /* ── CTAs ── */
  .cta-primary {
    display:inline-flex; align-items:center; gap:8px; padding:14px 32px; border-radius:14px;
    font-weight:600; font-size:0.95rem;
    background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;
    border:none; cursor:pointer; transition:all 0.25s ease;
    box-shadow:0 4px 20px rgba(99,102,241,0.35); text-decoration:none;
  }
  .cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(99,102,241,0.5); filter:brightness(1.1); }

  .cta-secondary {
    display:inline-flex; align-items:center; gap:8px; padding:13px 32px; border-radius:14px;
    font-weight:600; font-size:0.95rem; background:transparent;
    color:${dark ? '#c4b5fd' : '#6366f1'}; border:1px solid rgba(99,102,241,0.5);
    cursor:pointer; transition:all 0.25s ease; text-decoration:none;
  }
  .cta-secondary:hover { background:rgba(99,102,241,0.12); transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.2); color:${dark ? '#fff' : '#4f46e5'}; }

  /* ── gradient text ── */
  .grad-blue  { background:linear-gradient(135deg,#818cf8,#c084fc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .grad-green { background:linear-gradient(135deg,#34d399,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .grad-pink  { background:linear-gradient(135deg,#f472b6,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .grad-gold  { background:linear-gradient(135deg,#fbbf24,#f97316); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  /* ── badge ── */
  .badge {
    display:inline-block; padding:4px 12px; border-radius:999px;
    font-size:0.75rem; font-weight:600; letter-spacing:0.04em;
    background:var(--badge-bg); color:var(--badge-color); border:1px solid var(--badge-border);
  }

  /* ── contact chip ── */
  .contact-info-row {
    display:flex; align-items:center; gap:10px;
    padding:10px 16px; border-radius:12px;
    background:var(--chip-bg); border:1px solid var(--chip-border);
    font-size:0.875rem; color:var(--chip-color);
    transition:all 0.2s ease; text-decoration:none;
  }
  .contact-info-row:hover { color:#818cf8; background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.3); }

  /* ── theme toggle ── */
  .theme-toggle {
    position: relative;
    width: 56px; height: 28px;
    border-radius: 999px;
    border: 1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.25)'};
    background: ${dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'};
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex; align-items: center;
    padding: 3px;
    outline: none;
  }
  .theme-toggle:hover {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.2);
    box-shadow: 0 0 12px rgba(99,102,241,0.3);
  }
  .toggle-thumb {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg,#6366f1,#8b5cf6);
    box-shadow: 0 2px 8px rgba(99,102,241,0.5);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px;
    transform: ${dark ? 'translateX(28px)' : 'translateX(0)'};
  }
`;

/* ─── useTyped ───────────────────────────────────────────────────────── */
const useTyped = (words, speed = 100, pause = 2000) => {
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
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(w => (w+1)%words.length); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed/2 : speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
};

/* ─── useScrollReveal ────────────────────────────────────────────────── */
const useScrollReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ─── GlowCard ───────────────────────────────────────────────────────── */
const GlowCard = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
    ref.current.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className="glow-card reveal" style={{ transitionDelay:`${delay}ms`, ...style }}>
      {children}
    </div>
  );
};

/* ─── SectionHeading ─────────────────────────────────────────────────── */
const SectionHeading = ({ children, gradClass = 'grad-blue', icon: Icon }) => (
  <div className="reveal" style={{ textAlign:'center', marginBottom:'3.5rem' }}>
    {Icon && <Icon size={28} style={{ display:'inline', marginRight:10, verticalAlign:'middle', color:'#818cf8' }} />}
    <h2 className={`section-heading ${gradClass}`} style={{ fontSize:'2.25rem', fontWeight:700, display:'inline' }}>
      {children}
    </h2>
  </div>
);

/* ─── ThemeToggle button ─────────────────────────────────────────────── */
const ThemeToggle = ({ dark, onToggle }) => (
  <button
    className="theme-toggle"
    onClick={onToggle}
    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    title={dark ? 'Light mode' : 'Dark mode'}
  >
    <div className="toggle-thumb">
      {dark ? <Moon size={12} /> : <Sun size={12} />}
    </div>
  </button>
);

/* ─── Portfolio ──────────────────────────────────────────────────────── */
const Portfolio = () => {
  /* persist dark preference */
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') !== 'light'; } catch { return true; }
  });
  const toggleTheme = () => setDark(d => { const next = !d; try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {} return next; });

  const [activeSection, setActiveSection] = useState('about');
  const typed = useTyped(['Software Engineer','Backend Developer','React Developer','Scrum Master'], 80, 1800);
  useScrollReveal();

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4 }
    );
    ['about','skills','experience','education','projects','achievements','contact']
      .forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  const navItems = ['about','experience','education','projects','achievements','contact'];

  const T = {
    textPrimary: dark ? '#e2e8f0' : '#0f172a',
    textMuted:   dark ? '#94a3b8' : '#475569',
    textFaint:   dark ? '#475569' : '#94a3b8',
    surface:     dark ? 'rgba(255,255,255,0.04)' : '#fff',
    sectionBg:   dark ? 'rgba(255,255,255,0.015)' : 'rgba(99,102,241,0.03)',
    sectionBorder: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(99,102,241,0.08)',
    photoBorder: dark ? '#080b14' : '#fff',
    navBg:       dark ? 'rgba(8,11,20,0.75)' : 'rgba(248,250,255,0.88)',
    navBorder:   dark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.1)',
    navName:     dark ? '#e2e8f0' : '#1e293b',
    footerBg:    dark ? 'rgba(0,0,0,0.3)' : 'rgba(99,102,241,0.04)',
    footerText:  dark ? '#334155' : '#94a3b8',
    gridDot:     dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)',
    timelineGrad: dark
      ? 'linear-gradient(to bottom,#6366f1 0%,rgba(99,102,241,0.1) 100%)'
      : 'linear-gradient(to bottom,#818cf8 0%,rgba(129,140,248,0.1) 100%)',
    expTitle:    dark ? '#e2e8f0' : '#1e293b',
    expCompany:  dark ? '#818cf8' : '#6366f1',
    expLocation: dark ? '#64748b' : '#94a3b8',
    expDesc:     dark ? '#94a3b8' : '#475569',
    projSubtitle:dark ? '#818cf8' : '#6366f1',
    chipBg:      dark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.06)',
    chipBorder:  dark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)',
    greenBadge:  dark ? { bg:'rgba(52,211,153,0.15)', color:'#34d399', border:'rgba(52,211,153,0.3)' }
                      : { bg:'rgba(16,185,129,0.08)', color:'#059669', border:'rgba(16,185,129,0.25)' },
    projViewBg:  dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
    projViewColor:dark? '#818cf8' : '#6366f1',
    projViewBorder:dark?'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
    achIconBg:   (color) => dark ? `rgba(${color},0.15)` : `rgba(${color},0.08)`,
    ghImgFilter: dark ? 'brightness(0.95) contrast(1.05)' : 'brightness(1) contrast(1)',
    ghCardBg:    dark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.04)',
    ghCardBorder:dark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)',
    scrollBtnBorder:dark?'rgba(255,255,255,0.15)':'rgba(99,102,241,0.2)',
    scrollBtnColor: dark?'#64748b':'#818cf8',
    typedBracket: dark?'#818cf8':'#6366f1',
    typedText:    dark?'#e2e8f0':'#1e293b',
    heroBg:      dark?'#080b14':'#f8faff',
    contactCardBg:dark?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.9)',
  };

  const skills = [
    { name:'JavaScript', icon:'⚡' }, { name:'React', icon:'⚛️' },
    { name:'Redux', icon:'🔄' },      { name:'Java Spring Boot', icon:'☕' },
    { name:'REST API', icon:'🔗' },   { name:'SAP UI5', icon:'🔷' },
    { name:'HTML / CSS', icon:'🎨' }, { name:'AWS', icon:'☁️' },
    { name:'Microservices', icon:'🧩' },{ name:'JIRA / Agile', icon:'📋' },
    { name:'GitHub', icon:'🐙' },     { name:'Data Structures & Algorithms', icon:'📊' },
  ];

  const experiences = [
    {
      title:'Senior Member of Technical Staff', company:'Athenahealth',
      period:'Apr 2025 – Present', location:'Chennai, India', logo:'🏥',
      color:'linear-gradient(135deg,#6366f1,#4f46e5)',
      desc:['Transitioned to backend development, building scalable microservices using Java Spring Boot','Designed and implemented RESTful APIs for critical healthcare workflows','Collaborated cross-functionally to integrate backend services with React-based frontends'],
    },
    {
      title:'Member of Technical Staff', company:'Athenahealth',
      period:'Mar 2021 – Mar 2025', location:'Chennai, India', logo:'🏥',
      color:'linear-gradient(135deg,#818cf8,#6366f1)',
      desc:['Developed Product Authops – an authorization system for medical claims','Revolutionized UI with Z-pattern framework, boosting BPO agent efficiency by 20% & reducing task time by 25%','Implemented React + Forge components for agents to process medical claims','Integrated APIs to retrieve data and populate interface screens'],
    },
    {
      title:'Software Engineer', company:'Oracle Cerner',
      period:'Nov 2020 – Mar 2021', location:'Bangalore, India', logo:'🔮',
      color:'linear-gradient(135deg,#f472b6,#ec4899)',
      desc:['Contributed as a software engineer on the Partogram Project built with React'],
    },
    {
      title:'Intern', company:'SAP Labs',
      period:'2018 – 2019', location:'Bangalore, India', logo:'💼',
      color:'linear-gradient(135deg,#34d399,#059669)',
      desc:['Built enterprise-ready web applications using SAP UI5','Gained hands-on experience with SAP technologies and agile development practices'],
    },
  ];

  const education = [
    { degree:'Master of Technology — Software Engineering', institution:'Motilal Nehru National Institute of Technology', location:'Allahabad, U.P.', grade:'CPI: 8.2 / 10', icon:'🎓', color:'linear-gradient(135deg,#818cf8,#6366f1)' },
    { degree:'Bachelor of Technology — Computer Science & Engineering', institution:'Bhilai Institute of Technology', location:'Durg, C.G.', grade:'CGPA: 7.92 / 10', icon:'💻', color:'linear-gradient(135deg,#34d399,#06b6d4)' },
  ];

  const projects = [
    { title:'Pdhantu Classes', subtitle:'Online Test Platform', description:'A web platform for students to take tests and track their performance in real time.', link:'https://github.com/Pdhantu-Classes', tech:['React','JavaScript','Flask (Python)','REST API'], icon:'📚', color:'linear-gradient(135deg,#818cf8,#a78bfa)' },
  ];

  const achievements = [
    {
      category:'Professional', icon:<Target size={20} />, color:'251,191,36', hexColor:'#fbbf24',
      items:[
        { text:'Passed CGPSC exam for Lecturer position (2015–16) & reached final interview (waiting list).', bold:'Dedicated 2015–2016 to this preparation.', link:{ href:'https://psc.cg.gov.in/pdf/RESULT/SL_LE2015.pdf', label:'Official List' } },
        { text:'GATE Qualified: 2015, 2016, 2017' },
        { text:'Serving as Scrum Master since November 2024' },
      ],
    },
    {
      category:'Leadership & Teaching', icon:<GraduationCap size={20} />, color:'129,140,248', hexColor:'#818cf8',
      items:[
        { text:'Teaching Assistant / Lab Assistant at MNNIT Allahabad' },
        { text:'Thesis: Network Traffic Classification Techniques using ML' },
        { text:'Mentor: Dr. Anil Kumar Singh (HOD CSE Dept., MNNIT Allahabad)' },
      ],
    },
  ];

  /* ── render ── */
  return (
    <>
      <style>{buildStyles(dark)}</style>

      {/* NAV */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background: T.navBg, backdropFilter:'blur(20px)',
        borderBottom:`1px solid ${T.navBorder}`,
        transition:'background 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'0.9rem', color:'#fff',
            boxShadow:'0 0 16px rgba(99,102,241,0.4)',
          }}>AU</div>
          <span style={{ fontWeight:700, fontSize:'1.1rem', color:T.navName, letterSpacing:'-0.02em' }}>
            Ashish Umrey
          </span>
        </div>

        {/* Nav links + toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {navItems.map(s => (
            <button key={s} onClick={() => scrollTo(s)}
              className={`nav-pill${activeSection===s?' active':''}`}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
          {/* ── THEME TOGGLE ── */}
          <div style={{ marginLeft:8 }}>
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="about" style={{
        position:'relative', overflow:'hidden',
        minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        padding:'100px 24px 60px', background: T.heroBg, transition:'background 0.4s ease',
      }}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`radial-gradient(${T.gridDot} 1px, transparent 1px)`,
          backgroundSize:'32px 32px',
        }} />

        <div style={{ position:'relative', textAlign:'center', maxWidth:700 }}>
          {/* photo */}
          <div style={{ position:'relative', display:'inline-block', marginBottom:32 }}>
            <div className="photo-ring" style={{
              width:150, height:150, borderRadius:'50%',
              background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
              padding:3, display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>
              <img src={process.env.PUBLIC_URL+'/ashish-pic.jpeg'} alt="Ashish Umrey"
                style={{ width:144, height:144, borderRadius:'50%', objectFit:'cover', border:`3px solid ${T.photoBorder}`, transition:'border-color 0.4s' }} />
            </div>
            <div style={{
              position:'absolute', bottom:6, right:6,
              width:18, height:18, borderRadius:'50%',
              background:'#22c55e', border:`3px solid ${T.photoBorder}`,
              boxShadow:'0 0 10px rgba(34,197,94,0.6)', transition:'border-color 0.4s',
            }} />
          </div>

          {/* name */}
          <h1 style={{
            fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:800, lineHeight:1.08,
            letterSpacing:'-0.04em',
            background:'linear-gradient(135deg,#818cf8 0%,#c084fc 60%,#f472b6 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            marginBottom:16,
          }}>Ashish Umrey</h1>

          {/* typed */}
          <div style={{ fontSize:'1.35rem', fontWeight:500, color:T.textMuted, marginBottom:28, minHeight:'2rem' }}>
            <span style={{ color:T.typedBracket }}>{'< '}</span>
            <span style={{ color:T.typedText }}>{typed}</span>
            <span className="cursor" />
            <span style={{ color:T.typedBracket }}>{' />'}</span>
          </div>

          {/* contact chips */}
          <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:10, marginBottom:28 }}>
            <a href="mailto:ashishumrey009@gmail.com" className="contact-info-row">
              <Mail size={15} style={{ color:'#818cf8' }} /> ashishumrey009@gmail.com
            </a>
            <a href="tel:8435389995" className="contact-info-row">
              <Phone size={15} style={{ color:'#34d399' }} /> 8435389995
            </a>
            <span className="contact-info-row">
              <MapPin size={15} style={{ color:'#f472b6' }} /> Chennai, Tamil Nadu, India
            </span>
          </div>

          {/* socials */}
          <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:40 }}>
            <a href="https://www.linkedin.com/in/ashishumrey/" target="_blank" rel="noopener noreferrer" className="social-btn" title="LinkedIn"><Linkedin size={20} /></a>
            <a href="https://github.com/ashishumrey009" target="_blank" rel="noopener noreferrer" className="social-btn" title="GitHub"><Github size={20} /></a>
            <a href="https://ashishumrey009.github.io/" target="_blank" rel="noopener noreferrer" className="social-btn" title="Portfolio"><Globe size={20} /></a>
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap', marginBottom:48 }}>
            <a href="mailto:ashishumrey009@gmail.com" className="cta-primary"><Mail size={17} /> Get In Touch</a>
            <a href="https://www.linkedin.com/in/ashishumrey/" target="_blank" rel="noopener noreferrer" className="cta-secondary"><Linkedin size={17} /> Connect</a>
          </div>

          {/* scroll cue */}
          <button onClick={() => scrollTo('experience')} style={{
            background:'none', border:`1px solid ${T.scrollBtnBorder}`, borderRadius:'50%',
            width:44, height:44, display:'inline-flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', color:T.scrollBtnColor, animation:'blobFloat 2.5s ease-in-out infinite',
          }}><ChevronDown size={20} /></button>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding:'100px 24px', background:T.sectionBg, borderTop:T.sectionBorder, transition:'background 0.4s' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <SectionHeading icon={Code} gradClass="grad-blue">Skills &amp; Technologies</SectionHeading>
          <div className="reveal" style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
            {skills.map((s,i) => (
              <span key={s.name} className="skill-pill" style={{ transitionDelay:`${i*50}ms` }}>
                <span>{s.icon}</span> {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding:'100px 24px', transition:'background 0.4s' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <SectionHeading icon={Briefcase} gradClass="grad-blue">Professional Journey</SectionHeading>
          <div style={{ position:'relative' }}>
            <div style={{
              position:'absolute', left:25, top:0, bottom:0, width:2,
              background: T.timelineGrad,
            }} />
            <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
              {experiences.map((exp,idx) => (
                <div key={idx} style={{ display:'flex', gap:28, alignItems:'flex-start' }}>
                  <div className="timeline-dot" style={{ background:exp.color, flexShrink:0 }}>{exp.logo}</div>
                  <GlowCard delay={idx*80} style={{ flex:1 }}>
                    <div style={{ padding:28 }}>
                      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:16 }}>
                        <div>
                          <h3 style={{ fontWeight:700, fontSize:'1.15rem', color:T.expTitle, marginBottom:4 }}>{exp.title}</h3>
                          <p style={{ fontWeight:600, color:T.expCompany, marginBottom:4 }}>{exp.company}</p>
                          <p style={{ fontSize:'0.8rem', color:T.expLocation, display:'flex', alignItems:'center', gap:4 }}>
                            <MapPin size={12} /> {exp.location}
                          </p>
                        </div>
                        <span className="badge">{exp.period}</span>
                      </div>
                      <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                        {exp.desc.map((d,i) => (
                          <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, color:T.expDesc, fontSize:'0.9rem', lineHeight:1.6 }}>
                            <Star size={13} style={{ color:'#fbbf24', marginTop:4, flexShrink:0 }} />{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlowCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" style={{ padding:'100px 24px', background:T.sectionBg, borderTop:T.sectionBorder, transition:'background 0.4s' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <SectionHeading icon={GraduationCap} gradClass="grad-green">Education</SectionHeading>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:24 }}>
            {education.map((edu,idx) => (
              <GlowCard key={idx} delay={idx*100}>
                <div style={{ padding:28 }}>
                  <div style={{ width:54, height:54, borderRadius:14, marginBottom:18, background:edu.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>{edu.icon}</div>
                  <h3 style={{ fontWeight:700, color:T.expTitle, fontSize:'1rem', marginBottom:8, lineHeight:1.4 }}>{edu.degree}</h3>
                  <p style={{ fontWeight:600, color:'#34d399', marginBottom:6, fontSize:'0.9rem' }}>{edu.institution}</p>
                  <p style={{ color:T.expLocation, fontSize:'0.8rem', display:'flex', alignItems:'center', gap:4, marginBottom:14 }}>
                    <MapPin size={12} /> {edu.location}
                  </p>
                  <span className="badge" style={{ background:T.greenBadge.bg, color:T.greenBadge.color, borderColor:T.greenBadge.border }}>{edu.grade}</span>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding:'100px 24px', transition:'background 0.4s' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <SectionHeading icon={Code} gradClass="grad-pink">Featured Projects</SectionHeading>
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {projects.map((p,idx) => (
              <GlowCard key={idx} delay={idx*100}>
                <div style={{ padding:28, display:'flex', gap:24, flexWrap:'wrap', alignItems:'flex-start' }}>
                  <div style={{ width:64, height:64, borderRadius:16, flexShrink:0, background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', boxShadow:'0 8px 24px rgba(99,102,241,0.25)' }}>{p.icon}</div>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, flexWrap:'wrap', gap:8 }}>
                      <div>
                        <h3 style={{ fontWeight:700, color:T.expTitle, fontSize:'1.15rem' }}>{p.title}</h3>
                        <p style={{ color:T.projSubtitle, fontSize:'0.85rem', fontWeight:500 }}>{p.subtitle}</p>
                      </div>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
                        display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10,
                        fontSize:'0.8rem', fontWeight:600, background:T.projViewBg, color:T.projViewColor,
                        border:`1px solid ${T.projViewBorder}`, textDecoration:'none', transition:'all 0.2s',
                      }}>
                        <ExternalLink size={14} /> View
                      </a>
                    </div>
                    <p style={{ color:T.expDesc, fontSize:'0.9rem', lineHeight:1.7, marginBottom:16 }}>{p.description}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {p.tech.map(t => <span key={t} className="badge" style={{ background:'rgba(139,92,246,0.12)', color:'#a78bfa', borderColor:'rgba(139,92,246,0.25)' }}>{t}</span>)}
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" style={{ padding:'100px 24px', background:T.sectionBg, borderTop:T.sectionBorder, transition:'background 0.4s' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <SectionHeading icon={Award} gradClass="grad-gold">Achievements &amp; Recognition</SectionHeading>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:24 }}>
            {achievements.map((a,idx) => (
              <GlowCard key={idx} delay={idx*100}>
                <div style={{ padding:28 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:T.achIconBg(a.color), display:'flex', alignItems:'center', justifyContent:'center', color:a.hexColor, border:`1px solid ${a.hexColor}40` }}>{a.icon}</div>
                    <h3 style={{ fontWeight:700, color:T.expTitle, fontSize:'1rem' }}>{a.category}</h3>
                  </div>
                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:14 }}>
                    {a.items.map((item,i) => (
                      <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:'0.875rem', lineHeight:1.6, color:T.expDesc }}>
                        <Star size={13} style={{ color:a.hexColor, marginTop:4, flexShrink:0 }} />
                        <span>
                          {item.text}
                          {item.bold && <><br /><strong style={{ color:dark?'#c4b5fd':'#6366f1', fontWeight:600 }}>{item.bold}</strong></>}
                          {item.link && <> <a href={item.link.href} target="_blank" rel="noopener noreferrer" style={{ color:'#818cf8', textDecoration:'underline' }}>{item.link.label}</a></>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* GITHUB GRAPH */}
      <section style={{ padding:'80px 24px', transition:'background 0.4s' }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <h2 className="section-heading grad-blue reveal" style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:40 }}>GitHub Contributions</h2>
          <div className="reveal" style={{
            padding:24, borderRadius:20, display:'inline-block', width:'100%',
            background:T.ghCardBg, border:`1px solid ${T.ghCardBorder}`,
          }}>
            <img src="https://ghchart.rshah.org/6366f1/ashishumrey009" alt="GitHub Contribution Graph"
              style={{ width:'100%', maxWidth:700, borderRadius:10, filter:T.ghImgFilter }} />
            <p style={{ marginTop:12, fontSize:'0.8rem', color:T.textFaint }}>
              <a href="https://github.com/ashishumrey009" target="_blank" rel="noopener noreferrer" style={{ color:'#818cf8', textDecoration:'none' }}>
                View full profile on GitHub →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:'100px 24px', borderTop:T.sectionBorder, transition:'background 0.4s' }}>
        <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
          <SectionHeading icon={MessageSquare} gradClass="grad-pink">Let's Build Something</SectionHeading>
          <p className="reveal" style={{ color:T.textMuted, lineHeight:1.8, marginBottom:40, fontSize:'1rem' }}>
            Ready to discuss your next project? I'm always open to exciting opportunities and interesting challenges. Let's connect and create something extraordinary.
          </p>
          <div className="reveal" style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
            <a href="mailto:ashishumrey009@gmail.com" className="cta-primary"><Mail size={17} /> Send Email</a>
            <a href="https://www.linkedin.com/in/ashishumrey/" target="_blank" rel="noopener noreferrer" className="cta-secondary"><Linkedin size={17} /> Connect on LinkedIn</a>
          </div>
          <div className="reveal" style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:10, marginTop:36 }}>
            <span className="contact-info-row"><Mail size={14} style={{ color:'#818cf8' }} /> ashishumrey009@gmail.com</span>
            <span className="contact-info-row"><Phone size={14} style={{ color:'#34d399' }} /> 8435389995</span>
            <span className="contact-info-row"><MapPin size={14} style={{ color:'#f472b6' }} /> Chennai, India</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'28px 24px', borderTop:T.sectionBorder, textAlign:'center', background:T.footerBg, transition:'background 0.4s' }}>
        <p style={{ color:T.footerText, fontSize:'0.8rem' }}>
          © 2025 Ashish Umrey · Crafted with ❤️ using React &amp; Tailwind CSS
        </p>
      </footer>
    </>
  );
};

export default Portfolio;