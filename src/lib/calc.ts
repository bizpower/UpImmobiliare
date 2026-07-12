import { Property } from '../data/properties'

export const eur = (n: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export const pct = (n: number) => (n >= 0 ? '+' : '') + (n * 100).toFixed(1).replace('.', ',') + '%'

export function valoreMin(p: Property) { return p.mq * p.omiMinNormale }
export function valoreMaxNormale(p: Property) { return p.mq * p.omiMaxNormale }
export function valoreMaxOttimo(p: Property) { return p.mq * p.omiMaxOttimo }

/** Sconto del prezzo d'acquisto rispetto al valore OMI minimo (stato normale). */
export function scontoVsOmiMin(p: Property) {
  const v = valoreMin(p)
  return v > 0 ? (v - p.prezzoAcquisto) / v : 0
}

export interface RoiInput {
  prezzoAcquisto: number
  ristrutturazioneMq: number // €/mq
  mq: number
  accessoriPct: number // 0.10 = 10% su prezzo acquisto (imposte, legali, procedura)
  prezzoVendita: number
}

export interface RoiOutput {
  costoRistrutturazione: number
  costiAccessori: number
  investimentoTotale: number
  plusvalenzaLorda: number
  roi: number
}

export function calcolaRoi(i: RoiInput): RoiOutput {
  const costoRistrutturazione = i.ristrutturazioneMq * i.mq
  const costiAccessori = i.prezzoAcquisto * i.accessoriPct
  const investimentoTotale = i.prezzoAcquisto + costoRistrutturazione + costiAccessori
  const plusvalenzaLorda = i.prezzoVendita - investimentoTotale
  const roi = investimentoTotale > 0 ? plusvalenzaLorda / investimentoTotale : 0
  return { costoRistrutturazione, costiAccessori, investimentoTotale, plusvalenzaLorda, roi }
}

/** Rendimento lordo annuo da locazione sul totale investito. */
export function rendimentoAffitto(p: Property, investimento: number): { min: number; max: number } | null {
  if (!p.affittoMinMq || !p.affittoMaxMq || investimento <= 0) return null
  return {
    min: (p.affittoMinMq * p.mq * 12) / investimento,
    max: (p.affittoMaxMq * p.mq * 12) / investimento,
  }
}

export function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
