import { useMemo, useState } from 'react'
import { Property } from '../data/properties'
import { calcolaRoi, eur, pct, rendimentoAffitto, valoreMin, valoreMaxNormale, valoreMaxOttimo } from '../lib/calc'

type Scenario = 'prudente' | 'realistico' | 'ottimistico' | 'custom'

export default function RoiCalculator({ p }: { p: Property }) {
  const vMin = valoreMin(p)
  const vMaxN = valoreMaxNormale(p)
  const vMaxO = valoreMaxOttimo(p)

  const [prezzo, setPrezzo] = useState(p.prezzoAcquisto)
  const [ristr, setRistr] = useState(400) // €/mq default
  const [accPct, setAccPct] = useState(10)
  const [vendita, setVendita] = useState(vMaxN)
  const [scen, setScen] = useState<Scenario>('realistico')

  const applyScenario = (s: Scenario) => {
    setScen(s)
    if (s === 'prudente') setVendita(vMin)
    if (s === 'realistico') setVendita(vMaxN)
    if (s === 'ottimistico') setVendita(vMaxO)
  }

  const out = useMemo(() => calcolaRoi({
    prezzoAcquisto: prezzo, ristrutturazioneMq: ristr, mq: p.mq, accessoriPct: accPct / 100, prezzoVendita: vendita,
  }), [prezzo, ristr, accPct, vendita, p.mq])

  const aff = rendimentoAffitto(p, out.investimentoTotale)
  const maxBar = Math.max(out.investimentoTotale, vendita)
  const w = (n: number) => Math.max(2, (n / maxBar) * 100) + '%'

  return (
    <div className="calc">
      <h3>Calcola il tuo ROI su questo immobile</h3>
      <p className="sub">Muovi i cursori: il calcolo si aggiorna in tempo reale su base quotazioni OMI.</p>

      <div className="field">
        <label>Prezzo d'acquisto <span className="v">{eur(prezzo)}</span></label>
        <input type="range" min={Math.round(p.prezzoAcquisto * 0.8)} max={p.baseAsta} step={1000}
          value={prezzo} onChange={e => setPrezzo(+e.target.value)} aria-label="Prezzo d'acquisto" />
      </div>
      <div className="field">
        <label>Ristrutturazione (€/mq) <span className="v">{ristr} €/mq · {eur(ristr * p.mq)}</span></label>
        <input type="range" min={0} max={1500} step={50} value={ristr} onChange={e => setRistr(+e.target.value)} aria-label="Costo ristrutturazione al mq" />
      </div>
      <div className="field">
        <label>Costi accessori (imposte, legali, procedura) <span className="v">{accPct}% · {eur(prezzo * accPct / 100)}</span></label>
        <input type="range" min={0} max={20} step={1} value={accPct} onChange={e => setAccPct(+e.target.value)} aria-label="Costi accessori percentuale" />
      </div>

      <div className="scenarios" role="group" aria-label="Scenari di rivendita">
        <button className={'scenario' + (scen === 'prudente' ? ' active' : '')} onClick={() => applyScenario('prudente')}>
          <strong>Prudente</strong>{eur(vMin)}
        </button>
        <button className={'scenario' + (scen === 'realistico' ? ' active' : '')} onClick={() => applyScenario('realistico')}>
          <strong>Realistico</strong>{eur(vMaxN)}
        </button>
        <button className={'scenario' + (scen === 'ottimistico' ? ' active' : '')} onClick={() => applyScenario('ottimistico')}>
          <strong>Ottimistico</strong>{eur(vMaxO)}
        </button>
      </div>

      <div className="field">
        <label>Prezzo di rivendita atteso <span className="v">{eur(vendita)}</span></label>
        <input type="range" min={vMin} max={vMaxO} step={1000} value={vendita}
          onChange={e => { setVendita(+e.target.value); setScen('custom') }} aria-label="Prezzo di rivendita" />
      </div>

      <div className="calc-out">
        <div className="row"><span>Acquisto</span><span>{eur(prezzo)}</span></div>
        <div className="row"><span>Ristrutturazione</span><span>{eur(out.costoRistrutturazione)}</span></div>
        <div className="row"><span>Costi accessori</span><span>{eur(out.costiAccessori)}</span></div>
        <div className="row big"><span>Investimento totale</span><span>{eur(out.investimentoTotale)}</span></div>
        <div className="row big"><span>Plusvalenza lorda</span>
          <span className={out.plusvalenzaLorda >= 0 ? 'pos' : 'neg'}>{eur(out.plusvalenzaLorda)}</span></div>
        <div className={'roi-big ' + (out.roi >= 0 ? 'pos' : 'neg')}>{pct(out.roi)}</div>
        <div className="roi-lbl">ROI sull'operazione di compravendita</div>
      </div>

      <div className="bars" aria-hidden="true">
        <div className="bar-row"><span>Investimento</span><div className="bar inv" style={{ width: w(out.investimentoTotale) }} /><span className="amt">{eur(out.investimentoTotale)}</span></div>
        <div className="bar-row"><span>Rivendita</span><div className="bar mkt" style={{ width: w(vendita) }} /><span className="amt">{eur(vendita)}</span></div>
      </div>

      {aff && (
        <div className="affitto-box">
          <strong>Scenario locazione:</strong> canone stimato {eur((p.affittoMinMq || 0) * p.mq)}–{eur((p.affittoMaxMq || 0) * p.mq)}/mese
          → rendimento lordo annuo <strong>{(aff.min * 100).toFixed(1)}% – {(aff.max * 100).toFixed(1)}%</strong> sull'investimento totale.
        </div>
      )}
    </div>
  )
}
