import { useEffect, useState } from 'react'
import { Property, TipoOperazione } from '../data/properties'
import {
  loadProperties, upsertProperty, deleteProperty, resetProperties,
  loadLeads, deleteLead, leadsToCsv, isAdminLogged, adminLogin, adminLogout, Lead,
} from '../lib/store'
import { eur, slugify, scontoVsOmiMin } from '../lib/calc'
import { Header, Footer, Seo } from '../components/shared'

const EMPTY: Property = {
  id: '', slug: '', titolo: '', citta: '', provincia: 'MI', indirizzo: '', mq: 0,
  tipo: 'asta', baseAsta: 0, offertaMinima: 0, prezzoAcquisto: 0,
  omiMinNormale: 0, omiMaxNormale: 0, omiMaxOttimo: 0, pubblicato: false,
}

export default function Admin() {
  const [logged, setLogged] = useState(isAdminLogged())
  return (
    <>
      <Seo title="Gestionale — UpImmobiliare" description="Area riservata" />
      <Header />
      {logged ? <Dashboard onLogout={() => { adminLogout(); setLogged(false) }} /> : <Login onOk={() => setLogged(true)} />}
      <Footer />
    </>
  )
}

function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const submit = () => { if (adminLogin(pw)) onOk(); else setErr(true) }
  return (
    <div className="login-box">
      <h1>Area riservata</h1>
      <p>Microgestionale UpImmobiliare: immobili e lead.</p>
      <div className="field">
        <input type="password" value={pw} placeholder="Password" style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--line)', borderRadius: 8 }}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()} aria-label="Password amministratore" />
      </div>
      {err && <div className="err">Password non corretta.</div>}
      <button className="btn btn-ink mt-2" onClick={submit}>Accedi</button>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'immobili' | 'lead'>('immobili')
  const [props, setProps] = useState<Property[]>(loadProperties())
  const [leads, setLeads] = useState<Lead[]>(loadLeads())
  const [editing, setEditing] = useState<Property | null>(null)

  const refresh = () => { setProps(loadProperties()); setLeads(loadLeads()) }
  useEffect(() => {
    window.addEventListener('up-data-changed', refresh)
    return () => window.removeEventListener('up-data-changed', refresh)
  }, [])

  const save = (p: Property) => {
    const withId = { ...p, id: p.id || 'p' + Date.now(), slug: p.slug || slugify(`${p.tipo === 'asta' ? 'asta' : 'saldo-stralcio'}-${p.citta}-${p.indirizzo}-${p.mq}mq`) }
    upsertProperty(withId); setEditing(null); refresh()
  }

  const exportCsv = () => {
    const blob = new Blob(['\ufeff' + leadsToCsv(leads)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'lead-upimmobiliare.csv'
    a.click()
  }

  return (
    <div className="admin container">
      <div className="admin-bar">
        <h1 style={{ fontSize: '1.7rem' }}>Gestionale UpImmobiliare</h1>
        <div className="actions">
          <button className={'btn btn-sm ' + (tab === 'immobili' ? 'btn-ink' : 'btn-ghost')} style={tab !== 'immobili' ? { color: 'var(--ink)', borderColor: 'var(--line)' } : {}} onClick={() => setTab('immobili')}>Immobili ({props.length})</button>
          <button className={'btn btn-sm ' + (tab === 'lead' ? 'btn-ink' : 'btn-ghost')} style={tab !== 'lead' ? { color: 'var(--ink)', borderColor: 'var(--line)' } : {}} onClick={() => setTab('lead')}>Lead ({leads.length})</button>
          <button className="btn btn-sm btn-sigillo" onClick={onLogout}>Esci</button>
        </div>
      </div>

      {tab === 'immobili' && (
        <>
          <div className="admin-bar">
            <button className="btn btn-oro" onClick={() => setEditing({ ...EMPTY })}>+ Nuovo immobile</button>
            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}
              onClick={() => { if (confirm('Ripristinare i 18 immobili originali? Le modifiche locali andranno perse.')) { resetProperties(); refresh() } }}>
              Ripristina dati originali
            </button>
          </div>

          {editing && <PropertyForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />}

          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Immobile</th><th>Città</th><th>Mq</th><th>Acquisto</th><th>Sconto vs OMI</th><th>Stato</th><th></th></tr></thead>
              <tbody>
                {props.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.titolo}</strong><br /><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{p.indirizzo}</span></td>
                    <td>{p.citta} ({p.provincia})</td>
                    <td>{p.mq}</td>
                    <td>{eur(p.prezzoAcquisto)}</td>
                    <td style={{ color: 'var(--verde)', fontWeight: 700 }}>−{Math.round(scontoVsOmiMin(p) * 100)}%</td>
                    <td>{p.pubblicato ? <span className="tag tag-pub">Pubblicato</span> : <span className="tag tag-boz">Bozza</span>}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-ink" onClick={() => setEditing(p)}>Modifica</button>
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}
                          onClick={() => { upsertProperty({ ...p, pubblicato: !p.pubblicato }); refresh() }}>
                          {p.pubblicato ? 'Nascondi' : 'Pubblica'}
                        </button>
                        <button className="btn btn-sm btn-sigillo" onClick={() => { if (confirm('Eliminare questo immobile?')) { deleteProperty(p.id); refresh() } }}>Elimina</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'lead' && (
        <>
          <div className="admin-bar">
            <p style={{ color: 'var(--muted)' }}>Richieste ricevute dai form del sito.</p>
            <button className="btn btn-oro btn-sm" onClick={exportCsv} disabled={!leads.length}>Esporta CSV</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Data</th><th>Nome</th><th>Contatti</th><th>Budget</th><th>Immobile</th><th>Messaggio</th><th></th></tr></thead>
              <tbody>
                {leads.map(l => (
                  <tr key={l.id}>
                    <td>{new Date(l.createdAt).toLocaleString('it-IT')}</td>
                    <td><strong>{l.nome}</strong></td>
                    <td>{l.email}<br />{l.telefono}</td>
                    <td>{l.budget}</td>
                    <td>{l.propertyTitolo || '—'}</td>
                    <td style={{ maxWidth: 260 }}>{l.messaggio}</td>
                    <td><button className="btn btn-sm btn-sigillo" onClick={() => { deleteLead(l.id); refresh() }}>Elimina</button></td>
                  </tr>
                ))}
                {!leads.length && <tr><td colSpan={7}>Ancora nessun lead. I form del sito salvano qui automaticamente.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function PropertyForm({ initial, onSave, onCancel }: { initial: Property; onSave: (p: Property) => void; onCancel: () => void }) {
  const [p, setP] = useState<Property>(initial)
  const set = (k: keyof Property, v: string | number | boolean) => setP(prev => ({ ...prev, [k]: v }))
  const num = (v: string) => (v === '' ? 0 : +v)
  return (
    <div className="admin-form">
      <h3 className="mb-2">{p.id ? 'Modifica immobile' : 'Nuovo immobile'}</h3>
      <div className="grid2">
        <div className="field"><label>Titolo</label><input value={p.titolo} onChange={e => set('titolo', e.target.value)} placeholder="Trilocale 80 mq — Via ..." /></div>
        <div className="field"><label>Slug URL (vuoto = automatico)</label><input value={p.slug} onChange={e => set('slug', slugify(e.target.value))} /></div>
      </div>
      <div className="grid3">
        <div className="field"><label>Indirizzo</label><input value={p.indirizzo} onChange={e => set('indirizzo', e.target.value)} /></div>
        <div className="field"><label>Città</label><input value={p.citta} onChange={e => set('citta', e.target.value)} /></div>
        <div className="field"><label>Provincia</label><input value={p.provincia} onChange={e => set('provincia', e.target.value)} maxLength={2} /></div>
      </div>
      <div className="grid3">
        <div className="field"><label>Mq</label><input type="number" value={p.mq || ''} onChange={e => set('mq', num(e.target.value))} /></div>
        <div className="field"><label>Tipo operazione</label>
          <select value={p.tipo} onChange={e => set('tipo', e.target.value as TipoOperazione)}>
            <option value="asta">Asta giudiziaria</option>
            <option value="saldo_stralcio">Saldo e stralcio</option>
          </select>
        </div>
        <div className="field"><label>Tribunale</label><input value={p.tribunale || ''} onChange={e => set('tribunale', e.target.value)} /></div>
      </div>
      <div className="grid3">
        <div className="field"><label>Data asta</label><input type="date" value={p.dataAsta || ''} onChange={e => set('dataAsta', e.target.value)} /></div>
        <div className="field"><label>Base d'asta €</label><input type="number" value={p.baseAsta || ''} onChange={e => set('baseAsta', num(e.target.value))} /></div>
        <div className="field"><label>Offerta minima €</label><input type="number" value={p.offertaMinima || ''} onChange={e => set('offertaMinima', num(e.target.value))} /></div>
      </div>
      <div className="grid3">
        <div className="field"><label>Prezzo d'acquisto target €</label><input type="number" value={p.prezzoAcquisto || ''} onChange={e => set('prezzoAcquisto', num(e.target.value))} /></div>
        <div className="field"><label>OMI min normale €/mq</label><input type="number" value={p.omiMinNormale || ''} onChange={e => set('omiMinNormale', num(e.target.value))} /></div>
        <div className="field"><label>OMI max normale €/mq</label><input type="number" value={p.omiMaxNormale || ''} onChange={e => set('omiMaxNormale', num(e.target.value))} /></div>
      </div>
      <div className="grid3">
        <div className="field"><label>OMI max ottimo €/mq</label><input type="number" value={p.omiMaxOttimo || ''} onChange={e => set('omiMaxOttimo', num(e.target.value))} /></div>
        <div className="field"><label>Affitto min €/mq/mese</label><input type="number" step="0.1" value={p.affittoMinMq ?? ''} onChange={e => set('affittoMinMq', num(e.target.value))} /></div>
        <div className="field"><label>Affitto max €/mq/mese</label><input type="number" step="0.1" value={p.affittoMaxMq ?? ''} onChange={e => set('affittoMaxMq', num(e.target.value))} /></div>
      </div>
      <div className="field"><label>Note (stato occupazione, pertinenze...)</label><textarea rows={2} value={p.note || ''} onChange={e => set('note', e.target.value)} /></div>
      <div className="field">
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={p.pubblicato} onChange={e => set('pubblicato', e.target.checked)} /> Pubblicato sul sito
        </label>
      </div>
      <div className="actions">
        <button className="btn btn-ink" onClick={() => onSave(p)} disabled={!p.titolo || !p.citta || !p.mq}>Salva immobile</button>
        <button className="btn btn-ghost" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }} onClick={onCancel}>Annulla</button>
      </div>
    </div>
  )
}
