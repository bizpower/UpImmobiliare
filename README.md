# UP Immobiliare

Sito vetrina + calcolatore ROI + microgestionale per investimenti in aste giudiziarie e saldo e stralcio.

## Avvio in locale (2 minuti)

Requisiti: Node.js 18+ (https://nodejs.org)

```bash
npm install
npm run dev
```

Apri http://localhost:5173


## Il pacchetto contiene già tutto

- **Codice sorgente** (`src/`) — per modifiche e sviluppo
- **Sito già compilato** (`dist/`) — è la cartella che caricherai sull'hosting quando avrai il dominio
- **Script di avvio rapido** — doppio clic su `AVVIA-SITO-Windows.bat` (Windows) o `avvia-sito-mac.command` (Mac)

## Quando avrai il dominio

Non dovrai rifare nulla: carichi il **contenuto della cartella `dist/`** sul tuo hosting
(via FTP/cPanel) oppure importi il repo su Vercel/Netlify. Unica accortezza per hosting
tradizionali: configura il rewrite di tutte le URL verso `index.html` (per Netlify c'è già
il file `_redirects` incluso in dist).

## Pagine

- `/` — Landing SEO con catalogo, filtri, FAQ (schema FAQPage), lead capture
- `/immobili/:slug` — Scheda immobile con quotazioni OMI e calcolatore ROI interattivo (3 scenari + affitto)
- `/admin` — Microgestionale: CRUD immobili, pubblica/bozza, lead con export CSV
  - **Password**: `UpImmobiliare2026!` → cambiala in `src/lib/store.ts` (costante `ADMIN_PASSWORD`)

## Come funzionano i dati

I 18 immobili di partenza sono in `src/data/properties.ts`. Le modifiche fatte dal gestionale
e i lead ricevuti vengono salvati nel browser (localStorage) — perfetto per uso locale e demo.
"Ripristina dati originali" nel gestionale riporta il seed iniziale.
Per renderli permanenti per tutti i visitatori: modifica direttamente `properties.ts` e ripubblica,
oppure in futuro collega un backend (Supabase).

## Pubblicare sul tuo GitHub

```bash
git init
git add .
git commit -m "Up Immobiliare v1"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/up-immobiliare.git
git push -u origin main
```

## Deploy online gratuito (opzionale)

Vercel o Netlify: importa il repo GitHub, framework "Vite", build `npm run build`, output `dist`.
Aggiungi un redirect SPA (Netlify: file `public/_redirects` con `/* /index.html 200`).

## SEO incluso

Title/description per pagina, JSON-LD (Organization, FAQPage, Product/Offer per immobile),
URL parlanti, sitemap.xml e robots.txt in `public/`.
