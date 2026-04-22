/* AI Brief Framer — centered */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "targetUrl": "https://chatgpt.com/g/g-69e0f568d5c08191a970cdd142ae123c-brief-framer-by-plusone",
  "sheetsUrl": "https://script.google.com/macros/s/AKfycbxiK9tC4grnTI6WDBKbCiri1yIhXzvp6vZrk15MH-9pnANXJZT_HDGs4J9jegAEiMCbyg/exec"
}/*EDITMODE-END*/;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Topbar() {
  return (
    <div className="topbar">
      <a className="brand" href="https://plusone.ua/" target="_blank" rel="noopener" aria-label="plusone social impact">
        <img className="logo" src="plusone-logo-safezone-white.svg" alt="plusone social impact"/>
      </a>
    </div>
  );
}

function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setTweaksVisible(true);
      if (d.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type:'__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweak = (k,v) => {
    const next={...tweaks,[k]:v};
    setTweaks(next);
    window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]:v}}, '*');
  };

  const vEmail = isEmail(email);
  const valid = vEmail && consent;

  const onSubmit = async (e) => {
    e && e.preventDefault();
    if (!valid || submitted) return;
    setSubmitted(true);

    if (tweaks.targetUrl) {
      window.open(tweaks.targetUrl, '_blank');
    }

    if (tweaks.sheetsUrl) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        await fetch(tweaks.sheetsUrl, {
          method: 'POST',
          redirect: 'follow',
          keepalive: true,
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            email: email.trim(),
            consent: consent,
            userAgent: navigator.userAgent,
            referrer: document.referrer || '',
            page: location.href
          }),
          signal: ctrl.signal
        });
        clearTimeout(t);
      } catch(err) {}
    }
  };

  return (
    <div className="stage">
      <Topbar/>

      <div className="center">
        <p className="pitch">
          Brief Framer – AI-інструмент, створений на базі експертизи агенції plusone social impact у стратегічних комунікаціях.
          <br/><br/>
          Ми створили його, щоб допомогти вам визначити реальну комунікаційну задачу та сформувати сильний бриф.
          <br/><br/>
          Заповніть коротку форму, щоб отримати доступ до безкоштовної бета-версії на основі кастомізованого GPT.
        </p>

        <form className="form-wrap" onSubmit={onSubmit} noValidate>
          {showForm && (
            <>
              <div className="field row-full">
                <label>Email</label>
                <div className={`wrap${vEmail ? ' done' : ''}`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.ua"
                    autoComplete="email"
                    spellCheck={false}
                    autoFocus
                  />
                </div>
              </div>

              <div className="row-full">
                <div
                  className={`consent${consent ? ' on' : ''}`}
                  onClick={() => setConsent(!consent)}
                  role="checkbox"
                  aria-checked={consent}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key===' '||e.key==='Enter'){ e.preventDefault(); setConsent(!consent); } }}
                >
                  <span className="box"/>
                  <span className="txt">Дозволяю обробку моїх даних</span>
                </div>
              </div>
            </>
          )}

          <div className="row-full">
            {!showForm ? (
              <button type="button" className="submit ready" onClick={() => setShowForm(true)}>
                <span>Отримати доступ</span>
                <span className="arr">→</span>
              </button>
            ) : (
              <button
                type="submit"
                className={`submit${valid && !submitted ? ' ready' : ''}`}
                disabled={!valid || submitted}
              >
                <span>{submitted ? 'Відкриваємо…' : 'Отримати доступ'}</span>
                {!submitted && <span className="arr">→</span>}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="footer">
        <a href="https://plusone.ua/" target="_blank" rel="noopener" style={{color:'inherit', textDecoration:'none'}}>© plusone social impact 2026</a>
        <span className="links">
          <a href="https://www.facebook.com/PlusOneDA" target="_blank" rel="noopener">facebook</a>
          <a href="https://www.instagram.com/plusone_social.impact/" target="_blank" rel="noopener">instagram</a>
          <a href="https://www.linkedin.com/company/plusone-social-impact/" target="_blank" rel="noopener">linkedin</a>
          <a href="https://www.youtube.com/user/plusoneda" target="_blank" rel="noopener">youtube</a>
        </span>
        <span>office@plusone.com.ua</span>
      </div>

      {tweaksVisible && (
        <div style={{
          position:'fixed', right:16, bottom:60, zIndex:200,
          background:'var(--white)', border:'2px solid var(--blue)',
          padding:14, width:300, fontFamily:'var(--font-mono)',
          fontSize:11, color:'var(--blue)'
        }}>
          <div style={{letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>+ tweaks</div>
          <label style={{display:'block',marginBottom:6,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:10,fontWeight:600}}>Target URL</label>
          <input value={tweaks.targetUrl} onChange={(e)=>setTweak('targetUrl',e.target.value)}
            style={{width:'100%',background:'var(--white)',border:'1.5px solid var(--blue)',color:'var(--blue)',padding:8,fontFamily:'inherit',fontSize:12,marginBottom:10}}/>
          <label style={{display:'block',marginBottom:6,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:10,fontWeight:600}}>Sheets Webhook URL</label>
          <input value={tweaks.sheetsUrl} onChange={(e)=>setTweak('sheetsUrl',e.target.value)} placeholder="https://script.google.com/macros/s/.../exec"
            style={{width:'100%',background:'var(--white)',border:'1.5px solid var(--blue)',color:'var(--blue)',padding:8,fontFamily:'inherit',fontSize:12}}/>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
