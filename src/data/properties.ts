export type TipoOperazione = 'asta' | 'saldo_stralcio'

export interface Property {
  id: string
  slug: string
  titolo: string
  citta: string
  provincia: string
  indirizzo: string
  mq: number
  tipo: TipoOperazione
  tribunale?: string
  dataAsta?: string // ISO
  baseAsta: number
  offertaMinima: number
  prezzoAcquisto: number
  omiMinNormale: number // €/mq
  omiMaxNormale: number
  omiMaxOttimo: number
  affittoMinMq?: number // €/mq/mese
  affittoMaxMq?: number
  note?: string
  pubblicato: boolean
}

export const seedProperties: Property[] = [
  { id: 'p01', slug: 'asta-bisuschio-via-verga-150mq', titolo: 'Villa 150 mq — Bisuschio (VA)', citta: 'Bisuschio', provincia: 'VA', indirizzo: 'Via G. Verga 5', mq: 150, tipo: 'asta', tribunale: 'Tribunale di Varese', dataAsta: '2026-10-28', baseAsta: 98400, offertaMinima: 73800, prezzoAcquisto: 73800, omiMinNormale: 1575, omiMaxNormale: 2835, omiMaxOttimo: 4961, affittoMinMq: 7, affittoMaxMq: 12, note: 'Abitazione di tipo civile, categoria ville e villini.', pubblicato: true },
  { id: 'p02', slug: 'asta-filago-piazza-dante-68mq', titolo: 'Abitazione 68 mq — Filago (BG)', citta: 'Filago', provincia: 'BG', indirizzo: 'Piazza Dante 5', mq: 68, tipo: 'asta', tribunale: 'Tribunale di Bergamo', dataAsta: '2026-07-30', baseAsta: 51000, offertaMinima: 38250, prezzoAcquisto: 38250, omiMinNormale: 1350, omiMaxNormale: 2430, omiMaxOttimo: 4252, affittoMinMq: 6, affittoMaxMq: 11, note: 'Abitazione di tipo civile.', pubblicato: true },
  { id: 'p03', slug: 'asta-desio-via-da-giussano-40mq', titolo: 'Bilocale 40 mq — Desio (MB)', citta: 'Desio', provincia: 'MB', indirizzo: 'Via Alberto Da Giussano 3', mq: 40, tipo: 'asta', tribunale: 'Tribunale di Monza', dataAsta: '2026-07-23', baseAsta: 24852, offertaMinima: 24852, prezzoAcquisto: 24852, omiMinNormale: 1950, omiMaxNormale: 3510, omiMaxOttimo: 6142, affittoMinMq: 9, affittoMaxMq: 15, note: 'Taglio piccolo, ingresso ideale per il primo investimento.', pubblicato: true },
  { id: 'p04', slug: 'asta-cinisello-via-romagna-33mq', titolo: 'Monolocale 33 mq — Cinisello Balsamo (MI)', citta: 'Cinisello Balsamo', provincia: 'MI', indirizzo: 'Via Romagna 31/a', mq: 33, tipo: 'asta', tribunale: 'Tribunale di Monza', dataAsta: '2026-07-21', baseAsta: 89000, offertaMinima: 66750, prezzoAcquisto: 66750, omiMinNormale: 2625, omiMaxNormale: 4725, omiMaxOttimo: 8269, affittoMinMq: 12, affittoMaxMq: 21, note: 'Immobile LIBERO.', pubblicato: true },
  { id: 'p05', slug: 'milano-castelvetro-5-terzo-piano-80mq', titolo: 'Trilocale 80 mq — Via Castelvetro 5, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Ludovico Castelvetro 5, 3° piano', mq: 80, tipo: 'asta', baseAsta: 345000, offertaMinima: 345000, prezzoAcquisto: 293250, omiMinNormale: 4200, omiMaxNormale: 6400, omiMaxOttimo: 9000, affittoMinMq: 13.5, affittoMaxMq: 18, note: 'Zona Sempione, abitazione civile.', pubblicato: true },
  { id: 'p06', slug: 'milano-via-panizza-1-piano-terra-103mq', titolo: 'Piano terra 103 mq — Via Panizza 1, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Panizza Bartolomeo 1, piano terra', mq: 103, tipo: 'asta', baseAsta: 1021000, offertaMinima: 765750, prezzoAcquisto: 650000, omiMinNormale: 5500, omiMaxNormale: 6800, omiMaxOttimo: 10000, affittoMinMq: 16, affittoMaxMq: 18.5, note: 'Palazzo d\u2019epoca in zona di pregio.', pubblicato: true },
  { id: 'p07', slug: 'milano-corso-sempione-82-124mq', titolo: 'Appartamento 124 mq — Corso Sempione 82, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Corso Sempione 82', mq: 124, tipo: 'asta', baseAsta: 748000, offertaMinima: 561000, prezzoAcquisto: 493000, omiMinNormale: 4200, omiMaxNormale: 6400, omiMaxOttimo: 9000, affittoMinMq: 13.5, affittoMaxMq: 18, pubblicato: true },
  { id: 'p08', slug: 'milano-via-pollaiuolo-9-quarto-piano-102mq', titolo: 'Quadrilocale 102 mq — Via Pollaiuolo 9, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Pollaiuolo 9, 4° piano', mq: 102, tipo: 'asta', baseAsta: 613000, offertaMinima: 459750, prezzoAcquisto: 390745, omiMinNormale: 5500, omiMaxNormale: 7100, omiMaxOttimo: 10300, affittoMinMq: 16, affittoMaxMq: 23.5, note: 'Zona Isola, tre balconi.', pubblicato: true },
  { id: 'p09', slug: 'milano-via-perini-20-sesto-piano-182mq', titolo: 'Attico 182 mq con terrazzo — Via Perini 20, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Perini 20, 6° piano', mq: 182, tipo: 'asta', baseAsta: 618400, offertaMinima: 463800, prezzoAcquisto: 394230, omiMinNormale: 1850, omiMaxNormale: 2700, omiMaxOttimo: 3700, affittoMinMq: 7.6, affittoMaxMq: 9.9, note: 'Ampio terrazzo, tripla camera.', pubblicato: true },
  { id: 'p10', slug: 'milano-viale-argonne-10-primo-piano-74mq', titolo: 'Bilocale 74 mq — Viale Argonne 10, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Viale Argonne 10, 1° piano', mq: 74, tipo: 'asta', baseAsta: 410000, offertaMinima: 307500, prezzoAcquisto: 261375, omiMinNormale: 3800, omiMaxNormale: 5600, omiMaxOttimo: 8000, affittoMinMq: 12, affittoMaxMq: 15.5, note: 'Doppia veranda.', pubblicato: true },
  { id: 'p11', slug: 'milano-via-luigi-ornato-piani-5-6-120mq', titolo: 'Duplex 120 mq con box — Via Luigi Ornato, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Luigi Ornato, piani 5 e 6', mq: 120, tipo: 'asta', baseAsta: 502500, offertaMinima: 376875, prezzoAcquisto: 320343, omiMinNormale: 2900, omiMaxNormale: 3900, omiMaxOttimo: 4700, affittoMinMq: 11, affittoMaxMq: 14.6, note: 'Box auto incluso, terrazzo con serra.', pubblicato: true },
  { id: 'p12', slug: 'milano-via-ingegnoli-25-quinto-piano-67mq', titolo: 'Bilocale 67 mq — Via Ingegnoli 25, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Ingegnoli 25, 5° piano', mq: 67, tipo: 'asta', baseAsta: 292000, offertaMinima: 219000, prezzoAcquisto: 186150, omiMinNormale: 3800, omiMaxNormale: 5600, omiMaxOttimo: 8000, affittoMinMq: 12, affittoMaxMq: 15.5, pubblicato: true },
  { id: 'p13', slug: 'milano-via-san-mirocle-7-nono-piano-98mq', titolo: 'Trilocale 98 mq — Via San Mirocle 7, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via San Mirocle 7, 9° piano', mq: 98, tipo: 'asta', baseAsta: 367000, offertaMinima: 275250, prezzoAcquisto: 233962, omiMinNormale: 3200, omiMaxNormale: 4000, omiMaxOttimo: 4800, affittoMinMq: 11, affittoMaxMq: 14, note: 'Piano alto, vista aperta.', pubblicato: true },
  { id: 'p14', slug: 'milano-via-asiago-55-piano-terra-82mq', titolo: 'Piano terra 82 mq con box e terrazzo — Via Asiago 55, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Asiago 55, piano terra', mq: 82, tipo: 'asta', baseAsta: 340000, offertaMinima: 255000, prezzoAcquisto: 216750, omiMinNormale: 2750, omiMaxNormale: 4100, omiMaxOttimo: 5700, affittoMinMq: 9, affittoMaxMq: 13.7, note: 'Box e terrazzo.', pubblicato: true },
  { id: 'p15', slug: 'milano-via-ca-granda-2-quinto-piano-165mq', titolo: 'Appartamento 165 mq — Via Ca\u2019 Granda 2, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Via Ca\u2019 Granda 2, 5° piano', mq: 165, tipo: 'asta', baseAsta: 562000, offertaMinima: 421500, prezzoAcquisto: 358275, omiMinNormale: 3600, omiMaxNormale: 4600, omiMaxOttimo: 6800, affittoMinMq: 9.2, affittoMaxMq: 14, pubblicato: true },
  { id: 'p16', slug: 'saldo-stralcio-san-giuliano-matteotti-55-74mq', titolo: 'Bilocale 74 mq — Via Matteotti 55, San Giuliano M.se', citta: 'San Giuliano Milanese', provincia: 'MI', indirizzo: 'Via Matteotti 55, 2° piano', mq: 74, tipo: 'saldo_stralcio', baseAsta: 91413, offertaMinima: 68559, prezzoAcquisto: 58275, omiMinNormale: 1900, omiMaxNormale: 2550, omiMaxOttimo: 3100, affittoMinMq: 7.5, affittoMaxMq: 10.5, note: 'Operazione di saldo e stralcio: acquisto prima dell\u2019asta.', pubblicato: true },
  { id: 'p17', slug: 'milano-viale-campania-49-palazzina-1600mq', titolo: 'Palazzina intera 1.600 mq — Viale Campania 49, Milano', citta: 'Milano', provincia: 'MI', indirizzo: 'Viale Campania 49', mq: 1600, tipo: 'asta', baseAsta: 5250000, offertaMinima: 5250000, prezzoAcquisto: 4462500, omiMinNormale: 3800, omiMaxNormale: 5700, omiMaxOttimo: 8000, affittoMinMq: 12, affittoMaxMq: 15.5, note: 'Operazione istituzionale: intero stabile cielo-terra.', pubblicato: true },
  { id: 'p18', slug: 'porto-cervo-cala-granu-villetta-98mq', titolo: 'Villetta bifamiliare 98 mq — Porto Cervo, Cala Granu', citta: 'Porto Cervo (Arzachena)', provincia: 'SS', indirizzo: 'Loc. Cala Granu, 07021 Arzachena', mq: 98, tipo: 'asta', baseAsta: 845000, offertaMinima: 633800, prezzoAcquisto: 580000, omiMinNormale: 7500, omiMaxNormale: 12000, omiMaxOttimo: 21000, affittoMinMq: 33, affittoMaxMq: 52, note: 'Vista mare, Costa Smeralda. Forte potenziale locazione turistica.', pubblicato: true },
]
