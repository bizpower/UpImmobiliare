import { Property, seedProperties } from '../data/properties'

const PROPS_KEY = 'upimmobiliare_properties_v1'
const LEADS_KEY = 'upimmobiliare_leads_v1'
const AUTH_KEY = 'upimmobiliare_admin_session'

// Storage sicuro: usa localStorage/sessionStorage se disponibili,
// altrimenti (es. anteprima sandbox) tiene i dati in memoria per la sessione.
const mem: Record<string, string> = {}
const safe = {
  get(k: string): string | null { try { return window.localStorage.getItem(k) } catch { return mem[k] ?? null } },
  set(k: string, v: string) { try { window.localStorage.setItem(k, v) } catch { mem[k] = v } },
  del(k: string) { try { window.localStorage.removeItem(k) } catch { delete mem[k] } },
  sGet(k: string): string | null { try { return window.sessionStorage.getItem(k) } catch { return mem['s:' + k] ?? null } },
  sSet(k: string, v: string) { try { window.sessionStorage.setItem(k, v) } catch { mem['s:' + k] = v } },
  sDel(k: string) { try { window.sessionStorage.removeItem(k) } catch { delete mem['s:' + k] } },
}
// Password del microgestionale (modificabile qui prima del deploy)
export const ADMIN_PASSWORD = 'UpImmobiliare2026!'

export interface Lead {
  id: string
  nome: string
  email: string
  telefono: string
  budget: string
  messaggio: string
  propertyId?: string
  propertyTitolo?: string
  createdAt: string
}

// ---------- Immobili ----------
export function loadProperties(): Property[] {
  try {
    const raw = safe.get(PROPS_KEY)
    if (raw) return JSON.parse(raw) as Property[]
  } catch { /* ignore */ }
  return seedProperties
}

export function saveProperties(list: Property[]) {
  safe.set(PROPS_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('up-data-changed'))
}

export function resetProperties() {
  safe.del(PROPS_KEY)
  window.dispatchEvent(new Event('up-data-changed'))
}

export function upsertProperty(p: Property) {
  const list = loadProperties()
  const i = list.findIndex(x => x.id === p.id)
  if (i >= 0) list[i] = p
  else list.unshift(p)
  saveProperties(list)
}

export function deleteProperty(id: string) {
  saveProperties(loadProperties().filter(p => p.id !== id))
}

// ---------- Lead ----------
export function loadLeads(): Lead[] {
  try {
    const raw = safe.get(LEADS_KEY)
    if (raw) return JSON.parse(raw) as Lead[]
  } catch { /* ignore */ }
  return []
}

export function addLead(l: Omit<Lead, 'id' | 'createdAt'>) {
  const leads = loadLeads()
  leads.unshift({ ...l, id: 'l' + Date.now(), createdAt: new Date().toISOString() })
  safe.set(LEADS_KEY, JSON.stringify(leads))
}

export function deleteLead(id: string) {
  safe.set(LEADS_KEY, JSON.stringify(loadLeads().filter(l => l.id !== id)))
}

export function leadsToCsv(leads: Lead[]): string {
  const head = 'Data;Nome;Email;Telefono;Budget;Immobile;Messaggio'
  const rows = leads.map(l =>
    [new Date(l.createdAt).toLocaleString('it-IT'), l.nome, l.email, l.telefono, l.budget, l.propertyTitolo ?? '', (l.messaggio || '').replace(/;/g, ',').replace(/\n/g, ' ')].join(';')
  )
  return [head, ...rows].join('\n')
}

// ---------- Sessione admin ----------
export function isAdminLogged(): boolean {
  return safe.sGet(AUTH_KEY) === 'ok'
}
export function adminLogin(pw: string): boolean {
  if (pw === ADMIN_PASSWORD) { safe.sSet(AUTH_KEY, 'ok'); return true }
  return false
}
export function adminLogout() { safe.sDel(AUTH_KEY) }
