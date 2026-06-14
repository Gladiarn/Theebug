import { useNavigate } from 'react-router';
import { useTheme, AppTheme } from './ThemeContext';
import { LEVELS } from './gameData';

/* ─── tiny helpers ─────────────────────────────────────────── */

function Tag({ children, theme }: { children: React.ReactNode; theme: AppTheme }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: theme.isDark ? 'rgba(78,201,176,.12)' : 'rgba(0,122,204,.08)',
      border: `1px solid ${theme.accent}`, borderRadius: 20,
      padding: '3px 12px', fontSize: 11, color: theme.accent, fontFamily: 'monospace',
    }}>
      {children}
    </span>
  );
}

function SectionLabel({ children, theme }: { children: string; theme: AppTheme }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.accent, marginBottom: 10, fontFamily: 'monospace' }}>
      {children}
    </div>
  );
}

function SectionHeading({ children, theme }: { children: React.ReactNode; theme: AppTheme }) {
  return (
    <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: theme.text, lineHeight: 1.2, letterSpacing: '-0.02em', margin: 0 }}>
      {children}
    </h2>
  );
}

/* ─── editor mockup ────────────────────────────────────────── */
function EditorMockup({ theme }: { theme: AppTheme }) {
  const lines = [
    [{ t: 'function ', c: theme.codeKeyword }, { t: 'add', c: theme.codeFunction }, { t: '(a, b) {', c: theme.codePlain }],
    [{ t: '  return ', c: theme.codeKeyword }, { t: null, c: '' }],
    [{ t: '}', c: theme.codePlain }],
    [],
    [{ t: 'console', c: theme.codeVariable }, { t: '.', c: theme.codePlain }, { t: 'log', c: theme.codeFunction }, { t: '(add(3, 7)); ', c: theme.codePlain }, { t: '// 10', c: theme.codeComment }],
  ];

  return (
    <div style={{
      background: theme.editorBg, border: `1px solid ${theme.border}`, borderRadius: 10,
      overflow: 'hidden', width: '100%', maxWidth: 500,
      boxShadow: theme.isDark ? '0 32px 80px rgba(0,0,0,.65)' : '0 24px 60px rgba(0,0,0,.14)',
      fontFamily: "'JetBrains Mono','Consolas',monospace", fontSize: 13,
    }}>
      {/* Title bar */}
      <div style={{ background: theme.panelBg, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 7, borderBottom: `1px solid ${theme.border}` }}>
        {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:c }} />)}
        <span style={{ flex:1, textAlign:'center', fontSize:11, color:theme.textMuted }}>lesson2.js — Code Canvas</span>
      </div>
      {/* Tab */}
      <div style={{ background: theme.panelBg, borderBottom: `1px solid ${theme.border}`, display:'flex', height:32 }}>
        <div style={{ background:theme.editorBg, padding:'0 14px', height:'100%', display:'flex', alignItems:'center', fontSize:12, color:theme.text, borderTop:`1.5px solid ${theme.accentBlue}`, gap:6 }}>
          <span style={{ color:'#e8bf6a', fontWeight:'bold', fontSize:11 }}>JS</span> lesson2.js
        </div>
      </div>
      {/* Code */}
      <div style={{ padding:'14px 0 14px', lineHeight:1.75 }}>
        {lines.map((segs, li) => (
          <div key={li} style={{ display:'flex', alignItems:'center', minHeight:22, paddingLeft:0 }}>
            <div style={{ width:44, textAlign:'right', paddingRight:16, color:theme.lineNum, fontSize:12, userSelect:'none', flexShrink:0 }}>{li+1}</div>
            <div style={{ display:'flex', alignItems:'center' }}>
              {segs.map((s, si) => s.t === null
                ? <span key={si} style={{ display:'inline-flex', alignItems:'center', minWidth:90, padding:'1px 10px', borderRadius:3, background:theme.dropEmptyBg, border:`1.5px dashed ${theme.dropEmptyBorder}`, color:theme.accent, opacity:.65, fontSize:11, letterSpacing:2, margin:'0 2px' }}>______</span>
                : <span key={si} style={{ color: s.c, whiteSpace:'pre' }}>{s.t}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Blocks strip */}
      <div style={{ borderTop:`1px solid ${theme.border}`, background:theme.panelBg, padding:'9px 14px', display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ fontSize:10, color:theme.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginRight:2 }}>Drag:</span>
        {['a + b','a - b','a * b','a / b'].map(code => (
          <span key={code} style={{ background:theme.blockBg, border:`1px solid ${theme.blockBorder}`, borderRadius:3, padding:'4px 10px', fontSize:12, color:theme.text, cursor:'grab', fontFamily:'monospace' }}>{code}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── step card ────────────────────────────────────────────── */
function StepCard({ num, icon, title, desc, theme }: { num: number; icon: string; title: string; desc: string; theme: AppTheme }) {
  return (
    <div style={{
      flex:1, minWidth:180, padding:'24px 22px', borderRadius:10,
      background: theme.panelBg, border:`1px solid ${theme.border}`,
      display:'flex', flexDirection:'column', gap:12,
      transition:'border-color .15s, transform .15s',
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = theme.accent; el.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = theme.border; el.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:'50%', background: theme.isDark ? 'rgba(78,201,176,.15)' : 'rgba(0,122,204,.1)', border:`1px solid ${theme.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:theme.accent, fontFamily:'monospace', fontWeight:700, flexShrink:0 }}>{num}</div>
        <span style={{ fontSize:20 }}>{icon}</span>
      </div>
      <div style={{ fontWeight:700, fontSize:14, color:theme.text }}>{title}</div>
      <div style={{ fontSize:12, color:theme.textMuted, lineHeight:1.6 }}>{desc}</div>
    </div>
  );
}

/* ─── level card ───────────────────────────────────────────── */
function LevelCard({ level, theme, onClick }: { level: typeof LEVELS[0]; theme: AppTheme; onClick: () => void }) {
  const sampleLine = level.codeLines.find(l => l.includes('{{'));
  const preview = sampleLine ? sampleLine.replace(/\{\{[^}]+\}\}/g, '[ ___ ]') : level.codeLines[1] ?? '';

  return (
    <div
      onClick={onClick}
      style={{
        background: theme.panelBg, border:`1px solid ${theme.border}`, borderRadius:10, overflow:'hidden',
        cursor:'pointer', transition:'border-color .15s, transform .15s, box-shadow .15s',
        display:'flex', flexDirection:'column',
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = theme.accent; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = theme.isDark ? '0 12px 32px rgba(0,0,0,.5)' : '0 12px 32px rgba(0,0,0,.1)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = theme.border; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
    >
      {/* Card header */}
      <div style={{ background: theme.isDark ? '#2A2D2E' : '#EAEAEA', padding:'12px 14px', borderBottom:`1px solid ${theme.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontFamily:'monospace', fontSize:11, color:theme.textMuted }}>0{level.id} — {level.filename}</span>
        <span style={{ fontSize:11, color:theme.accentYellow, background: theme.isDark ? '#2D2D2D':'#F0F0F0', padding:'2px 8px', borderRadius:8, border:`1px solid ${theme.border}` }}>{level.title}</span>
      </div>
      {/* Code snippet */}
      <div style={{ padding:'14px', fontFamily:"'JetBrains Mono','Consolas',monospace", fontSize:12, lineHeight:1.7, flex:1 }}>
        {level.codeLines.slice(0,5).map((line, i) => {
          const hasZone = line.includes('{{');
          const display = line.replace(/\{\{[^}]+\}\}/g, '[ ___ ]');
          return (
            <div key={i} style={{ display:'flex', gap:10, minHeight:18 }}>
              <span style={{ color:theme.lineNum, userSelect:'none', fontSize:11, flexShrink:0 }}>{i+1}</span>
              <span style={{ color: hasZone ? theme.accent : theme.textMuted, whiteSpace:'pre', opacity: line === '' ? 0.3 : 1 }}>{display || ' '}</span>
            </div>
          );
        })}
      </div>
      {/* Objective */}
      <div style={{ padding:'10px 14px', borderTop:`1px solid ${theme.border}`, fontSize:11, color:theme.textMuted, lineHeight:1.5 }}>
        {level.objective.length > 72 ? level.objective.slice(0,72) + '…' : level.objective}
      </div>
      {/* Play button */}
      <div style={{ padding:'10px 14px', borderTop:`1px solid ${theme.border}`, display:'flex', justifyContent:'flex-end' }}>
        <span style={{ fontSize:12, color:theme.accent, fontFamily:'monospace' }}>Play → </span>
      </div>
    </div>
  );
}

/* ─── stat pill ────────────────────────────────────────────── */
function StatPill({ value, label, theme }: { value: string; label: string; theme: AppTheme }) {
  return (
    <div style={{ textAlign:'center', padding:'20px 28px', borderRadius:10, background:theme.panelBg, border:`1px solid ${theme.border}` }}>
      <div style={{ fontSize:36, fontWeight:700, color:theme.accent, fontFamily:'monospace', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:theme.textMuted, marginTop:6 }}>{label}</div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────── */
export function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const gradientOverlay = theme.isDark
    ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(78,201,176,.13) 0%, transparent 70%)'
    : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,122,204,.08) 0%, transparent 70%)';

  return (
    <div style={{ flex:1, background:theme.editorBg, color:theme.text, overflowY:'auto', transition:'background .2s, color .2s' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position:'relative', overflow:'hidden', padding:'72px 48px 80px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        {/* Background grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${theme.border} 1px, transparent 1px),linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`, backgroundSize:'48px 48px', opacity:.3, pointerEvents:'none' }} />
        {/* Glow */}
        <div style={{ position:'absolute', inset:0, background:gradientOverlay, pointerEvents:'none' }} />

        <style>{`
          @keyframes worm-float { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-12px) rotate(5deg)} }
          @keyframes fade-up    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          .hero-worm { animation: worm-float 3.2s ease-in-out infinite; display:inline-block; }
          .fade-up-1 { animation: fade-up .6s ease both .1s; }
          .fade-up-2 { animation: fade-up .6s ease both .25s; }
          .fade-up-3 { animation: fade-up .6s ease both .4s; }
          .fade-up-4 { animation: fade-up .6s ease both .55s; }
        `}</style>

        <div className="hero-worm" style={{ fontSize:64, marginBottom:24 }}>🐛</div>

        <div className="fade-up-1" style={{ marginBottom:16 }}>
          <Tag theme={theme}>● Interactive JavaScript Learning Game</Tag>
        </div>

        <h1 className="fade-up-2" style={{ fontSize:'clamp(36px,6vw,62px)', fontWeight:700, color:theme.text, lineHeight:1.1, letterSpacing:'-0.03em', maxWidth:680, margin:'0 0 20px' }}>
          Learn JavaScript<br />
          <span style={{ color:theme.accent }}>by Dragging Code</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize:17, color:theme.textMuted, maxWidth:500, lineHeight:1.65, margin:'0 0 40px' }}>
          A VS Code–styled game where you assemble real JavaScript by dragging code blocks into the editor.
          Debug the Worm coaches you every step of the way.
        </p>

        <div className="fade-up-4" style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <button onClick={() => navigate('/play')}
            style={{ padding:'14px 36px', borderRadius:6, background:theme.accentBlue, border:'none', color:'#fff', cursor:'pointer', fontSize:15, fontWeight:700, boxShadow:'0 4px 16px rgba(0,120,212,.4)', transition:'transform .15s, box-shadow .15s', outline:'none', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform='translateY(-2px)'; b.style.boxShadow='0 8px 24px rgba(0,120,212,.5)'; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform='translateY(0)'; b.style.boxShadow='0 4px 16px rgba(0,120,212,.4)'; }}
          >▶ Start Playing</button>

          <button onClick={() => { document.getElementById('levels-section')?.scrollIntoView({ behavior:'smooth' }); }}
            style={{ padding:'14px 28px', borderRadius:6, background:'transparent', border:`1px solid ${theme.border}`, color:theme.text, cursor:'pointer', fontSize:15, outline:'none', fontFamily:'inherit', transition:'border-color .15s, background .15s' }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor=theme.accent; b.style.background=theme.lineHover; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor=theme.border; b.style.background='transparent'; }}
          >See All Levels ↓</button>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section style={{ borderTop:`1px solid ${theme.border}`, borderBottom:`1px solid ${theme.border}`, background:theme.panelBg, padding:'32px 48px', transition:'background .2s' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <StatPill value="5" label="Coding Levels" theme={theme} />
          <StatPill value="JS" label="Language" theme={theme} />
          <StatPill value="🐛" label="Your Coach" theme={theme} />
          <StatPill value="0→💡" label="No Experience Needed" theme={theme} />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding:'72px 48px', maxWidth:1100, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <SectionLabel theme={theme}>How It Works</SectionLabel>
          <SectionHeading theme={theme}>Three steps to <span style={{ color:theme.accent }}>write real code</span></SectionHeading>
        </div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          <StepCard num={1} icon="👀" title="Read the Objective" desc="Debug the Worm explains the challenge in plain English. No jargon, just friendly guidance in the right panel." theme={theme} />
          <StepCard num={2} icon="🖱️" title="Drag the Right Block" desc="Pick a code block from the bottom tray and drop it into the glowing empty slot inside the VS Code editor." theme={theme} />
          <StepCard num={3} icon="✅" title="Get Instant Feedback" desc="Correct drops turn green and Debug cheers. Wrong drops turn red so you can try again — no judgment, just learning." theme={theme} />
        </div>
      </section>

      {/* ── EDITOR PREVIEW ───────────────────────────────────── */}
      <section style={{ borderTop:`1px solid ${theme.border}`, background: theme.isDark ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.02)', padding:'72px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', width:'100%', boxSizing:'border-box', display:'flex', gap:56, alignItems:'center', flexWrap:'wrap', justifyContent:'center' }}>
          <div style={{ flex:'1 1 300px', maxWidth:520 }}>
            <SectionLabel theme={theme}>The Editor Experience</SectionLabel>
            <SectionHeading theme={theme}>It looks and feels like <span style={{ color:theme.accent }}>VS Code</span></SectionHeading>
            <p style={{ color:theme.textMuted, lineHeight:1.7, fontSize:15, margin:'16px 0 28px' }}>
              Syntax-highlighted code, a real file explorer, line numbers, tabs, a terminal panel, and drop zones that slot right into the code — built with the exact VS Code Dark+ and Light+ color palettes.
            </p>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
              {['Full syntax highlighting in dark & light themes', 'Drop zones inline inside real code structure', 'Terminal shows system logs (not the coach!)', 'File sidebar tracks your progress'].map(item => (
                <li key={item} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:theme.textMuted }}>
                  <span style={{ color:theme.accentGreen, flexShrink:0, marginTop:1 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex:'1 1 300px', display:'flex', justifyContent:'center' }}>
            <EditorMockup theme={theme} />
          </div>
        </div>
      </section>

      {/* ── LEVELS ───────────────────────────────────────────── */}
      <section id="levels-section" style={{ padding:'72px 48px', maxWidth:1100, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
        <div style={{ marginBottom:40 }}>
          <SectionLabel theme={theme}>All Levels</SectionLabel>
          <SectionHeading theme={theme}>Five challenges, <span style={{ color:theme.accent }}>zero boredom</span></SectionHeading>
          <p style={{ color:theme.textMuted, fontSize:14, marginTop:10, lineHeight:1.6 }}>
            Each level teaches a distinct JavaScript concept. Click any card to jump straight in.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16 }}>
          {LEVELS.map(level => (
            <LevelCard key={level.id} level={level} theme={theme} onClick={() => navigate('/play')} />
          ))}
        </div>
      </section>

      {/* ── MEET DEBUG ───────────────────────────────────────── */}
      <section style={{ borderTop:`1px solid ${theme.border}`, background:theme.panelBg, padding:'72px 48px', transition:'background .2s' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', gap:48, alignItems:'center', flexWrap:'wrap', justifyContent:'center' }}>
          {/* Worm display */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, flexShrink:0 }}>
            <div style={{ fontSize:96, animation:'worm-float 3.2s ease-in-out infinite', display:'inline-block' }}>🐛</div>
            <div style={{ fontFamily:'monospace', fontSize:12, color:theme.textMuted }}>Debug the Worm</div>
            {/* Mood badges */}
            <div style={{ display:'flex', gap:8 }}>
              {[['😔','Sad'],['🐛','Neutral'],['🎉','Party']].map(([em,label]) => (
                <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:24 }}>{em}</span>
                  <span style={{ fontSize:10, color:theme.textMuted }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex:1, minWidth:260 }}>
            <SectionLabel theme={theme}>Meet Your Coach</SectionLabel>
            <SectionHeading theme={theme}><span style={{ color:theme.accent }}>Debug</span> never leaves your side</SectionHeading>
            <p style={{ color:theme.textMuted, fontSize:14, lineHeight:1.7, margin:'14px 0 20px' }}>
              Every action triggers a reaction from Debug. Correct answer? He wiggles with joy. Wrong block? He gives you a gentle nudge. Level complete? Pure celebration. All dialogue lives in the right panel — the terminal is strictly for system logs.
            </p>
            {/* Sample speech bubbles */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { mood: theme.accent, text: '"Drag the return block into the empty slot to complete the function!"' },
                { mood: theme.accentGreen, text: '"Perfect! a + b adds both parameters! You\'re getting it! 🚀"' },
                { mood: theme.accentRed, text: '"Hmm, that\'s not quite right. Try a different block! 🤔"' },
              ].map(({ mood, text }) => (
                <div key={text} style={{ background:theme.bubbleBg, border:`1px solid ${mood}`, borderRadius:8, padding:'9px 13px', fontSize:12, color:theme.text, lineHeight:1.55, fontFamily:'monospace' }}>
                  <span style={{ color:mood }}>🐛 </span>{text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section style={{ padding:'80px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:gradientOverlay, pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${theme.border} 1px, transparent 1px),linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`, backgroundSize:'48px 48px', opacity:.2, pointerEvents:'none' }} />

        <div style={{ fontSize:52, marginBottom:20 }}>🏆</div>
        <SectionHeading theme={theme}>Ready to write <span style={{ color:theme.accent }}>real JavaScript?</span></SectionHeading>
        <p style={{ color:theme.textMuted, fontSize:15, margin:'16px auto 36px', maxWidth:420, lineHeight:1.65 }}>
          Five levels. Drag-and-drop. A worm who believes in you. What are you waiting for?
        </p>
        <button onClick={() => navigate('/play')}
          style={{ padding:'15px 44px', borderRadius:6, background:theme.accentBlue, border:'none', color:'#fff', cursor:'pointer', fontSize:16, fontWeight:700, boxShadow:'0 4px 20px rgba(0,120,212,.45)', transition:'transform .15s, box-shadow .15s', outline:'none', fontFamily:'inherit' }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform='translateY(-2px)'; b.style.boxShadow='0 8px 28px rgba(0,120,212,.55)'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform='translateY(0)'; b.style.boxShadow='0 4px 20px rgba(0,120,212,.45)'; }}
        >▶ Launch Code Canvas</button>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${theme.border}`, padding:'18px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:theme.textMuted, flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span>🐛</span>
          <span style={{ fontFamily:'monospace', fontWeight:700 }}>Code Canvas</span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          <span>Built with React + react-dnd</span>
          <span>VS Code Dark+ / Light+ themes</span>
          <span style={{ cursor:'pointer', color:theme.accent }} onClick={() => navigate('/play')}>Play Now →</span>
        </div>
      </footer>
    </div>
  );
}
