import { useParams, Link } from 'react-router-dom'
import { loadProperties } from '../lib/store'
import { eur, valoreMin, valoreMaxNormale, valoreMaxOttimo, scontoVsOmiMin } from '../lib/calc'
import { Header, Footer, Seo, MarginBar, LeadForm } from '../components/shared'
import RoiCalculator from '../components/RoiCalculator'

export default function PropertyDetail() {
  const { slug } = useParams()
  const p = loadProperties().find(x => x.slug === slug && x.pubblicato)

  if (!p) {
    return (
      <>
        <Header />
        <div className="container section">
          <h1>Immobile non trovato</h1>
          <p className="mt-2">Questa scheda non è più disponibile: l'operazione potrebbe essere stata chiusa.</p>
          <Link to="/" className="btn btn-ink mt-3">Torna al catalogo</Link>
        </div>
        <Footer />
      </>
    )
  }

  const sconto = Math.round(scontoVsOmiMin(p) * 100)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.titolo,
    description: `${p.indirizzo}, ${p.citta} (${p.provincia}) — ${p.mq} mq. ${p.tipo === 'asta' ? 'Asta giudiziaria' : 'Saldo e stralcio'}.`,
    offers: { '@type': 'Offer', price: p.prezzoAcquisto, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
  }

  return (
    <>
      <Seo
        title={`${p.titolo} a ${eur(p.prezzoAcquisto)} | Valore OMI fino a ${eur(valoreMaxOttimo(p))} | UpImmobiliare`}
        description={`${p.tipo === 'asta' ? 'Asta giudiziaria' : 'Saldo e stralcio'}: ${p.indirizzo}, ${p.citta}. ${p.mq} mq a ${eur(p.prezzoAcquisto)}, −${sconto}% sotto il valore OMI minimo. Calcola il ROI.`}
        jsonLd={jsonLd}
      />
      <Header />

      <section className="detail-hero">
        <div className="container">
          <div className="badges">
            {p.tipo === 'asta'
              ? <span className="badge badge-asta">Asta giudiziaria</span>
              : <span className="badge badge-ss">Saldo e stralcio</span>}
            {sconto > 0 && <span className="badge badge-sconto">−{sconto}% vs OMI min</span>}
            {p.tribunale && <span className="badge badge-asta">{p.tribunale}</span>}
            {p.dataAsta && <span className="badge badge-asta">Asta il {new Date(p.dataAsta).toLocaleDateString('it-IT')}</span>}
          </div>
          <h1>{p.titolo}</h1>
          <p className="addr">{p.indirizzo} · {p.citta} ({p.provincia}) · {p.mq} mq{p.note ? ` · ${p.note}` : ''}</p>
          <div className="key-prices">
            <div className="key-price"><div className="l">Base d'asta</div><div className="v">{eur(p.baseAsta)}</div></div>
            <div className="key-price"><div className="l">Offerta minima</div><div className="v">{eur(p.offertaMinima)}</div></div>
            <div className="key-price acq"><div className="l">Prezzo d'acquisto target</div><div className="v">{eur(p.prezzoAcquisto)}</div></div>
          </div>
          <div style={{ maxWidth: 560, marginTop: 30 }}>
            <MarginBar p={p} onDark />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div>
            <span className="eyebrow">Quotazioni OMI · Agenzia delle Entrate</span>
            <h2 className="mb-2">Il valore di mercato, nero su bianco</h2>
            <table className="omi">
              <thead><tr><th>Scenario</th><th>€/mq</th><th>Valore totale</th></tr></thead>
              <tbody>
                <tr><td>Minimo — stato normale</td><td>{p.omiMinNormale.toLocaleString('it-IT')}</td><td className="val">{eur(valoreMin(p))}</td></tr>
                <tr><td>Massimo — stato normale</td><td>{p.omiMaxNormale.toLocaleString('it-IT')}</td><td className="val">{eur(valoreMaxNormale(p))}</td></tr>
                <tr><td>Massimo — stato ottimo</td><td>{p.omiMaxOttimo.toLocaleString('it-IT')}</td><td className="val">{eur(valoreMaxOttimo(p))}</td></tr>
                {p.affittoMinMq && p.affittoMaxMq && (
                  <tr><td>Locazione (€/mq/mese)</td><td>{p.affittoMinMq}–{p.affittoMaxMq}</td><td className="val">{eur(p.affittoMinMq * p.mq)}–{eur(p.affittoMaxMq * p.mq)}/mese</td></tr>
                )}
              </tbody>
            </table>
            <p className="mt-3" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Anche vendendo al valore <strong>minimo</strong> di mercato, il margine lordo su questo immobile è di{' '}
              <strong style={{ color: 'var(--verde)' }}>{eur(valoreMin(p) - p.prezzoAcquisto)}</strong> prima di ristrutturazione e costi accessori.
              Usa il calcolatore per lo scenario completo.
            </p>
            <div className="mt-3">
              <h3 className="mb-2">Richiedi il dossier completo</h3>
              <LeadForm propertyId={p.id} propertyTitolo={p.titolo} cta="Richiedi il dossier di questo immobile" />
            </div>
          </div>
          <RoiCalculator p={p} />
        </div>
      </section>

      <Footer />
    </>
  )
}
