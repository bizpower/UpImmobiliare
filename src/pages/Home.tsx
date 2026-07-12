import { useEffect, useMemo, useState } from 'react'
import { Property } from '../data/properties'
import { loadProperties } from '../lib/store'
import { eur, scontoVsOmiMin, valoreMin } from '../lib/calc'
import { Header, Footer, PropertyCard, LeadForm, Seo, MarginBar } from '../components/shared'

const FAQS = [
  { q: "Cos'è un'asta giudiziaria immobiliare?", a: "È una vendita forzata di un immobile disposta dal tribunale nell'ambito di una procedura esecutiva. L'immobile viene venduto al miglior offerente partendo da una base d'asta spesso molto inferiore al valore di mercato: è questo il vantaggio competitivo per chi investe." },
  { q: "Cos'è il saldo e stralcio?", a: "È un accordo con il creditore (di solito una banca) per chiudere il debito del proprietario a una cifra ridotta, acquistando l'immobile prima che vada all'asta. Tempi più rapidi dell'asta e prezzo negoziato direttamente." },
  { q: 'Come si calcola il ROI di un investimento immobiliare?', a: 'ROI = (prezzo di rivendita − investimento totale) ÷ investimento totale. Nell\u2019investimento totale includiamo prezzo d\u2019acquisto, ristrutturazione e costi accessori (imposte, spese legali e di procedura). Ogni scheda immobile su questo sito ha un calcolatore che fa il conto in tempo reale.' },
  { q: 'Quali costi devo considerare oltre al prezzo di aggiudicazione?', a: 'Imposte di registro o IVA, compenso del delegato, eventuali spese condominiali arretrate (nei limiti di legge), spese legali e di trascrizione, ristrutturazione. Come regola prudenziale, nel calcolatore usiamo un 10% di costi accessori, modificabile.' },
  { q: "L'immobile all'asta è libero od occupato?", a: 'Dipende dalla procedura: la perizia del tribunale lo specifica sempre. Se occupato senza titolo, il decreto di trasferimento è titolo esecutivo per la liberazione. Nelle nostre schede segnaliamo lo stato quando disponibile.' },
  { q: "Come si partecipa a un'asta con UpImmobiliare?", a: 'Ti forniamo il dossier completo (perizia, valori OMI, analisi del margine), definiamo insieme la strategia di offerta e ti accompagniamo in ogni fase: deposito cauzione, gara, decreto di trasferimento e, se vuoi, ristrutturazione e rivendita.' },
]

export default function Home() {
  const [props, setProps] = useState<Property[]>(loadProperties())
  useEffect(() => {
    const h = () => setProps(loadProperties())
    window.addEventListener('up-data-changed', h)
    return () => window.removeEventListener('up-data-changed', h)
  }, [])

  const pubblicati = props.filter(p => p.pubblicato)

  const [fCitta, setFCitta] = useState('')
  const [fTipo, setFTipo] = useState('')
  const [fBudget, setFBudget] = useState('')
  const [sort, setSort] = useState('sconto')

  const cities = useMemo(() => Array.from(new Set(pubblicati.map(p => p.citta))).sort(), [pubblicati])

  const filtered = useMemo(() => {
    let list = pubblicati.filter(p =>
      (!fCitta || p.citta === fCitta) &&
      (!fTipo || p.tipo === fTipo) &&
      (!fBudget || p.prezzoAcquisto <= +fBudget)
    )
    if (sort === 'sconto') list = [...list].sort((a, b) => scontoVsOmiMin(b) - scontoVsOmiMin(a))
    if (sort === 'prezzo-asc') list = [...list].sort((a, b) => a.prezzoAcquisto - b.prezzoAcquisto)
    if (sort === 'prezzo-desc') list = [...list].sort((a, b) => b.prezzoAcquisto - a.prezzoAcquisto)
    return list
  }, [pubblicati, fCitta, fTipo, fBudget, sort])

  const scontoMedio = pubblicati.length
    ? Math.round(pubblicati.reduce((s, p) => s + scontoVsOmiMin(p), 0) / pubblicati.length * 100) : 0
  const plusvTot = pubblicati.reduce((s, p) => s + (valoreMin(p) - p.prezzoAcquisto), 0)
  const featured = pubblicati.find(p => p.slug.includes('desio')) ?? pubblicati[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'UpImmobiliare', description: 'Investimenti in immobili da aste giudiziarie e saldo e stralcio in Lombardia', areaServed: 'Lombardia, Italia' },
      { '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  }

  return (
    <>
      <Seo
        title="UpImmobiliare — Immobili all'Asta a Milano e Lombardia fino al -60% | Aste Giudiziarie e Saldo e Stralcio"
        description="Compra sotto il valore di mercato: aste giudiziarie e saldo e stralcio selezionati e analizzati su quotazioni OMI ufficiali. Calcola il ROI di ogni immobile."
        jsonLd={jsonLd}
      />
      <Header />

      <section className="hero">
        <div className="container">
          <span className="eyebrow">Aste giudiziarie · Saldo e stralcio · Lombardia</span>
          <h1>Immobili all'asta a Milano e in Lombardia: compra sotto il valore di mercato fino al −60%</h1>
          <p className="lead">
            Selezioniamo e analizziamo immobili da procedure giudiziarie e operazioni di saldo e stralcio.
            Ogni opportunità arriva con margine calcolato su quotazioni OMI ufficiali dell'Agenzia delle Entrate — niente promesse, solo numeri.
          </p>
          <div className="cta-row">
            <a href="#immobili" className="btn btn-oro">Scopri gli immobili disponibili</a>
            <a href="#immobili" className="btn btn-ghost">Calcola il tuo ROI</a>
          </div>
          {featured && (
            <div style={{ maxWidth: 560, marginTop: 44 }}>
              <MarginBar p={featured} onDark />
            </div>
          )}
          <div className="trust-bar">
            <span>{pubblicati.length} immobili analizzati</span>
            <span>Quotazioni OMI ufficiali</span>
            <span>Sconto medio −{scontoMedio}% vs valore minimo di mercato</span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stat"><div className="num">{pubblicati.length}</div><div className="lbl">Immobili in portafoglio, dal monolocale alla palazzina intera</div></div>
          <div className="stat"><div className="num"><em>−{scontoMedio}%</em></div><div className="lbl">Sconto medio del prezzo d'acquisto sul valore OMI minimo</div></div>
          <div className="stat"><div className="num"><em>{eur(plusvTot)}</em></div><div className="lbl">Plusvalenza potenziale complessiva già al valore di mercato minimo</div></div>
        </div>
      </section>

      <section className="section" id="come-funziona">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Il metodo</span>
            <h2>Come funziona</h2>
            <p>Tre passaggi, un solo criterio: il margine deve esserci prima di comprare, non dopo.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="n">1</div><h3>Selezioniamo l'immobile</h3><p>Monitoriamo le aste dei Tribunali di Milano, Monza, Varese e Bergamo e le occasioni di saldo e stralcio. Passa la selezione solo ciò che ha un margine reale.</p></div>
            <div className="step"><div className="n">2</div><h3>Analizziamo valore e margine</h3><p>Confrontiamo il prezzo d'acquisto con le quotazioni OMI ufficiali (stato normale e ottimo) e calcoliamo ROI di rivendita e rendimento da locazione.</p></div>
            <div className="step"><div className="n">3</div><h3>Ti accompagniamo al rogito</h3><p>Dossier completo, strategia d'offerta, cauzione, gara, decreto di trasferimento. E se vuoi, anche ristrutturazione e rivendita.</p></div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="immobili">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Il portafoglio</span>
            <h2>Immobili disponibili adesso</h2>
            <p>Ogni card mostra la Barra del Margine: dove si colloca il prezzo d'acquisto rispetto al range di mercato OMI. Apri la scheda per il calcolatore ROI completo.</p>
          </div>
          <div className="filters">
            <select value={fCitta} onChange={e => setFCitta(e.target.value)} aria-label="Filtra per città">
              <option value="">Tutte le città</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={fTipo} onChange={e => setFTipo(e.target.value)} aria-label="Filtra per tipo di operazione">
              <option value="">Tutte le operazioni</option>
              <option value="asta">Asta giudiziaria</option>
              <option value="saldo_stralcio">Saldo e stralcio</option>
            </select>
            <select value={fBudget} onChange={e => setFBudget(e.target.value)} aria-label="Filtra per budget">
              <option value="">Qualsiasi budget</option>
              <option value="100000">Fino a 100.000 €</option>
              <option value="300000">Fino a 300.000 €</option>
              <option value="600000">Fino a 600.000 €</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordina">
              <option value="sconto">Margine più alto</option>
              <option value="prezzo-asc">Prezzo crescente</option>
              <option value="prezzo-desc">Prezzo decrescente</option>
            </select>
          </div>
          <div className="grid">
            {filtered.map(p => <PropertyCard key={p.id} p={p} />)}
          </div>
          {filtered.length === 0 && <p>Nessun immobile corrisponde ai filtri. Allarga la ricerca o lasciaci i tuoi criteri nel form qui sotto.</p>}
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Domande frequenti</span>
            <h2>Tutto quello che devi sapere prima di investire in aste</h2>
          </div>
          <div className="faq">
            {FAQS.map(f => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="contatti">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Anteprima riservata</span>
            <h2>Ricevi le migliori occasioni prima che vadano all'asta</h2>
            <p>Le operazioni con più margine si chiudono in fretta. Lasciaci i tuoi criteri: ti mandiamo il dossier delle opportunità in linea con il tuo budget prima di pubblicarle.</p>
          </div>
          <LeadForm />
        </div>
      </section>

      <Footer />
    </>
  )
}
