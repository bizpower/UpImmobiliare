import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Property } from '../data/properties'
import { eur, scontoVsOmiMin, valoreMin, valoreMaxOttimo } from '../lib/calc'
import { addLead } from '../lib/store'

/* ---------- SEO ---------- */
export function Seo({ title, description, jsonLd }: { title: string; description: string; jsonLd?: object }) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta) }
    meta.setAttribute('content', description)
    let script = document.getElementById('jsonld') as HTMLScriptElement | null
    if (jsonLd) {
      if (!script) { script = document.createElement('script'); script.id = 'jsonld'; script.type = 'application/ld+json'; document.head.appendChild(script) }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) { script.remove() }
  }, [title, description, jsonLd])
  return null
}

/* ---------- Header / Footer ---------- */
export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="logo"><span className="up">UP</span> Immobiliare</Link>
        <nav className="nav">
          <a href="/#immobili" className="hide-m">Immobili</a>
          <a href="/#come-funziona" className="hide-m">Come funziona</a>
          <a href="/#faq" className="hide-m">FAQ</a>
          <a href="/#contatti" className="btn btn-oro btn-sm">Parla con noi</a>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="cols">
          <div>
            <h4><span style={{ color: 'var(--oro)' }}>UP</span> Immobiliare</h4>
            <p>Investimenti in immobili da aste giudiziarie e operazioni di saldo e stralcio in Lombardia. Ogni opportunità è analizzata su quotazioni OMI ufficiali dell'Agenzia delle Entrate.</p>
          </div>
          <div>
            <h4>Naviga</h4>
            <a href="/#immobili">Immobili all'asta</a>
            <a href="/#come-funziona">Come funziona</a>
            <a href="/#faq">Domande frequenti</a>
            <a href="/#contatti">Contatti</a>
          </div>
          <div>
            <h4>Contatti</h4>
            <a href="mailto:info@upimmobiliare.it">info@upimmobiliare.it</a>
            <p>Milano, Italia</p>
          </div>
        </div>
        <p className="disclaimer">
          UpImmobiliare è un operatore indipendente specializzato in immobili provenienti da procedure esecutive
          dei Tribunali di Milano, Monza, Varese e Bergamo e in operazioni di saldo e stralcio. Le informazioni
          pubblicate hanno finalità illustrative, non costituiscono consulenza finanziaria o perizia. I valori di
          mercato indicati derivano dalle quotazioni OMI dell'Agenzia delle Entrate; i risultati dei calcolatori
          sono stime lorde che non includono fiscalità individuale. © {new Date().getFullYear()} UpImmobiliare.
        </p>
      </div>
    </footer>
  )
}

/* ---------- Barra del Margine (firma visiva) ---------- */
export function MarginBar({ p, onDark = false }: { p: Property; onDark?: boolean }) {
  const min = valoreMin(p)
  const max = valoreMaxOttimo(p)
  const pos = Math.min(97, Math.max(3, ((p.prezzoAcquisto - min * 0.5) / (max - min * 0.5)) * 100))
  return (
    <div className={'margin-bar' + (onDark ? ' on-dark' : '')}>
      <div className="track"><div className="marker" style={{ left: pos + '%' }} /></div>
      <div className="labels"><span>OMI min {eur(min)}</span><span>OMI max {eur(max)}</span></div>
      <div className="caption">Prezzo d'acquisto <strong>{eur(p.prezzoAcquisto)}</strong> · {Math.round(scontoVsOmiMin(p) * 100)}% sotto il valore OMI minimo</div>
    </div>
  )
}

/* ---------- Card ---------- */
export function PropertyCard({ p }: { p: Property }) {
  const sconto = Math.round(scontoVsOmiMin(p) * 100)
  return (
    <Link to={'/immobili/' + p.slug} className="card">
      <div className="card-top">
        <div className="badges">
          {p.tipo === 'asta'
            ? <span className="badge badge-asta">Asta giudiziaria</span>
            : <span className="badge badge-ss">Saldo e stralcio</span>}
          {sconto > 0 && <span className="badge badge-sconto">−{sconto}% vs OMI min</span>}
        </div>
        <h3>{p.titolo}</h3>
        <div className="addr">{p.indirizzo} · {p.citta} ({p.provincia})</div>
      </div>
      <div className="card-body">
        <div className="price-row">
          <div className="acq"><small>Prezzo d'acquisto</small>{eur(p.prezzoAcquisto)}</div>
          <div className="mkt">Valore di mercato<br /><strong>{eur(valoreMin(p))} – {eur(valoreMaxOttimo(p))}</strong></div>
        </div>
        <MarginBar p={p} />
        <div className="card-meta">
          <span>{p.mq} mq</span>
          {p.tribunale && <span>{p.tribunale}</span>}
          {p.dataAsta && <span>Asta: {new Date(p.dataAsta).toLocaleDateString('it-IT')}</span>}
        </div>
      </div>
    </Link>
  )
}

/* ---------- Lead form ---------- */
export function LeadForm({ propertyId, propertyTitolo, cta = 'Ricevi le migliori occasioni in anteprima' }:
  { propertyId?: string; propertyTitolo?: string; cta?: string }) {
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ nome: '', email: '', telefono: '', budget: '', messaggio: '' })
  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }))
  const submit = () => {
    if (!f.nome || !f.email) return
    addLead({ ...f, propertyId, propertyTitolo })
    setSent(true)
  }
  if (sent) return <div className="form-ok">Richiesta inviata. Ti ricontattiamo entro 24 ore con il dossier completo.</div>
  return (
    <div className="lead-form">
      <div className="row2">
        <div className="field"><label>Nome e cognome *</label><input value={f.nome} onChange={e => set('nome', e.target.value)} placeholder="Mario Rossi" /></div>
        <div className="field"><label>Email *</label><input type="email" value={f.email} onChange={e => set('email', e.target.value)} placeholder="mario@email.it" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Telefono</label><input value={f.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+39 ..." /></div>
        <div className="field"><label>Budget di investimento</label>
          <select value={f.budget} onChange={e => set('budget', e.target.value)}>
            <option value="">Seleziona</option>
            <option>Fino a 100.000 €</option>
            <option>100.000 – 300.000 €</option>
            <option>300.000 – 600.000 €</option>
            <option>Oltre 600.000 €</option>
          </select>
        </div>
      </div>
      <div className="field"><label>Messaggio</label><textarea rows={3} value={f.messaggio} onChange={e => set('messaggio', e.target.value)} placeholder={propertyTitolo ? `Vorrei il dossier di: ${propertyTitolo}` : 'Cosa stai cercando?'} /></div>
      <button className="btn btn-sigillo" onClick={submit}>{cta}</button>
    </div>
  )
}
