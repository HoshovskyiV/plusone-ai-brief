/* AI Brief Framer — centered */
const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "targetUrl": "https://chatgpt.com/g/g-69e0f568d5c08191a970cdd142ae123c-brief-framer-by-plusone",
  "sheetsUrl": "https://script.google.com/macros/s/AKfycbxiK9tC4grnTI6WDBKbCiri1yIhXzvp6vZrk15MH-9pnANXJZT_HDGs4J9jegAEiMCbyg/exec"
}/*EDITMODE-END*/;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const hasLen = (v, n = 2) => v.trim().length >= n;

function Topbar() {
  return (
    <div className="topbar">
      <a className="brand" href="https://plusone.ua/" target="_blank" rel="noopener" aria-label="plusone social impact">
        <img className="logo" src="plusone-logo-safezone-white.svg" alt="plusone social impact"/>
      </a>
    </div>
  );
}

function Field({ label, value, onChange, valid, placeholder, type='text', autoComplete }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className={`wrap${valid ? ' done' : ''}`}>
        <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} spellCheck={false}/>
      </div>
    </div>
  );
}

function Unlock() { return null; }

function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [data, setData] = useState({ name:'', company:'', email:'' });
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

  const vName = hasLen(data.name);
  const vCompany = hasLen(data.company);
  const vEmail = isEmail(data.email);
  const valid = vName && vCompany && vEmail && consent;

  const onSubmit = async (e) => {
    e && e.preventDefault();
    if (!valid || submitted) return;
    setSubmitted(true);

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
            name: data.name.trim(),
            company: data.company.trim(),
            email: data.email.trim(),
            consent: consent,
            userAgent: navigator.userAgent,
            referrer: document.referrer || '',
            page: location.href
          }),
          signal: ctrl.signal
        });
        clearTimeout(t);
      } catch(err) {
        // Expected on slow cold-start: 5s timeout or CORS after 302 follow.
        // Either way doPost already ran on server — data is in the sheet.
      }
    }

    if (tweaks.targetUrl) { try { window.location.href = tweaks.targetUrl; } catch(err){} }
  };

  return (
    <div className="stage">
      <Topbar/>

      <div className="center">
        <p className="pitch">
          Заповни форму й отримай доступ до <span className="hl">АІ-інструменту</span>,
          що допоможе визначити <span className="u">реальну комунікаційну задачу</span> та сформувати чіткий бриф.
        </p>

        <form className="form-wrap" onSubmit={onSubmit} noValidate>
          <Field label="Ім'я" value={data.name} onChange={(v)=>setData({...data, name:v})} valid={vName} placeholder="ваше ім'я" autoComplete="given-name"/>
          <Field label="Компанія" value={data.company} onChange={(v)=>setData({...data, company:v})} valid={vCompany} placeholder="назва компанії" autoComplete="organization"/>
          <Field label="Email" type="email" value={data.email} onChange={(v)=>setData({...data, email:v})} valid={vEmail} placeholder="you@company.ua" autoComplete="email"/>

          <div className="row-full">
            <div
              className={`consent${consent ? ' on' : ''}`}
              onClick={()=>setConsent(!consent)}
              role="checkbox"
              aria-checked={consent}
              tabIndex={0}
              onKeyDown={(e)=>{ if (e.key===' '||e.key==='Enter'){ e.preventDefault(); setConsent(!consent);} }}
            >
              <span className="box"/>
              <span className="txt">Дозволяю обробку моїх даних відповідно до <u>політики конфіденційності</u>.</span>
            </div>
          </div>

          <div className="row-full">
            <button type="submit" className={`submit${valid && !submitted ? ' ready' : ''}`} disabled={!valid || submitted}>
              <span>{submitted ? 'Відправляємо…' : 'AI Brief Framer'}</span>
              {!submitted && <span className="arr">→</span>}
            </button>
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
