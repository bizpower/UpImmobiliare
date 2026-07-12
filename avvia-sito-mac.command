#!/bin/bash
cd "$(dirname "$0")"
echo "=== UP Immobiliare - avvio sito in locale ==="
command -v node >/dev/null || { echo "Installa prima Node.js da https://nodejs.org"; read -p "Premi invio..."; exit 1; }
npm install && npm run dev
