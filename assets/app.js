

const {

  useState,

  useCallback,

  useEffect,

  useRef

} = React;

/* === HERMES INJECTED: guaranteed-global sync functions (defined first, self-contained) === */
window.collectAllData = function() {
  var data = { _meta: { app: 'ForderungenApp', version: (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.0'), exported: new Date().toISOString() } };
  var seen = {};
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (!k) continue;
    var lk = k.toLowerCase();
    if ((k.indexOf('forderungen-') !== 0 && k !== 'forderungen-users' && k.indexOf('forderungen-dark') !== 0)) continue;
    if (seen[lk]) continue;
    seen[lk] = true;
    try { data[k] = localStorage.getItem(k); } catch(e) {}
  }
  return data;
};

var SYNC_FNAME = 'forderungen-sync.json';
var SYNC_DIR = 'Download/Forderungen-sync';
window.writeSyncFile = function(payload) {
  try {
    var json = (typeof payload === 'string') ? payload : JSON.stringify(payload, null, 2);
    var filename = SYNC_FNAME;
    if (typeof AndroidBridge !== 'undefined' && AndroidBridge && AndroidBridge.saveFile) {
      var ok = AndroidBridge.saveFile(filename, btoa(unescape(encodeURIComponent(json))));
      console.log('[SYNC] AndroidBridge.saveFile ok=' + ok);
      return ok;
    }
    // WEBAPP FALLBACK: Blob-Download
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    a.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:0;height:0;';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); document.body.removeChild(a); }, 1000);
    console.log('[SYNC] WebApp Blob download triggered');
    return true;
  } catch(e) { console.log('[SYNC] writeSyncFile error=' + e.message); return false; }
};

/* Import-Pfad (global, damit AndroidBridge.pickSyncFile ihn erreicht) */
window.applySyncContent = function(content) {
  try {
    var data = JSON.parse(content);
    var seen = {};
    Object.keys(data).forEach(function(k) {
      if (k === '_meta') return;
      var lk = k.toLowerCase();
      if (seen[lk]) { console.log('[SYNC] skip duplicate case key: ' + k); return; }
      seen[lk] = true;
      try { localStorage.setItem(k, data[k]); } catch(e2) {}
    });
    console.log('[SYNC] import ok, keys written=' + Object.keys(seen).length);
    try {
      var _u = JSON.parse(localStorage.getItem('forderungen-users-v1') || '[]');
      if (Array.isArray(_u)) {
        for (var _i = 0; _i < _u.length; _i++) {
          if (_u[_i] && _u[_i].isAdmin) {
            try { sessionStorage.setItem('forderungen-session', JSON.stringify(_u[_i])); } catch(e3) {}
            break;
          }
        }
      }
    } catch(e3) {}
    if (typeof alert === 'function') alert('Sync-Import erfolgreich. App wird neu geladen...');
    setTimeout(function(){ location.reload(); }, 800);
  } catch (e) { console.error('[SYNC] applySyncContent failed:', e); if (typeof alert === 'function') alert('Sync-Datei ungueltig: ' + e.message); }
};

window.__onSyncFilePicked = function(content) {
  try {
    if (!content || content.length === 0) { if (typeof alert === 'function') alert('Keine Sync-Datei ausgewaehlt.'); return; }
    console.log('[SYNC] __onSyncFilePicked called, content length=' + content.length);
    window.applySyncContent(content);
  } catch (e) { console.error('[SYNC] __onSyncFilePicked failed:', e); if (typeof alert === 'function') alert('Sync-Datei ungueltig: ' + e.message); }
};
/* === END HERMES INJECTED === */

const Icon = ({

  children,

  size = 16,

  className = ''

}) => /*#__PURE__*/React.createElement("svg", {

  width: size,

  height: size,

  viewBox: "0 0 24 24",

  fill: "none",

  stroke: "currentColor",

  strokeWidth: "2",

  strokeLinecap: "round",

  strokeLinejoin: "round",

  className: className

}, children);

const PlusIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "5",

  x2: "12",

  y2: "19"

}), /*#__PURE__*/React.createElement("line", {

  x1: "5",

  y1: "12",

  x2: "19",

  y2: "12"

}));

const XIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {

  x1: "18",

  y1: "6",

  x2: "6",

  y2: "18"

}), /*#__PURE__*/React.createElement("line", {

  x1: "6",

  y1: "6",

  x2: "18",

  y2: "18"

}));

const PencilIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"

}), /*#__PURE__*/React.createElement("path", {

  d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"

}));

const TrashIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {

  points: "3 6 5 6 21 6"

}), /*#__PURE__*/React.createElement("path", {

  d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"

}), /*#__PURE__*/React.createElement("path", {

  d: "M10 11v6"

}), /*#__PURE__*/React.createElement("path", {

  d: "M14 11v6"

}), /*#__PURE__*/React.createElement("path", {

  d: "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"

}));

const SearchIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {

  cx: "11",

  cy: "11",

  r: "8"

}), /*#__PURE__*/React.createElement("line", {

  x1: "21",

  y1: "21",

  x2: "16.65",

  y2: "16.65"

}));

const FileIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"

}), /*#__PURE__*/React.createElement("polyline", {

  points: "14 2 14 8 20 8"

}));

const ClockIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {

  cx: "12",

  cy: "12",

  r: "10"

}), /*#__PURE__*/React.createElement("polyline", {

  points: "12 6 12 12 16 14"

}));

const CheckIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"

}), /*#__PURE__*/React.createElement("polyline", {

  points: "22 4 12 14.01 9 11.01"

}));

const ScaleIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "3",

  x2: "12",

  y2: "21"

}), /*#__PURE__*/React.createElement("path", {

  d: "M5 7l-3 6a4 4 0 0 0 6 0z"

}), /*#__PURE__*/React.createElement("path", {

  d: "M19 7l-3 6a4 4 0 0 0 6 0z"

}), /*#__PURE__*/React.createElement("path", {

  d: "M5 7h14"

}), /*#__PURE__*/React.createElement("path", {

  d: "M9 21h6"

}));

const PaperclipIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"

}));

const DownloadIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"

}), /*#__PURE__*/React.createElement("polyline", {

  points: "7 10 12 15 17 10"

}), /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "15",

  x2: "12",

  y2: "3"

}));

const ExternalLinkIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"

}), /*#__PURE__*/React.createElement("polyline", {

  points: "15 3 21 3 21 9"

}), /*#__PURE__*/React.createElement("line", {

  x1: "10",

  y1: "14",

  x2: "21",

  y2: "3"

}));

const MoonIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"

}));

const SunIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {

  cx: "12",

  cy: "12",

  r: "5"

}), /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "1",

  x2: "12",

  y2: "3"

}), /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "21",

  x2: "12",

  y2: "23"

}), /*#__PURE__*/React.createElement("line", {

  x1: "4.22",

  y1: "4.22",

  x2: "5.64",

  y2: "5.64"

}), /*#__PURE__*/React.createElement("line", {

  x1: "18.36",

  y1: "18.36",

  x2: "19.78",

  y2: "19.78"

}), /*#__PURE__*/React.createElement("line", {

  x1: "1",

  y1: "12",

  x2: "3",

  y2: "12"

}), /*#__PURE__*/React.createElement("line", {

  x1: "21",

  y1: "12",

  x2: "23",

  y2: "12"

}), /*#__PURE__*/React.createElement("line", {

  x1: "4.22",

  y1: "19.78",

  x2: "5.64",

  y2: "18.36"

}), /*#__PURE__*/React.createElement("line", {

  x1: "18.36",

  y1: "5.64",

  x2: "19.78",

  y2: "4.22"

}));

const InfoIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {

  cx: "12",

  cy: "12",

  r: "10"

}), /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "8",

  x2: "12",

  y2: "12"

}), /*#__PURE__*/React.createElement("line", {

  x1: "12",

  y1: "16",

  x2: "12.01",

  y2: "16"

}));

const PrinterIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {

  points: "6 9 6 2 18 2 18 9"

}), /*#__PURE__*/React.createElement("path", {

  d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"

}), /*#__PURE__*/React.createElement("rect", {

  x: "6",

  y: "14",

  width: "12",

  height: "8",

  rx: "1"

}));

const MailIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {

  x: "2",

  y: "4",

  width: "20",

  height: "16",

  rx: "2"

}), /*#__PURE__*/React.createElement("path", {

  d: "M22 7l-10 6L2 7"

}));

const STATUS_CONFIG = {

  offen: {

    label: 'Offen',

    color: 'text-amber-700 dark:text-amber-300',

    bg: 'bg-amber-50 dark:bg-amber-900',

    border: 'border-amber-200',

    dot: 'bg-amber-50 dark:bg-amber-900',

    Icon: ClockIcon

  },

  bearbeitung: {

    label: 'In Bearbeitung',

    color: 'text-sky-700 dark:text-sky-300',

    bg: 'bg-sky-50 dark:bg-sky-900',

    border: 'border-sky-200',

    dot: 'bg-sky-50 dark:bg-sky-900',

    Icon: FileIcon

  },

  bestritten: {

    label: 'Bestritten',

    color: 'text-rose-700 dark:text-rose-300',

    bg: 'bg-rose-50 dark:bg-rose-900',

    border: 'border-rose-200',

    dot: 'bg-rose-50 dark:bg-rose-900',

    Icon: ScaleIcon

  },

  bezahlt: {

    label: 'Bezahlt',

    color: 'text-emerald-700 dark:text-emerald-300',

    bg: 'bg-emerald-50 dark:bg-emerald-900',

    border: 'border-emerald-200',

    dot: 'bg-emerald-50 dark:bg-emerald-900',

    Icon: CheckIcon

  }

};



// Kategorien: Forderung (eingehend), Rechnung (ausgehend), Privatschuld (eigene Schulden)

const TYP_CONFIG = {

  forderung: {

    label: 'Forderung',

    short: 'F',

    color: 'text-rose-700 dark:text-rose-300 dark:text-rose-300',

    bg: 'bg-rose-50 dark:bg-rose-900 dark:bg-rose-900',

    border: 'border-rose-200 dark:border-rose-800',

    dot: 'bg-rose-50 dark:bg-rose-900',

    sign: '-'

  },

  rechnung: {

    label: 'Rechnung',

    short: 'R',

    color: 'text-sky-700 dark:text-sky-300',

    bg: 'bg-sky-50 dark:bg-sky-900 dark:bg-sky-900',

    border: 'border-sky-200 dark:border-sky-800',

    dot: 'bg-sky-50 dark:bg-sky-900',

    sign: '+'

  },

  privatschuld: {

    label: 'Private Schulden',

    short: 'S',

    color: 'text-violet-700 dark:text-violet-300',

    bg: 'bg-violet-50 dark:bg-violet-900',

    border: 'border-violet-200 dark:border-violet-800',

    dot: 'bg-violet-500',

    sign: '-'

  }

};

const STORAGE_KEY = 'forderungen-list-v1';

const USERS_KEY = 'forderungen-users-v1';

const SESSION_KEY = 'forderungen-session';

// App-Versionsnummer – bei jedem Patch erhoeht, damit der Fortschritt sichtbar ist.

const APP_VERSION = '1.30.25';

const APP_CHANGELOG = ['1.30.26  Budget: Ausgaben erfassen (monatlich) + Kreisdiagramm Einnahmen/Ausgaben/Fixkosten/Sparen in % im Dashboard', '1.30.25  Kassenbon: OCR (Tesseract) komplett entfernt - manuelle Belegerfassung (Betrag/Shop/Datum/Kategorie, Foto optional, offline); gespeicherte Belege mit Wisch-loschen; monatliche Auswertung; Tab-Wisch nur horizontal; Start-Fehler behoben', '1.30.2  Budget-Export: CSV + PDF in Budget + OCR-Button Nebenkosten; Build 2026-07-21; Artefakte: app-v24.js, index.html v29, sw.js v24, budget-pdf.js', '1.30.1  Fix: Startfehler entries is not defined; Export-Helfer entfernt; PDF-Button lokal in BudgetTab', '1.30.0  Build-Sync: app-v24.js fuer Cache-Busting; sw.js Precache + Cache-Version v24', '1.29.0  Dashboard-Optimierung: neuer Tab "Uebersicht" fasst ALLE Tabs kompakt zusammen (Forderungen/Budget/Nebenkosten/Sparen/Einkauf/Vergleich/SEPA) mit Klick-zum-Tab + Bezahlt-gesamt/Saldo-Karten', '1.28.0  Neuer Tab "Budget" (monatliche Einnahmen + Fixkosten erfassen, Saldo) + monatliche Einnahmen/Fixkosten/Saldo im Dashboard', '1.27.0  Caching-Strategie (SW v22): Stale-While-Revalidate fuer Assets + Network-First mit 3s-Timeout fuer HTML + Offline-Fallback; babel.min.js nicht mehr precached', '1.26.0  Navigationsleiste im Dark-Mode optimiert (dunkler Balken, aktiver Tab dunkel+hell, inaktive Tabs lesbar)', '1.25.0  Dashboard-Karten + Typ-Badges im Dark-Mode lesbar (helle Karten + helle Zahlen/Texte)', '1.24.0  Kritischer Bugfix: Eintrags-Liste im Light-Mode war unsichtbar (App crashte)', '1.23.0  Performance: JSX build-time vorkompiliert (Babel im Browser entfaellt, -2,8 MB Start), tote Tesseract-SIMD-Assets geloescht (-8 MB im ZIP/APK)', '1.22.0  Header: "Finanzplan"-Haupttitel entfernt, stattdessen voller Titel "Forderungs- & Rechnungsmanagement" als Überschrift', '1.21.0  Service Worker robust gemacht: index.html immer frisch, Cache-Version v20, bei Update automatisch neu laden', '1.20.0  Header-Subtitel "Inkasso-Verwaltung" -> "Finanzverwaltung"', '1.19.0  Dark-Mode-Lesbarkeit repariert (globale CSS-Fixes: Inputs/Selects/Karten im Dark Mode lesbar auf allen Seiten)', '1.18.0  Titel geändert auf "Forderungs- und Rechnungsmanagement / Finanzplan" (Header: "Finanzplan" + Untertitel)', '1.17.0  Neuer Tab "Nebenkosten": Registrierkarte für Strom/Betriebskosten/Heizung jährlich + Verlaufs-Grafik + Online-Vergleich ortsübliche Betriebskosten PLZ 36304 Alsfeld (1 vs 2 Pers.)', '1.16.0  Typ-spezifisches Formular: Rechnung (nur Name/Kontodaten/Betrag/Fälligkeit/Verwendungszweck) + Privatschuld (Name/Gesamtschuld/Rate, Restschuld = Gesamtschuld − Zahlungen)', '1.15.0  Dashboard kompakter & übersichtlicher (Kennzahlen-Reihe, 2-Spalten-Layout, kleinere Karten)', '1.14.0  Swipe-Funktion in Web-App (Forderungsliste: Wisch links -> Bezahlt/Bearbeiten/Vergleich/Löschen)', '1.13.0  Vergleich anbieten (außergerichtliche Einigung: Einmalzahlung mit Nachlass / Ratenzahlung) + Verhandlungs-Historie', '1.12.0  Kassenbon als Foto auslesen (Tesseract OCR offline) + Auswertung (Positionen/Summe)', '1.11.0  Online-Preisvergleich (idealo/Google/Lidl/Aldi/Rewe/Edeka-Suche pro Produkt) + Tabellen-Darstellung', '1.10.0  QR-Code (SEPA-BezahlCode) pro Ueberweisung', '1.9.0  Online-Banking-Link pro eigenem Konto (SEPA direkt in Banking oeffnen)', '1.8.0  Profilbild pro Benutzer + Versionsanzeige (Footer/Info)', '1.7.0  Eigene Konten (Absender) bei SEPA + Auswahl "Von welchem Konto?"', '1.6.0  E-Mail-Programm-Auswahl (System / Gmail / Outlook)', '1.5.0  Swipe-Funktion in der Android-Liste (Bezahlt/Bearbeiten/Loeschen)', '1.4.0  Zahlungsziel standardmaessig der 5. des Monats', '1.3.0  SEPA-Ueberweisung / Dauerauftrag (pain.001 / pain.008) + PDF-Beleg', '1.2.0  Einsparpotenzial (Abos/Versicherungen) + Einkaufspreisvergleich'];

const ABO_KEY = username => `forderungen-abos-v1-${username}`;

const EINKAUF_KEY = username => `forderungen-einkauf-v1-${username}`;

const SEPA_KEY = username => `forderungen-sepa-v1-${username}`;

const OWN_ACCOUNT_KEY = username => `forderungen-eigenekonten-v1-${username}`;

// Eigene Konten (Absender) pro Account: { id, name, iban, bic, kontoinhaber }[]

function loadOwnAccounts(username) {

  try {

    return JSON.parse(localStorage.getItem(OWN_ACCOUNT_KEY(username))) || [];

  } catch {

    return [];

  }

}

function saveOwnAccount(username, acc) {

  const list = loadOwnAccounts(username);

  const next = list.some(a => a.id === acc.id) ? list.map(a => a.id === acc.id ? acc : a) : [...list, acc];

  try {

    localStorage.setItem(OWN_ACCOUNT_KEY(username), JSON.stringify(next));

  } catch {}

  return next;

}

function deleteOwnAccount(username, id) {

  const next = loadOwnAccounts(username).filter(a => a.id !== id);

  try {

    localStorage.setItem(OWN_ACCOUNT_KEY(username), JSON.stringify(next));

  } catch {}

  return next;

}

// Profilbild pro Benutzer (in IDB gespeichert als Base64-DataURL, da Bilder zu gross fuer localStorage waeren)

function profilePicKey(username) {

  return `profilbild-${username}`;

}

function loadProfilePic(username) {

  try {

    return JSON.parse(localStorage.getItem(profilePicKey(username))) || null;

  } catch {

    return null;

  }

}

async function saveProfilePic(username, dataUrl) {

  try {

    localStorage.setItem(profilePicKey(username), JSON.stringify(dataUrl));

  } catch {}

}

const UserIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"

}), /*#__PURE__*/React.createElement("circle", {

  cx: "12",

  cy: "7",

  r: "4"

}));

const LogOutIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"

}), /*#__PURE__*/React.createElement("polyline", {

  points: "16 17 21 12 16 7"

}), /*#__PURE__*/React.createElement("line", {

  x1: "21",

  y1: "12",

  x2: "9",

  y2: "12"

}));

const ShieldIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {

  d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"

}));

async function hashPassword(pw) {

  if (crypto.subtle) {

    try {

      const saltBytes = crypto.getRandomValues(new Uint8Array(16));

      const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw));

      const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

      return salt + ':' + hash;

    } catch {}

  }

  const salt = Math.random().toString(36).slice(2, 10);

  let hash = '';

  for (let i = 0; i < (pw + salt).length; i++) hash = ((hash << 5) - hash + (pw + salt).charCodeAt(i)) | 0;

  return salt + ':' + Math.abs(hash).toString(16);

}

async function verifyPassword(pw, stored) {

  if (!stored || !stored.includes(':')) return false;

  const [salt, hash] = stored.split(':');

  if (crypto.subtle) {

    try {

      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw));

      const computed = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

      return computed === hash;

    } catch {

      // Fallback below

    }

  }

  let h = '';

  for (let i = 0; i < (pw + salt).length; i++) h = ((h << 5) - h + (pw + salt).charCodeAt(i)) | 0;

  return Math.abs(h).toString(16) === hash;

}

function loadUsers() {

  try {

    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

  } catch {

    return [];

  }

}

function saveUsers(users) {

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

}

function userStorageKey(username) {

  return `${STORAGE_KEY}-${username}`;

}



// Bekannte Gläubiger/Inkasso: Bankdaten zur Auto-Vervollständigung (pro Account)

const PARTEI_KEY = username => `forderungen-parties-v1-${username}`;

function loadParties(username) {

  try {

    return JSON.parse(localStorage.getItem(PARTEI_KEY(username)) || '{}');

  } catch {

    return {};

  }

}

function savePartyData(username, name, data) {

  if (!name || !name.trim()) return;

  const key = name.trim().toLowerCase();

  const all = loadParties(username);

  all[key] = {

    ...(all[key] || {}),

    name: name.trim(),

    ...data

  };

  try {

    localStorage.setItem(PARTEI_KEY(username), JSON.stringify(all));

  } catch {}

}

function findParty(username, name) {

  if (!name || !name.trim()) return null;

  return loadParties(username)[name.trim().toLowerCase()] || null;

}

function defaultFaelligkeit() {

  // Zahlungsziel = immer der 5. des Monats (nächster anstehender 5.)

  const d = new Date();

  let target = new Date(d.getFullYear(), d.getMonth(), 5);

  if (target < new Date(d.getFullYear(), d.getMonth(), d.getDate())) {

    target = new Date(d.getFullYear(), d.getMonth() + 1, 5);

  }

  const y = target.getFullYear();

  const m = String(target.getMonth() + 1).padStart(2, '0');

  const t = String(target.getDate()).padStart(2, '0');

  return `${y}-${m}-${t}`;

}

const emptyForm = {

  typ: 'forderung',

  aktenzeichen: '',

  glaeubiger: '',

  inkassounternehmen: '',

  betrag: '',

  faelligkeit: defaultFaelligkeit(),

  status: 'offen',

  notizen: '',

  dokumente: [],

  rate: '',

  rateAb: '',

  zahlungen: [],

  zahlungswebseite: '',

  zahlungsart: '',

  iban: '',

  bic: '',

  kontoinhaber: '',

  verwendungszweck: '',



  intervall: '' // wiederkehrend: '', 'monatlich', 'vierteljährlich', 'halbjährlich', 'jährlich'



};

function uid() {

  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

}

function toMonthly(betrag, intervall) {

  var b = parseFloat(betrag) || 0;

  var i = (intervall || 'monatlich').toLowerCase();

  if (i === 'quartalsweise') return b / 3;

  if (i === 'halbjaehrlich') return b / 6;

  if (i === 'jaehrlich') return b / 12;

  return b;

}

function formatEUR(value) {

  const n = parseFloat(value);

  if (isNaN(n)) return '0,00 €';

  return n.toLocaleString('de-DE', {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2

  }) + ' €';

}

// Such-URLs der gängigen Preisvergleiche / Händler für ein Produkt.

// Öffnet die externe Suche – die App bleibt offline, nur der Klick verlässt sie.

function onlineSearchUrls(name) {

  const q = encodeURIComponent(name.trim());

  return [{

    label: 'idealo',

    url: `https://www.idealo.de/preisvergleich/main.html?q=${q}`

  }, {

    label: 'Google',

    url: `https://www.google.com/search?tbm=shop&q=${q}`

  }, {

    label: 'Lidl',

    url: `https://www.lidl.de/s?q=${q}`

  }, {

    label: 'Aldi',

    url: `https://www.aldi-sued.de/de/suche?q=${q}`

  }, {

    label: 'Rewe',

    url: `https://shop.rewe.de/search?q=${q}`

  }, {

    label: 'Edeka',

    url: `https://www.edeka.de/suche?q=${q}`

  }];

}

function formatDate(iso) {

  if (!iso) return '—';

  const d = new Date(iso);

  if (isNaN(d.getTime())) return iso;

  return d.toLocaleDateString('de-DE', {

    day: '2-digit',

    month: '2-digit',

    year: 'numeric'

  });

}

function daysUntil(iso) {

  if (!iso) return null;

  const d = new Date(iso);

  if (isNaN(d.getTime())) return null;

  const now = new Date();

  const diff = Math.round((d.setHours(0,0,0,0) - now.setHours(0,0,0,0)) / 86400000);

  return diff;

}

function formatFileSize(bytes) {

  if (!bytes) return '';

  if (bytes < 1024) return bytes + ' B';

  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';

  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';

}

function paymentSum(zahlungen) {

  return (zahlungen || []).reduce((s, z) => s + (parseFloat(z.betrag) || 0), 0);

}

// Tilgungsverlauf: chronologische Abbaurate des Restbetrags.

// Liefert [{ datum, betrag, rest, pct }] – pct = Prozent des Gesamtbetrags bereits gezahlt.

function buildAmortization(en) {

  const total = parseFloat(en.betrag) || 0;

  const zahlungen = [...(en.zahlungen || [])].filter(z => z && (parseFloat(z.betrag) || 0) > 0).sort((a, b) => (a.datum || '').localeCompare(b.datum || ''));

  let rest = total;

  let gezahlt = 0;

  return zahlungen.map(z => {

    const b = parseFloat(z.betrag) || 0;

    gezahlt += b;

    rest = Math.max(0, rest - b);

    const pct = total > 0 ? Math.min(100, gezahlt / total * 100) : 0;

    return {

      datum: z.datum,

      betrag: b,

      rest,

      pct

    };

  });

}

// Zahlstatus einer Forderung für das Dashboard:

// 'beglichen' (grün) = Rest 0; 'verzug' (rot) = Fälligkeit überschritten & Rest > 0;

// 'rate' (gelb) = Ratenzahlung läuft (noch offen, nicht überfällig).

function zahlstatus(en) {

  const total = parseFloat(en.betrag) || 0;

  const rest = Math.max(0, total - paymentSum(en.zahlungen));

  if (rest <= 0) return 'beglichen';

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const faellig = en.faelligkeit ? new Date(en.faelligkeit) : null;

  if (faellig && faellig < today) return 'verzug';

  return 'rate';

}

// Empfohlene Monatsrate, um den Restbetrag bis zur Fälligkeit abzuzahlen.

// Liefert { rest, monate, empfohlen, ausreichend } – ausreichend = eingetragene

// Rate deckt den Bedarf (inkl. bereits gezahlter Beträge).

function suggestRate(en) {

  const total = parseFloat(en.betrag) || 0;

  const bereits = paymentSum(en.zahlungen);

  const rest = Math.max(0, total - bereits);

  if (rest <= 0) return {

    rest: 0,

    monate: 0,

    empfohlen: 0,

    ausreichend: true

  };

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const faellig = en.faelligkeit ? new Date(en.faelligkeit) : null;

  let monate;

  if (faellig && faellig > today) {

    monate = (faellig.getFullYear() - today.getFullYear()) * 12 + (faellig.getMonth() - today.getMonth());

    monate = Math.max(1, monate); // min. 1 Monat

  } else {

    monate = 12; // ohne Fälligkeit: 12 Monate Standard

  }

  const empfohlen = Math.ceil(rest / monate * 100) / 100;

  const rate = parseFloat(en.rate) || 0;

  const ausreichend = rate > 0 && rate >= empfohlen;

  return {

    rest,

    monate,

    empfohlen,

    ausreichend,

    rate

  };

}

// Haushaltsbasierter Tilgungsplan: sozial verträglich (entlastet Schuldner)

// UND für den Gläubiger realistisch (wird tatsächlich bezahlt, läuft aus).

// einkommen/ausgaben in EUR/Monat. Liefert { rate, monate, rest,

// verfuegbar, sozial, realistisch, pctEinkommen }.

function suggestPlan(en, einkommen, ausgaben) {

  const total = parseFloat(en.betrag) || 0;

  const bereits = paymentSum(en.zahlungen);

  const rest = Math.max(0, total - bereits);

  if (rest <= 0) return {

    rate: 0,

    monate: 0,

    rest: 0,

    verfuegbar: 0,

    sozial: true,

    realistisch: true,

    pctEinkommen: 0

  };

  const e = parseFloat(einkommen) || 0;

  const a = parseFloat(ausgaben) || 0;

  // Freibetrag zum Leben (richtwert: 1.200 € für Alleinstehende, +600 € pro

  // weitere Person im Haushalt nicht erfasst – konservativ).

  const lebenshaltung = 1200;

  const verfuegbar = Math.max(0, e - a - lebenshaltung);

  // Sozial verträglich: max. 40 % des verfügbaren Einkommens.

  const sozialRate = verfuegbar * 0.4;

  // Realistisch für Gläubiger: Rest in max. 48 Monaten tilgen.

  const glaeubigerRate = rest / 48;

  // Nehme den kleineren Wert (schützt Schuldner), aber mind. 5 € Pflichtrate.

  let rate = Math.max(5, Math.min(sozialRate, glaeubigerRate));

  rate = Math.ceil(rate * 100) / 100;

  const monate = Math.max(1, Math.ceil(rest / rate));

  const sozial = rate <= sozialRate + 0.01; // innerhalb 40 %-Grenze

  const realistisch = monate <= 48; // läuft in ≤ 4 Jahren aus

  const pctEinkommen = e > 0 ? rate / e * 100 : 0;

  return {

    rate,

    monate,

    rest,

    verfuegbar,

    sozial,

    realistisch,

    pctEinkommen

  };

}

// Öffnet eine saubere Druckansicht des Tilgungsplans und ruft den Druckdialog

// auf (der Browser bietet dort „Als PDF speichern" an). Kein externes CDN/npm.

function printTilgungsplan(en) {

  const total = parseFloat(en.betrag) || 0;

  const am = buildAmortization(en);

  const gezahlt = paymentSum(en.zahlungen);

  const rest = Math.max(0, total - gezahlt);

  const pct = total > 0 ? Math.min(100, gezahlt / total * 100) : 0;

  const s = suggestRate(en);

  const rows = am.map((r, i) => `

    <tr>

      <td>${i + 1}</td>

      <td>${r.datum ? formatDate(r.datum) : '—'}</td>

      <td class="num">${formatEUR(r.betrag)}</td>

      <td class="num">${formatEUR(r.rest)}</td>

      <td class="num">${r.pct.toFixed(0)} %</td>

    </tr>`).join('');

  const win = window.open('', '_blank');

  if (!win) {

    alert('Bitte Pop-ups für diese Seite erlauben, um zu drucken.');

    return;

  }

  win.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">

<title>Tilgungsplan – ${en.glaeubiger || ''}</title>

<style>

  * { box-sizing: border-box; }

  body { font-family: 'IBM Plex Sans', Arial, sans-serif; color: #0f172a; margin: 32px; }

  h1 { font-size: 20px; margin: 0 0 4px; }

  .meta { color: #475569; font-size: 13px; margin-bottom: 16px; }

  table { width: 100%; border-collapse: collapse; margin-top: 12px; }

  th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 13px; }

  th { background: #f1f5f9; }

  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }

  .sum { margin-top: 14px; font-size: 14px; }

  .sum span { font-weight: 600; }

  .bar { height: 10px; background: #e2e8f0; border-radius: 6px; overflow: hidden; margin: 6px 0 0; }

  .bar > div { height: 100%; background: #059669; }

  .hint { margin-top: 18px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }

  @media print { body { margin: 0; } }

</style></head><body>

  <h1>Tilgungsplan</h1>

  <div class="meta">${en.glaeubiger || '—'}${en.aktenzeichen ? ' · Aktenzeichen ' + en.aktenzeichen : ''} · Fällig: ${formatDate(en.faelligkeit)}</div>

  <div>Gesamt: <span class="mono">${formatEUR(total)}</span> · Gezahlt: <span class="mono">${formatEUR(gezahlt)}</span> · Rest: <span class="mono">${formatEUR(rest)}</span></div>

  <div class="bar"><div style="width:${pct}%"></div></div>

  <table>

    <thead><tr><th>#</th><th>Datum</th><th class="num">Zahlung</th><th class="num">Restbetrag</th><th class="num">Fortschritt</th></tr></thead>

    <tbody>${rows}</tbody>

  </table>

  <div class="sum">Empfohlene Monatsrate: <span>${formatEUR(s.empfohlen)}</span> (${s.monate} Mon. bis Fälligkeit)${s.ausreichend ? ' – aktuelle Rate reicht aus.' : ' – aktuelle Rate zu niedrig.'}</div>

  <div class="hint">Erstellt am ${new Date().toLocaleDateString('de-DE')} · Forderungsverwaltung</div>

  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };<\/script>

</body></html>`);

  win.document.close();

}

// Erzeugt ein valides, eigenständiges PDF (Data-URL) aus Betreff + Body.

// Reines JS, keine externe Bibliothek (offline-fähig). Kodierung: WinAnsi (Latin-1),

// damit deutsche Umlaute korrekt dargestellt werden.

function strToLatin1Pdf(s) {

  // Ersetze typische Unicode-Punktuelle durch Latin-1, sonst Zeichen durch '?'

  const map = {

    '–': '-',

    '—': '-',

    '‘': "'",

    '’': "'",

    '“': '"',

    '”': '"',

    '•': '-',

    '·': '-',

    '€': 'EUR',

    '§': '§',

    'ä': 'ä',

    'ö': 'ö',

    'ü': 'ü',

    'Ä': 'Ä',

    'Ö': 'Ö',

    'Ü': 'Ü',

    'ß': 'ß'

  };

  let out = '';

  for (const ch of s) {

    if (map[ch]) {

      out += map[ch];

      continue;

    }

    const code = ch.charCodeAt(0);

    if (code <= 0xFF) {

      out += ch;

    } else if (ch === '\n') {

      out += '\n';

    } else {

      out += '?';

    }

  }

  return out;

}

function pdfEscape(s) {

  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

}

function emailToPdfDataUrl(subject, body) {

  const lines = (subject ? 'Betreff: ' + subject + '\n\n' : '') + body;

  const wrapped = [];

  for (const raw of lines.split('\n')) {

    if (raw.trim() === '') {

      wrapped.push('');

      continue;

    }

    let line = raw;

    while (line.length > 95) {

      let cut = line.lastIndexOf(' ', 95);

      if (cut <= 0) cut = 95;

      wrapped.push(line.slice(0, cut));

      line = line.slice(cut).trimStart();

    }

    wrapped.push(line);

  }

  const text = wrapped.map(l => `(${pdfEscape(strToLatin1Pdf(l))}) Tj`).join('\n0 -15 Td\n');

  const stream = `BT\n/F1 11 Tf\n60 780 Td\n${text}\nET`;

  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'];

  let pdf = '%PDF-1.4\n';

  const offsets = [];

  objects.forEach((obj, i) => {

    offsets.push(pdf.length);

    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;

  });

  const xrefStart = pdf.length;

  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  offsets.forEach(off => {

    pdf += String(off).padStart(10, '0') + ' 00000 n \n';

  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  // Bytes → Latin-1 Data-URL

  const bytes = new Uint8Array(pdf.length);

  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xFF;

  let bin = '';

  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);

  return 'data:application/pdf;base64,' + btoa(bin);

}

// Öffnet das Standard-Mailprogramm mit einem vorgefertigten, individualisierbaren

// Ratenzahlungsangebot (mailto:, kein Server/API). rate = gewählte Monatsrate.

// Gibt { mailto, doc } zurück; doc ist ein PDF-Dokument (für "Dokumente"), falls gewünscht.

function composeRateEmail(en, rate, opts) {

  opts = opts || {};

  const total = parseFloat(en.betrag) || 0;

  const gezahlt = paymentSum(en.zahlungen);

  const rest = Math.max(0, total - gezahlt);

  const r = parseFloat(rate) || 0;

  const heute = new Date();

  const start = new Date(heute.getFullYear(), heute.getMonth() + 1, 5);

  const monate = r > 0 ? Math.ceil(rest / r) : 0;

  const anrede = (en.inkassounternehmen || en.glaeubiger || 'Damen und Herren').trim();

  const ratenListe = [];

  let d = new Date(start);

  for (let i = 1; i <= monate; i++) {

    ratenListe.push(`  ${i}. Rate: ${formatEUR(r)} am ${d.toLocaleDateString('de-DE')}`);

    d = new Date(d.getFullYear(), d.getMonth() + 1, 5);

  }

  const betreff = `Ratenzahlungsvereinbarung – ${en.glaeubiger || 'Forderung'}${en.aktenzeichen ? ' (Az. ' + en.aktenzeichen + ')' : ''}`;

  const body = `Sehr geehrte Damen und Herren,



bezüglich der oben genannten Forderung (${en.glaeubiger || '—'}${en.aktenzeichen ? ', Aktenzeichen ' + en.aktenzeichen : ''}) biete ich Ihnen folgende Ratenzahlung an:



Forderungsbetrag gesamt: ${formatEUR(total)}

Bereits geleistete Zahlungen: ${formatEUR(gezahlt)}

Noch offener Restbetrag: ${formatEUR(rest)}



Ich zahle den Restbetrag in ${monate} monatlichen Raten zu je ${formatEUR(r)}, beginnend ab ${start.toLocaleDateString('de-DE')}:



${ratenListe.join('\n')}



Die Raten werden jeweils zum 5. des Monats fällig. Bitte bestätigen Sie mir diese Vereinbarung schriftlich.



Mit freundlichen Grüßen

${''}



(Erstellt am ${heute.toLocaleDateString('de-DE')} · Forderungsverwaltung)`;

  // Optionale CC-Adresse (eigene E-Mail des Nutzers) in den mailto-Link einbauen

  const ccPart = opts.cc ? `&cc=${encodeURIComponent(opts.cc)}` : '';

  const mailto = `mailto:?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}${ccPart}`;

  let doc = null;

  if (opts.saveDoc) {

    const datum = heute.toISOString().slice(0, 10);

    doc = {

      id: uid(),

      name: `Ratenangebot_${en.glaeubiger || 'Forderung'}_${datum}.pdf`,

      type: 'application/pdf',

      size: 0,

      dataUrl: emailToPdfDataUrl(betreff, body),

      gesendetAm: heute.toISOString(),

      kind: 'email'

    };

  }

  return {

    mailto,

    doc,

    betreff,

    subject: betreff,

    body,

    cc: opts.cc || ''

  };

}



// Vergleichsangebot (aussergerichtliche Einigung) per E-Mail/PDF.

// opts: { art: 'einmal' | 'raten', einmalBetrag, rate, nachlassPct, cc }

function composeVergleichEmail(en, opts) {

  opts = opts || {};

  const total = parseFloat(en.betrag) || 0;

  const gezahlt = paymentSum(en.zahlungen);

  const rest = Math.max(0, total - gezahlt);

  const heute = new Date();

  const art = opts.art || 'einmal';

  const ccPart = opts.cc ? `&cc=${encodeURIComponent(opts.cc)}` : '';

  let betreff, body;

  if (art === 'einmal') {

    const einmal = parseFloat(opts.einmalBetrag) || 0;

    const nachlass = Math.max(0, rest - einmal);

    betreff = `Vergleichsangebot (Einmalzahlung) – ${en.glaeubiger || 'Forderung'}${en.aktenzeichen ? ' (Az. ' + en.aktenzeichen + ')' : ''}`;

    body = `Sehr geehrte Damen und Herren,



bezüglich der oben genannten Forderung (${en.glaeubiger || '—'}${en.aktenzeichen ? ', Aktenzeichen ' + en.aktenzeichen : ''}) biete ich Ihnen zur außergerichtlichen Erledigung folgenden Vergleich an:



Forderungsbetrag gesamt: ${formatEUR(total)}

Bereits geleistete Zahlungen: ${formatEUR(gezahlt)}

Noch offener Restbetrag: ${formatEUR(rest)}



Ich zahle den Restbetrag in einer einmaligen Zahlung in Höhe von ${formatEUR(einmal)}.

Damit erlassen Sie mir den Differenzbetrag von ${formatEUR(nachlass)} (${rest > 0 ? Math.round(nachlass / rest * 100) : 0} % Nachlass).



Bitte bestätigen Sie mir diesen Vergleich schriftlich. Nach Zahlungseingang betrachte ich die Angelegenheit als erledigt.



Mit freundlichen Grüßen



(Erstellt am ${heute.toLocaleDateString('de-DE')} · Forderungsverwaltung)`;

  } else {

    const r = parseFloat(opts.rate) || 0;

    const monate = r > 0 ? Math.ceil(rest / r) : 0;

    const start = new Date(heute.getFullYear(), heute.getMonth() + 1, 5);

    const ratenListe = [];

    let d = new Date(start);

    for (let i = 1; i <= monate; i++) {

      ratenListe.push(`  ${i}. Rate: ${formatEUR(r)} am ${d.toLocaleDateString('de-DE')}`);

      d = new Date(d.getFullYear(), d.getMonth() + 1, 5);

    }

    betreff = `Vergleichsangebot (Ratenzahlung) – ${en.glaeubiger || 'Forderung'}${en.aktenzeichen ? ' (Az. ' + en.aktenzeichen + ')' : ''}`;

    body = `Sehr geehrte Damen und Herren,



bezüglich der oben genannten Forderung (${en.glaeubiger || '—'}${en.aktenzeichen ? ', Aktenzeichen ' + en.aktenzeichen : ''}) biete ich Ihnen zur außergerichtlichen Erledigung folgende Ratenzahlung als Vergleich an:



Forderungsbetrag gesamt: ${formatEUR(total)}

Bereits geleistete Zahlungen: ${formatEUR(gezahlt)}

Noch offener Restbetrag: ${formatEUR(rest)}



Ich zahle den Restbetrag in ${monate} monatlichen Raten zu je ${formatEUR(r)}, beginnend ab ${start.toLocaleDateString('de-DE')}:



${ratenListe.join('\n')}



Die Raten werden jeweils zum 5. des Monats fällig. Bitte bestätigen Sie mir diesen Vergleich schriftlich.



Mit freundlichen Grüßen



(Erstellt am ${heute.toLocaleDateString('de-DE')} · Forderungsverwaltung)`;

  }

  const mailto = `mailto:?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}${ccPart}`;

  let doc = null;

  if (opts.saveDoc) {

    const datum = heute.toISOString().slice(0, 10);

    doc = {

      id: uid(),

      name: `Vergleich_${en.glaeubiger || 'Forderung'}_${datum}.pdf`,

      type: 'application/pdf',

      size: 0,

      dataUrl: emailToPdfDataUrl(betreff, body),

      gesendetAm: heute.toISOString(),

      kind: 'email'

    };

  }

  return {

    mailto,

    doc,

    betreff,

    subject: betreff,

    body,

    cc: opts.cc || ''

  };

}



// Öffnet das gewählte E-Mail-Programm mit vorbefülltem Betreff/Text.

// provider: 'system' (mailto:) | 'gmail' | 'outlook' (beide öffnen im Browser)

function openMail(provider, subject, body, cc) {

  const s = encodeURIComponent(subject || '');

  const b = encodeURIComponent(body || '');

  const c = encodeURIComponent(cc || '');

  if (provider === 'gmail') {

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${s}&body=${b}${c ? `&bcc=${c}` : ''}`, '_blank');

  } else if (provider === 'outlook') {

    window.open(`https://outlook.live.com/mail/0/deelegate?path=/mail/action/compose&subject=${s}&body=${b}${c ? `&cc=${c}` : ''}`, '_blank');

  } else {

    window.location.href = `mailto:?subject=${s}&body=${b}${c ? `&cc=${c}` : ''}`;

  }

}

// Erzeugt eine SEPA-XML (pain.001 für Überweisung, pain.008 für Dauerauftrag)

// aus den Formulardaten. Reines Offline-Format – kann in das Online-Banking hochgeladen werden.

function buildSepaXml(s) {

  const msgId = 'SEPA-' + Date.now();

  const date = new Date().toISOString().slice(0, 10);

  const betrag = (parseFloat(s.betrag) || 0).toFixed(2);

  const iban = (s.iban || '').replace(/\s/g, '').toUpperCase();

  const bic = (s.bic || '').replace(/\s/g, '').toUpperCase();

  const empfaenger = (s.empfaenger || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const zweck = (s.zweck || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Eigener Absender (von welchem Konto die Überweisung / der Dauerauftrag läuft)

  const vonName = (s.vonName || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || empfaenger;

  const vonIban = (s.vonIban || '').replace(/\s/g, '').toUpperCase();

  const vonBic = (s.vonBic || '').replace(/\s/g, '').toUpperCase();

  const isDA = s.typ === 'dauerauftrag';

  const ns = isDA ? 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02' : 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03';

  const svcLvl = isDA ? `<PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl><SeqTp>${s.turnus === 'vierteljaehrlich' ? 'QUR' : s.turnus === 'halbjaehrlich' ? 'SEM' : s.turnus === 'jaehrlich' ? 'YEAR' : 'RCUR'}</SeqTp></PmtTpInf>` : `<PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf>`;

  const freq = isDA ? `<Freq>${s.turnus === 'vierteljaehrlich' ? 'QUR' : s.turnus === 'halbjaehrlich' ? 'SEM' : s.turnus === 'jaehrlich' ? 'YEAR' : 'MNTH'}</Freq><DtPrf>${date}</DtPrf>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>

<Document xmlns="${ns}">

  <Cstmr${isDA ? 'DrctDbt' : 'CdtTrf'}Initn>

    <GrpHdr>

      <MsgId>${msgId}</MsgId>

      <CreDtTm>${new Date().toISOString()}</CreDtTm>

      <NbOfTxs>1</NbOfTxs>

      <InitgPty><Nm>${vonName}</Nm></InitgPty>

    </GrpHdr>

    <PmtInf>

      <PmtInfId>${msgId}</PmtInfId>

      ${svcLvl}

      <Reqd${isDA ? 'Colltn' : 'Exctn'}Dt>${date}</Reqd${isDA ? 'Colltn' : 'Exctn'}Dt>

      <Dbtr><Nm>${vonName}</Nm></Dbtr>

      <DbtrAcct><Id><IBAN>${vonIban}</IBAN></Id></DbtrAcct>

      ${vonBic ? `<DbtrAgt><FinInstnId><BIC>${vonBic}</BIC></FinInstnId></DbtrAgt>` : `<DbtrAgt><FinInstnId><Othr><Cd>NOTPROVIDED</Cd></Othr></FinInstnId></DbtrAgt>`}

      <Cdtr><Nm>${empfaenger}</Nm></Cdtr>

      <CdtrAcct><Id><IBAN>${iban}</IBAN></Id></CdtrAcct>

        <Amt><InstdAmt Ccy="EUR">${betrag}</InstdAmt></Amt>

        <Cdtr><Nm>${empfaenger}</Nm></Cdtr>

        <CdtrAcct><Id><IBAN>${iban}</IBAN></Id></CdtrAcct>

        ${freq}

        <RmtInf><Ustrd>${zweck}</Ustrd></RmtInf>

      </CdtTrfTxInf>

    </PmtInf>

  </Cstmr${isDA ? 'DrctDbt' : 'CdtTrf'}Initn>

</Document>`;

}

// SEPA-BezahlCode (EPC) erzeugen + als QR-SVG rendern (scanbar mit Banking-Apps).

// Nutzt die lokal eingebundene qrcode.js (Kazuhiko Arase, public domain) – offline.

function sepaBezahlCode(s) {

  const name = (s.empfaenger || '').replace(/\n/g, ' ');

  const iban = (s.iban || '').replace(/\s/g, '').toUpperCase();

  const bic = (s.vonBic || s.bic || '').replace(/\s/g, '').toUpperCase();

  const betrag = (parseFloat(s.betrag) || 0).toFixed(2).replace('.', ',');

  const zweck = (s.zweck || '').replace(/\n/g, ' ');

  return ['BCD', '002', '1', 'SCT', bic, name, iban, betrag, '', zweck, '', ''].join('\n');

}

function sepaQrSvg(s) {

  try {

    const code = sepaBezahlCode(s);

    const qr = qrcode(0, 'M');

    qr.addData(code);

    qr.make();

    const n = qr.getModuleCount(),

      cell = 4,

      dim = n * cell;

    let rects = '';

    for (let r = 0; r < n; r++) {

      for (let c = 0; c < n; c++) {

        if (qr.isDark(r, c)) rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}"/>`;

      }

    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges"><rect width="${dim}" height="${dim}" fill="#fff"/><g fill="#000">${rects}</g></svg>`;

  } catch (e) {

    return null;

  }

}

function fileToDataUrl(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });

}

// ── IndexedDB: robustere zweite Speicherebene ──────────────────────────────

const IDB_NAME = 'ForderungenDB';

const IDB_STORE = 'eintraege';

/**

 * Öffnet die IndexedDB-Datenbank für die persistente Speicherung.

 * @returns {Promise<IDBDatabase>} Die geöffnete Datenbankverbindung.

 */

function openIDB() {

  return new Promise((resolve, reject) => {

    const req = indexedDB.open(IDB_NAME, 1);

    req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE);

    req.onsuccess = e => resolve(e.target.result);

    req.onerror = reject;

  });

}



/**

 * Speichert einen Wert in IndexedDB.

 * @param {string} key - Eindeutiger Schlüssel.

 * @param {any} value - Zu speicherndes Objekt.

 */

async function idbSave(key, value) {

  try {

    const db = await openIDB();

    return new Promise((resolve, reject) => {

      const tx = db.transaction(IDB_STORE, 'readwrite');

      tx.objectStore(IDB_STORE).put(value, key);

      tx.oncomplete = resolve;

      tx.onerror = reject;

    });

  } catch (e) {/* IDB nicht verfügbar */}

}



/**

 * Lädt einen Wert aus IndexedDB.

 * @param {string} key - Schlüssel des Eintrags.

 * @returns {Promise<any|null>} Der geladene Wert oder null.

 */

async function idbLoad(key) {

  try {

    const db = await openIDB();

    return new Promise((resolve, reject) => {

      const req = db.transaction(IDB_STORE).objectStore(IDB_STORE).get(key);

      req.onsuccess = e => resolve(e.target.result);

      req.onerror = reject;

    });

  } catch (e) {

    return null;

  }

}

function isFirstOfMonth() {

  return new Date().getDate() === 1;

}



// Entfernt die base64-Dokumentdaten aus der localStorage-Spiegelung, damit das

// 5-MB-Quota nicht durch große Anhänge platzt. Die vollständigen Daten (inkl.

// Dokumenten) liegen autoritativ in IndexedDB.

function stripDocData(entries) {

  return (entries || []).map(e => ({

    ...e,

    dokumente: (e.dokumente || []).map(({

      dataUrl,

      ...rest

    }) => rest)

  }));

}



// SwipeRow für Web (Pointer-Events: Touch + Maus). Wisch nach links -> Aktionsfläche.

function SwipeRow({

  children,

  actions,

  open,

  onOpenChange

}) {

  const [dx, setDx] = useState(0);

  const startX = useRef(null);

  const ACTION_W = 160;

  function onDown(e) {

    startX.current = e.clientX != null ? e.clientX : e.touches && e.touches[0] ? e.touches[0].clientX : null;

  }

  function onMove(e) {

    if (startX.current == null) return;

    const x = e.clientX != null ? e.clientX : e.touches && e.touches[0] ? e.touches[0].clientX : startX.current;

    let delta = (open ? ACTION_W : 0) + (x - startX.current);

    if (delta < 0) delta = 0;

    if (delta > ACTION_W) delta = ACTION_W;

    setDx(delta);

  }

  function onUp() {

    if (startX.current == null) return;

    startX.current = null;

    if (dx > ACTION_W / 2) {

      setDx(ACTION_W);

      onOpenChange(true);

    } else {

      setDx(0);

      onOpenChange(false);

    }

  }

  return /*#__PURE__*/React.createElement("div", {

    className: "relative overflow-hidden rounded-xl"

  }, /*#__PURE__*/React.createElement("div", {

    className: "absolute inset-y-0 right-0 flex",

    style: {

      width: ACTION_W

    }

  }, actions.map((a, i) => /*#__PURE__*/React.createElement("button", {

    key: i,

    onClick: e => {

      e.stopPropagation();

      setDx(0);

      onOpenChange(false);

      a.onClick();

    },

    style: { backgroundColor: (a.color || '#e11d48'), color: '#ffffff' },

    className: "flex-1 flex flex-col items-center justify-center gap-0.5 text-white text-xs font-medium py-2"

  }, /*#__PURE__*/React.createElement("span", {

    className: "text-base leading-none"

  }, a.icon), a.label))), /*#__PURE__*/React.createElement("div", {

    onPointerDown: onDown,

    onPointerMove: onMove,

    onPointerUp: onUp,

    onPointerLeave: onUp,

    style: {

      transform: `translateX(${-dx}px)`,

      transition: startX.current == null ? 'transform 0.18s ease' : 'none',

      touchAction: 'pan-y'

    },

    className: "relative bg-white dark:bg-slate-900"

  }, children));

}

function DashboardCashflowChart({ entries, einkauf, budgetEinnahmen, budgetFixkosten, budgetAusgaben }) {

  const now = new Date();

  const [selYear, setSelYear] = useState(now.getFullYear());

  const [selMonth, setSelMonth] = useState(now.getMonth());

  const ym = selYear + '-' + String(selMonth + 1).padStart(2, '0');

  const days = new Date(selYear, selMonth + 1, 0).getDate();

  const ein = []; const aus = [];

  for (let d = 1; d <= days; d++) { ein.push(0); aus.push(0); }

  (entries || []).forEach(function (en) { (en.einzahlungen || []).forEach(function (z) {

    if ((z.datum || '').slice(0, 7) === ym) { const day = parseInt((z.datum || '').slice(8, 10), 10); if (day >= 1 && day <= days) ein[day - 1] += Number(z.betrag) || 0; }

  }); });

  (einkauf || []).forEach(function (b) { if ((b.datum || '').slice(0, 7) === ym) { const day = parseInt((b.datum || '').slice(8, 10), 10); if (day >= 1 && day <= days) aus[day - 1] += Number(b.betrag) || 0; } });

  const maxV = Math.max(1, ein.reduce(function (a, b) { return a + b; }, 0), aus.reduce(function (a, b) { return a + b; }, 0));

  const monthEin = ein.reduce(function (a, b) { return a + b; }, 0);

  const monthAus = aus.reduce(function (a, b) { return a + b; }, 0);

  const bEin = (budgetEinnahmen || []).reduce(function (s, x) { return s + (Number(x.betrag) || 0); }, 0);

  const bFix = (budgetFixkosten || []).reduce(function (s, x) { return s + toMonthly(x.betrag, x.intervall); }, 0);

  const bAus = (budgetAusgaben || []).reduce(function (s, x) { return s + (Number(x.betrag) || 0); }, 0);

  const planNetDaily = (bEin - bFix - bAus) / days;

  const W = 320, H = 124, pad = 4, baseY = H - 18;

  const bw = (W - pad * 2) / days;

  const bars = [];

  for (let d = 1; d <= days; d++) {

    const i = ein[d - 1], a = aus[d - 1];

    const x = pad + (d - 1) * bw;

    const ih = i / maxV * (baseY - 4);

    const ah = a / maxV * (baseY - 4);

    if (i > 0) bars.push(React.createElement('rect', { key: 'g' + d, x: x + 1, y: baseY - ih, width: Math.max(1, bw - 2), height: ih, fill: '#10b981', rx: 1 }));

    if (a > 0) bars.push(React.createElement('rect', { key: 'r' + d, x: x + 1, y: baseY - ah, width: Math.max(1, bw - 2), height: ah, fill: '#f43f5e', rx: 1 }));

  }

  const planY = baseY - (planNetDaily / maxV) * (baseY - 4);

  const planLine = planNetDaily !== 0 ? React.createElement('line', { x1: pad, y1: planY, x2: W - pad, y2: planY, stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }) : null;

  const months = ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  return React.createElement('div', { className: 'bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3' },

    React.createElement('div', { className: 'flex items-center justify-between mb-2' },

      React.createElement('p', { className: 'text-xs font-medium text-slate-100' }, 'Cashflow pro Tag'),

      React.createElement('div', { className: 'flex items-center gap-1' },

        React.createElement('select', { value: selMonth, onChange: function (e) { setSelMonth(Number(e.target.value)); }, className: 'text-xs bg-slate-800 text-white rounded px-1 py-1 border border-slate-600' }, months.map(function (m, i) { return React.createElement('option', { key: i, value: i }, m); })),

        React.createElement('input', { type: 'number', value: selYear, onChange: function (e) { setSelYear(Number(e.target.value)); }, className: 'text-xs bg-slate-800 text-white rounded px-1 py-1 border border-slate-600 w-16' }))),

    React.createElement('svg', { viewBox: '0 0 ' + W + ' ' + H, className: 'w-full', style: { height: H } }, bars, planLine),

    React.createElement('div', { className: 'flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px]' },

      React.createElement('span', { className: 'text-emerald-400' }, 'Einnahmen ' + formatEUR(monthEin + bEin)),

      React.createElement('span', { className: 'text-rose-400' }, 'Ausgaben ' + formatEUR(monthAus + bFix + bAus))),

    React.createElement('div', { className: 'flex items-center gap-3 mt-1 text-[10px] text-slate-400' },

      React.createElement('span', { className: 'flex items-center gap-1' }, React.createElement('span', { className: 'w-2 h-2 rounded-sm', style: { background: '#10b981' } }), 'Einnahmen'),

      React.createElement('span', { className: 'flex items-center gap-1' }, React.createElement('span', { className: 'w-2 h-2 rounded-sm', style: { background: '#f43f5e' } }), 'Ausgaben'),

      React.createElement('span', { className: 'flex items-center gap-1' }, React.createElement('span', { className: 'w-3 border-t border-dashed', style: { borderColor: '#94a3b8' } }), 'Plan/Tag'))

  );

}



function AppShell({

  currentUser,

  onLogout,

  darkMode,

  toggleDark,

  onUserMgmt

}) {

  // Initialisierung aus IndexedDB (autoritativ); Fallback auf localStorage-Spiegel

  const [entries, setEntries] = useState(() => {

    try {

      const raw = localStorage.getItem(userStorageKey(currentUser.username));

      const parsed = raw ? JSON.parse(raw) : null;

      return Array.isArray(parsed) ? parsed : [];

    } catch {

      return [];

    }

  });



  // Beim Mount: IndexedDB (mit Dokumenten) laden, falls vorhanden

  useEffect(() => {

    const key = userStorageKey(currentUser.username);

    idbLoad(key).then(idbData => {

      if (Array.isArray(idbData)) setEntries(idbData);else {

        // localStorage enthält ggf. noch Dokumente aus alter Version -> in IDB nachrüsten

        try {

          const raw = localStorage.getItem(key);

          const localData = raw ? JSON.parse(raw) : [];

          if (Array.isArray(localData) && localData.length) idbSave(key, localData);

        } catch {}

      }

    });

  }, [currentUser]);



  useEffect(() => { searchRef.current = buildSearchIndex(entries); }, [entries]);

  // Speichern beim Schließen / Tab-Wechsel: IDB vollständig, localStorage ohne Doc-Daten

  useEffect(() => {

    const save = () => {

      const key = userStorageKey(currentUser.username);

      idbSave(key, entries); // vollständig inkl. Dokumenten

      try {

        localStorage.setItem(key, JSON.stringify(stripDocData(entries)));

      } catch {}

    };

    window.addEventListener('beforeunload', save);

    document.addEventListener('visibilitychange', () => {

      if (document.hidden) save();

    });

    return () => {

      window.removeEventListener('beforeunload', save);

    };

  }, [entries, currentUser]);



  // Automatisches Speichern im Hintergrund alle 30 Sekunden (IDB voll, LS ohne Docs)

  useEffect(() => {

    const interval = setInterval(() => {

      const key = userStorageKey(currentUser.username);

      idbSave(key, entries);

      try {

        localStorage.setItem(key, JSON.stringify(stripDocData(entries)));

        setSaveError(false);

      } catch {}

      setLastSaved(new Date());

    }, 30000);

    return () => clearInterval(interval);

  }, [entries, currentUser]);

  const searchRef = { current: null };

  function buildSearchIndex(list) {

    const idx = {};

    (list || []).forEach((en, i) => {

      const h = [en.id, en.glaeubiger, en.aktenzeichen, en.name, en.kategorie, en.status, en.zahlungsart, en.typ, en.verwendungszweck].join(' ').toLowerCase();

      h.split(/[^a-z0-9]+/).filter(Boolean).forEach(w => { if (!idx[w]) idx[w] = new Set(); idx[w].add(i); });

    });

    return idx;

  }

  function queryIndex(idx, q) {

    if (!q || !idx) return null;

    const ws = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

    if (!ws.length) return null;

    let result = null;

    ws.forEach(w => {

      const ids = idx[w];

      if (!ids || !ids.size) { result = new Set(); return; }

      result = result ? new Set([...result].filter(x => ids.has(x))) : new Set(ids);

    });

    return result || null;

  }

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('alle');

  const [typeFilter, setTypeFilter] = useState('alle');

  const [partySuggestions, setPartySuggestions] = useState([]);

  const [formOpen, setFormOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [expandedId, setExpandedId] = useState(null);

  const [swipeOpenId, setSwipeOpenId] = useState(null);

  const [activeTab, setActiveTab] = useState('uebersicht');

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [saveError, setSaveError] = useState(false);

  const [mailProvider, setMailProvider] = useState(() => {

    try {

      return localStorage.getItem('forderungen-mailprovider') || 'system';

    } catch {

      return 'system';

    }

  });

  function setMailProviderPersist(p) {

    setMailProvider(p);

    try {

      localStorage.setItem('forderungen-mailprovider', p);

    } catch {}

  }

  const [paymentDraft, setPaymentDraft] = useState({

    datum: '',

    betrag: ''

  });

  const [dragOver, setDragOver] = useState(false);

  const [lastSaved, setLastSaved] = useState(null);

  const [showReminder, setShowReminder] = useState(() => isFirstOfMonth());

  const [view, setView] = useState('dashboard');

  const [showInfo, setShowInfo] = useState(false);

  const [infoTab, setInfoTab] = useState('version');

  const [showPlanCalc, setShowPlanCalc] = useState(false);

  const [planEinkommen, setPlanEinkommen] = useState('');

  const [planAusgaben, setPlanAusgaben] = useState('');

  // Sparen: Abos/Versicherungen + Einkaufspreisvergleich

  const [abos, setAbos] = useState(() => {

    try {

      return JSON.parse(localStorage.getItem(ABO_KEY(currentUser.username))) || [];

    } catch {

      return [];

    }

  });

  const [einkauf, setEinkauf] = useState(() => {

    try {

      return JSON.parse(localStorage.getItem(EINKAUF_KEY(currentUser.username))) || [];

    } catch {

      return [];

    }

  });

  const [aboForm, setAboForm] = useState({

    name: '',

    kategorie: 'Abo',

    aktuell: '',

    alternativ: '',

    anbieterAlt: '',

    intervall: 'monatlich'

  });

  const [einkaufForm, setEinkaufForm] = useState({

    name: '',

    preise: {}

  });

  const [sepaList, setSepaList] = useState(() => {

    try {

      return JSON.parse(localStorage.getItem(SEPA_KEY(currentUser.username))) || [];

    } catch {

      return [];

    }

  });

  const [sepaForm, setSepaForm] = useState({

    empfaenger: '',

    iban: '',

    bic: '',

    betrag: '',

    zweck: '',

    typ: 'ueberweisung',

    turnus: 'monatlich',

    Tag: '1',

    vonKontoId: ''

  });

  const [profilePic, setProfilePic] = useState(() => loadProfilePic(currentUser.username));

  const [bonStatus, setBonStatus] = useState('');

  const [bonImg, setBonImg] = useState('');

  const [bonResult, setBonResult] = useState(null);

  const [bonForm, setBonForm] = useState({ betrag: '', shop: '', datum: new Date().toISOString().slice(0,10), kat: 'Einkauf' });



function readBonFile(file) {

  if (!file) return;

  setBonStatus('Lese Bild...');

  const reader = new FileReader();

  reader.onload = () => { setBonImg(reader.result); setBonStatus(''); };

  reader.onerror = () => { setBonStatus('Bild konnte nicht gelesen werden'); };

  reader.readAsDataURL(file);

}



function KassenbonManual() {

  const betrag = bonForm.betrag;

  const items = einkauf.length > 0 ? einkauf.slice().reverse() : [];

  const rows = items.map(function(b){

    return React.createElement(SwipeRow, {

      key: b.id,

      open: swipeOpenId === ('bk_' + b.id),

      onOpenChange: function(o){ setSwipeOpenId(o ? ('bk_' + b.id) : null); },

      actions: [{ icon: '✕', label: 'Löschen', color: '#e11d48', onClick: function(){ persistEinkauf(einkauf.filter(function(x){ return x.id !== b.id; })); } }],

      children: React.createElement('div', { className: 'bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3 flex gap-3 items-center' },

        b.img ? React.createElement('img', { src: b.img, alt: 'Beleg', className: 'w-16 h-16 object-cover rounded-lg border border-slate-600 shrink-0' }) : null,

        React.createElement('div', { className: 'flex-1 min-w-0' },

          React.createElement('p', { className: 'text-sm font-medium text-slate-100' }, formatEUR(b.betrag) + ' · ' + (b.name || 'Beleg')),

          React.createElement('p', { className: 'text-xs text-slate-100' }, (b.datum || '') + ' · ' + (b.kat || 'Einkauf'))

        )

      )

    })

  });

  const months = Object.keys(einkauf.reduce(function(m, b){ var k = (b.datum || '').slice(0, 7); (m[k] = m[k] || []).push(b); return m; }, {})).sort().reverse();

  const monthly = months.map(function(monat){

    var mitems = einkauf.filter(function(b){ return (b.datum || '').slice(0, 7) === monat; });

    var summe = mitems.reduce(function(s, b){ return s + (parseFloat(b.betrag) || 0); }, 0);

    var cats = {}; mitems.forEach(function(b){ var k = b.kat || 'Einkauf'; cats[k] = (cats[k] || 0) + (parseFloat(b.betrag) || 0); });

    return React.createElement('div', { key: monat, className: 'bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3 space-y-1' },

      React.createElement('div', { className: 'flex justify-between items-center' },

        React.createElement('p', { className: 'text-sm font-medium text-slate-100' }, monat),

        React.createElement('p', { className: 'text-sm font-semibold text-slate-100' }, formatEUR(summe))

      ),

      Object.keys(cats).map(function(cat){

        return React.createElement('div', { key: cat, className: 'flex justify-between text-xs text-slate-100' },

          React.createElement('span', null, cat + ': '),

          React.createElement('span', null, formatEUR(cats[cat]))

        );

      })

    );

  });

  return React.createElement('div', { className: 'space-y-3' },

    bonStatus ? React.createElement('p', { className: 'text-xs font-medium text-slate-100' }, bonStatus) : null,

    bonImg ? React.createElement('img', { src: bonImg, alt: 'Kassenbon', className: 'w-full rounded-lg border border-slate-600' }) : null,

    React.createElement('div', { className: 'bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-3' },

      React.createElement('p', { className: 'text-sm font-medium text-slate-100' }, 'Beleg manuell erfassen'),

      React.createElement('input', { type: 'number', step: '0.01', inputMode: 'decimal', value: bonForm.betrag, onChange: function(e){ setBonForm(Object.assign({}, bonForm, { betrag: e.target.value })); }, placeholder: 'Betrag (EUR)', className: 'w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white text-slate-900 outline-none' }),

      React.createElement('input', { value: bonForm.shop, onChange: function(e){ setBonForm(Object.assign({}, bonForm, { shop: e.target.value })); }, placeholder: 'Shop / Haendler', className: 'w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white text-slate-900 outline-none' }),

      React.createElement('input', { type: 'date', value: bonForm.datum, onChange: function(e){ setBonForm(Object.assign({}, bonForm, { datum: e.target.value })); }, className: 'w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white text-slate-900 outline-none' }),

      React.createElement('select', { value: bonForm.kat, onChange: function(e){ setBonForm(Object.assign({}, bonForm, { kat: e.target.value })); }, className: 'w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white text-slate-900 outline-none' },

        React.createElement('option', { value: 'Einkauf' }, 'Einkauf'),

        React.createElement('option', { value: 'Auto' }, 'Auto'),

        React.createElement('option', { value: 'Essen' }, 'Essen'),

        React.createElement('option', { value: 'Wohnen' }, 'Wohnen'),

        React.createElement('option', { value: 'Sonstiges' }, 'Sonstiges')

      ),

      React.createElement('button', {

        onClick: function(){

          var b = parseFloat(bonForm.betrag) || 0;

          if (!b) { setBonStatus('Bitte einen Betrag eingeben.'); return; }

          persistEinkauf(einkauf.concat([{ id: uid(), name: bonForm.shop || 'Beleg', betrag: b, datum: bonForm.datum || new Date().toISOString().slice(0,10), kat: bonForm.kat, img: bonImg }]));

          setBonForm({ betrag: '', shop: '', datum: new Date().toISOString().slice(0,10), kat: 'Einkauf' });

          setBonImg('');

          var bi = document.getElementById('bon-input'); if (bi) bi.value = '';

          setBonStatus('Beleg gespeichert.');

        },

        className: 'w-full bg-slate-900 text-white text-sm font-medium rounded-lg py-2'

      }, 'Beleg speichern')

    ),

    einkauf.length > 0 ? React.createElement('div', { className: 'mt-4 space-y-2' },

      React.createElement('p', { className: 'text-sm font-medium text-slate-100' }, 'Gespeicherte Belege (' + einkauf.length + ')'),

      rows

    ) : null,

    einkauf.length > 0 ? React.createElement('div', { className: 'mt-4 space-y-2' },

      React.createElement('p', { className: 'text-sm font-medium text-slate-100' }, 'Monatliche Auswertung'),

      monthly

    ) : null

  );

}



  const [vergleichForderungId, setVergleichForderungId] = useState('');

  const [vergleichArt, setVergleichArt] = useState('einmal');

  const [vergleichEinmal, setVergleichEinmal] = useState('');

  const [vergleichRate, setVergleichRate] = useState('');

  const [vergleichStatus, setVergleichStatus] = useState('');

  const [vergleichLog, setVergleichLog] = useState(() => {

    try {

      return JSON.parse(localStorage.getItem('forderungen-vergleich-' + currentUser.username)) || [];

    } catch {

      return [];

    }

  });

  const [nkForm, setNkForm] = useState({

    jahr: new Date().getFullYear().toString(),

    kategorie: 'strom',

    betrag: '',

    notiz: '',

    intervall: 'monatlich'

  });

  const [ownAccounts, setOwnAccounts] = useState(() => loadOwnAccounts(currentUser.username));

  const [ownAccForm, setOwnAccForm] = useState({

    name: '',

    iban: '',

    bic: '',

    kontoinhaber: '',

    bankingUrl: ''

  });

  const [sparenTab, setSparenTab] = useState('abos');

  const persist = useCallback(next => {

    setEntries(next);

    const key = userStorageKey(currentUser.username);

    idbSave(key, next); // vollständig inkl. Dokumenten

    try {

      localStorage.setItem(key, JSON.stringify(stripDocData(next)));

      setSaveError(false);

      setLastSaved(new Date());

    } catch (e) {

      setSaveError(true);

    }

  }, [currentUser]);



  // Sparen-Daten speichern

  const persistAbos = useCallback(next => {

    setAbos(next);

    try {

      localStorage.setItem(ABO_KEY(currentUser.username), JSON.stringify(next));

    } catch {}

  }, [currentUser]);

  const persistEinkauf = useCallback(next => {

    setEinkauf(next);

    try {

      localStorage.setItem(EINKAUF_KEY(currentUser.username), JSON.stringify(next));

    } catch {}

  }, [currentUser]);

  const persistVergleichLog = useCallback(next => {

    setVergleichLog(next);

    try {

      localStorage.setItem('forderungen-vergleich-' + currentUser.username, JSON.stringify(next));

    } catch {}

  }, [currentUser]);

  const [nebenkosten, setNebenkosten] = useState(() => {

    try {

      return JSON.parse(localStorage.getItem('forderungen-nebenkosten-' + currentUser.username)) || [];

    } catch {

      return [];

    }

  });

  const persistNebenkosten = useCallback(next => {

    setNebenkosten(next);

    try {

      localStorage.setItem('forderungen-nebenkosten-' + currentUser.username, JSON.stringify(next));

    } catch {}

  }, [currentUser]);

  // --- Budget: monatliche Einnahmen & Fixkosten ---

  const [budgetEinnahmen, setBudgetEinnahmen] = useState(() => {

    try { return JSON.parse(localStorage.getItem('forderungen-budget-einnahmen-' + currentUser.username)) || []; } catch { return []; }

  });

  const persistBudgetEinnahmen = useCallback(next => {

    setBudgetEinnahmen(next);

    try { localStorage.setItem('forderungen-budget-einnahmen-' + currentUser.username, JSON.stringify(next)); } catch {}

  }, [currentUser]);

  const [budgetFixkosten, setBudgetFixkosten] = useState(() => {

    try { return JSON.parse(localStorage.getItem('forderungen-budget-fixkosten-' + currentUser.username)) || []; } catch { return []; }

  });

  const persistBudgetFixkosten = useCallback(next => {

    setBudgetFixkosten(next);

    try { localStorage.setItem('forderungen-budget-fixkosten-' + currentUser.username, JSON.stringify(next)); } catch {}

  }, [currentUser]);

  const [budgetAusgaben, setBudgetAusgaben] = useState(() => {

    try { return JSON.parse(localStorage.getItem('forderungen-budget-ausgaben-' + currentUser.username)) || []; } catch { return []; }

  });

  const persistBudgetAusgaben = useCallback(next => {

    setBudgetAusgaben(next);

    try { localStorage.setItem('forderungen-budget-ausgaben-' + currentUser.username, JSON.stringify(next)); } catch {}

  }, [currentUser]);

  const [budgetForm, setBudgetForm] = useState({ einnahmeQuelle: '', einnahmeBetrag: '', kostenKategorie: 'miete', kostenBetrag: '', kostenIntervall: 'monatlich', kostenBemerkung: '', ausgabeZweck: '', ausgabeBetrag: '' });
    const [editingBudget, setEditingBudget] = useState(null);

  // Budget-Tab als eigene Funktion (Closure ueber State) -> robuste Klammerstruktur

  function BudgetTab() {

    const sumE = budgetEinnahmen.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

    const sumF = budgetFixkosten.reduce((s, x) => s + toMonthly(x.betrag, x.intervall), 0);

    const saldo = sumE - sumF;

    const katLabel = { miete: 'Miete / Kredit', strom: 'Strom', heizung: 'Heizung', wasser: 'Wasser/Abwasser', hausrat: 'Hausrat', auto_haftpflicht: 'Auto / Haftpflicht', versicherung_sonst: 'Sonstige Versicherung', abo: 'Abos / Vertraege', steuer: 'Steuern / Abgaben', sonstige: 'Sonstige', internet: 'Internet / Telefon', handy: 'Handy / Mobilfunk', streaming: 'Streaming / Abos', kranken: 'Krankenversicherung' };

    const card = (label, val, color) => /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-3 text-center" },

      /*#__PURE__*/React.createElement("p", { className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide" }, label),

      /*#__PURE__*/React.createElement("p", { className: `mono text-base font-semibold mt-0.5 leading-tight ${color}` }, formatEUR(val)));

    return /*#__PURE__*/React.createElement("div", { className: "px-4 mt-3 space-y-3" },

      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-100" }, "Monatliches Budget: Einnahmen abzueglich Fixkosten."),

      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-4 gap-2" }, card("Einnahmen", sumE, "text-emerald-600"), card("Fixkosten", sumF, "text-rose-600"), card("Saldo", saldo, saldo >= 0 ? "text-emerald-600" : "text-rose-600"), card("Deckungsbeitrag", saldo, saldo >= 0 ? "text-indigo-600" : "text-rose-600")),

      /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4 space-y-3" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white" }, "Einnahme erfassen (monatlich)"),

        /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2" },

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Quelle"),

            /*#__PURE__*/React.createElement("input", { value: budgetForm.einnahmeQuelle, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { einnahmeQuelle: e.target.value })), className: "w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none", placeholder: "z.B. Gehalt, Rente" })),

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Betrag / Monat (€)"),

            /*#__PURE__*/React.createElement("input", { type: "number", step: "0.01", value: budgetForm.einnahmeBetrag, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { einnahmeBetrag: e.target.value })), className: "mono w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none", placeholder: "0,00" }))

        ),

        /*#__PURE__*/React.createElement("button", { onClick: () => { const b = Number(String(budgetForm.einnahmeBetrag).replace(',', '.')); if (!budgetForm.einnahmeQuelle.trim() || !(b > 0) || isNaN(b)) return; if (editingBudget && editingBudget.list === 'einnahmen') { persistBudgetEinnahmen(budgetEinnahmen.map(y => y.id === editingBudget.id ? Object.assign({}, y, { quelle: budgetForm.einnahmeQuelle.trim(), betrag: b }) : y)); setEditingBudget(null); } else { persistBudgetEinnahmen(budgetEinnahmen.concat([{ id: 'be' + Date.now(), quelle: budgetForm.einnahmeQuelle.trim(), betrag: b }])); } setBudgetForm(Object.assign({}, budgetForm, { einnahmeQuelle: '', einnahmeBetrag: '' })); }, className: "w-full text-sm font-medium bg-emerald-600 text-white rounded-lg py-2" }, "Einnahme hinzufuegen")

      ),

      /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4 space-y-3" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white" }, "Fixkosten erfassen (monatlich)"),

        /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2" },

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Kategorie"),

            /*#__PURE__*/React.createElement("select", { value: budgetForm.kostenKategorie, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { kostenKategorie: e.target.value })), className: "w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none" },

              /*#__PURE__*/React.createElement("option", { value: "miete" }, "Miete / Kredit"), /*#__PURE__*/React.createElement("option", { value: "strom" }, "Strom"), /*#__PURE__*/React.createElement("option", { value: "heizung" }, "Heizung"), /*#__PURE__*/React.createElement("option", { value: "wasser" }, "Wasser/Abwasser"), /*#__PURE__*/React.createElement("option", { value: "hausrat" }, "Hausrat"), /*#__PURE__*/React.createElement("option", { value: "auto_haftpflicht" }, "Auto / Haftpflicht"), /*#__PURE__*/React.createElement("option", { value: "versicherung_sonst" }, "Sonstige Versicherung"), /*#__PURE__*/React.createElement("option", { value: "abo" }, "Abos / Vertraege"), /*#__PURE__*/React.createElement("option", { value: "internet" }, "Internet / Telefon"), /*#__PURE__*/React.createElement("option", { value: "handy" }, "Handy / Mobilfunk"), /*#__PURE__*/React.createElement("option", { value: "streaming" }, "Streaming / Abos"), /*#__PURE__*/React.createElement("option", { value: "kranken" }, "Krankenversicherung"), /*#__PURE__*/React.createElement("option", { value: "steuer" }, "Steuern / Abgaben"), /*#__PURE__*/React.createElement("option", { value: "sonstige" }, "Sonstige"))),

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Betrag / Monat (€)"),

            /*#__PURE__*/React.createElement("input", { type: "number", step: "0.01", value: budgetForm.kostenBetrag, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { kostenBetrag: e.target.value })), className: "mono w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none", placeholder: "0,00" }))),

        /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2" },

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Zahlung"), /*#__PURE__*/React.createElement("select", { value: budgetForm.kostenIntervall, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { kostenIntervall: e.target.value })), className: "w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none" }, ["monatlich","quartalsweise","halbjaehrlich","jaehrlich"].map(v => /*#__PURE__*/React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.slice(1))))),

          /*#__PURE__*/React.createElement("div", null)

        ),

        /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Bemerkung"), /*#__PURE__*/React.createElement("input", { value: budgetForm.kostenBemerkung, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { kostenBemerkung: e.target.value })), className: "w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none", placeholder: "z.B. Anbieter, Vertragsnummer" })),

        /*#__PURE__*/React.createElement("button", { onClick: () => { const b = Number(String(budgetForm.kostenBetrag).replace(',', '.')); if (!(b > 0) || isNaN(b)) return; if (editingBudget && editingBudget.list === 'fixkosten') { persistBudgetFixkosten(budgetFixkosten.map(y => y.id === editingBudget.id ? Object.assign({}, y, { kategorie: budgetForm.kostenKategorie, betrag: b, intervall: budgetForm.kostenIntervall || 'monatlich', bemerkung: budgetForm.kostenBemerkung.trim() }) : y)); setEditingBudget(null); } else { persistBudgetFixkosten(budgetFixkosten.concat([{ id: 'bf' + Date.now(), kategorie: budgetForm.kostenKategorie, betrag: b, intervall: budgetForm.kostenIntervall || 'monatlich', bemerkung: budgetForm.kostenBemerkung.trim() }])); } setBudgetForm(Object.assign({}, budgetForm, { kostenBetrag: '', kostenBemerkung: '' })); }, className: "w-full text-sm font-medium bg-rose-600 text-white rounded-lg py-2" }, "Fixkosten hinzufuegen")

      ),

      /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4 space-y-3" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white" }, "Ausgaben erfassen (monatlich)"),

        /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2" },

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Zweck"),

            /*#__PURE__*/React.createElement("input", { value: budgetForm.ausgabeZweck, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { ausgabeZweck: e.target.value })), className: "w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none", placeholder: "z.B. Lebensmittel, Hobby" })),

          /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Betrag / Monat (EUR)"),

            /*#__PURE__*/React.createElement("input", { type: "number", step: "0.01", value: budgetForm.ausgabeBetrag, onChange: e => setBudgetForm(Object.assign({}, budgetForm, { ausgabeBetrag: e.target.value })), className: "mono w-full text-sm border border-slate-600 dark:border-slate-600 rounded-lg px-3 py-3 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 outline-none", placeholder: "0,00" }))

        ),

        /*#__PURE__*/React.createElement("button", { onClick: () => { const b = Number(String(budgetForm.ausgabeBetrag).replace(',', '.')); if (!budgetForm.ausgabeZweck.trim() || !(b > 0) || isNaN(b)) return; if (editingBudget && editingBudget.list === 'ausgaben') { persistBudgetAusgaben(budgetAusgaben.map(y => y.id === editingBudget.id ? Object.assign({}, y, { zweck: budgetForm.ausgabeZweck.trim(), betrag: b }) : y)); setEditingBudget(null); } else { persistBudgetAusgaben(budgetAusgaben.concat([{ id: 'ba' + Date.now(), zweck: budgetForm.ausgabeZweck.trim(), betrag: b }])); } setBudgetForm(Object.assign({}, budgetForm, { ausgabeZweck: '', ausgabeBetrag: '' })); }, className: "w-full text-sm font-medium bg-rose-600 text-white rounded-lg py-2" }, "Ausgabe hinzufuegen")

      ),

      /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white mb-2" }, "Erfasste Ausgaben"),

        budgetAusgaben.length === 0 ? /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-100" }, "Noch keine Ausgaben erfasst.")

          : /*#__PURE__*/React.createElement("div", { className: "space-y-1" }, budgetAusgaben.map(x => /*#__PURE__*/React.createElement("div", { key: x.id, className: "flex items-center justify-between py-2.5 border-b border-slate-600 last:border-0" },

            /*#__PURE__*/React.createElement("span", { className: "text-sm text-slate-100 dark:text-white" }, x.zweck),

            /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" }, /*#__PURE__*/React.createElement("span", { className: "mono text-sm text-slate-100 dark:text-white" }, formatEUR(x.betrag)),

              /*#__PURE__*/React.createElement("button", { onClick: () => { setEditingBudget({ list: 'ausgaben', id: x.id }); setBudgetForm(Object.assign({}, budgetForm, { ausgabeZweck: x.zweck, ausgabeBetrag: String(x.betrag) })); }, className: "text-slate-100 p-1" }, /*#__PURE__*/React.createElement(PencilIcon, { size: 14 })),

              /*#__PURE__*/React.createElement("button", { onClick: () => persistBudgetAusgaben(budgetAusgaben.filter(y => y.id !== x.id)), className: "text-slate-100 p-1" }, /*#__PURE__*/React.createElement(XIcon, { size: 12 }))))))),

      /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white mb-2" }, "Erfasste Einnahmen"),

        budgetEinnahmen.length === 0 ? /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-100" }, "Noch keine Einnahmen erfasst.")

          : /*#__PURE__*/React.createElement("div", { className: "space-y-1" }, budgetEinnahmen.map(x => /*#__PURE__*/React.createElement("div", { key: x.id, className: "flex items-center justify-between py-2.5 border-b border-slate-600 last:border-0 last:border-0" },

            /*#__PURE__*/React.createElement("span", { className: "text-sm text-slate-100 dark:text-white" }, x.quelle),

            /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" }, /*#__PURE__*/React.createElement("span", { className: "mono text-sm text-slate-100 dark:text-white" }, formatEUR(x.betrag)),

              /*#__PURE__*/React.createElement("button", { onClick: () => { setEditingBudget({ list: 'einnahmen', id: x.id }); setBudgetForm(Object.assign({}, budgetForm, { einnahmeQuelle: x.quelle, einnahmeBetrag: String(x.betrag) })); }, className: "text-slate-100 p-1" }, /*#__PURE__*/React.createElement(PencilIcon, { size: 14 })),

              /*#__PURE__*/React.createElement("button", { onClick: () => persistBudgetEinnahmen(budgetEinnahmen.filter(y => y.id !== x.id)), className: "text-slate-100 p-1" }, /*#__PURE__*/React.createElement(XIcon, { size: 12 }))))))),

      /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white mb-2" }, "Erfasste Fixkosten"),

        budgetFixkosten.length === 0 ? /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-100" }, "Noch keine Fixkosten erfasst.")

          : /*#__PURE__*/React.createElement("div", { className: "space-y-3" }, (() => { const monatlich = budgetFixkosten.filter(x => (x.intervall || 'monatlich') === 'monatlich'); const periodisch = budgetFixkosten.filter(x => (x.intervall || 'monatlich') !== 'monatlich'); const row = (x) => /*#__PURE__*/React.createElement("div", { key: x.id, className: "flex items-center justify-between py-2.5 border-b border-slate-600 last:border-0" }, /*#__PURE__*/React.createElement("div", { className: "flex flex-col" }, /*#__PURE__*/React.createElement("span", { className: "text-sm text-slate-100 dark:text-white" }, katLabel[x.kategorie] || x.kategorie), /*#__PURE__*/React.createElement("span", { className: "text-[11px] text-slate-100 dark:text-slate-300" }, (x.intervall || 'monatlich').charAt(0).toUpperCase() + (x.intervall || 'monatlich').slice(1))), x.bemerkung ? /*#__PURE__*/React.createElement("span", { className: "text-[11px] text-slate-400 italic" }, x.bemerkung) : null, /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-2" }, /*#__PURE__*/React.createElement("div", { className: "text-right" }, /*#__PURE__*/React.createElement("span", { className: "mono text-sm text-slate-100 dark:text-white" }, formatEUR(x.betrag)), ((x.intervall || 'monatlich') === 'monatlich' ? null : /*#__PURE__*/React.createElement("div", { className: "text-[11px] text-slate-100 dark:text-slate-300" }, formatEUR(toMonthly(x.betrag, x.intervall)) + " / Monat"))), /*#__PURE__*/React.createElement("button", { onClick: () => { setEditingBudget({ list: 'fixkosten', id: x.id }); setBudgetForm(Object.assign({}, budgetForm, { kostenKategorie: x.kategorie, kostenBetrag: String(x.betrag), kostenIntervall: x.intervall || 'monatlich', kostenBemerkung: x.bemerkung || '' })); }, className: "text-slate-100 p-1" }, /*#__PURE__*/React.createElement(PencilIcon, { size: 14 })), /*#__PURE__*/React.createElement("button", { onClick: () => persistBudgetFixkosten(budgetFixkosten.filter(y => y.id !== x.id)), className: "text-slate-100 p-1" }, /*#__PURE__*/React.createElement(XIcon, { size: 12 })))); const reportBtn = /*#__PURE__*/React.createElement("button", { onClick: function() { var title = 'Budget (Fixkosten)'; var rows = budgetFixkosten.map(function(x,i){ return '<tr><td>'+(i+1)+'</td><td>'+(katLabel[x.kategorie] || x.kategorie)+'</td><td class=\"num\">'+formatEUR(x.betrag)+'</td><td class=\"num\">'+formatEUR(toMonthly(x.betrag, x.intervall || 'monatlich'))+' / Monat</td></tr>'; }).join(''); var html = '<!DOCTYPE html><html lang=\"de\"><head><meta charset=\"utf-8\"><title>'+title+'</title><style>*{box-sizing:border-box}body{font-family:sans-serif;margin:24px;color:#0f172a}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #cbd5e1;padding:6px 8px;font-size:12px;text-align:left}th{background:#f1f5f9}td.num{text-align:right;font-variant-numeric:tabular-nums}@media print{body{margin:0}}</style></head><body><h1>'+title+'</h1><p>Erstellt: '+new Date().toLocaleDateString('de-DE')+'</p><table><thead><tr><th>#</th><th>Kategorie</th><th class=\"num\">Betrag</th><th class=\"num\">/ Monat</th></tr></thead><tbody>'+rows+'</tbody></table><script>setTimeout(function(){window.print();},300);</script></body></html>'; var w = window.open('','_blank'); if (w){ w.document.write(html); w.document.close(); } else { alert('Bitte Pop-ups erlauben.'); } }, className: "w-full text-sm font-medium bg-slate-700 dark:bg-slate-800 text-white border border-slate-600 rounded-lg py-2" }, "Bericht drucken"); return [monatlich.length ? /*#__PURE__*/React.createElement("div", { key: "m" }, /*#__PURE__*/React.createElement("p", { className: "text-xs font-medium text-slate-100 mb-1" }, "Monatlich"), /*#__PURE__*/React.createElement("div", { className: "space-y-1" }, monatlich.map(row))) : null, periodisch.length ? /*#__PURE__*/React.createElement("div", { key: "p" }, /*#__PURE__*/React.createElement("p", { className: "text-xs font-medium text-slate-100 mb-1" }, "Jährlich / periodisch"), /*#__PURE__*/React.createElement("div", { className: "space-y-1" }, periodisch.map(row))) : null, reportBtn]; })())), /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-4 mt-3" }, /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white mb-2" }, "Export"), /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /*#__PURE__*/React.createElement("button", { onClick: function(){ if(window.openBudgetCsv) window.openBudgetCsv(); }, className: "w-full text-sm font-medium bg-slate-700 dark:bg-slate-800 text-white rounded-lg py-2" }, "CSV"), /*#__PURE__*/React.createElement("button", { onClick: function(){ if(window.openBudgetExcel) window.openBudgetExcel(); }, className: "w-full text-sm font-medium bg-slate-700 dark:bg-slate-800 text-white rounded-lg py-2" }, "Excel"), /*#__PURE__*/React.createElement("button", { onClick: function(){ if(window.openBudgetPdf) window.openBudgetPdf(); }, className: "w-full text-sm font-medium bg-slate-700 dark:bg-slate-800 text-white rounded-lg py-2" }, "PDF / Bericht"), /*#__PURE__*/React.createElement("button", { onClick: function(){ if(window.openBudgetEmail) window.openBudgetEmail(); }, className: "w-full text-sm font-medium bg-slate-700 dark:bg-slate-800 text-white rounded-lg py-2" }, "E-Mail"))), 

    );

  }

  // --- Uebersicht: kompakte Zusammenfassung ALLER Tabs (Closure ueber State) ---

  function UebersichtTab() {

    const openE = entries.filter(e => e.status === 'offen' || e.status === 'bearbeitung');

    const offen = openE.reduce((s, e) => s + (Number(e.betrag) || 0), 0);

    const bezahlt = entries.reduce((s, e) => s + paymentSum(e.zahlungen || []), 0);

    const bE = budgetEinnahmen.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

    const bF = budgetFixkosten.reduce((s, x) => s + toMonthly(x.betrag, x.intervall), 0);

    const saldo = bE - bF;

    const nkSum = nebenkosten.reduce((s, n) => s + toMonthly(n.betrag, n.intervall), 0);

    const sparSum = abos.reduce((s, a) => s + toMonthly(a.betrag, a.intervall || 'monatlich'), 0);

    const row = (titel, wert, color, view) => /*#__PURE__*/React.createElement("button", {

      onClick: () => setView(view),

      className: "w-full flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 px-4 py-3 text-left hover:border-slate-600 transition-colors"

    },

      /*#__PURE__*/React.createElement("div", { className: "min-w-0" },

        /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium text-slate-100 dark:text-white" }, titel),

        /*#__PURE__*/React.createElement("p", { className: "text-[11px] text-slate-100 mt-0.5" }, wert)

      ),

      /*#__PURE__*/React.createElement("span", { className: "text-slate-100 text-xs shrink-0 ml-2" }, "›")

    );

    return /*#__PURE__*/React.createElement("div", { className: "px-4 mt-3 space-y-3" },

      /*#__PURE__*/React.createElement("p", { className: "text-xs text-slate-100" }, "Kompakte Zusammenfassung aller Bereiche – Antippen öffnet den Tab."),

      row("Forderungen & Rechnungen", entries.length + " Einträge · " + openE.length + " offen · " + formatEUR(offen) + " offen", "text-rose-600", 'liste'),

      row("Budget (monatlich)", "Ein " + formatEUR(bE) + " / Aus " + formatEUR(bF) + " / Saldo " + formatEUR(saldo), saldo >= 0 ? "text-emerald-600" : "text-rose-600", 'budget'),

      row("Nebenkosten", nebenkosten.length + " Abrechnungen · " + formatEUR(nkSum) + " / Monat", "text-sky-600", 'nebenkosten'),

      row("Sparen (Abos/Vers.)", abos.length + " Einträge · " + formatEUR(sparSum) + "/Mon. Ausgaben", "text-amber-600", 'sparen'),

      row("Einkaufsvergleich", einkauf.length + " Produkte im Vergleich", "text-violet-600", 'kassenbon'),

      row("Vergleichsangebote", vergleichLog.length + " gesendete Angebote", "text-indigo-600", 'vergleich'),

      row("SEPA-Aufträge", sepaList.length + " Aufträge erstellt", "text-teal-600", 'sepa'),

      /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-2 gap-2 pt-1" },

        /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-3 text-center" },

          /*#__PURE__*/React.createElement("p", { className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide" }, "Bezahlt gesamt"),

          /*#__PURE__*/React.createElement("p", { className: "mono text-base font-semibold text-emerald-600 mt-0.5" }, formatEUR(bezahlt))

        ),

        /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-3 text-center" },

          /*#__PURE__*/React.createElement("p", { className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide" }, "Saldo/Mon."),

          /*#__PURE__*/React.createElement("p", { className: `mono text-base font-semibold mt-0.5 ${saldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}` }, formatEUR(saldo))

        )

      )

    );

  }

  const persistSepa = useCallback(next => {

    setSepaList(next);

    try {

      localStorage.setItem(SEPA_KEY(currentUser.username), JSON.stringify(next));

    } catch {}

  }, [currentUser]);

  function exportBackup() {

    // unified with saveSyncFile: full-data backup via collectAllData()

    try {

      const data = collectAllData();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = SYNC_FNAME;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);

    } catch (e) {/* Export fehlgeschlagen */}

  }

  function downloadAndroidApp() {

    const b64 = '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Rm9yZGVydW5nZW5BcHAvYXBwL3NyYy9tYWluL3Jlcy9taXBtYXAteHhoZHBpL1VUBQADJzxBanV4CwABBAAAAAAEAAAAAFBLAQIeAxQAAAAIAMh63FztEUllmR4AANweAAA9ABgAAAAAAAAAAACkgZOVAABGb3JkZXJ1bmdlbkFwcC9hcHAvc3JjL21haW4vcmVzL21pcG1hcC14eGhkcGkvaWNfbGF1bmNoZXIucG5nVVQFAAMnPEFqdXgLAAEEAAAAAAQAAAAAUEsBAh4DCgAAAAAAyHrcXAAAAAAAAAAAAAAAAC8AGAAAAAAAAAAQAO1Bo7QAAEZvcmRlcnVuZ2VuQXBwL2FwcC9zcmMvbWFpbi9yZXMvbWlwbWFwLXh4eGhkcGkvVVQFAAMnPEFqdXgLAAEEAAAAAAQAAAAAUEsBAh4DFAAAAAgAyHrcXPl15deOKgAAfysAAD4AGAAAAAAAAAAAAKSBDLUAAEZvcmRlcnVuZ2VuQXBwL2FwcC9zcmMvbWFpbi9yZXMvbWlwbWFwLXh4eGhkcGkvaWNfbGF1bmNoZXIucG5nVVQFAAMnPEFqdXgLAAEEAAAAAAQAAAAAUEsBAh4DCgAAAAAAyHrcXAAAAAAAAAAAAAAAAC0AGAAAAAAAAAAQAO1BEuAAAEZvcmRlcnVuZ2VuQXBwL2FwcC9zcmMvbWFpbi9yZXMvbWlwbWFwLXhoZHBpL1VUBQADJzxBanV4CwABBAAAAAAEAAAAAFBLAQIeAwoAAAAAAMh63Fxb/GOKwhMAAMITAAA8ABgAAAAAAAAAAACkgXngAABGb3JkZXJ1bmdlbkFwcC9hcHAvc3JjL21haW4vcmVzL21pcG1hcC14aGRwaS9pY19sYXVuY2hlci5wbmdVVAUAAyc8QWp1eAsAAQQAAAAABAAAAABQSwECHgMKAAAAAADIetxcAAAAAAAAAAAAAAAALAAYAAAAAAAAABAA7UGx9AAARm9yZGVydW5nZW5BcHAvYXBwL3NyYy9tYWluL3Jlcy9taXBtYXAtbWRwaS9VVAUAAyc8QWp1eAsAAQQAAAAABAAAAABQSwECHgMKAAAAAADIetxc0NBotakIAACpCAAAOwAYAAAAAAAAAAAApIEX9QAARm9yZGVydW5nZW5BcHAvYXBwL3NyYy9tYWluL3Jlcy9taXBtYXAtbWRwaS9pY19sYXVuY2hlci5wbmdVVAUAAyc8QWp1eAsAAQQAAAAABAAAAABQSwECHgMUAAAACAD9Gddc0k8CPt8BAAA/BAAALwAYAAAAAAABAAAApIE1/gAARm9yZGVydW5nZW5BcHAvYXBwL3NyYy9tYWluL0FuZHJvaWRNYW5pZmVzdC54bWxVVAUAA236OWp1eAsAAQQAAAAABAAAAABQSwECHgMUAAAACAAPGtdcdhRkaGIAAAByAAAAIAAYAAAAAAABAAAApIF9AAEARm9yZGVydW5nZW5BcHAvZ3JhZGxlLnByb3BlcnRpZXNVVAUAA436OWp1eAsAAQQAAAAABAAAAABQSwECHgMUAAAACAAaGtdc088ECd8DAADKBgAAGwAYAAAAAAABAAAApIE5AQEARm9yZGVydW5nZW5BcHAvQU5MRUlUVU5HLm1kVVQFAAOk+jlqdXgLAAEEAAAAAAQAAAAAUEsBAh4DFAAAAAgACxrXXHA3YgmvAAAASwEAAB4AGAAAAAAAAQAAAKSBbQUBAEZvcmRlcnVuZ2VuQXBwL3NldHRpbmdzLmdyYWRsZVVUBQADhvo5anV4CwABBAAAAAAEAAAAAFBLBQYAAAAAHwAfAIoNAAB0BgEAAAA=';

    try {

      const byteChars = atob(b64.replace(/\s/g, ''));

      const bytes = new Uint8Array(byteChars.length);

      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

      const blob = new Blob([bytes], {

        type: 'application/zip'

      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = 'ForderungenApp-Android.zip';

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);

    } catch (e) {

      alert('Download fehlgeschlagen. Bitte versuche es erneut.');

    }

  }

  function openNewForm() {

    setForm(emptyForm);

    setEditingId(null);

    setPaymentDraft({

      datum: '',

      betrag: ''

    });

    setFormOpen(true);

  }

  function openEditForm(entry) {

    setForm({

      aktenzeichen: entry.aktenzeichen,

      glaeubiger: entry.glaeubiger,

      inkassounternehmen: entry.inkassounternehmen,

      betrag: entry.betrag,

      faelligkeit: entry.faelligkeit,

      status: entry.status,

      notizen: entry.notizen || '',

      dokumente: entry.dokumente || [],

      rate: entry.rate || '',

      rateAb: entry.rateAb || '',

      zahlungen: entry.zahlungen || [],

      zahlungswebseite: entry.zahlungswebseite || '',

      zahlungsart: entry.zahlungsart || '',

      ratenVereinbart: !!entry.ratenVereinbart,

      ratenAktualisiert: entry.ratenAktualisiert || ''

    });

    setEditingId(entry.id);

    setPaymentDraft({

      datum: '',

      betrag: ''

    });

    setFormOpen(true);

  }

  function closeForm() {

    setFormOpen(false);

    setEditingId(null);

    setForm(emptyForm);

    setPaymentDraft({

      datum: '',

      betrag: ''

    });

  }

  function addPayment() {

    if (!paymentDraft.betrag) return;

    setForm(f => ({

      ...f,

      zahlungen: [...(f.zahlungen || []), {

        id: uid(),

        datum: paymentDraft.datum,

        betrag: paymentDraft.betrag

      }].sort((a, b) => new Date(a.datum || 0) - new Date(b.datum || 0))

    }));

    setPaymentDraft({

      datum: '',

      betrag: ''

    });

  }

  function removePayment(id) {

    setForm(f => ({

      ...f,

      zahlungen: (f.zahlungen || []).filter(z => z.id !== id)

    }));

  }

  const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB pro Datei

  async function processFiles(fileList) {

    const files = Array.from(fileList || []);

    if (files.length === 0) return;

    const newDocs = [];

    const skipped = [];

    for (const file of files) {

      if (file.size > MAX_DOC_BYTES) {

        skipped.push(file.name);

        continue;

      }

      try {

        const dataUrl = await fileToDataUrl(file);

        newDocs.push({

          id: uid(),

          name: file.name,

          type: file.type,

          size: file.size,

          dataUrl

        });

      } catch (err) {/* Datei konnte nicht gelesen werden */}

    }

    setForm(f => ({

      ...f,

      dokumente: [...(f.dokumente || []), ...newDocs]

    }));

    if (skipped.length) alert(`Übersprungen (>${MAX_DOC_BYTES / 1024 / 1024} MB):\n` + skipped.join('\n'));

  }

  function handleFilesSelected(e) {

    const fileList = e.target.files;

    e.target.value = '';

    processFiles(fileList);

  }

  function handleDragOver(e) {

    e.preventDefault();

    e.stopPropagation();

    setDragOver(true);

  }

  function handleDragLeave(e) {

    e.preventDefault();

    e.stopPropagation();

    setDragOver(false);

  }

  function handleDrop(e) {

    e.preventDefault();

    e.stopPropagation();

    setDragOver(false);

    processFiles(e.dataTransfer.files);

  }

  function removeDocument(id) {

    setForm(f => ({

      ...f,

      dokumente: (f.dokumente || []).filter(d => d.id !== id)

    }));

  }

  // Hängt ein generiertes E-Mail-PDF an einen bestehenden Eintrag an (unter "Dokumente")

  function attachEmailDoc(enId, doc) {

    if (!enId || !doc) return;

    persist(entries.map(en => en.id === enId ? {

      ...en,

      dokumente: [...(en.dokumente || []), doc]

    } : en));

  }

  function handleSubmit(e) {

    e.preventDefault();

    if (!form.glaeubiger.trim()) return;

    if (editingId) {

      persist(entries.map(en => en.id === editingId ? {

        ...en,

        ...form

      } : en));

    } else {

      var baseEntry = {

        id: uid(),

        ...form,

        erstelltAm: new Date().toISOString()

      };

      var repeats = [];

      if (form.intervall && form.intervall !== 'monatlich') {

        var repeatCount = form.intervall === 'vierteljährlich' ? 6 : form.intervall === 'halbjährlich' ? 6 : 12;

        var d2 = new Date(form.faelligkeit || new Date().toISOString().slice(0,10));

        for (var x = 1; x <= repeatCount; x++) {

          d2 = new Date(d2.getFullYear(), d2.getMonth() + 1, d2.getDate());

          repeats.push(Object.assign({}, baseEntry, { id: uid(), faelligkeit: d2.toISOString().slice(0,10) }));

        }

      }

      persist([baseEntry, ...repeats, ...entries]);

    }

    // Bankdaten für künftige Einträge dieser Partei merken

    const partyData = {

      iban: form.iban,

      bic: form.bic,

      kontoinhaber: form.kontoinhaber,

      verwendungszweck: form.verwendungszweck,

      zahlungswebseite: form.zahlungswebseite,

      zahlungsart: form.zahlungsart,

      ratenVereinbart: !!form.ratenVereinbart,

      ratenAktualisiert: form.ratenVereinbart ? (form.ratenAktualisiert || new Date().toISOString().slice(0, 10)) : ''

    };

    if (form.glaeubiger.trim()) savePartyData(currentUser.username, form.glaeubiger, partyData);

    if (form.inkassounternehmen.trim()) savePartyData(currentUser.username, form.inkassounternehmen, partyData);

    closeForm();

  }

  function handleDelete(id) {

    persist(entries.filter(en => en.id !== id));

    setConfirmDeleteId(null);

  }

  function applyParty(name) {

    const p = findParty(currentUser.username, name);

    if (p) {

      setForm(f => ({

        ...f,

        iban: p.iban || '',

        bic: p.bic || '',

        kontoinhaber: p.kontoinhaber || '',

        verwendungszweck: p.verwendungszweck || '',

        zahlungswebseite: p.zahlungswebseite || f.zahlungswebseite,

        zahlungsart: p.zahlungsart || ''

      }));

    }

    setPartySuggestions([]);

  }

  function onPartyInput(value) {

    const matches = Object.values(loadParties(currentUser.username)).filter(p => p.name && p.name.toLowerCase().includes(value.trim().toLowerCase()) && value.trim()).slice(0, 5);

    setPartySuggestions(matches);

  }

  searchRef.current = buildSearchIndex(entries);

  searchRef.current = buildSearchIndex(entries);

  const filtered = entries.filter((en, i) => {

    const q = search.trim().toLowerCase();

    const ids = queryIndex(searchRef.current, q);

    if (ids && !ids.has(i)) return false;

    const matchesStatus = statusFilter === 'alle' || en.status === statusFilter;

    const matchesTyp = typeFilter === 'alle' || (en.typ || 'forderung') === typeFilter;

    const matchesSearch = !q || (en.aktenzeichen || '').toLowerCase().includes(q) || (en.glaeubiger || '').toLowerCase().includes(q) || (en.inkassounternehmen || '').toLowerCase().includes(q);

    return matchesStatus && matchesTyp && matchesSearch;

  }).sort((a, b) => (a.glaeubiger || '').localeCompare(a.glaeubiger || '', 'de', {

    sensitivity: 'base'

  }));

  const totalGesamt = entries.filter(en => en.status === 'offen' || en.status === 'bearbeitung').reduce((sum, en) => sum + (parseFloat(en.betrag) || 0), 0);

  const totalOffen = entries.filter(en => en.status === 'offen' || en.status === 'bearbeitung').reduce((sum, en) => sum + Math.max((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen), 0), 0);

  const countOffen = entries.filter(en => en.status === 'offen' || en.status === 'bearbeitung').length;

  const CHART_COLORS = ['#f59e0b', '#0ea5e9', '#f43f5e', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

  const openChartItems = entries.filter(en => en.status === 'offen' || en.status === 'bearbeitung').map(en => ({

    id: en.id,

    name: en.glaeubiger || 'Ohne Gläubiger',

    value: Math.max((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen), 0)

  })).filter(i => i.value > 0).sort((a, b) => b.value - a.value);

  const chartTotal = openChartItems.reduce((s, i) => s + i.value, 0);

  function conicGradient(items) {

    if (!items.length || chartTotal <= 0) return '#e2e8f0';

    let acc = 0;

    const stops = items.map((i, idx) => {

      const start = acc;

      const pct = i.value / chartTotal * 100;

      acc += pct;

      return `${CHART_COLORS[idx % CHART_COLORS.length]} ${start}% ${acc}%`;

    });

    return `conic-gradient(${stops.join(', ')})`;

  }

  const statusCounts = {

    offen: 0,

    bearbeitung: 0,

    bestritten: 0,

    bezahlt: 0

  };

  entries.forEach(en => {

    if (statusCounts[en.status] !== undefined) statusCounts[en.status]++;

  });

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  const totalGezahltAll = entries.reduce((s, en) => s + paymentSum(en.zahlungen), 0);

  const todayStr = new Date().toISOString().slice(0, 10);

  const openTotal = chartTotal;

  const overdueTotal = entries.filter(en => (en.status === 'offen' || en.status === 'bearbeitung') && en.faelligkeit && en.faelligkeit < todayStr).reduce((s, en) => s + Math.max((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen), 0), 0);

  const upcomingDue = entries.filter(en => (en.status === 'offen' || en.status === 'bearbeitung') && en.faelligkeit).sort((a, b) => new Date(a.faelligkeit) - new Date(b.faelligkeit)).slice(0, 5);

  const recentPayments = entries.flatMap(en => (en.zahlungen || []).map(z => ({

    ...z,

    glaeubiger: en.glaeubiger

  }))).sort((a, b) => new Date(b.datum || 0) - new Date(a.datum || 0)).slice(0, 5);



  // Kategorie-Summen für das Dashboard (getrennt nach Art)

  const restOffen = en => Math.max(0, (parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen));

  const active = en => en.status === 'offen' || en.status === 'bearbeitung';

  const byTyp = typ => entries.filter(en => (en.typ || 'forderung') === typ && active(en));

  const sumBetrag = list => list.reduce((s, en) => s + (parseFloat(en.betrag) || 0), 0);

  const sumRest = list => list.reduce((s, en) => s + restOffen(en), 0);

  const ford = byTyp('forderung'),

    rech = byTyp('rechnung'),

    schuld = byTyp('privatschuld');

  const dashCards = [{

    key: 'forderung',

    label: 'Offene Forderungen',

    count: ford.length,

    betrag: sumRest(ford),

    ...TYP_CONFIG.forderung

  }, {

    key: 'rechnung',

    label: 'Offene Rechnungen',

    count: rech.length,

    betrag: sumRest(rech),

    ...TYP_CONFIG.rechnung

  }, {

    key: 'privatschuld',

    label: 'Private Schulden',

    count: schuld.length,

    betrag: sumRest(schuld),

    ...TYP_CONFIG.privatschuld

  }];

    var SYNC_FNAME = 'forderungen-sync.json';

  function gatherBudgetRows(){

    var rows = [];

    for (var i = 0; i < localStorage.length; i++) {

      var k = localStorage.key(i);

      if (k && k.indexOf('forderungen-budget-') === 0) {

        try {

          var arr = JSON.parse(localStorage.getItem(k) || '[]');

          if (Array.isArray(arr)) {

            var typ = k.replace('forderungen-budget-','');

            for (var j = 0; j < arr.length; j++) {

              var it = arr[j] || {};

              rows.push({

                typ: typ,

                quelle: it.quelle || it.shop || it.kategorie || '',

                kategorie: it.kategorie || '',

                betrag: it.betrag != null ? it.betrag : '',

                datum: it.datum || '',

                bemerkung: it.bemerkung || ''

              });

            }

          }

        } catch(e){}

      }

    }

    return rows;

  }

  function escHtml(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function rowsToCsv(rows){

    var header = ['Typ','Quelle/Kategorie','Kategorie','Betrag','Datum','Bemerkung'];

    var lines = [header.join(';')];

    for (var i=0;i<rows.length;i++){

      var r = rows[i];

      lines.push([r.typ, r.quelle, r.kategorie, r.betrag, r.datum, r.bemerkung].map(function(v){ return '"' + String(v == null ? '' : v).replace(/"/g,'""') + '"'; }).join(';'));

    }

    return lines.join('\r\n');

  }

  function downloadBlob(content, filename, mime){

    try {

      var blob = new Blob([content], {type: mime});

      var a = document.createElement('a');

      a.href = URL.createObjectURL(blob);

      a.download = filename;

      document.body.appendChild(a);

      a.click();

      setTimeout(function(){ try { URL.revokeObjectURL(a.href); } catch(e){} }, 1000);

    } catch(e){ alert('Export fehlgeschlagen: ' + e.message); }

  }

  function buildSimplePdf(lines){

    function pesc(s){ s = String(s == null ? '' : s); s = s.split('\\').join('\\\\'); s = s.split('(').join('\\('); s = s.split(')').join('\\)'); return s; }

    var content = '';

    var y = 800;

    for (var i=0;i<lines.length && y>40;i++){

      content += 'BT /F1 10 Tf 50 ' + y + ' Td (' + pesc(lines[i] || ' ') + ') Tj ET\n';

      y -= 16;

    }

    var objects = [];

    objects.push('<< /Type /Catalog /Pages 2 0 R >>');

    objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');

    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>');

    objects.push('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream');

    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>');

    var pdf = '%PDF-1.4\n';

    var offsets = [];

    for (var o=0;o<objects.length;o++){

      offsets.push(pdf.length);

      pdf += (o+1) + ' 0 obj\n' + objects[o] + '\nendobj\n';

    }

    var xrefPos = pdf.length;

    pdf += 'xref\n0 ' + (objects.length+1) + '\n';

    pdf += '0000000000 65535 f \n';

    for (var x=0;x<offsets.length;x++){

      var off = String(offsets[x]);

      while(off.length<10) off='0'+off;

      pdf += off + ' 00000 n \n';

    }

    pdf += 'trailer\n<< /Size ' + (objects.length+1) + ' /Root 1 0 R >>\n';

    pdf += 'startxref\n' + xrefPos + '\n%%EOF';

    return pdf;

  }

  function saveViaBridge(filename, content){

    try {

      var mime = 'text/plain;charset=utf-8';

      if (/\.csv$/i.test(filename)) mime = 'text/csv;charset=utf-8';

      else if (/\.xls$/i.test(filename)) mime = 'application/vnd.ms-excel';

      else if (/\.pdf$/i.test(filename)) mime = 'application/pdf';

      var blob = new Blob([content], { type: mime });

      var url = URL.createObjectURL(blob);

      var a = document.createElement('a');

      a.href = url; a.download = filename; a.style.display = 'none';

      document.body.appendChild(a); a.click();

      setTimeout(function(){ try { document.body.removeChild(a); URL.revokeObjectURL(url); } catch(e){} }, 1000);

      alert(filename + ' wurde zum Download angeboten.');

    } catch(e){ alert('Export fehlgeschlagen: ' + e.message); }

    // Zusaetzlich an lokalen Server senden, damit die Datei unter D:\Forderungsapp\downloads\ landen

    try {

      if (typeof fetch === 'function' && location.protocol !== 'file:') {

        fetch('/export/' + encodeURIComponent(filename), { method: 'POST', body: content, mode: 'cors' });

      }

    } catch(e){}

  }

  window.openBudgetCsv = function(){

    try {

      var rows = gatherBudgetRows();

      saveViaBridge('forderungen-budget.csv', rowsToCsv(rows));

    } catch(e){ alert('CSV-Export fehlgeschlagen: ' + e.message); }

  };

  window.openBudgetExcel = function(){

    try {

      var rows = gatherBudgetRows();

      var html = '<table border="1">';

      html += '<tr><th>Typ</th><th>Quelle/Kategorie</th><th>Kategorie</th><th>Betrag</th><th>Datum</th><th>Bemerkung</th></tr>';

      for (var i=0;i<rows.length;i++){ var r=rows[i];

        html += '<tr><td>'+escHtml(r.typ)+'</td><td>'+escHtml(r.quelle)+'</td><td>'+escHtml(r.kategorie)+'</td><td>'+escHtml(r.betrag)+'</td><td>'+escHtml(r.datum)+'</td><td>'+escHtml(r.bemerkung)+'</td></tr>';

      }

      html += '</table>';

      saveViaBridge('forderungen-budget.xls', html);

    } catch(e){ alert('Excel-Export fehlgeschlagen: ' + e.message); }

  };

  window.openBudgetPdf = function(){

    try {

      var rows = gatherBudgetRows();

      var lines = [];

      lines.push('ForderungenApp - Budget-Bericht');

      lines.push('Erstellt: ' + new Date().toLocaleString('de-DE'));

      lines.push('');

      lines.push('Typ | Quelle/Kategorie | Kategorie | Betrag | Datum | Bemerkung');

      var total = 0;

      for (var i=0;i<rows.length;i++){ var r=rows[i];

        lines.push([r.typ, r.quelle, r.kategorie, r.betrag, r.datum, r.bemerkung].join(' | '));

        var b = parseFloat(r.betrag); if(!isNaN(b)) total += b;

      }

      lines.push('------------------------------------------------------------');

      lines.push('Summe Betraege: ' + total.toFixed(2));

      // Build minimal valid PDF (PDF-1.4, single page, Helvetica 11)

      var esc = function(t){ return String(t).replace(/\\\\/g,'\\\\\\\\').replace(/\/(?=[^0-9])/g,'\\/').replace(/\(/g,'\\(').replace(/\)/g,'\\)'); };

      var content = '';

      var y = 800;

      for (var i=0;i<lines.length;i++){

        var t = (lines[i] || '').toString();

        if (t.length > 95) t = t.substring(0,95);

        content += 'BT /F1 11 Tf 1 0 0 1 50 ' + y + ' Tm (' + esc(t) + ') Tj ET\n';

        y -= 16;

        if (y < 50) break;

      }

      var stream = content;

      var objs = [];

      objs.push('<< /Type /Catalog /Pages 2 0 R >>');

      objs.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');

      objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>');

      objs.push('<< /Length ' + stream.length + ' >>\nstream\n' + stream + 'endstream');

      objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

      var pdf = '%PDF-1.4\n';

      var offsets = [];

      for (var i=0;i<objs.length;i++){

        offsets.push(pdf.length);

        pdf += (i+1) + ' 0 obj\n' + objs[i] + '\nendobj\n';

      }

      pdf += 'xref\n0 ' + (objs.length+1) + '\n';

      pdf += '0000000000 65535 f \n';

      for (var i=0;i<offsets.length;i++){

        var o = offsets[i].toString();

        while (o.length < 10) o = '0' + o;

        pdf += o + ' 00000 n \n';

      }

      pdf += 'trailer\n<< /Size ' + (objs.length+1) + ' /Root 1 0 R >>\nstartxref\n' + pdf.length + '\n%%EOF';

      saveViaBridge('forderungen-budget.pdf', pdf);

    } catch(e){ alert('PDF-Export fehlgeschlagen: ' + e.message); }

  };

  window.openBudgetEmail = function(){

    try {

      var rows = gatherBudgetRows();

      var csv = rowsToCsv(rows);

      var subject = 'ForderungenApp Budget-Export';

      var body = 'Anhang: Budget-Export (CSV)\n\n' + csv;

      window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    } catch(e){ alert('E-Mail-Export fehlgeschlagen: ' + e.message); }

  };



  window.importSyncContent = function(source){

    try {

      var content = '';

      if (typeof source === 'string') {

        content = source;

      } else if (source && typeof source.readAsText === 'function') {

        var reader = new FileReader();

        reader.onload = function(){

          applySyncContent(reader.result);

        };

        reader.readAsText(source);

        return;

      } else if (source && source.constructor && source.constructor.name === 'File') {

        var r = new FileReader();

        r.onload = function(){ applySyncContent(r.result); };

        r.readAsText(source);

        return;

      }

      if (!content) { alert('Keine Sync-Daten.'); return; }

      applySyncContent(content);

    } catch (e) { alert('Sync-Import fehlgeschlagen: ' + e.message); }

  }

  var _syncInput = null;

  function triggerSyncImport(){

    try {

      console.log('[SYNC] triggerSyncImport called');

      if (typeof AndroidBridge !== 'undefined' && AndroidBridge && typeof AndroidBridge.pickSyncFile === 'function') {

        console.log('[SYNC] using AndroidBridge.pickSyncFile');

        AndroidBridge.pickSyncFile();

        return;

      }

      console.log('[SYNC] falling back to file input');

      if (!_syncInput) {

        _syncInput = document.createElement('input');

        _syncInput.type = 'file';

        _syncInput.accept = 'application/json,.json';

        _syncInput.style.cssText = 'position:absolute;opacity:0;height:0;width:0;pointer-events:none;';

        _syncInput.addEventListener('change', function(){

          console.log('[SYNC] file input changed, files=', _syncInput.files ? _syncInput.files.length : 0);

          if (_syncInput.files && _syncInput.files[0]) importSyncContent(_syncInput.files[0]);

        });

        document.body.appendChild(_syncInput);

      }

      _syncInput.value = '';

      _syncInput.style.pointerEvents = 'auto';

      _syncInput.click();

      console.log('[SYNC] file input clicked');

      setTimeout(function(){ try { _syncInput.style.pointerEvents = 'none'; } catch(e) {} }, 300);

    } catch (e) { console.error('[SYNC] triggerSyncImport failed:', e); alert('Sync-Import fehlgeschlagen: ' + e.message); }

  }

  window.__onSyncFilePicked = function(content){

    try {

      if (!content || content.length === 0) { alert('Keine Sync-Datei ausgewählt.'); return; }

      console.log('[SYNC] __onSyncFilePicked called, content length=', content.length);

      applySyncContent(content);

    } catch (e) { console.error('[SYNC] __onSyncFilePicked failed:', e); alert('Sync-Datei ungueltig: ' + e.message); }

  };

  window.applySyncContent = function(content){

    try {

      console.log('[SYNC] applySyncContent called');

      var data = JSON.parse(content);

      var seen = {};

      Object.keys(data).forEach(function(k){

        if (k === '_meta') return;

        var lk = k.toLowerCase();

        if (seen[lk]) {

          console.log('[SYNC] skip duplicate case key:', k);

          return;

        }

        seen[lk] = true;

        try { localStorage.setItem(k, data[k]); } catch(e2) {}

      });

      console.log('[SYNC] import ok, keys written=', Object.keys(seen).length);

      alert('Sync-Import erfolgreich. App wird neu geladen...');

      setTimeout(function(){ location.reload(); }, 800);

    } catch (e) { console.error('[SYNC] applySyncContent failed:', e); alert('Sync-Datei ungueltig: ' + e.message); }

  }

  function SyncBar(){

    if (document.getElementById('sync-bar')) return;

    var bar = document.createElement('div');

    bar.id = 'sync-bar';

    bar.style.cssText = 'position:relative;top:0;margin:8px 16px;display:flex;gap:8px;z-index:40;';

    var b1 = document.createElement('button');

    b1.textContent = '\u2601 Sync exportieren';

    b1.style.cssText = 'flex:1;padding:8px 12px;background:#475569;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;';

    b1.onclick = function(){ window.writeSyncFile(collectAllData()); };

    var b2 = document.createElement('button');

    b2.textContent = '\u2388 Sync importieren';

    b2.style.cssText = 'flex:1;padding:8px 12px;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;';

    b2.onclick = function(){ triggerSyncImport(); };

    bar.appendChild(b1); bar.appendChild(b2);

    var hint = document.createElement('div');
    hint.textContent = 'Syncthing-Ordner: /sdcard/' + (typeof SYNC_DIR !== 'undefined' ? SYNC_DIR : 'Android/data/com.forderungen.app/files/forderungen-sync');
    hint.style.cssText = 'flex-basis:100%;margin-top:6px;font-size:11px;color:#94a3b8;text-align:center;line-height:1.3;';
    bar.appendChild(hint);

    document.body.insertBefore(bar, document.body.firstChild);

  }

  setInterval(function(){ try { SyncBar(); } catch(e){} }, 1500);

var TAB_ORDER = ['dashboard','uebersicht','liste','sparen','nebenkosten','kassenbon','vergleich','sepa','budget'];

  var tabTouchX = null;

  var tabTouchY = null;

  function handleTabSwipe(dir){

    var ti = TAB_ORDER.indexOf(view); if (ti < 0) ti = 0;

    var ni = ti + (dir === 'left' ? 1 : -1);

    if (ni < 0) ni = 0; if (ni > TAB_ORDER.length - 1) ni = TAB_ORDER.length - 1;

    setView(TAB_ORDER[ni]);

  }

  return /*#__PURE__*/React.createElement("div", {

    className: `min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white pb-24 ${darkMode ? 'dark' : ''}`,

    onTouchStart: function(e){ try { tabTouchX = e.touches[0].clientX; tabTouchY = e.touches[0].clientY; } catch(_){} },

    onTouchEnd: function(e){ try { var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : 0; var endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : 0; if (tabTouchX !== null) { var dx = endX - tabTouchX; var dy = endY - (tabTouchY || 0); if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) handleTabSwipe(dx < 0 ? 'left' : 'right'); } } catch(_){} tabTouchX = null; tabTouchY = null; },

  }, /*#__PURE__*/React.createElement("header", {

    className: "bg-white text-slate-900 dark:bg-slate-900 dark:text-white px-5 pt-7 pb-6"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-center justify-between mb-1"

  }, /*#__PURE__*/React.createElement("p", {

    className: "mono text-xs tracking-widest text-slate-500 dark:text-slate-200 uppercase"

  }, "Finanzverwaltung"), /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-2"

  }, null, /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      setShowInfo(true);

      setInfoTab('faq');

    },

    className: "text-slate-200 p-1"

  }, /*#__PURE__*/React.createElement(InfoIcon, {

    size: 16

  })), onUserMgmt && /*#__PURE__*/React.createElement("button", {

    onClick: onUserMgmt,

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(UserIcon, {

    size: 16

  })), /*#__PURE__*/React.createElement("button", {

    onClick: onLogout,

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(LogOutIcon, {

    size: 16

  })))), /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-1.5 mb-3"

  }, /*#__PURE__*/React.createElement("h1", {

    className: "text-xl font-semibold tracking-tight"

  }, "Forderungs- & Rechnungsmanagement")), /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-2 mb-1"

  }, /*#__PURE__*/React.createElement("button", {

    onClick: () => document.getElementById('profibild-input').click(),

    className: "shrink-0 rounded-full overflow-hidden bg-white flex items-center justify-center",

    style: {

      width: 28,

      height: 28

    }

  }, profilePic ? /*#__PURE__*/React.createElement("img", {

    src: profilePic,

    alt: "Profil",

    className: "w-full h-full object-cover"

  }) : /*#__PURE__*/React.createElement(UserIcon, {

    size: 16,

    className: "text-white"

  })), /*#__PURE__*/React.createElement("input", {

    id: "profibild-input",

    type: "file",

    accept: "image/*",

    className: "hidden",

    onChange: e => {

      const f = e.target.files && e.target.files[0];

      if (!f) return;

      const r = new FileReader();

      r.onload = () => {

        const d = String(r.result);

        setProfilePic(d);

        saveProfilePic(currentUser.username, d);

      };

      r.readAsDataURL(f);

    }

  }), /*#__PURE__*/React.createElement("span", {

    className: "text-xs text-slate-100"

  }, currentUser.username, currentUser.isAdmin ? ' · Admin' : '')), lastSaved && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, "\u2713 Gespeichert \xB7 ", lastSaved.toLocaleTimeString('de-DE', {

    hour: '2-digit',

    minute: '2-digit'

  }), " Uhr \xB7 localStorage + IndexedDB"), /*#__PURE__*/React.createElement("div", {

    className: "mt-5 grid grid-cols-1 gap-2"

  }, dashCards.map(c => /*#__PURE__*/React.createElement("button", {

    key: c.key,

    onClick: () => {

      setTypeFilter(c.key);

      setStatusFilter('alle');

    },

    className: `flex items-center justify-between rounded-lg px-4 py-3 border text-left transition-colors ${c.bg} ${c.border}`

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: `text-xs font-medium ${c.color}`

  }, c.label), /*#__PURE__*/React.createElement("p", {

    className: "mono text-xl font-semibold text-white dark:text-white"

  }, formatEUR(c.betrag))), /*#__PURE__*/React.createElement("div", {

    className: "text-right"

  }, /*#__PURE__*/React.createElement("p", {

    className: "mono text-lg font-semibold text-slate-100 dark:text-white"

  }, c.count), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, "offen"))))), /*#__PURE__*/React.createElement("div", {

    className: "mt-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-500/30 rounded-lg px-4 py-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-amber-300 mb-1"

  }, "Noch zu zahlen (nach Zahlungen)"), /*#__PURE__*/React.createElement("p", {

    className: "mono text-2xl font-semibold text-amber-200"

  }, formatEUR(totalOffen)))), /*#__PURE__*/React.createElement("div", {

    className: "px-5 mt-4"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1"

  }, /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('dashboard'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Dashboard"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('budget'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'budget' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Budget"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('uebersicht'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'uebersicht' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Übersicht"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('liste'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'liste' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Forderungen"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('sparen'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'sparen' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Sparen"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('nebenkosten'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'nebenkosten' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Nebenkosten"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('kassenbon'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'kassenbon' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Kassenbon"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('vergleich'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'vergleich' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "Vergleich"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setView('sepa'),

    className: `flex-1 text-sm font-medium py-3 rounded-lg transition-colors ${view === 'sepa' ? 'bg-white text-white shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-100 dark:text-white'}`

  }, "SEPA"))), view === 'uebersicht' && UebersichtTab(), view === 'dashboard' && /*#__PURE__*/React.createElement("div", {

    className: "px-4 mt-3 space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-3 gap-2"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3 text-center"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide"

  }, "Offen"), /*#__PURE__*/React.createElement("p", {

    className: "mono text-base font-semibold text-white mt-0.5 leading-tight"

  }, formatEUR(openTotal))), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3 text-center"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide"

  }, "Gezahlt"), /*#__PURE__*/React.createElement("p", {

    className: "mono text-base font-semibold text-emerald-600 mt-0.5 leading-tight"

  }, formatEUR(totalGezahltAll))), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3 text-center"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide"

  }, "\xDCberf\xE4llig"), /*#__PURE__*/React.createElement("p", {

    className: `mono text-base font-semibold mt-0.5 leading-tight ${overdueTotal > 0 ? 'text-rose-600' : 'text-slate-100'}`

  }, overdueTotal > 0 ? formatEUR(overdueTotal) : '–'))),

  (() => {

    const bE = budgetEinnahmen.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

    const bF = budgetFixkosten.reduce((s, x) => s + toMonthly(x.betrag, x.intervall), 0);

    const bS = bE - bF;

    const bc = (label, val, color) => /*#__PURE__*/React.createElement("div", { className: "bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-600 dark:border-slate-600 p-3 text-center" },

      /*#__PURE__*/React.createElement("p", { className: "text-[10px] font-medium text-slate-100 uppercase tracking-wide" }, label),

      /*#__PURE__*/React.createElement("p", { className: `mono text-base font-semibold mt-0.5 leading-tight ${color}` }, formatEUR(val)));

    return /*#__PURE__*/React.createElement("div", { className: "grid grid-cols-3 gap-2" },

      bc("Einnahmen/Mon.", bE, "text-emerald-600"),

      bc("Fixkosten/Mon.", bF, "text-rose-600"),

      bc("Saldo/Mon.", bS, bS >= 0 ? "text-emerald-600" : "text-rose-600"));

  })(),

  (() => {

    var v = 0;

    try {

      var bE = budgetEinnahmen.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

      var bA = budgetAusgaben.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

      var bF = budgetFixkosten.reduce((s, x) => s + toMonthly(x.betrag, x.intervall), 0);

      var bS2 = abos.reduce((s, a) => s + toMonthly(a.betrag || 0, a.intervall || 'monatlich'), 0);

      v = bE - bA - bF - bS2;

    } catch (e) {}

    if (v >= 0) return null;

    return /*#__PURE__*/React.createElement("div", { className: "bg-rose-900/40 border border-rose-500 rounded-xl px-4 py-2 text-rose-100" }, /*#__PURE__*/React.createElement("p", { className: "text-sm font-medium" }, "Budget-Alarm: Verfuegbar negativ"), /*#__PURE__*/React.createElement("p", { className: "text-xs mt-1" }, "Verfuegbar: " + formatEUR(v)));

  })(),

  (() => {

    const bE = budgetEinnahmen.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

    const bA = budgetAusgaben.reduce((s, x) => s + (Number(x.betrag) || 0), 0);

    const bF = budgetFixkosten.reduce((s, x) => s + toMonthly(x.betrag, x.intervall), 0);

    const bS2 = abos.reduce((s, a) => s + toMonthly(a.betrag, a.intervall || 'monatlich'), 0);

    const segs = [

      { label: 'Einnahmen', val: bE, color: '#10b981' },

      { label: 'Ausgaben', val: bA, color: '#f43f5e' },

      { label: 'Fixkosten', val: bF, color: '#f59e0b' },

      { label: 'Sparen', val: bS2, color: '#8b5cf6' }

    ];

    const total = segs.reduce((s, x) => s + x.val, 0) || 1;

    let acc = 0;

    const stops = segs.map(x => { const pct = x.val / total * 100; const s0 = acc; acc += pct; return x.color + ' ' + s0 + '% ' + acc + '%'; }).join(', ');

    const grad = (total > 0 && segs.some(x => x.val > 0)) ? 'conic-gradient(' + stops + ')' : '#475569';

    return /*#__PURE__*/React.createElement("div", { className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4" },

      /*#__PURE__*/React.createElement("p", { className: "text-xs font-medium text-slate-100 mb-2" }, "Budget-Verteilung (Anteil am Gesamt)"),

      /*#__PURE__*/React.createElement("div", { className: "flex items-center gap-3" },

        /*#__PURE__*/React.createElement("div", { className: "relative shrink-0", style: { width: 96, height: 96, borderRadius: '9999px', background: grad } },

          /*#__PURE__*/React.createElement("div", { className: "absolute inset-3 bg-slate-700 rounded-full flex flex-col items-center justify-center" },

            /*#__PURE__*/React.createElement("span", { className: "text-[9px] text-slate-100" }, "Verfuegbar"),

            /*#__PURE__*/React.createElement("span", { className: "mono text-[11px] font-semibold text-white text-center leading-tight" }, formatEUR(bE - bA - bF - bS2)))),

        /*#__PURE__*/React.createElement("div", { className: "flex-1 space-y-1 min-w-0" }, segs.map((x, idx) => /*#__PURE__*/React.createElement("div", { key: idx, className: "flex items-center gap-1.5 text-[11px]" },

          /*#__PURE__*/React.createElement("span", { className: "w-2 h-2 rounded-full shrink-0", style: { background: x.color } }),

          /*#__PURE__*/React.createElement("span", { className: "text-slate-100 flex-1 truncate" }, x.label),

          /*#__PURE__*/React.createElement("span", { className: "mono text-slate-100 shrink-0" }, Math.round(x.val / total * 100) + "%"))))));

  })(),



  /*#__PURE__*/React.createElement(DashboardCashflowChart, { entries: entries, einkauf: einkauf, budgetEinnahmen: budgetEinnahmen, budgetFixkosten: budgetFixkosten, budgetAusgaben: budgetAusgaben }),



  openChartItems.length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-2"

  }, "Verteilung offener Forderungen"), /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "relative shrink-0",

    style: {

      width: 84,

      height: 84,

      borderRadius: '9999px',

      background: conicGradient(openChartItems)

    }

  }, /*#__PURE__*/React.createElement("div", {

    className: "absolute inset-2.5 bg-white rounded-full flex flex-col items-center justify-center px-1"

  }, /*#__PURE__*/React.createElement("span", {

    className: "text-[9px] text-slate-100"

  }, "offen"), /*#__PURE__*/React.createElement("span", {

    className: "mono text-[11px] font-semibold text-white text-center leading-tight"

  }, formatEUR(chartTotal)))), /*#__PURE__*/React.createElement("div", {

    className: "flex-1 space-y-1 min-w-0"

  }, openChartItems.map((item, idx) => /*#__PURE__*/React.createElement("div", {

    key: item.id,

    className: "flex items-center gap-1.5 text-[11px]"

  }, /*#__PURE__*/React.createElement("span", {

    className: "w-2 h-2 rounded-full shrink-0",

    style: {

      background: CHART_COLORS[idx % CHART_COLORS.length]

    }

  }), /*#__PURE__*/React.createElement("span", {

    className: "text-slate-100 truncate flex-1"

  }, item.name), /*#__PURE__*/React.createElement("span", {

    className: "mono text-slate-100 shrink-0"

  }, Math.round(item.value / chartTotal * 100), "%")))))), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-2"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[11px] font-medium text-slate-100 mb-2"

  }, "Status"), /*#__PURE__*/React.createElement("div", {

    className: "space-y-1.5"

  }, Object.entries(STATUS_CONFIG).map(([key, cfg]) => /*#__PURE__*/React.createElement("div", {

    key: key,

    className: "flex items-center gap-1.5"

  }, /*#__PURE__*/React.createElement("span", {

    className: "text-[10px] text-slate-100 w-16 shrink-0 truncate"

  }, cfg.label), /*#__PURE__*/React.createElement("div", {

    className: "flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden"

  }, /*#__PURE__*/React.createElement("div", {

    className: `h-full ${cfg.dot}`,

    style: {

      width: `${statusCounts[key] / maxStatusCount * 100}%`

    }

  })), /*#__PURE__*/React.createElement("span", {

    className: "mono text-[10px] text-slate-100 w-4 text-right shrink-0"

  }, statusCounts[key]))))), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[11px] font-medium text-slate-100 mb-2"

  }, "Zahlstatus"), /*#__PURE__*/React.createElement("div", {

    className: "space-y-1.5"

  }, [{

    key: 'rate',

    label: 'Rate offen',

    color: 'text-amber-600',

    bg: 'bg-amber-400'

  }, {

    key: 'beglichen',

    label: 'Beglichen',

    color: 'text-emerald-600',

    bg: 'bg-emerald-400'

  }, {

    key: 'verzug',

    label: 'Verzug',

    color: 'text-rose-600',

    bg: 'bg-rose-400'

  }].map(s => {

    const n = entries.filter(en => zahlstatus(en) === s.key).length;

    return /*#__PURE__*/React.createElement("div", {

      key: s.key,

      className: "flex items-center justify-between gap-1.5"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center gap-1.5 min-w-0"

    }, /*#__PURE__*/React.createElement("span", {

      className: `w-2 h-2 rounded-full shrink-0 ${s.bg}`

    }), /*#__PURE__*/React.createElement("span", {

      className: `text-[11px] font-medium ${s.color} truncate`

    }, s.label)), /*#__PURE__*/React.createElement("span", {

      className: `mono text-[11px] font-semibold ${s.color} shrink-0`

    }, n));

  })))), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-2"

  }, upcomingDue.length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[11px] font-medium text-slate-100 mb-2"

  }, "N\xE4chste F\xE4lligkeiten"), /*#__PURE__*/React.createElement("div", {

    className: "space-y-1.5"

  }, upcomingDue.slice(0, 4).map(en => {

    const overdue = en.faelligkeit < todayStr;

    return /*#__PURE__*/React.createElement("div", {

      key: en.id,

      className: "flex items-center justify-between text-[11px] gap-1.5"

    }, /*#__PURE__*/React.createElement("div", {

      className: "min-w-0"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-slate-100 truncate leading-tight"

    }, en.glaeubiger), /*#__PURE__*/React.createElement("p", {

      className: `text-[10px] ${overdue ? 'text-rose-500' : 'text-slate-100'}`

    }, overdue ? 'überfällig' : formatDate(en.faelligkeit))), /*#__PURE__*/React.createElement("span", {

      className: "mono text-slate-100 shrink-0"

    }, formatEUR(Math.max((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen), 0))));

  }))), recentPayments.length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-[11px] font-medium text-slate-100 mb-2"

  }, "Letzte Zahlungen"), /*#__PURE__*/React.createElement("div", {

    className: "space-y-1.5"

  }, recentPayments.slice(0, 4).map(z => /*#__PURE__*/React.createElement("div", {

    key: z.id,

    className: "flex items-center justify-between text-[11px] gap-1.5"

  }, /*#__PURE__*/React.createElement("div", {

    className: "min-w-0"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-slate-100 truncate leading-tight"

  }, z.glaeubiger), /*#__PURE__*/React.createElement("p", {

    className: "text-[10px] text-slate-100"

  }, formatDate(z.datum))), /*#__PURE__*/React.createElement("span", {

    className: "mono text-emerald-600 shrink-0"

  }, "+", formatEUR(z.betrag)))))))), view === 'liste' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {

    className: "px-5 mt-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-2 mb-2"

  }, /*#__PURE__*/React.createElement(SearchIcon, {

    size: 16,

    className: "text-slate-100 shrink-0"

  }), /*#__PURE__*/React.createElement("input", {

    type: "text",

    value: search,

    onChange: e => setSearch(e.target.value),

    placeholder: "Suche nach Aktenzeichen, Gl\xE4ubiger\u2026",

    className: "w-full text-sm bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none"

  })), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-1.5 overflow-x-auto pb-1 -mb-1"

  }, ['alle', 'offen', 'bearbeitung', 'bestritten', 'bezahlt'].map(s => /*#__PURE__*/React.createElement("button", {

    key: s,

    onClick: () => setStatusFilter(s),

    className: `shrink-0 text-xs font-medium px-3 py-2.5 rounded-full border transition-colors ${statusFilter === s ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-200 border-slate-600 font-medium'}`

  }, s === 'alle' ? 'Alle' : STATUS_CONFIG[s].label))), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-1.5 overflow-x-auto pb-1 -mb-1 mt-1.5"

  }, ['alle', 'forderung', 'rechnung', 'privatschuld'].map(t => /*#__PURE__*/React.createElement("button", {

    key: t,

    onClick: () => setTypeFilter(t),

    className: `shrink-0 text-xs font-medium px-3 py-2.5 rounded-full border transition-colors ${typeFilter === t ? `${TYP_CONFIG[t === 'alle' ? 'forderung' : t].bg} ${TYP_CONFIG[t === 'alle' ? 'forderung' : t].color} ${TYP_CONFIG[t === 'alle' ? 'forderung' : t].border}` : 'bg-slate-800 text-slate-200 border-slate-600 font-medium'}`

  }, t === 'alle' ? 'Alle Arten' : TYP_CONFIG[t].label)))), /*#__PURE__*/React.createElement("button", {

    onClick: () => window.writeSyncFile(collectAllData()),

    className: "w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-100 bg-slate-700 border border-slate-500 rounded-lg py-2"

  }, /*#__PURE__*/React.createElement(DownloadIcon, {

    size: 13

  }), " Datensicherung speichern (.json)"), /*#__PURE__*/React.createElement("button", {

    onClick: downloadAndroidApp,

    className: "w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-slate-700 dark:bg-slate-700 rounded-lg py-2.5"

  }, /*#__PURE__*/React.createElement(DownloadIcon, {

    size: 13

  }), " Android-App herunterladen (.zip)")), /*#__PURE__*/React.createElement("main", {

    className: "px-5 mt-4 space-y-3"

  }, showReminder && countOffen > 0 && /*#__PURE__*/React.createElement("div", {

    className: "bg-amber-800/40 border border-amber-500 rounded-xl px-4 py-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-start justify-between gap-2"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-start gap-2"

  }, /*#__PURE__*/React.createElement(ClockIcon, {

    size: 16,

    className: "text-amber-300 shrink-0 mt-0.5"

  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-amber-200"

  }, "Monatliche Erinnerung"), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-amber-100 mt-0.5"

  }, countOffen, " offene Forderung", countOffen === 1 ? '' : 'en', ", noch zu zahlen: ", /*#__PURE__*/React.createElement("span", {

    className: "mono font-medium"

  }, formatEUR(totalOffen))))), /*#__PURE__*/React.createElement("button", {

    onClick: () => setShowReminder(false),

    className: "text-amber-500 p-1 shrink-0"

  }, /*#__PURE__*/React.createElement(XIcon, {

    size: 14

  })))), filtered.length === 0 && entries.length === 0 && /*#__PURE__*/React.createElement("div", {

    className: "text-center py-14 px-4"

  }, /*#__PURE__*/React.createElement(FileIcon, {

    size: 28,

    className: "mx-auto text-slate-200 mb-3"

  }), /*#__PURE__*/React.createElement("p", {

    className: "text-slate-200 text-sm"

  }, "Noch keine Forderungen erfasst."), /*#__PURE__*/React.createElement("p", {

    className: "text-slate-300 text-xs mt-1"

  }, "Tippe unten auf \u201ENeue Forderung\", um zu starten.")), filtered.length === 0 && entries.length > 0 && /*#__PURE__*/React.createElement("p", {

    className: "text-sm text-slate-300 text-center py-10"

  }, "Keine Treffer f\xFCr diese Filter."), filtered.map(en => {

    const cfg = STATUS_CONFIG[en.status] || STATUS_CONFIG.offen;

    const StatusIcon = cfg.Icon;

    const isExpanded = expandedId === en.id;

    return /*#__PURE__*/React.createElement("div", {

      key: en.id,

      className: `bg-white dark:bg-slate-800 rounded-xl border ${cfg.border} overflow-hidden`

    }, /*#__PURE__*/React.createElement(SwipeRow, {

      actions: [{

        icon: '✓',

        label: 'Bezahlt',

        cls: 'bg-emerald-600',

        onClick: () => {

          if (confirm('Forderung als bezahlt markieren?')) persist(entries.map(x => x.id === en.id ? {

            ...x,

            status: 'bezahlt'

          } : x));

        }

      }, {

        icon: '✎',

        label: 'Bearbeiten',

        cls: 'bg-slate-600',

        onClick: () => setEditingId(en.id)

      }, {

        icon: '⚖',

        label: 'Vergleich',

        cls: 'bg-indigo-600',

        onClick: () => {

          setVergleichForderungId(en.id);

          setView('vergleich');

        }

      }, {

        icon: '🗑',

        label: 'Löschen',

        color: '#e11d48',

        onClick: () => setConfirmDeleteId(en.id)

      }],

      open: swipeOpenId === en.id,

      onOpenChange: o => setSwipeOpenId(o ? en.id : null)

    }, /*#__PURE__*/React.createElement("button", {

      onClick: () => {

        setExpandedId(isExpanded ? null : en.id);

        setActiveTab('uebersicht');

      },

      className: "w-full text-left px-4 pt-3.5 pb-3"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center justify-between gap-2 mb-1.5"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center gap-1.5 min-w-0"

    }, /*#__PURE__*/React.createElement("span", {

      className: "mono text-xs text-slate-100 truncate"

    }, en.aktenzeichen || 'ohne Aktenzeichen'), /*#__PURE__*/React.createElement("span", {

      className: `shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-full ${TYP_CONFIG[en.typ || 'forderung'].bg} ${TYP_CONFIG[en.typ || 'forderung'].color} ${TYP_CONFIG[en.typ || 'forderung'].border}`

    }, TYP_CONFIG[en.typ || 'forderung'].label), en.dokumente && en.dokumente.length > 0 && /*#__PURE__*/React.createElement("span", {

      className: "flex items-center gap-0.5 text-xs text-slate-100 shrink-0"

    }, /*#__PURE__*/React.createElement(PaperclipIcon, {

      size: 11

    }), " ", en.dokumente.length)), /*#__PURE__*/React.createElement("span", {

      className: `flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`

    }, /*#__PURE__*/React.createElement(StatusIcon, {

      size: 11

    }), " ", cfg.label)), /*#__PURE__*/React.createElement("p", {

      className: "font-semibold text-white leading-snug"

    }, en.glaeubiger), /*#__PURE__*/React.createElement("p", {

      className: "text-sm text-slate-100"

    }, en.inkassounternehmen), /*#__PURE__*/React.createElement("div", {

      className: "mt-1.5"

    }, /*#__PURE__*/React.createElement("span", {

      className: `inline-block text-xs font-medium px-2 py-0.5 rounded-full ${TYP_CONFIG[en.typ || 'forderung'].bg} ${TYP_CONFIG[en.typ || 'forderung'].color} ${TYP_CONFIG[en.typ || 'forderung'].border}`

    }, TYP_CONFIG[en.typ || 'forderung'].label)), /*#__PURE__*/React.createElement("div", {

      className: "flex items-center justify-between mt-2"

    }, /*#__PURE__*/React.createElement("span", {

      className: "text-xs text-slate-100"

    }, "F\xE4llig: ", formatDate(en.faelligkeit)), /*#__PURE__*/React.createElement("div", {

      className: "text-right"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100"

    }, "Gesamt: ", /*#__PURE__*/React.createElement("span", {

      className: "mono"

    }, formatEUR(en.betrag))), /*#__PURE__*/React.createElement("p", {

      className: "mono font-semibold text-white"

    }, formatEUR(Math.max((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen), 0)), /*#__PURE__*/React.createElement("span", {

      className: "text-xs font-normal text-slate-100"

    }, " offen")))))), isExpanded && /*#__PURE__*/React.createElement("div", {

      className: "border-t border-slate-700 bg-slate-700"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex gap-1 px-4 pt-3 border-b border-slate-600"

    }, [{

      key: 'uebersicht',

      label: 'Übersicht'

    }, {

      key: 'zahlungen',

      label: `Zahlungen${en.zahlungen && en.zahlungen.length ? ` (${en.zahlungen.length})` : ''}`

    }, {

      key: 'dokumente',

      label: `Dokumente${en.dokumente && en.dokumente.length ? ` (${en.dokumente.length})` : ''}`

    }].map(tab => /*#__PURE__*/React.createElement("button", {

      key: tab.key,

      onClick: () => setActiveTab(tab.key),

      className: `text-xs font-medium px-3 py-2 border-b-2 -mb-px transition-colors ${activeTab === tab.key ? 'border-slate-900 text-white' : 'border-transparent text-slate-100'}`

    }, tab.label))), /*#__PURE__*/React.createElement("div", {

      className: "px-4 py-3"

    }, activeTab === 'uebersicht' && /*#__PURE__*/React.createElement("div", {

      className: "space-y-2"

    }, /*#__PURE__*/React.createElement("div", {

      className: "grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm"

    }, /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Art"), /*#__PURE__*/React.createElement("span", {

      className: `mono text-right font-medium ${TYP_CONFIG[en.typ || 'forderung'].color}`

    }, TYP_CONFIG[en.typ || 'forderung'].label), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Aktenzeichen"), /*#__PURE__*/React.createElement("span", {

      className: "mono text-slate-100 text-right"

    }, en.aktenzeichen || '—'), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Inkassounternehmen"), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100 text-right"

    }, en.inkassounternehmen || '—'), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Forderungsbetrag"), /*#__PURE__*/React.createElement("span", {

      className: "mono text-slate-100 text-right"

    }, formatEUR(en.betrag)), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "F\xE4llig am"), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100 text-right"

    }, formatDate(en.faelligkeit)), en.zahlungen && en.zahlungen.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Restbetrag"), /*#__PURE__*/React.createElement("span", {

      className: "mono text-slate-100 text-right"

    }, formatEUR((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen)))), en.rate && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Ratenzahlung"), /*#__PURE__*/React.createElement("span", {

      className: "mono text-slate-100 text-right"

    }, formatEUR(en.rate), en.rateAb ? ` ab ${formatDate(en.rateAb)}` : '')), (() => {

      const s = suggestRate(en);

      if (s.rest <= 0) return null;

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Empf. Monatsrate"), /*#__PURE__*/React.createElement("span", {

        className: `mono text-right ${s.ausreichend ? 'text-emerald-600' : 'text-amber-600'}`

      }, formatEUR(s.empfohlen), /*#__PURE__*/React.createElement("span", {

        className: "text-xs font-normal text-slate-100"

      }, " / ", s.monate, " Mon.")));

    })(), /*#__PURE__*/React.createElement("button", {

      type: "button",

      onClick: () => printTilgungsplan(en),

      className: "mt-3 w-full flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-slate-700 rounded-lg py-3 hover:bg-slate-600"

    }, /*#__PURE__*/React.createElement(PrinterIcon, {

      size: 14

    }), " Tilgungsplan drucken / als PDF"), /*#__PURE__*/React.createElement("div", {

      className: "mt-2 flex gap-2"

    }, /*#__PURE__*/React.createElement("button", {

      type: "button",

      onClick: () => {

        const s = suggestRate(en);

        const res = composeRateEmail(en, s.empfohlen, {

          saveDoc: true,

          cc: currentUser.email

        });

        openMail(mailProvider, res.subject, res.body, res.cc);

        if (res.doc) attachEmailDoc(en.id, res.doc);

      },

      className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg py-2 hover:bg-sky-50 dark:bg-sky-900"

    }, /*#__PURE__*/React.createElement(MailIcon, {

      size: 14

    }), " E-Mail (Vorschlag ", formatEUR(suggestRate(en).empfohlen), ")"), /*#__PURE__*/React.createElement("button", {

      type: "button",

      onClick: () => {

        const s = suggestRate(en);

        const v = prompt('Monatsrate für das Ratenzahlungsangebot (€):', String(Math.ceil(Math.max(0, (parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen)) / Math.max(1, s.monate) * 100) / 100));

        if (v !== null && parseFloat(v) > 0) {

          const res = composeRateEmail(en, parseFloat(v), {

            saveDoc: true,

            cc: currentUser.email

          });

          openMail(mailProvider, res.subject, res.body, res.cc);

          if (res.doc) attachEmailDoc(en.id, res.doc);

        }

      },

      className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-slate-600 rounded-lg py-3 hover:bg-slate-600"

    }, /*#__PURE__*/React.createElement(MailIcon, {

      size: 14

    }), " E-Mail (eigene Rate)")), /*#__PURE__*/React.createElement("div", {

      className: "mt-2 flex items-center gap-2"

    }, /*#__PURE__*/React.createElement("span", {

      className: "text-xs text-slate-100 shrink-0"

    }, "E-Mail-Programm:"), /*#__PURE__*/React.createElement("select", {

      value: mailProvider,

      onChange: e => setMailProviderPersist(e.target.value),

      className: "flex-1 text-xs border border-slate-600 rounded-lg px-2 py-1.5 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500"

    }, /*#__PURE__*/React.createElement("option", {

      value: "system"

    }, "System (Standard)"), /*#__PURE__*/React.createElement("option", {

      value: "gmail"

    }, "Gmail (im Browser)"), /*#__PURE__*/React.createElement("option", {

      value: "outlook"

    }, "Outlook (im Browser)"))), /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100 mt-2"

    }, "Das versendete Angebot wird automatisch als PDF unter \u201EDokumente\" gespeichert (mit Versanddatum)."), en.zahlungsart && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100"

    }, "Zahlungsart"), /*#__PURE__*/React.createElement("span", {

      className: "text-slate-100 text-right capitalize"

    }, {

      sepa: 'SEPA-Überweisung',

      lastschrift: 'Lastschrift',

      dauerauftrag: 'Dauerauftrag',

      online: 'Online-Zahlung',

      bar: 'Barzahlung',

      sonstige: 'Sonstige'

    }[en.zahlungsart] || en.zahlungsart))), en.zahlungswebseite && (() => {

      let safe = false;

      try {

        safe = /^https?:\/\//i.test(new URL(en.zahlungswebseite).href);

      } catch {

        safe = false;

      }

      return safe ? /*#__PURE__*/React.createElement("a", {

        href: en.zahlungswebseite,

        target: "_blank",

        rel: "noopener noreferrer",

        className: "flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg py-2.5"

      }, /*#__PURE__*/React.createElement(ExternalLinkIcon, {

        size: 14

      }), " Jetzt online bezahlen") : null;

    })(), en.notizen && /*#__PURE__*/React.createElement("p", {

      className: "text-sm text-slate-100 whitespace-pre-wrap pt-2 border-t border-slate-600"

    }, en.notizen)), activeTab === 'zahlungen' && /*#__PURE__*/React.createElement("div", {

      className: "mb-3 p-3 rounded-xl bg-sky-900 dark:bg-sky-900 border border-sky-200 dark:border-sky-800"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-xs font-semibold text-sky-800 dark:text-sky-300 mb-2"

    }, "Tilgungsplan aus Haushalt berechnen"), /*#__PURE__*/React.createElement("div", {

      className: "grid grid-cols-2 gap-2"

    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

      className: "text-xs text-slate-100"

    }, "Einnahmen / Monat (\u20AC)"), /*#__PURE__*/React.createElement("input", {

      type: "number",

      min: "0",

      value: planEinkommen,

      onChange: e => setPlanEinkommen(e.target.value),

      placeholder: "z.B. 1800",

      className: "w-full mt-0.5 text-sm rounded-lg border border-slate-600 px-2 py-1.5 outline-none"

    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

      className: "text-xs text-slate-100"

    }, "Ausgaben / Monat (\u20AC)"), /*#__PURE__*/React.createElement("input", {

      type: "number",

      min: "0",

      value: planAusgaben,

      onChange: e => setPlanAusgaben(e.target.value),

      placeholder: "z.B. 1500",

      className: "w-full mt-0.5 text-sm rounded-lg border border-slate-600 px-2 py-1.5 outline-none"

    }))), (() => {

      if (!planEinkommen && !planAusgaben) return null;

      const p = suggestPlan(en, planEinkommen, planAusgaben);

      if (p.rest <= 0) return /*#__PURE__*/React.createElement("p", {

        className: "text-xs text-slate-100 mt-2"

      }, "Forderung bereits beglichen.");

      return /*#__PURE__*/React.createElement("div", {

        className: "mt-2 space-y-1.5 text-sm"

      }, /*#__PURE__*/React.createElement("div", {

        className: "flex items-center justify-between"

      }, /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Vorgeschlagene Rate"), /*#__PURE__*/React.createElement("span", {

        className: "mono font-semibold text-sky-800"

      }, formatEUR(p.rate))), /*#__PURE__*/React.createElement("div", {

        className: "flex items-center justify-between"

      }, /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Laufzeit"), /*#__PURE__*/React.createElement("span", {

        className: "mono text-slate-100"

      }, p.monate, " Monate")), /*#__PURE__*/React.createElement("div", {

        className: "flex items-center justify-between"

      }, /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Verf\xFCgbar (nach Lebenshaltung)"), /*#__PURE__*/React.createElement("span", {

        className: "mono text-slate-100"

      }, formatEUR(p.verfuegbar))), p.verfuegbar < 0 ? /*#__PURE__*/React.createElement("div", {

        className: "bg-rose-600 text-white text-xs font-medium px-3 py-2 rounded-lg shadow mt-2"

      }, "Budget-Banner: Verfügbar ist negativ — Ausgaben zu hoch.") : null, /*#__PURE__*/React.createElement("div", {

        className: "flex flex-wrap gap-1 pt-1"

      }, /*#__PURE__*/React.createElement("span", {

        className: `text-xs font-medium px-2 py-0.5 rounded-full ${p.sozial ? 'bg-emerald-100 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:text-rose-300'}`

      }, p.sozial ? 'Sozial verträglich' : 'Wenig Spielraum'), /*#__PURE__*/React.createElement("span", {

        className: `text-xs font-medium px-2 py-0.5 rounded-full ${p.realistisch ? 'bg-emerald-100 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:text-amber-300'}`

      }, p.realistisch ? 'Für Gläubiger realistisch' : 'Sehr lange Laufzeit'), /*#__PURE__*/React.createElement("span", {

        className: "text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 dark:bg-slate-600 text-white"

      }, p.pctEinkommen.toFixed(1), " % des Einkommens")), /*#__PURE__*/React.createElement("div", {

        className: "flex gap-2 pt-1"

      }, /*#__PURE__*/React.createElement("button", {

        onClick: () => {

          const res = composeRateEmail(en, p.rate, {

            saveDoc: true,

            cc: currentUser.email

          });

          openMail(mailProvider, res.subject, res.body, res.cc);

          if (res.doc) attachEmailDoc(en.id, res.doc);

        },

        className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-sky-600 rounded-lg py-2"

      }, /*#__PURE__*/React.createElement(MailIcon, {

        size: 13

      }), " Als Ratenangebot senden")));

    })()), activeTab === 'zahlungen' && (en.zahlungen && en.zahlungen.length > 0 ? /*#__PURE__*/React.createElement("div", null, (() => {

      const am = buildAmortization(en);

      const total = parseFloat(en.betrag) || 0;

      const gezahlt = paymentSum(en.zahlungen);

      const rest = Math.max(0, total - gezahlt);

      const pct = total > 0 ? Math.min(100, gezahlt / total * 100) : 0;

      return /*#__PURE__*/React.createElement("div", {

        className: "mb-3"

      }, /*#__PURE__*/React.createElement("div", {

        className: "flex items-center justify-between text-xs mb-1"

      }, /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Tilgungsfortschritt"), /*#__PURE__*/React.createElement("span", {

        className: "mono text-slate-100"

      }, pct.toFixed(0), " %")), /*#__PURE__*/React.createElement("div", {

        className: "w-full h-2 rounded-full bg-slate-200 overflow-hidden"

      }, /*#__PURE__*/React.createElement("div", {

        className: "h-full rounded-full bg-emerald-50 dark:bg-emerald-900 transition-all",

        style: {

          width: pct + '%'

        }

      })), /*#__PURE__*/React.createElement("div", {

        className: "flex items-center justify-between text-xs mt-1"

      }, /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Gezahlt ", /*#__PURE__*/React.createElement("span", {

        className: "mono text-slate-100"

      }, formatEUR(gezahlt))), /*#__PURE__*/React.createElement("span", {

        className: "text-slate-100"

      }, "Rest ", /*#__PURE__*/React.createElement("span", {

        className: "mono text-slate-100"

      }, formatEUR(rest)))));

    })(), /*#__PURE__*/React.createElement("table", {

      className: "w-full text-sm border border-slate-600 rounded-lg overflow-hidden bg-slate-800 dark:bg-slate-800"

    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {

      className: "bg-slate-700 text-xs text-white"

    }, /*#__PURE__*/React.createElement("th", {

      className: "text-left font-medium px-3 py-1.5"

    }, "Datum"), /*#__PURE__*/React.createElement("th", {

      className: "text-right font-medium px-3 py-1.5"

    }, "Zahlung"), /*#__PURE__*/React.createElement("th", {

      className: "text-right font-medium px-3 py-1.5"

    }, "Rest"))), /*#__PURE__*/React.createElement("tbody", null, buildAmortization(en).map((row, i) => /*#__PURE__*/React.createElement("tr", {

      key: i,

      className: "border-t border-slate-700"

    }, /*#__PURE__*/React.createElement("td", {

      className: "px-3 py-1.5 text-slate-100"

    }, formatDate(row.datum)), /*#__PURE__*/React.createElement("td", {

      className: "px-3 py-1.5 text-right mono text-slate-100"

    }, formatEUR(row.betrag)), /*#__PURE__*/React.createElement("td", {

      className: "px-3 py-1.5 text-right mono text-slate-100"

    }, formatEUR(row.rest))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {

      className: "border-t border-slate-600 bg-slate-700"

    }, /*#__PURE__*/React.createElement("td", {

      className: "px-3 py-1.5 text-xs font-medium text-slate-100"

    }, "Gezahlt"), /*#__PURE__*/React.createElement("td", {

      className: "px-3 py-1.5 text-right mono font-semibold text-white"

    }, formatEUR(paymentSum(en.zahlungen))), /*#__PURE__*/React.createElement("td", {

      className: "px-3 py-1.5 text-right mono text-slate-100"

    }, formatEUR(Math.max(0, (parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen)))))))) : /*#__PURE__*/React.createElement("p", {

      className: "text-sm text-slate-300 text-center py-4"

    }, "Noch keine Zahlungen erfasst.")), activeTab === 'dokumente' && (en.dokumente && en.dokumente.length > 0 ? /*#__PURE__*/React.createElement("div", {

      className: "space-y-1.5"

    }, en.dokumente.map(doc => /*#__PURE__*/React.createElement("a", {

      key: doc.id,

      href: doc.dataUrl,

      download: doc.name,

      className: "flex items-center gap-2 text-sm bg-white dark:bg-slate-700 dark:text-white text-slate-900 border border-slate-600 rounded-lg px-3 py-2 placeholder:text-slate-500"

    }, doc.kind === 'email' ? /*#__PURE__*/React.createElement(MailIcon, {

      size: 14,

      className: "text-sky-500 shrink-0"

    }) : /*#__PURE__*/React.createElement(PaperclipIcon, {

      size: 14,

      className: "text-slate-100 shrink-0"

    }), /*#__PURE__*/React.createElement("span", {

      className: "truncate flex-1"

    }, doc.name), doc.gesendetAm && /*#__PURE__*/React.createElement("span", {

      className: "text-[10px] text-sky-600 shrink-0"

    }, "gesendet ", formatDate(doc.gesendetAm)), /*#__PURE__*/React.createElement("span", {

      className: "text-xs text-slate-100 shrink-0"

    }, formatFileSize(doc.size))))) : /*#__PURE__*/React.createElement("p", {

      className: "text-sm text-slate-300 text-center py-4"

    }, "Keine Dokumente hinterlegt.")), /*#__PURE__*/React.createElement("div", {

      className: "flex gap-2 mt-4"

    }, /*#__PURE__*/React.createElement("button", {

      onClick: () => openEditForm(en),

      className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-100 bg-slate-700 border border-slate-500 rounded-lg py-2"

    }, /*#__PURE__*/React.createElement(PencilIcon, {

      size: 14

    }), " Bearbeiten"), confirmDeleteId === en.id ? /*#__PURE__*/React.createElement("button", {

      onClick: () => handleDelete(en.id),

      className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-rose-600 rounded-lg py-2"

    }, "Wirklich l\xF6schen?") : /*#__PURE__*/React.createElement("button", {

      onClick: () => setConfirmDeleteId(en.id),

      className: "flex items-center justify-center gap-1.5 text-sm font-medium text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-800 border border-rose-300 rounded-lg py-2 px-3"

    }, /*#__PURE__*/React.createElement(TrashIcon, {

      size: 14

    }))))));

  }), saveError && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-rose-500 text-center pt-2"

  }, "Speichern fehlgeschlagen (lokaler Speicher nicht verfügbar)."), /*#__PURE__*/React.createElement("footer", {

    className: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-100 border-t border-slate-300 dark:border-slate-700 relative px-5 mt-6 mb-8 text-center"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, "Forderungs- und Rechnungsmanagement / Finanzplan \xB7 v", APP_VERSION)))), /*#__PURE__*/React.createElement("button", {

    onClick: openNewForm,

    className: "fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-full shadow-lg font-medium text-sm z-50"

  }, /*#__PURE__*/React.createElement(PlusIcon, {

    size: 18

  }), " Neuer Eintrag"), formOpen && /*#__PURE__*/React.createElement("div", {

    className: "fixed inset-0 z-50 flex items-end justify-center"

  }, /*#__PURE__*/React.createElement("div", {

    className: "absolute inset-0 bg-black bg-opacity-50",

    onClick: closeForm

  }), /*#__PURE__*/React.createElement("form", {

    onSubmit: handleSubmit,

    style: {

      maxHeight: '88vh'

    },

    className: "auth-card relative bg-white dark:bg-slate-900 dark:bg-slate-700 w-full max-w-md rounded-t-2xl px-5 pt-4 pb-6 overflow-y-auto text-white"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-center justify-between mb-4"

  }, /*#__PURE__*/React.createElement("h2", {

    className: "font-semibold text-lg"

  }, editingId ? 'Eintrag bearbeiten' : 'Neuer Eintrag'), /*#__PURE__*/React.createElement("button", {

    type: "button",

    onClick: closeForm,

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(XIcon, {

    size: 20

  }))), /*#__PURE__*/React.createElement("div", {

    className: "mb-3"

  }, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1.5 block"

  }, "Art des Eintrags"), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-3 gap-2"

  }, [{

    key: 'forderung',

    label: 'Forderung'

  }, {

    key: 'rechnung',

    label: 'Rechnung'

  }, {

    key: 'privatschuld',

    label: 'Private Schulden'

  }].map(t => /*#__PURE__*/React.createElement("button", {

    type: "button",

    key: t.key,

    onClick: () => setForm({

      ...form,

      typ: t.key

    }),

    className: `text-sm font-medium px-2 py-2 rounded-lg border text-center transition-colors ${form.typ === t.key ? `${TYP_CONFIG[t.key].bg} ${TYP_CONFIG[t.key].color} ${TYP_CONFIG[t.key].border}` : 'bg-slate-700 dark:bg-slate-800 text-white border-slate-600'}`

  }, t.label)))), /*#__PURE__*/React.createElement("div", {

    className: "space-y-3"

  }, form.typ === 'forderung' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Aktenzeichen"), /*#__PURE__*/React.createElement("input", {

    value: form.aktenzeichen,

    onChange: e => setForm({

      ...form,

      aktenzeichen: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "z. B. 123/45/6789"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, form.typ === 'privatschuld' ? 'Name des Schuldners *' : 'Gläubiger *'), /*#__PURE__*/React.createElement("input", {

    required: true,

    value: form.glaeubiger,

    onChange: e => {

      setForm({

        ...form,

        glaeubiger: e.target.value

      });

      onPartyInput(e.target.value);

    },

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: form.typ === 'privatschuld' ? 'Name des Schuldners' : 'Name des Gläubigers'

  }), partySuggestions.length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "mt-1 border border-slate-600 rounded-lg overflow-hidden bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500 shadow-sm"

  }, partySuggestions.map(p => /*#__PURE__*/React.createElement("button", {

    type: "button",

    key: p.name,

    onClick: () => {

      setForm(f => ({

        ...f,

        glaeubiger: p.name

      }));

      applyParty(p.name);

    },

    className: "w-full text-left px-3 py-2 text-sm hover:bg-slate-700 border-b border-slate-700 last:border-0 text-white"

  }, /*#__PURE__*/React.createElement("span", {

    className: "font-medium"

  }, p.name), p.iban && /*#__PURE__*/React.createElement("span", {

    className: "mono text-xs text-slate-100 ml-2"

  }, p.iban))))), form.typ === 'forderung' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Wiederholung"), /*#__PURE__*/React.createElement("select", {

    value: form.intervall || '',

    onChange: e => setForm({

      ...form,

      intervall: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white outline-none focus:border-slate-600"

  }, [["", "Keine"], ["monatlich", "Monatlich"], ["vierteljährlich", "Vierteljährlich"], ["halbjährlich", "Halbjährlich"], ["jährlich", "Jährlich"]].map(([val, label]) => /*#__PURE__*/React.createElement("option", {

    key: val,

    value: val

  }, label)))), form.typ === 'forderung' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Inkassounternehmen"), /*#__PURE__*/React.createElement("input", {

    value: form.inkassounternehmen,

    onChange: e => setForm({

      ...form,

      inkassounternehmen: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "Name des Inkassounternehmens"

  })), form.typ === 'forderung' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Zahlungswebseite (optional)"), /*#__PURE__*/React.createElement("input", {

    type: "url",

    value: form.zahlungswebseite,

    onChange: e => setForm({

      ...form,

      zahlungswebseite: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "https://www.inkasso-firma.de/zahlung"

  })), form.typ === 'forderung' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1.5 block"

  }, "Zahlungsart"), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-2"

  }, [{

    key: 'sepa',

    label: 'SEPA-Überweisung'

  }, {

    key: 'lastschrift',

    label: 'Lastschrift'

  }, {

    key: 'dauerauftrag',

    label: 'Dauerauftrag'

  }, {

    key: 'online',

    label: 'Online-Zahlung'

  }, {

    key: 'bar',

    label: 'Barzahlung'

  }, {

    key: 'sonstige',

    label: 'Sonstige'

  }].map(art => /*#__PURE__*/React.createElement("button", {

    type: "button",

    key: art.key,

    onClick: () => setForm({

      ...form,

      zahlungsart: form.zahlungsart === art.key ? '' : art.key

    }),

    className: `text-sm font-medium px-3 py-2 rounded-lg border text-left transition-colors ${form.zahlungsart === art.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-700 dark:bg-slate-800 text-white border-slate-600'}`

  }, art.label)))), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-3"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, form.typ === 'privatschuld' ? 'Gesamtschuld (€)' : 'Betrag (€)', form.typ === 'rechnung' ? ' – gefordert' : ''), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: form.betrag,

    onChange: e => setForm({

      ...form,

      betrag: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "0,00"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, form.typ === 'privatschuld' ? 'Fällig am (optional)' : 'Fällig am'), /*#__PURE__*/React.createElement("input", {

    type: "date",

    value: form.faelligkeit,

    onChange: e => setForm({

      ...form,

      faelligkeit: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }))), form.typ !== 'privatschuld' && /*#__PURE__*/React.createElement("div", {

    className: "border-t border-slate-700 pt-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-semibold text-slate-100 mb-2"

  }, "Bankdaten (f\xFCr k\xFCnftige Eintr\xE4ge gespeichert)"), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-3"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "IBAN"), /*#__PURE__*/React.createElement("input", {

    value: form.iban,

    onChange: e => setForm({

      ...form,

      iban: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "DE00 0000 0000 0000 0000 00"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "BIC"), /*#__PURE__*/React.createElement("input", {

    value: form.bic,

    onChange: e => setForm({

      ...form,

      bic: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "XXXXDEXX"

  }))), /*#__PURE__*/React.createElement("div", {

    className: "mt-3"

  }, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Kontoinhaber"), /*#__PURE__*/React.createElement("input", {

    value: form.kontoinhaber,

    onChange: e => setForm({

      ...form,

      kontoinhaber: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "Name des Kontoinhabers"

  })), form.typ === 'rechnung' && /*#__PURE__*/React.createElement("div", {

    className: "mt-3"

  }, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Verwendungszweck"), /*#__PURE__*/React.createElement("input", {

    value: form.verwendungszweck,

    onChange: e => setForm({

      ...form,

      verwendungszweck: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "z. B. Aktenzeichen / Kundennr."

  })), partySuggestions.length === 0 && (form.iban || form.bic || form.kontoinhaber) && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 mt-2"

  }, "Diese Daten werden beim Speichern f\xFCr \"", form.glaeubiger || form.inkassounternehmen || 'diese Partei', "\" gemerkt und k\xFCnftig automatisch vorgeschlagen.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1.5 block"

  }, form.typ === 'privatschuld' ? 'Geleistete Zahlungen (ziehen Restschuld ab)' : 'Geleistete Zahlungen'), (form.zahlungen || []).length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "border border-slate-600 rounded-lg overflow-hidden mb-2"

  }, /*#__PURE__*/React.createElement("table", {

    className: "w-full text-sm"

  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {

    className: "bg-slate-700 text-xs text-slate-100"

  }, /*#__PURE__*/React.createElement("th", {

    className: "text-left font-medium px-3 py-1.5"

  }, "Datum"), /*#__PURE__*/React.createElement("th", {

    className: "text-right font-medium px-3 py-1.5"

  }, "Betrag"), /*#__PURE__*/React.createElement("th", {

    className: "w-8"

  }))), /*#__PURE__*/React.createElement("tbody", null, form.zahlungen.map(z => /*#__PURE__*/React.createElement("tr", {

    key: z.id,

    className: "border-t border-slate-700"

  }, /*#__PURE__*/React.createElement("td", {

    className: "px-3 py-1.5 text-slate-100"

  }, formatDate(z.datum)), /*#__PURE__*/React.createElement("td", {

    className: "px-3 py-1.5 text-right mono text-slate-100"

  }, formatEUR(z.betrag)), /*#__PURE__*/React.createElement("td", {

    className: "px-1 py-1.5 text-center"

  }, /*#__PURE__*/React.createElement("button", {

    type: "button",

    onClick: () => removePayment(z.id),

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(XIcon, {

    size: 12

  })))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {

    className: "border-t border-slate-600 bg-slate-700"

  }, /*#__PURE__*/React.createElement("td", {

    className: "px-3 py-1.5 text-xs font-medium text-slate-100"

  }, form.typ === 'privatschuld' ? 'Restschuld' : 'Gezahlt'), /*#__PURE__*/React.createElement("td", {

    className: "px-3 py-1.5 text-right mono font-semibold text-white"

  }, form.typ === 'privatschuld' ? formatEUR(Math.max((parseFloat(form.betrag) || 0) - paymentSum(form.zahlungen), 0)) : formatEUR(paymentSum(form.zahlungen))), /*#__PURE__*/React.createElement("td", null))))), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-2"

  }, /*#__PURE__*/React.createElement("input", {

    type: "date",

    value: paymentDraft.datum,

    onChange: e => setPaymentDraft({

      ...paymentDraft,

      datum: e.target.value

    }),

    className: "flex-1 text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: paymentDraft.betrag,

    onChange: e => setPaymentDraft({

      ...paymentDraft,

      betrag: e.target.value

    }),

    placeholder: "Betrag",

    className: "mono w-24 text-sm border border-slate-600 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 bg-slate-700 dark:bg-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("button", {

    type: "button",

    onClick: addPayment,

    className: "shrink-0 bg-slate-700 dark:bg-slate-600 text-white rounded-lg px-3 text-sm font-medium hover:bg-slate-600"

  }, "+"))), (form.typ === 'forderung' || form.typ === 'privatschuld') && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1.5 block"

  }, "Ratenzahlung (falls vereinbart)"), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-3"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs text-slate-100 mb-1 block"

  }, "Rate (\u20AC)"), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: form.rate,

    onChange: e => setForm({

      ...form,

      rate: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "0,00"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs text-slate-100 mb-1 block"

  }, "Rate ab"), /*#__PURE__*/React.createElement("input", {

    type: "date",

    value: form.rateAb,

    onChange: e => setForm({

      ...form,

      rateAb: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  })))), (form.typ === 'forderung' || form.typ === 'rechnung') && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Status"), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-2"

  }, Object.entries(STATUS_CONFIG).map(([key, cfg]) => /*#__PURE__*/React.createElement("button", {

    type: "button",

    key: key,

    onClick: () => setForm({

      ...form,

      status: key

    }),

    className: `text-sm font-medium px-3 py-2 rounded-lg border text-left flex items-center gap-1.5 ${form.status === key ? `${cfg.bg} ${cfg.color} ${cfg.border}` : 'bg-slate-700 dark:bg-slate-800 text-white border-slate-600'}`

  }, /*#__PURE__*/React.createElement("span", {

    className: `w-1.5 h-1.5 rounded-full ${cfg.dot}`

  }), cfg.label)))), (form.typ === 'forderung' || form.typ === 'privatschuld') && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Dokumente"), (form.dokumente || []).length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "space-y-2 mb-2"

  }, form.dokumente.map(doc => /*#__PURE__*/React.createElement("div", {

    key: doc.id,

    className: "flex items-center justify-between gap-2 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-2 min-w-0"

  }, /*#__PURE__*/React.createElement(PaperclipIcon, {

    size: 14,

    className: "text-slate-100 shrink-0"

  }), /*#__PURE__*/React.createElement("span", {

    className: "text-sm text-slate-100 truncate"

  }, doc.name), /*#__PURE__*/React.createElement("span", {

    className: "text-xs text-slate-100 shrink-0"

  }, formatFileSize(doc.size))), /*#__PURE__*/React.createElement("button", {

    type: "button",

    onClick: () => removeDocument(doc.id),

    className: "text-slate-100 p-1 shrink-0"

  }, /*#__PURE__*/React.createElement(XIcon, {

    size: 14

  }))))), /*#__PURE__*/React.createElement("label", {

    onDragOver: handleDragOver,

    onDragLeave: handleDragLeave,

    onDrop: handleDrop,

    className: `flex flex-col items-center justify-center gap-1 text-center rounded-lg py-5 px-2 cursor-pointer border-2 border-dashed transition-colors ${dragOver ? 'border-slate-900 bg-slate-700 dark:bg-slate-600' : 'border-slate-600'}`

  }, /*#__PURE__*/React.createElement(PaperclipIcon, {

    size: 16,

    className: dragOver ? 'text-white' : 'text-slate-100'

  }), /*#__PURE__*/React.createElement("span", {

    className: `text-sm font-medium ${dragOver ? 'text-white' : 'text-slate-100'}`

  }, "Datei hinzuf\xFCgen oder hierher ziehen"), /*#__PURE__*/React.createElement("span", {

    className: "text-xs text-slate-100"

  }, "auch empfangene E-Mails (.eml/.msg) per Drag & Drop"), /*#__PURE__*/React.createElement("input", {

    type: "file",

    multiple: true,

    onChange: handleFilesSelected,

    className: "hidden",

    accept: "application/pdf,image/*,.eml,.msg,message/rfc822"

  })), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 mt-1"

  }, "Dateien werden lokal im Browser gespeichert. Bei vielen/gro\xDFen Dateien kann der Speicherplatz knapp werden.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Notizen"), /*#__PURE__*/React.createElement("textarea", {

    value: form.notizen,

    onChange: e => setForm({

      ...form,

      notizen: e.target.value

    }),

    rows: 3,

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 outline-none focus:border-slate-600 text-white placeholder:text-slate-400 resize-none",

    placeholder: "Zus\xE4tzliche Hinweise\u2026"

  }))), /*#__PURE__*/React.createElement("button", {

    type: "submit",

    className: "w-full bg-slate-900 text-white font-medium text-sm rounded-lg py-3 mt-5"

  }, editingId ? 'Änderungen speichern' : 'Forderung anlegen'))), view === 'sparen' && /*#__PURE__*/React.createElement("div", {

    className: "px-5 mt-3 space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex gap-1.5 overflow-x-auto pb-1"

  }, /*#__PURE__*/React.createElement("button", {

    onClick: () => setSparenTab('abos'),

    className: `shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${sparenTab === 'abos' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-200 border-slate-600 font-medium'}`

  }, "Abos & Versicherungen"), /*#__PURE__*/React.createElement("button", {

    onClick: () => setSparenTab('einkauf'),

    className: `shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${sparenTab === 'einkauf' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-200 border-slate-600 font-medium'}`

  }, "Einkaufsvergleich")), sparenTab === 'abos' && /*#__PURE__*/React.createElement("div", {

    className: "space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-emerald-700 dark:text-emerald-300 dark:text-emerald-300 mb-1"

  }, "M\xF6gliche Ersparnis pro Jahr"), /*#__PURE__*/React.createElement("p", {

    className: "mono text-2xl font-semibold text-emerald-700 dark:text-emerald-300 dark:text-emerald-300"

  }, formatEUR(abos.reduce((s, a) => s + toMonthly(Math.max(0, (parseFloat(a.aktuell) || 0) - (parseFloat(a.alternativ) || 0)), a.intervall), 0)))), abos.map(a => {

    const diff = Math.max(0, (parseFloat(a.aktuell) || 0) - (parseFloat(a.alternativ) || 0));

    return /*#__PURE__*/React.createElement("div", {

      key: a.id,

      className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-start justify-between"

    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

      className: "text-sm font-medium text-slate-100"

    }, a.name), /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100"

    }, a.kategorie, " \xB7 ", (a.intervall || 'monatlich').charAt(0).toUpperCase() + (a.intervall || 'monatlich').slice(1))), /*#__PURE__*/React.createElement("button", {

      onClick: () => persistAbos(abos.filter(x => x.id !== a.id)),

      className: "text-slate-100 p-1"

    }, /*#__PURE__*/React.createElement(TrashIcon, {

      size: 15

    }))), /*#__PURE__*/React.createElement("div", {

      className: "mt-2 flex items-center gap-3 text-sm"

    }, /*#__PURE__*/React.createElement("span", {

      className: "text-rose-600 font-medium"

    }, formatEUR(a.aktuell), "/Mt"), ((a.intervall || 'monatlich') !== 'monatlich' ? /*#__PURE__*/React.createElement("span", { className: "text-[11px] text-slate-100 dark:text-slate-300" }, formatEUR(toMonthly(a.aktuell, a.intervall)) + " / Monat") : null), /*#__PURE__*/React.createElement("span", {

      className: "text-white"

    }, "\u2192"), /*#__PURE__*/React.createElement("span", {

      className: "text-emerald-600 font-medium"

    }, formatEUR(a.alternativ), "/Mt"), ((a.intervall || 'monatlich') !== 'monatlich' ? /*#__PURE__*/React.createElement("span", { className: "text-[11px] text-slate-100 dark:text-slate-300" }, formatEUR(toMonthly(a.alternativ, a.intervall)) + " / Monat") : null), diff > 0 && /*#__PURE__*/React.createElement("span", {

      className: "ml-auto text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900 px-2 py-0.5 rounded-full"

    }, "spart ", formatEUR(diff * 12), "/Jahr")));

  }), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-1"

  }, "Abo / Versicherung hinzuf\xFCgen"), /*#__PURE__*/React.createElement("input", {

    value: aboForm.name,

    onChange: e => setAboForm({

      ...aboForm,

      name: e.target.value

    }),

    placeholder: "z.B. Streaming, Haftpflicht",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-2"

  }, /*#__PURE__*/React.createElement("select", {

    value: aboForm.kategorie,

    onChange: e => setAboForm({

      ...aboForm,

      kategorie: e.target.value

    }),

    className: "text-sm border border-slate-600 rounded-lg px-2 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none"

  }, /*#__PURE__*/React.createElement("option", null, "Abo"), /*#__PURE__*/React.createElement("option", null, "Versicherung"), /*#__PURE__*/React.createElement("option", null, "Vertrag")), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: aboForm.aktuell,

    onChange: e => setAboForm({

      ...aboForm,

      aktuell: e.target.value

    }),

    placeholder: "Aktuell \u20AC/Mt",

    className: "flex-1 text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  })), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-2"

  }, /*#__PURE__*/React.createElement("input", {

    value: aboForm.anbieterAlt,

    onChange: e => setAboForm({

      ...aboForm,

      anbieterAlt: e.target.value

    }),

    placeholder: "G\xFCnstigerer Anbieter",

    className: "flex-1 text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: aboForm.alternativ,

    onChange: e => setAboForm({

      ...aboForm,

      alternativ: e.target.value

    }),

    placeholder: "Deren Preis \u20AC/Mt",

    className: "w-32 text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  })), /*#__PURE__*/React.createElement("select", { value: aboForm.intervall, onChange: e => setAboForm({ ...aboForm, intervall: e.target.value }), className: "text-sm border border-slate-600 rounded-lg px-2 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none" }, ["monatlich","quartalsweise","halbjaehrlich","jaehrlich"].map(v => /*#__PURE__*/React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.slice(1)))), /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      if (!aboForm.name.trim() || !(parseFloat(aboForm.aktuell) > 0)) return;

      persistAbos([...abos, {

        id: uid(),

        ...aboForm,

        aktuell: parseFloat(aboForm.aktuell) || 0,

        alternativ: parseFloat(aboForm.alternativ) || 0,

        intervall: aboForm.intervall || 'monatlich'

      }]);

      setAboForm({

        name: '',

        kategorie: 'Abo',

        aktuell: '',

        alternativ: '',

        anbieterAlt: '',

        intervall: 'monatlich'

      });

    },

    className: "w-full bg-slate-900 text-white text-sm font-medium rounded-lg py-2"

  }, "Hinzuf\xFCgen")), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 leading-relaxed"

  }, "Trage deine laufenden Abos/Versicherungen ein und den Preis eines g\xFCnstigeren Anbieters (z.B. Wechsel der Kfz-Versicherung, g\xFCnstigerer Stromtarif). Die App rechnet die Jahresersparnis automatisch aus.")), sparenTab === 'einkauf' && /*#__PURE__*/React.createElement("div", {

    className: "space-y-3"

  }, einkauf.map(p => {

    const preise = Object.entries(p.preise).filter(([, v]) => parseFloat(v) > 0);

    const werte = preise.map(([, v]) => parseFloat(v));

    const min = werte.length ? Math.min(...werte) : 0;

    const max = werte.length ? Math.max(...werte) : 0;

    const guenstig = preise.find(([, v]) => parseFloat(v) === min);

    return /*#__PURE__*/React.createElement("div", {

      key: p.id,

      className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-start justify-between"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-sm font-medium text-slate-100"

    }, p.name), /*#__PURE__*/React.createElement("button", {

      onClick: () => persistEinkauf(einkauf.filter(x => x.id !== p.id)),

      className: "text-slate-100 p-1"

    }, /*#__PURE__*/React.createElement(TrashIcon, {

      size: 15

    }))), preise.length > 0 ? /*#__PURE__*/React.createElement("table", {

      className: "mt-2 w-full text-xs"

    }, /*#__PURE__*/React.createElement("tbody", null, preise.sort((a, b) => parseFloat(a[1]) - parseFloat(b[1])).map(([h, v]) => /*#__PURE__*/React.createElement("tr", {

      key: h,

      className: parseFloat(v) === min ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-100'

    }, /*#__PURE__*/React.createElement("td", {

      className: "py-0.5"

    }, h), /*#__PURE__*/React.createElement("td", {

      className: "py-0.5 text-right"

    }, formatEUR(v)), parseFloat(v) === min && /*#__PURE__*/React.createElement("td", {

      className: "py-0.5 text-right text-[10px] text-emerald-600"

    }, "g\xFCnstigst"))))) : /*#__PURE__*/React.createElement("p", {

      className: "mt-2 text-xs text-slate-100"

    }, "Noch keine Preise eingetragen \u2013 unten vergleichen."), max > min && /*#__PURE__*/React.createElement("p", {

      className: "mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300"

    }, "G\xFCnstigster: ", guenstig[0], " \xB7 spart ", formatEUR(max - min), " gg\xFC. teuerstem"), /*#__PURE__*/React.createElement("div", {

      className: "mt-3 flex flex-wrap gap-1.5"

    }, onlineSearchUrls(p.name).map(s => /*#__PURE__*/React.createElement("button", {

      key: s.label,

      onClick: () => window.open(s.url, '_blank'),

      className: "text-[11px] font-medium px-2 py-1 rounded-full bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200"

    }, s.label))));

  }), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-1"

  }, "Produkt / Einkauf hinzuf\xFCgen"), /*#__PURE__*/React.createElement("input", {

    value: einkaufForm.name,

    onChange: e => setEinkaufForm({

      ...einkaufForm,

      name: e.target.value

    }),

    placeholder: "z.B. Milch 1L, Waschmittel",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-3 gap-2"

  }, ['Lidl', 'Aldi', 'Netto', 'Rewe', 'Edeka', 'Penny'].map(h => /*#__PURE__*/React.createElement("input", {

    key: h,

    type: "number",

    step: "0.01",

    value: einkaufForm.preise[h] || '',

    onChange: e => setEinkaufForm({

      ...einkaufForm,

      preise: {

        ...einkaufForm.preise,

        [h]: e.target.value

      }

    }),

    placeholder: h,

    className: "text-sm border border-slate-600 rounded-lg px-2 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }))), /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      if (!einkaufForm.name.trim()) return;

      persistEinkauf([...einkauf, {

        id: uid(),

        name: einkaufForm.name,

        preise: einkaufForm.preise

      }]);

      setEinkaufForm({

        name: '',

        preise: {}

      });

    },

    className: "w-full bg-slate-900 text-white text-sm font-medium rounded-lg py-2"

  }, "Hinzuf\xFCgen")), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 leading-relaxed"

  }, "Trage f\xFCr Produkte die Preise bei verschiedenen H\xE4ndlern ein. Die App markiert den g\xFCnstigsten und zeigt, wie viel du gegen\xFCber dem teuersten sparst."))), view === 'kassenbon' && /*#__PURE__*/React.createElement("div", {

    className: "space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-slate-100"

  }, "Kassenbon fotografieren & auswerten"), KassenbonManual())), view === 'vergleich' && /*#__PURE__*/React.createElement("div", {

    className: "space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-slate-100"

  }, "Vergleich anbieten (au\xDFergerichtliche Einigung)"), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, "W\xE4hle eine offene Forderung und biete einen Vergleich an \u2013 als Einmalzahlung mit Nachlass oder als Ratenzahlung."), /*#__PURE__*/React.createElement("select", {

    value: vergleichForderungId,

    onChange: e => setVergleichForderungId(e.target.value),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-slate-900 placeholder:text-slate-500 outline-none"

  }, /*#__PURE__*/React.createElement("option", {

    value: ""

  }, "\u2013 Forderung w\xE4hlen \u2013"), entries.filter(en => (parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen) > 0).map(en => /*#__PURE__*/React.createElement("option", {

    key: en.id,

    value: en.id

  }, en.glaeubiger || 'Forderung', " \xB7 Rest ", formatEUR((parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen))))), vergleichForderungId && (() => {

    const en = entries.find(x => x.id === vergleichForderungId);

    if (!en) return null;

    const rest = Math.max(0, (parseFloat(en.betrag) || 0) - paymentSum(en.zahlungen));

    const vorschlagEinmal = Math.round(rest * 0.7 * 100) / 100;

    return /*#__PURE__*/React.createElement("div", {

      className: "space-y-3 pt-1"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex gap-2"

    }, /*#__PURE__*/React.createElement("button", {

      onClick: () => setVergleichArt('einmal'),

      className: `flex-1 text-xs font-medium py-2 rounded-lg border ${vergleichArt === 'einmal' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-200 border-slate-600 font-medium'}`

    }, "Einmalzahlung (Nachlass)"), /*#__PURE__*/React.createElement("button", {

      onClick: () => setVergleichArt('raten'),

      className: `flex-1 text-xs font-medium py-2 rounded-lg border ${vergleichArt === 'raten' ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-200 border-slate-600 font-medium'}`

    }, "Ratenzahlung")), vergleichArt === 'einmal' ? /*#__PURE__*/React.createElement("div", {

      className: "space-y-2"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100"

    }, "Vorgeschlagene Einmalzahlung (30 % Nachlass): ", formatEUR(vorschlagEinmal)), /*#__PURE__*/React.createElement("input", {

      type: "number",

      step: "0.01",

      value: vergleichEinmal,

      onChange: e => setVergleichEinmal(e.target.value),

      placeholder: "Angebotener Betrag \u20AC",

      className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-slate-900 placeholder:text-slate-500 outline-none"

    }), /*#__PURE__*/React.createElement("p", {

      className: "text-xs font-medium text-emerald-700 dark:text-emerald-300"

    }, "Nachlass: ", formatEUR(Math.max(0, rest - (parseFloat(vergleichEinmal) || 0))))) : /*#__PURE__*/React.createElement("div", {

      className: "space-y-2"

    }, /*#__PURE__*/React.createElement("input", {

      type: "number",

      step: "0.01",

      value: vergleichRate,

      onChange: e => setVergleichRate(e.target.value),

      placeholder: "Monatsrate \u20AC",

      className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-slate-900 placeholder:text-slate-500 outline-none"

    }), /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100"

    }, vergleichRate > 0 ? `Ergibt ${Math.ceil(rest / parseFloat(vergleichRate))} Raten à ${formatEUR(vergleichRate)}` : 'Monatsrate eingeben')), /*#__PURE__*/React.createElement("div", {

      className: "flex gap-2 pt-1"

    }, /*#__PURE__*/React.createElement("button", {

      onClick: () => {

        const opts = vergleichArt === 'einmal' ? {

          art: 'einmal',

          einmalBetrag: parseFloat(vergleichEinmal) || 0,

          cc: currentUser.email,

          saveDoc: true

        } : {

          art: 'raten',

          rate: parseFloat(vergleichRate) || 0,

          cc: currentUser.email,

          saveDoc: true

        };

        const res = composeVergleichEmail(en, opts);

        openMail(mailProvider, res.subject, res.body, res.cc);

        if (res.doc) attachEmailDoc(en.id, res.doc);

        persistVergleichLog([...vergleichLog, {

          datum: new Date().toLocaleDateString('de-DE'),

          glaeubiger: en.glaeubiger || 'Forderung',

          art: vergleichArt,

          betrag: vergleichArt === 'einmal' ? parseFloat(vergleichEinmal) || 0 : parseFloat(vergleichRate) || 0,

          status: 'Angebot gesendet'

        }]);

        setVergleichStatus('Angebot gesendet (per E-Mail). Bestätigung vom Gläubiger abwarten.');

      },

      className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg py-2"

    }, "Angebot senden (E-Mail)"), /*#__PURE__*/React.createElement("button", {

      onClick: () => {

        const opts = vergleichArt === 'einmal' ? {

          art: 'einmal',

          einmalBetrag: parseFloat(vergleichEinmal) || 0,

          cc: currentUser.email

        } : {

          art: 'raten',

          rate: parseFloat(vergleichRate) || 0,

          cc: currentUser.email

        };

        const res = composeVergleichEmail(en, opts);

        const url = res.doc ? res.doc.dataUrl : emailToPdfDataUrl(res.subject, res.body);

        const a = document.createElement('a');

        a.href = url;

        a.download = `Vergleich_${(en.glaeubiger || 'Forderung').replace(/\s+/g, '_')}.pdf`;

        a.click();

      },

      className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-900 bg-slate-200 rounded-lg py-2"

    }, "Als PDF")));

  })(), vergleichStatus && /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100"

  }, vergleichStatus)), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-2"

  }, "Verhandlungs-Historie (gesendete Vergleichsangebote)"), vergleichLog.length === 0 ? /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, "Noch keine Vergleichsangebote gesendet.") : /*#__PURE__*/React.createElement("ul", {

    className: "space-y-2"

  }, vergleichLog.map((v, i) => /*#__PURE__*/React.createElement("li", {

    key: i,

    className: "text-xs border-l-2 border-sky-200 pl-2"

  }, /*#__PURE__*/React.createElement("span", {

    className: "font-medium text-slate-100"

  }, v.datum), " \xB7 ", v.glaeubiger, " \xB7 ", v.art === 'einmal' ? `Einmal ${formatEUR(v.betrag)}` : `Raten ${formatEUR(v.betrag)}`, /*#__PURE__*/React.createElement("span", {

    className: "text-slate-100"

  }, " \u2013 ", v.status)))))), view === 'nebenkosten' && /*#__PURE__*/React.createElement("div", {

    className: "px-4 mt-3 space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-3"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-slate-100"

  }, "Abrechnung hinterlegen"),

/*#__PURE__*/React.createElement("div", {

    className: "grid grid-cols-2 gap-2"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Jahr"), /*#__PURE__*/React.createElement("input", {

    value: nkForm.jahr,

    onChange: e => setNkForm({

      ...nkForm,

      jahr: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none",

    placeholder: "2024"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Kategorie"), /*#__PURE__*/React.createElement("select", {

    value: nkForm.kategorie,

    onChange: e => setNkForm({

      ...nkForm,

      kategorie: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none"

  }, /*#__PURE__*/React.createElement("option", {

    value: "strom"

  }, "Strom"), /*#__PURE__*/React.createElement("option", {

    value: "betriebskosten"

  }, "Betriebskosten (Nebenkosten)"), /*#__PURE__*/React.createElement("option", {

    value: "heizung"

  }, "Heizung"), /*#__PURE__*/React.createElement("option", {

    value: "wasser"

  }, "Wasser/Abwasser"), /*#__PURE__*/React.createElement("option", {

    value: "sonstige"

  }, "Sonstige")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Jahresbetrag (\u20AC)"), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: nkForm.betrag,

    onChange: e => setNkForm({

      ...nkForm,

      betrag: e.target.value

    }),

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 bg-slate-700 dark:bg-slate-800 placeholder:text-slate-400 outline-none",

    placeholder: "0,00"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Notiz (optional)"), /*#__PURE__*/React.createElement("input", {

    value: nkForm.notiz,

    onChange: e => setNkForm({

      ...nkForm,

      notiz: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 bg-slate-700 dark:bg-slate-800 placeholder:text-slate-400 outline-none",

    placeholder: "z.B. Verbrauch, Ablesewert"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", { className: "text-xs font-medium text-slate-100 mb-1 block" }, "Zahlung / Intervall"), /*#__PURE__*/React.createElement("select", { value: nkForm.intervall, onChange: e => setNkForm({ ...nkForm, intervall: e.target.value }), className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none" }, ["monatlich","quartalsweise","halbjaehrlich","jaehrlich"].map(v => /*#__PURE__*/React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.slice(1))))), /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      const betrag = parseFloat(nkForm.betrag);

      if (!nkForm.jahr || !(betrag > 0)) return;

      const eintrag = {

        id: uid(),

        jahr: nkForm.jahr,

        kategorie: nkForm.kategorie,

        betrag,

        notiz: nkForm.notiz,

        intervall: nkForm.intervall || 'jaehrlich'

      };

      persistNebenkosten([...nebenkosten, eintrag].sort((a, b) => a.jahr < b.jahr ? -1 : 1));

      setNkForm({

        jahr: new Date().getFullYear().toString(),

        kategorie: 'strom',

        betrag: '',

        notiz: ''

      });

    },

    className: "w-full bg-slate-700 text-white text-sm font-medium rounded-lg py-2.5"

  }, "Hinterlegen")), nebenkosten.length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-3"

  }, "Verlauf nach Jahr & Kategorie"), (() => {

    const jahre = [...new Set(nebenkosten.map(n => n.jahr))].sort();

    const kats = ['strom', 'betriebskosten', 'heizung', 'wasser', 'sonstige'];

    const katColors = {

      strom: '#0ea5e9',

      betriebskosten: '#8b5cf6',

      heizung: '#f59e0b',

      wasser: '#10b981',

      sonstige: '#94a3b8'

    };

    const katLabel = {

      strom: 'Strom',

      betriebskosten: 'Betriebsk.',

      heizung: 'Heizung',

      wasser: 'Wasser',

      sonstige: 'Sonst.'

    };

    const maxVal = Math.max(...nebenkosten.map(n => n.betrag), 1);

    return /*#__PURE__*/React.createElement("div", {

      className: "space-y-2"

    }, jahre.map(j => {

      const summe = nebenkosten.filter(n => n.jahr === j).reduce((s, n) => s + n.betrag, 0);

      return /*#__PURE__*/React.createElement("div", {

        key: j

      }, /*#__PURE__*/React.createElement("div", {

        className: "flex items-center justify-between text-xs mb-1"

      }, /*#__PURE__*/React.createElement("span", {

        className: "font-medium text-slate-100"

      }, j), /*#__PURE__*/React.createElement("span", {

        className: "mono text-slate-100"

      }, formatEUR(summe), " gesamt")), /*#__PURE__*/React.createElement("div", {

        className: "space-y-1"

      }, kats.filter(k => nebenkosten.some(n => n.jahr === j && n.kategorie === k)).map(k => {

        const val = nebenkosten.filter(n => n.jahr === j && n.kategorie === k).reduce((s, n) => s + n.betrag, 0);

        return /*#__PURE__*/React.createElement("div", {

          key: k,

          className: "flex items-center gap-2"

        }, /*#__PURE__*/React.createElement("span", {

          className: "text-[10px] w-14 shrink-0 text-slate-100"

        }, katLabel[k]), /*#__PURE__*/React.createElement("div", {

          className: "flex-1 bg-slate-200 rounded-full h-3 overflow-hidden"

        }, /*#__PURE__*/React.createElement("div", {

          className: "h-full rounded-full",

          style: {

            width: `${val / maxVal * 100}%`,

            background: katColors[k]

          }

        })), /*#__PURE__*/React.createElement("span", {

          className: "mono text-[10px] text-slate-100 w-14 text-right shrink-0"

        }, formatEUR(val)));

      })));

    }), /*#__PURE__*/React.createElement("div", {

      className: "flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-slate-700"

    }, kats.map(k => /*#__PURE__*/React.createElement("div", {

      key: k,

      className: "flex items-center gap-1 text-[10px] text-slate-100"

    }, /*#__PURE__*/React.createElement("span", {

      className: "w-2.5 h-2.5 rounded-full",

      style: {

        background: katColors[k]

      }

    }), katLabel[k]))));

  })()), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-slate-100 mb-1"

  }, "Orts\xFCbliche Betriebskosten \u2013 PLZ 36304 Alsfeld"), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 mb-3"

  }, "Richtwerte (Deutschland-Schnitt 2024/25, l\xE4ndlicher Raum Hessen). Zum Vergleich deiner erfassten Betriebskosten."), (() => {

    // Referenzwerte: €/qm/Monat (ohne Heizung), Heizung/Warmwasser gesondert

    const ref = {

      betriebOhneHeiz: 1.20,

      heizung: 1.32

    };

    const flaeche1 = 50,

      flaeche2 = 70; // Angenommene Wohnfläche

    const jahrBk = nebenkosten.filter(n => n.kategorie === 'betriebskosten').reduce((s, n) => s + n.betrag, 0);

    const jahrHeiz = nebenkosten.filter(n => n.kategorie === 'heizung').reduce((s, n) => s + n.betrag, 0);

    const refBk1 = ref.betriebOhneHeiz * flaeche1 * 12;

    const refHeiz1 = ref.heizung * flaeche1 * 12;

    const refBk2 = ref.betriebOhneHeiz * flaeche2 * 12;

    const refHeiz2 = ref.heizung * flaeche2 * 12;

    const ref1 = Math.round((refBk1 + refHeiz1) * 100) / 100;

    const ref2 = Math.round((refBk2 + refHeiz2) * 100) / 100;

    const deinBk = Math.round(jahrBk * 100) / 100;

    const deinHeiz = Math.round(jahrHeiz * 100) / 100;

    const deinGesamt = Math.round((jahrBk + jahrHeiz) * 100) / 100;

    const abw1 = Math.round((deinGesamt - ref1) * 100) / 100;

    const abw2 = Math.round((deinGesamt - ref2) * 100) / 100;

    return /*#__PURE__*/React.createElement("div", {

      className: "space-y-2 text-xs"

    }, /*#__PURE__*/React.createElement("div", {

      className: "grid grid-cols-3 gap-2 text-center"

    }, /*#__PURE__*/React.createElement("div", {

      className: "bg-slate-700 rounded-lg p-2"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-slate-100"

    }, "1 Pers. (", flaeche1, " m\xB2)"), /*#__PURE__*/React.createElement("p", {

      className: "mono font-semibold text-white"

    }, formatEUR(ref1)), /*#__PURE__*/React.createElement("p", {

      className: "text-[10px] text-slate-100"

    }, "Referenz/Jahr")), /*#__PURE__*/React.createElement("div", {

      className: "bg-slate-700 rounded-lg p-2"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-slate-100"

    }, "2 Pers. (", flaeche2, " m\xB2)"), /*#__PURE__*/React.createElement("p", {

      className: "mono font-semibold text-white"

    }, formatEUR(ref2)), /*#__PURE__*/React.createElement("p", {

      className: "text-[10px] text-slate-100"

    }, "Referenz/Jahr")), /*#__PURE__*/React.createElement("div", {

      className: "bg-slate-700 rounded-lg p-2"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-slate-100"

    }, "Deine erfassten"), /*#__PURE__*/React.createElement("p", {

      className: "mono font-semibold text-white"

    }, formatEUR(deinGesamt)), /*#__PURE__*/React.createElement("p", {

      className: "text-[10px] text-slate-100"

    }, "BK + Heizung"))), deinGesamt > 0 && /*#__PURE__*/React.createElement("div", {

      className: `rounded-lg p-2 text-center ${abw1 > 0 ? 'bg-rose-50 dark:bg-rose-900 text-rose-700 dark:text-rose-300' : 'bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'}`

    }, abw1 > 0 ? `Über Referenz 1 Pers.: +${formatEUR(abw1)}/Jahr` : `Unter Referenz 1 Pers.: ${formatEUR(abw1)}/Jahr`, '  ·  ', abw2 > 0 ? `Über Referenz 2 Pers.: +${formatEUR(abw2)}/Jahr` : `Unter Referenz 2 Pers.: ${formatEUR(abw2)}/Jahr`), /*#__PURE__*/React.createElement("p", {

      className: "text-[10px] text-slate-100"

    }, "Annahme: Betriebskosten ", ref.betriebOhneHeiz, " \u20AC/m\xB2/Monat + Heizung ", ref.heizung, " \u20AC/m\xB2/Monat (ohne Strom). Werte sind Richtwerte, keine Garantie f\xFCr Alsfeld."), /*#__PURE__*/React.createElement("button", {

      onClick: () => openMail('system', 'Betriebskosten-Vergleich Alsfeld', `Meine erfassten Betriebskosten + Heizung: ${formatEUR(deinGesamt)}/Jahr.\n\nReferenz 1 Person (50 m²): ${formatEUR(ref1)}\nReferenz 2 Personen (70 m²): ${formatEUR(ref2)}\n\nAbweichung: 1 Pers. ${abw1 > 0 ? '+' : ''}${formatEUR(abw1)}, 2 Pers. ${abw2 > 0 ? '+' : ''}${formatEUR(abw2)}`, ''),

      className: "w-full mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-900 bg-slate-200 rounded-lg py-2"

    }, "Vergleich als Notiz per E-Mail"));

  })()), nebenkosten.length > 0 && /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-2"

  }, "Erfasste Abrechnungen"), /*#__PURE__*/React.createElement("div", {

    className: "space-y-1.5"

  }, nebenkosten.map(n => /*#__PURE__*/React.createElement("div", {

    key: n.id,

    className: "flex items-center justify-between gap-2 text-sm border-b border-slate-100 pb-1.5 last:border-0"

  }, /*#__PURE__*/React.createElement("div", {

    className: "min-w-0"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-slate-100 truncate"

  }, n.jahr, " \xB7 ", n.kategorie === 'betriebskosten' ? 'Betriebskosten' : n.kategorie === 'strom' ? 'Strom' : n.kategorie === 'heizung' ? 'Heizung' : n.kategorie === 'wasser' ? 'Wasser/Abwasser' : 'Sonstige', n.notiz ? ` · ${n.notiz}` : '')), /*#__PURE__*/React.createElement("div", {

    className: "flex items-center gap-2 shrink-0"

  }, /*#__PURE__*/React.createElement("span", {

    className: "mono text-slate-100"

  }, formatEUR(n.betrag)), /*#__PURE__*/React.createElement("button", {

    onClick: () => persistNebenkosten(nebenkosten.filter(x => x.id !== n.id)),

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(XIcon, {

    size: 12

  })))))))), view === 'budget' && BudgetTab(), view === 'sepa' && /*#__PURE__*/React.createElement("div", {

    className: "px-5 mt-3 space-y-3"

  }, /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-1"

  }, "Neue SEPA-\xDCberweisung / Dauerauftrag"), /*#__PURE__*/React.createElement("input", {

    value: sepaForm.empfaenger,

    onChange: e => setSepaForm({

      ...sepaForm,

      empfaenger: e.target.value

    }),

    placeholder: "Empf\xE4ngername",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("input", {

    value: sepaForm.iban,

    onChange: e => setSepaForm({

      ...sepaForm,

      iban: e.target.value

    }),

    placeholder: "IBAN (DE12 3456 ...)",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("input", {

    value: sepaForm.bic,

    onChange: e => setSepaForm({

      ...sepaForm,

      bic: e.target.value

    }),

    placeholder: "BIC (optional)",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("input", {

    type: "number",

    step: "0.01",

    value: sepaForm.betrag,

    onChange: e => setSepaForm({

      ...sepaForm,

      betrag: e.target.value

    }),

    placeholder: "Betrag (\u20AC)",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("input", {

    value: sepaForm.zweck,

    onChange: e => setSepaForm({

      ...sepaForm,

      zweck: e.target.value

    }),

    placeholder: "Verwendungszweck",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600"

  }), /*#__PURE__*/React.createElement("div", {

    className: "border-t border-slate-700 pt-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-1"

  }, "Von welchem Konto? (eigenes Absender-Konto)"), /*#__PURE__*/React.createElement("select", {

    value: sepaForm.vonKontoId,

    onChange: e => {

      const acc = ownAccounts.find(a => a.id === e.target.value);

      setSepaForm({

        ...sepaForm,

        vonKontoId: e.target.value,

        vonName: acc ? acc.kontoinhaber : '',

        vonIban: acc ? acc.iban : '',

        vonBic: acc ? acc.bic : ''

      });

    },

    className: "w-full text-sm border border-slate-600 rounded-lg px-2 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none"

  }, /*#__PURE__*/React.createElement("option", {

    value: ""

  }, "\u2013 Konto w\xE4hlen / manuell \u2013"), ownAccounts.map(a => /*#__PURE__*/React.createElement("option", {

    key: a.id,

    value: a.id

  }, a.name, " \xB7 ", a.iban)))), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-2"

  }, /*#__PURE__*/React.createElement("select", {

    value: sepaForm.typ,

    onChange: e => setSepaForm({

      ...sepaForm,

      typ: e.target.value

    }),

    className: "text-sm border border-slate-600 rounded-lg px-2 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none"

  }, /*#__PURE__*/React.createElement("option", {

    value: "ueberweisung"

  }, "Einmalig (\xDCberweisung)"), /*#__PURE__*/React.createElement("option", {

    value: "dauerauftrag"

  }, "Dauerauftrag")), sepaForm.typ === 'dauerauftrag' && /*#__PURE__*/React.createElement("select", {

    value: sepaForm.turnus,

    onChange: e => setSepaForm({

      ...sepaForm,

      turnus: e.target.value

    }),

    className: "text-sm border border-slate-600 rounded-lg px-2 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none"

  }, /*#__PURE__*/React.createElement("option", {

    value: "monatlich"

  }, "monatlich"), /*#__PURE__*/React.createElement("option", {

    value: "vierteljaehrlich"

  }, "viertelj\xE4hrlich"), /*#__PURE__*/React.createElement("option", {

    value: "halbjaehrlich"

  }, "halbj\xE4hrlich"), /*#__PURE__*/React.createElement("option", {

    value: "jaehrlich"

  }, "j\xE4hrlich"))), /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      if (!sepaForm.empfaenger.trim() || !sepaForm.iban.trim() || !(parseFloat(sepaForm.betrag) > 0)) return;

      const xml = buildSepaXml(sepaForm);

      const auftrag = {

        id: uid(),

        ...sepaForm,

        betrag: parseFloat(sepaForm.betrag) || 0,

        xml,

        erstelltAm: new Date().toISOString()

      };

      persistSepa([...sepaList, auftrag]);

      setSepaForm({

        empfaenger: '',

        iban: '',

        bic: '',

        betrag: '',

        zweck: '',

        typ: 'ueberweisung',

        turnus: 'monatlich',

        Tag: '1',

        vonKontoId: ''

      });

    },

    className: "w-full bg-slate-900 text-white text-sm font-medium rounded-lg py-2"

  }, "Auftrag erzeugen")), /*#__PURE__*/React.createElement("div", {

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4 space-y-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-xs font-medium text-slate-100 mb-1"

  }, "Eigene Konten (Absender)"), ownAccounts.length === 0 && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, "Noch keine Konten hinterlegt."), ownAccounts.map(a => /*#__PURE__*/React.createElement("div", {

    key: a.id,

    className: "flex items-center justify-between gap-2 border border-slate-100 rounded-lg px-3 py-2"

  }, /*#__PURE__*/React.createElement("div", {

    className: "min-w-0"

  }, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-slate-100 truncate"

  }, a.name), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 mono truncate"

  }, a.iban), a.kontoinhaber && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 truncate"

  }, a.kontoinhaber)), /*#__PURE__*/React.createElement("button", {

    onClick: () => setOwnAccounts(deleteOwnAccount(currentUser.username, a.id)),

    className: "text-slate-100 p-1 shrink-0"

  }, /*#__PURE__*/React.createElement(TrashIcon, {

    size: 15

  })))), /*#__PURE__*/React.createElement("div", {

    className: "border-t border-slate-700 pt-2 space-y-1.5"

  }, /*#__PURE__*/React.createElement("input", {

    value: ownAccForm.name,

    onChange: e => setOwnAccForm({

      ...ownAccForm,

      name: e.target.value

    }),

    placeholder: "Bezeichnung (z. B. Girokonto)",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-slate-600 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500"

  }), /*#__PURE__*/React.createElement("input", {

    value: ownAccForm.iban,

    onChange: e => setOwnAccForm({

      ...ownAccForm,

      iban: e.target.value

    }),

    placeholder: "IBAN",

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-slate-600 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500"

  }), /*#__PURE__*/React.createElement("input", {

    value: ownAccForm.bankingUrl,

    onChange: e => setOwnAccForm({

      ...ownAccForm,

      bankingUrl: e.target.value

    }),

    placeholder: "Online-Banking-URL (z. B. https://banking.sparkasse.de)",

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-slate-600 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500"

  }), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-1.5"

  }, /*#__PURE__*/React.createElement("input", {

    value: ownAccForm.bic,

    onChange: e => setOwnAccForm({

      ...ownAccForm,

      bic: e.target.value

    }),

    placeholder: "BIC (opt.)",

    className: "mono w-full text-sm border border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-slate-600 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500"

  }), /*#__PURE__*/React.createElement("input", {

    value: ownAccForm.kontoinhaber,

    onChange: e => setOwnAccForm({

      ...ownAccForm,

      kontoinhaber: e.target.value

    }),

    placeholder: "Kontoinhaber",

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-1.5 outline-none focus:border-slate-600 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-500"

  })), /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      if (!ownAccForm.name.trim() && !ownAccForm.iban.trim()) return;

      const acc = {

        id: uid(),

        ...ownAccForm

      };

      setOwnAccounts(saveOwnAccount(currentUser.username, acc));

      setOwnAccForm({

        name: '',

        iban: '',

        bic: '',

        kontoinhaber: '',

        bankingUrl: ''

      });

    },

    className: "w-full bg-emerald-600 text-white text-xs font-medium rounded-lg py-1.5"

  }, "Konto speichern"))), sepaList.map(a => /*#__PURE__*/React.createElement("div", {

    key: a.id,

    className: "bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-4"

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-start justify-between"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "text-sm font-medium text-slate-100"

  }, a.empfaenger), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100"

  }, a.typ === 'dauerauftrag' ? 'Dauerauftrag' : 'Überweisung', " \xB7 ", formatEUR(a.betrag), a.typ === 'dauerauftrag' ? ' / ' + a.turnus : '')), /*#__PURE__*/React.createElement("button", {

    onClick: () => persistSepa(sepaList.filter(x => x.id !== a.id)),

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(TrashIcon, {

    size: 15

  }))), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 mt-1 font-mono break-all"

  }, a.iban), a.zweck && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 mt-0.5"

  }, a.zweck), /*#__PURE__*/React.createElement("div", {

    className: "mt-2 flex gap-2"

  }, /*#__PURE__*/React.createElement("a", {

    href: 'data:application/xml;base64,' + btoa(unescape(encodeURIComponent(a.xml))),

    download: `SEPA_${(a.empfaenger || 'Auftrag').replace(/\s+/g, '_')}.xml`,

    className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-sky-600 rounded-lg py-2"

  }, "XML herunterladen"), /*#__PURE__*/React.createElement("button", {

    onClick: () => {

      const d = emailToPdfDataUrl('SEPA-' + (a.typ === 'dauerauftrag' ? 'Dauerauftrag' : 'Überweisung') + ' ' + a.empfaenger, `SEPA-${a.typ === 'dauerauftrag' ? 'Dauerauftrag' : 'Überweisung'}\nEmpfänger: ${a.empfaenger}\nIBAN: ${a.iban}${a.bic ? '\nBIC: ' + a.bic : ''}\nBetrag: ${formatEUR(a.betrag)}${a.typ === 'dauerauftrag' ? '\nTurnus: ' + a.turnus : ''}\nVerwendungszweck: ${a.zweck || '-'}\n\nErstellt am ${new Date().toLocaleDateString('de-DE')}`);

      const url = d;

      const aEl = document.createElement('a');

      aEl.href = url;

      aEl.download = `SEPA_${(a.empfaenger || 'Auftrag').replace(/\s+/g, '_')}.pdf`;

      aEl.click();

    },

    className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-900 bg-slate-200 rounded-lg py-2"

  }, "Als PDF")), (() => {

    const src = ownAccounts.find(o => o.id === a.vonKontoId);

    const bu = src && src.bankingUrl && src.bankingUrl.trim();

    if (!bu) return null;

    return /*#__PURE__*/React.createElement("button", {

      onClick: () => window.open(bu, '_blank'),

      className: "mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-lg py-2"

    }, "In Online-Banking \xF6ffnen (", src.name, ")");

  })(), a.typ !== 'dauerauftrag' && (() => {

    const svg = sepaQrSvg(a);

    if (!svg) return null;

    return /*#__PURE__*/React.createElement("div", {

      className: "mt-3 flex flex-col items-center border-t border-slate-700 pt-3"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-xs font-medium text-slate-100 mb-2"

    }, "SEPA-\xDCberweisung scannen (BezahlCode)"), /*#__PURE__*/React.createElement("div", {

      className: "bg-white p-2 rounded-lg border border-slate-600",

      dangerouslySetInnerHTML: {

        __html: svg

      }

    }), /*#__PURE__*/React.createElement("button", {

      onClick: () => {

        const el = document.createElement('a');

        el.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

        el.download = `QR_SEPA_${(a.empfaenger || 'Auftrag').replace(/\s+/g, '_')}.svg`;

        el.click();

      },

      className: "mt-2 text-xs text-slate-100 underline"

    }, "QR als SVG speichern"));

  })())), /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-slate-100 leading-relaxed"

  }, "Erzeugt ein\u6807\u51C6isiertes SEPA-XML (pain.001/pain.008), das du in dein Online-Banking hochladen kannst, plus einen PDF-Beleg. Die Daten verlassen das Ger\xE4t nicht.")), showInfo && /*#__PURE__*/React.createElement("div", {

    className: "fixed inset-0 z-50 flex items-end justify-center",

    onClick: () => setShowInfo(false)

  }, /*#__PURE__*/React.createElement("div", {

    className: "absolute inset-0 bg-black bg-opacity-50"

  }), /*#__PURE__*/React.createElement("div", {

    className: "relative bg-white dark:bg-slate-900 dark:bg-slate-800 w-full max-w-md rounded-t-2xl px-5 pt-4 pb-6 text-white",

    onClick: e => e.stopPropagation()

  }, /*#__PURE__*/React.createElement("div", {

    className: "flex items-center justify-between mb-4"

  }, /*#__PURE__*/React.createElement("h2", {

    className: "font-semibold text-lg"

  }, "Informationen"), /*#__PURE__*/React.createElement("button", {

    type: "button",

    onClick: () => setShowInfo(false),

    className: "text-slate-100 p-1"

  }, /*#__PURE__*/React.createElement(XIcon, {

    size: 20

  }))), /*#__PURE__*/React.createElement("div", {

    className: "flex gap-1 px-0 pt-0 mb-3 border-b border-slate-600"

  }, [{

    key: 'version',

    label: 'Version'

  }, {

    key: 'faq',

    label: 'Häufige Fragen'

  }, {

    key: 'privacy',

    label: 'Datenschutz'

  }].map(tab => /*#__PURE__*/React.createElement("button", {

    key: tab.key,

    onClick: () => setInfoTab(tab.key),

    className: `text-sm font-medium px-3 py-2 border-b-2 -mb-px transition-colors ${infoTab === tab.key ? 'border-slate-900 text-white' : 'border-transparent text-slate-100'}`

  }, tab.label))), /*#__PURE__*/React.createElement("div", {

    className: "text-sm text-slate-100 space-y-3 max-h-[60vh] overflow-y-auto"

  }, infoTab === 'version' ? /*#__PURE__*/React.createElement("div", {

    className: "space-y-2"

  }, /*#__PURE__*/React.createElement("p", {

    className: "font-semibold text-white"

  }, "Forderungs- und Rechnungsmanagement / Finanzplan \xB7 v", APP_VERSION), /*#__PURE__*/React.createElement("ul", {

    className: "space-y-1"

  }, APP_CHANGELOG.map((line, i) => /*#__PURE__*/React.createElement("li", {

    key: i,

    className: `text-xs ${i === 0 ? 'text-white font-medium' : 'text-slate-100'}`

  }, line)))) : infoTab === 'faq' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Wo werden meine Daten gespeichert?"), /*#__PURE__*/React.createElement("p", null, "Alle Daten bleiben lokal auf diesem Ger\xE4t (IndexedDB + lokaler Speicher). Es gibt keinen Server und keine Cloud-Synchronisation.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Wie sichere ich meine Daten?"), /*#__PURE__*/React.createElement("p", null, "Nutze \u201EDatensicherung speichern (.json)\" in der Liste. Das erstellte Backup kann auf einem anderen Ger\xE4t eingespielt werden (Import folgt).")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Funktioniert die App offline?"), /*#__PURE__*/React.createElement("p", null, "Ja. Alle Bibliotheken sind lokal eingebunden; die App l\xE4uft ohne Internetverbindung.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Was passiert bei einem Ger\xE4tewechsel?"), /*#__PURE__*/React.createElement("p", null, "Lade ein Backup (.json) ein bzw. kopiere die App inkl. ihres lokalen Speichers. Ohne Backup sind die Daten nicht \xFCbertragbar."))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Lokale Verarbeitung"), /*#__PURE__*/React.createElement("p", null, "Die App verarbeitet alle Eingaben ausschlie\xDFlich lokal auf deinem Ger\xE4t. Es werden keine Daten an Dritte \xFCbertragen.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Passw\xF6rter"), /*#__PURE__*/React.createElement("p", null, "Passw\xF6rter werden mit SHA-256 und einem zuf\xE4lligen Salt (pro Benutzer) gehasht \u2013 nicht im Klartext gespeichert. Der Login ist kein Ersatz f\xFCr Ger\xE4tesicherheit.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Dokumente"), /*#__PURE__*/React.createElement("p", null, "Hochgeladene Dokumente werden als Datei lokal in der App gespeichert (max. 10 MB pro Datei). Sie verlassen das Ger\xE4t nicht.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

    className: "font-medium text-slate-100"

  }, "Verantwortung"), /*#__PURE__*/React.createElement("p", null, "Du tr\xE4gst die Verantwortung f\xFCr Backups. Bei Verlust des Ger\xE4ts ohne Backup sind die Daten unwiederbringlich.")))))));

}

function Root() {

  // GLOBALER AUTO-EXPORT: immer beim Start (Setup + Dashboard), unabhaengig von setupMode
  React.useEffect(() => {
    try {
      var t1 = setInterval(function(){ try { window.writeSyncFile(window.collectAllData()); } catch(e){ console.log('[SYNC] global interval export error=' + e.message); } }, 30000);
      return function(){ clearInterval(t1); };
    } catch(e) { console.log('[SYNC] global export setup error=' + e.message); }
  }, []);

  // AUTO-SETUP: beim ersten Start Admin-User anlegen (Setup ueberspringbar)

  try {

    if (typeof loadUsers === 'function' && (!Array.isArray(loadUsers()) || loadUsers().length === 0)) {

      var _admin = { username: 'Admin', passwordHash: '8484', isAdmin: true, email: 'admin@local' };

      if (typeof saveUsers === 'function') saveUsers([_admin]);

      console.log('[SETUP] auto-created Admin user');

    }

  } catch(_e) { console.log('[SETUP] auto-setup error: ' + _e.message); }

  const [darkMode, setDarkMode] = useState(true);

  // Dark-Klasse sofort (synchron vor dem ersten Paint) an <html> setzen, damit

  // Tailwind (darkMode:'class') die dark:-Varianten auf ALLEN Screens (Login,

  // Setup, UserMgmt) anwendet – nicht erst nach dem ersten useEffect-Lauf.

  if (typeof document !== 'undefined') {

    if (darkMode) document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');

  }

  const [currentUser, setCurrentUser] = useState(() => {

    try {

      return JSON.parse(sessionStorage.getItem(SESSION_KEY));

    } catch {

      return null;

    }

  });

  const [loginForm, setLoginForm] = useState({

    username: '',

    password: '',

    email: ''

  });

  const [loginError, setLoginError] = useState('');

  const [loginLoading, setLoginLoading] = useState(false);

  const [setupMode, setSetupMode] = useState(() => { try { var u = typeof loadUsers === "function" ? loadUsers() : []; return !Array.isArray(u) || u.length === 0; } catch(_) { return true; } });

  const [userMgmt, setUserMgmt] = useState(false);

  const [newUser, setNewUser] = useState({

    username: '',

    password: '',

    isAdmin: false,

    email: ''

  });

  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({ username: '', password: '', isAdmin: false, email: '' });

  const [userError, setUserError] = useState('');

  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add('dark');

      localStorage.setItem('forderungen-dark', '1');

    } else {

      document.documentElement.classList.remove('dark');

      localStorage.setItem('forderungen-dark', '1');

    }

  }, [darkMode]);

  useEffect(() => {

    var isAndroid = (typeof AndroidBridge !== 'undefined' && AndroidBridge && AndroidBridge.saveFile);

    if (isAndroid) {

      // Sofortiger Export beim Start fuer Diagnose

      setTimeout(() => { try { window.writeSyncFile(collectAllData()); } catch (e) { console.log('[SYNC] startup error=' + e.message); } }, 10000);

      const t1 = setInterval(() => {

        try { window.writeSyncFile(collectAllData()); } catch (e) { console.log('[SYNC] interval error=' + e.message); }

      }, 30000);

      return () => { clearInterval(t1); };

    }

    // WebApp: kein Auto-Export

  }, []);

  async function handleSetup(e) {

    e.preventDefault();

    var username = (loginForm.username || '').trim() || 'admin';

    var password = loginForm.password || 'admin';

    var email = (loginForm.email || '').trim() || 'a@b.c';

    const hash = await hashPassword(password);

    const user = { username: username.replace(/[^a-zA-Z0-9_-]/g, '') || 'admin', passwordHash: hash, isAdmin: true, email: email };

    saveUsers([user]);

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));

    setCurrentUser(user);

    setSetupMode(false);

    localStorage.setItem('forderungen-dark', '1');

    document.documentElement.classList.add('dark');

    try { window.location.reload(); } catch(_) {}

  }

  async function handleLogin(e) {

    e.preventDefault();

    setLoginLoading(true);

    setLoginError('');

    const users = loadUsers();

    const user = users.find(u => u.username === loginForm.username.trim());

    if (!user) {

      setLoginError('Benutzer nicht gefunden.');

      setLoginLoading(false);

      return;

    }

    const ok = await verifyPassword(loginForm.password, user.passwordHash);

    if (!ok) {

      setLoginError('Falsches Passwort.');

      setLoginLoading(false);

      return;

    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));

    setCurrentUser(user);

    setLoginLoading(false);

  }

  function handleLogout() {

    sessionStorage.removeItem(SESSION_KEY);

    setCurrentUser(null);

    setLoginForm({

      username: '',

      password: ''

    });

  }

  async function handleAddUser(e) {

    e.preventDefault();

    if (!newUser.username.trim() || !newUser.password) {

      setUserError('Benutzername und Passwort erforderlich.');

      return;

    }

    const users = loadUsers();

    if (users.find(u => u.username === newUser.username.trim())) {

      setUserError('Benutzername bereits vergeben.');

      return;

    }

    const hash = await hashPassword(newUser.password);

    const updated = [...users, {

      username: newUser.username.trim(),

      passwordHash: hash,

      isAdmin: newUser.isAdmin,

      email: newUser.email ? newUser.email.trim() : ''

    }];

    saveUsers(updated);

    setNewUser({

      username: '',

      password: '',

      isAdmin: false,

      email: ''

    });

    setUserError('');

  }

  // Eigene E-Mail-Adresse eines beliebigen Nutzers (inkl. Nicht-Admin) aktualisieren

  function handleUpdateUser(username, patch) {

    const users = loadUsers();

    const updated = users.map(u => u.username === username ? {

      ...u,

      ...patch

    } : u);

    saveUsers(updated);

    const me = updated.find(u => u.username === currentUser.username);

    if (me) {

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(me));

      setCurrentUser(me);

    }

  }

  function handleDeleteUser(username) {

    const updated = loadUsers().filter(u => u.username !== username);

    saveUsers(updated);

    localStorage.removeItem(userStorageKey(username));

    setConfirmDeleteUser(null);

  }

  async function startEditUser(u) {

    setEditingUser(u.username);

    setEditForm({

      username: u.username,

      password: '',

      isAdmin: !!u.isAdmin,

      email: u.email || ''

    });

  }

  async function saveEditUser(e) {

    e.preventDefault();

    if (!editForm.username.trim()) return;

    const users = loadUsers();

    const oldName = editingUser;

    const patch = {

      username: editForm.username.trim(),

      isAdmin: editForm.isAdmin,

      email: editForm.email ? editForm.email.trim() : ''

    };

    if (editForm.password) {

      patch.passwordHash = await hashPassword(editForm.password);

    }

    const updated = users.map(u => u.username === oldName ? { ...u, ...patch } : u);

    saveUsers(updated);

    if (oldName !== editForm.username.trim()) {

      localStorage.removeItem(userStorageKey(oldName));

    }

    if (currentUser.username === oldName) {

      const me = updated.find(u => u.username === editForm.username.trim());

      if (me) {

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(me));

        setCurrentUser(me);

      }

    }

    setEditingUser(null);

    setEditForm({ username: '', password: '', isAdmin: false, email: '' });

  }

  const dk = 'dark:';

  if (setupMode) return /*#__PURE__*/React.createElement("div", {

    className: `min-h-screen flex items-center justify-center px-5 bg-slate-900 ${darkMode ? 'dark' : ''}`

  }, /*#__PURE__*/React.createElement("div", {

    className: "w-full max-w-sm"

  }, /*#__PURE__*/React.createElement("div", {

    className: "text-center mb-6"

  }, /*#__PURE__*/React.createElement(ShieldIcon, {

    size: 36,

    className: "mx-auto text-slate-200 mb-3"

  }), /*#__PURE__*/React.createElement("h1", {

    className: "text-xl font-semibold text-white dark:text-white"

  }, "Ersteinrichtung"), /*#__PURE__*/React.createElement("p", {

    className: "text-sm text-slate-100 mt-1"

  }, "Erstelle den ersten Admin-Benutzer")), /*#__PURE__*/React.createElement("form", {

    onSubmit: handleSetup,

    className: "auth-card bg-white dark:bg-slate-700 rounded-2xl border border-slate-600 dark:border-slate-600 p-5 space-y-3 shadow-sm"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Benutzername"), /*#__PURE__*/React.createElement("input", {

    required: true,

    autoFocus: true,

    value: loginForm.username,

    onChange: e => setLoginForm({

      ...loginForm,

      username: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-slate-600",

    placeholder: "admin"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Passwort"), /*#__PURE__*/React.createElement("input", {

    required: true,

    type: "password",

    value: loginForm.password,

    onChange: e => setLoginForm({

      ...loginForm,

      password: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-slate-600",

    placeholder: "Sicheres Passwort"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Eigene E-Mail-Adresse (f\xFCr Ratenangebote als Kopie)"), /*#__PURE__*/React.createElement("input", {

    type: "email",

    value: loginForm.email,

    onChange: e => setLoginForm({

      ...loginForm,

      email: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-slate-600",

    placeholder: "name@beispiel.de"

  })), /*#__PURE__*/React.createElement("button", {

    type: "submit",

    className: "w-full bg-slate-900 text-white font-medium text-sm rounded-lg py-2.5 mt-2"

  }, "Einrichten & Starten"))));

  if (!currentUser) return /*#__PURE__*/React.createElement("div", {

    className: `min-h-screen flex items-center justify-center px-5 bg-slate-900 ${darkMode ? 'dark' : ''}`

  }, /*#__PURE__*/React.createElement("div", {

    className: "w-full max-w-sm"

  }, /*#__PURE__*/React.createElement("div", {

    className: "text-center mb-6"

  }, /*#__PURE__*/React.createElement("div", {

    className: "w-14 h-14 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-3"

  }, /*#__PURE__*/React.createElement(ShieldIcon, {

    size: 24,

    className: "text-white"

  })), /*#__PURE__*/React.createElement("h1", {

    className: "text-xl font-semibold text-white"

  }, "Forderungs- und Rechnungsmanagement / Finanzplan"), /*#__PURE__*/React.createElement("p", {

    className: "text-sm text-slate-100 mt-1"

  }, "Bitte anmelden")), /*#__PURE__*/React.createElement("form", {

    onSubmit: handleLogin,

    className: "auth-card bg-white dark:bg-slate-700 rounded-2xl border border-slate-600 dark:border-slate-600 p-5 space-y-3 shadow-sm"

  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Benutzername"), /*#__PURE__*/React.createElement("input", {

    required: true,

    autoFocus: true,

    value: loginForm.username,

    onChange: e => setLoginForm({

      ...loginForm,

      username: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "Benutzername"

  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {

    className: "text-xs font-medium text-slate-100 mb-1 block"

  }, "Passwort"), /*#__PURE__*/React.createElement("input", {

    required: true,

    type: "password",

    value: loginForm.password,

    onChange: e => setLoginForm({

      ...loginForm,

      password: e.target.value

    }),

    className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

    placeholder: "Passwort"

  })), loginError && /*#__PURE__*/React.createElement("p", {

    className: "text-xs text-rose-500"

  }, loginError), /*#__PURE__*/React.createElement("button", {

    type: "submit",

    disabled: loginLoading,

    className: "w-full bg-slate-900 text-white font-medium text-sm rounded-lg py-2.5 mt-2 disabled:opacity-50"

  }, loginLoading ? 'Prüfe…' : 'Anmelden'))));

  if (userMgmt && currentUser.isAdmin) {

    const users = loadUsers();

    if (editingUser) {

      return /*#__PURE__*/React.createElement("div", {

        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"

      }, /*#__PURE__*/React.createElement("div", {

        className: "w-full max-w-sm bg-slate-800 rounded-xl border border-slate-600 p-5 space-y-3"

      }, /*#__PURE__*/React.createElement("h2", {

        className: "text-lg font-semibold text-white"

      }, "Benutzer bearbeiten"), /*#__PURE__*/React.createElement("form", {

        onSubmit: saveEditUser,

        className: "space-y-2"

      }, /*#__PURE__*/React.createElement("input", {

        value: editForm.username,

        onChange: e => setEditForm({ ...editForm, username: e.target.value }),

        className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400 outline-none",

        placeholder: "Benutzername"

      }), /*#__PURE__*/React.createElement("input", {

        type: "password",

        value: editForm.password,

        onChange: e => setEditForm({ ...editForm, password: e.target.value }),

        className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400 outline-none",

        placeholder: "Neues Passwort (leer = unver\u00E4ndert)"

      }), /*#__PURE__*/React.createElement("input", {

        type: "email",

        value: editForm.email,

        onChange: e => setEditForm({ ...editForm, email: e.target.value }),

        className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400 outline-none",

        placeholder: "E-Mail"

      }), /*#__PURE__*/React.createElement("label", {

        className: "flex items-center gap-2 text-sm text-slate-100 cursor-pointer"

      }, /*#__PURE__*/React.createElement("input", {

        type: "checkbox",

        checked: editForm.isAdmin,

        onChange: e => setEditForm({ ...editForm, isAdmin: e.target.checked })

      }), "Admin-Rechte"), /*#__PURE__*/React.createElement("div", {

        className: "flex gap-2 pt-1"

      }, /*#__PURE__*/React.createElement("button", {

        type: "submit",

        className: "flex-1 bg-slate-900 text-white text-sm font-medium rounded-lg py-2"

      }, "Speichern"), /*#__PURE__*/React.createElement("button", {

        type: "button",

        onClick: () => setEditingUser(null),

        className: "flex-1 bg-slate-600 text-white text-sm font-medium rounded-lg py-2"

      }, "Abbrechen")))));

    }



    return /*#__PURE__*/React.createElement("div", {

      className: `min-h-screen bg-slate-900 pb-10 ${darkMode ? 'dark' : ''}`

    }, /*#__PURE__*/React.createElement("header", {

      className: "bg-white text-slate-900 dark:bg-slate-900 dark:text-white px-5 pt-7 pb-5"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center justify-between"

    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

      className: "mono text-xs tracking-widest text-slate-100 uppercase mb-1"

    }, "Benutzerverwaltung"), /*#__PURE__*/React.createElement("h1", {

      className: "text-xl font-semibold text-white"

    }, "Benutzer")), /*#__PURE__*/React.createElement("div", {

      className: "flex gap-2"

    }, null, /*#__PURE__*/React.createElement("button", {

      onClick: () => setUserMgmt(false),

      className: "text-slate-100 p-1"

    }, /*#__PURE__*/React.createElement(XIcon, {

      size: 18

    }))))), /*#__PURE__*/React.createElement("div", {

      className: "px-5 mt-4 space-y-3"

    }, users.map(u => /*#__PURE__*/React.createElement("div", {

      key: u.username,

      className: "auth-card bg-white dark:bg-slate-800 rounded-xl border border-slate-600 px-4 py-3 space-y-2"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center justify-between gap-2"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center gap-2"

    }, /*#__PURE__*/React.createElement(UserIcon, {

      size: 16,

      className: "text-slate-100"

    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {

      className: "text-sm font-medium text-slate-100"

    }, u.username), /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100"

    }, /*#__PURE__*/React.createElement("div", {

      className: "flex items-center gap-1"

    }, /*#__PURE__*/React.createElement("button", {

      onClick: () => startEditUser(u),

      className: "text-slate-100 p-1"

    }, /*#__PURE__*/React.createElement(PencilIcon, {

      size: 15

    })), u.username !== currentUser.username && (confirmDeleteUser === u.username ? /*#__PURE__*/React.createElement("button", {

      onClick: () => handleDeleteUser(u.username),

      className: "text-xs font-medium text-white bg-rose-600 rounded-lg px-3 py-1.5"

    }, "L\xF6schen?") : /*#__PURE__*/React.createElement("button", {

      onClick: () => setConfirmDeleteUser(u.username),

      className: "text-slate-100 p-1"

    }, /*#__PURE__*/React.createElement(TrashIcon, {

      size: 15

    })))))

    ), /*#__PURE__*/React.createElement("div", {

      className: "flex items-center gap-2"

    }, /*#__PURE__*/React.createElement(MailIcon, {

      size: 13,

      className: "text-slate-100 shrink-0"

    }), /*#__PURE__*/React.createElement("input", {

      type: "email",

      value: u.email || '',

      onChange: e => handleUpdateUser(u.username, {

        email: e.target.value

      }),

      className: "w-full text-xs border border-slate-600 rounded-lg px-2 py-1.5 text-white placeholder:text-slate-400 bg-slate-700 dark:bg-slate-800 outline-none focus:border-slate-600",

      placeholder: "Eigene E-Mail-Adresse"

    })))), /*#__PURE__*/React.createElement("div", {

      className: "auth-card bg-white dark:bg-slate-800 rounded-xl border border-slate-600 p-4"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-xs font-medium text-slate-100 mb-3"

    }, "Neuen Benutzer anlegen"), /*#__PURE__*/React.createElement("form", {

      onSubmit: handleAddUser,

      className: "auth-card space-y-2"

    }, /*#__PURE__*/React.createElement("input", {

      required: true,

      value: newUser.username,

      onChange: e => setNewUser({

        ...newUser,

        username: e.target.value

      }),

      className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

      placeholder: "Benutzername"

    }), /*#__PURE__*/React.createElement("input", {

      required: true,

      type: "password",

      value: newUser.password,

      onChange: e => setNewUser({

        ...newUser,

        password: e.target.value

      }),

      className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

      placeholder: "Passwort"

    }), /*#__PURE__*/React.createElement("input", {

      type: "email",

      value: newUser.email,

      onChange: e => setNewUser({

        ...newUser,

        email: e.target.value

      }),

      className: "w-full text-sm border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white placeholder:text-slate-400 outline-none focus:border-slate-600",

      placeholder: "E-Mail (optional)"

    }), /*#__PURE__*/React.createElement("label", {

      className: "flex items-center gap-2 text-sm text-slate-100 cursor-pointer"

    }, /*#__PURE__*/React.createElement("input", {

      type: "checkbox",

      checked: newUser.isAdmin,

      onChange: e => setNewUser({

        ...newUser,

        isAdmin: e.target.checked

      }),

      className: "rounded"

    }), "Admin-Rechte"), userError && /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-rose-500"

    }, userError), /*#__PURE__*/React.createElement("button", {

      type: "submit",

      className: "w-full bg-slate-900 text-white text-sm font-medium rounded-lg py-2"

    }, "Benutzer anlegen")))))));

  }

  return currentUser ? /*#__PURE__*/React.createElement("div", null,

    /*#__PURE__*/React.createElement(AppShell, {

      currentUser: currentUser,

      onLogout: handleLogout,

      darkMode: darkMode,

      toggleDark: () => setDarkMode(!darkMode),

      onUserMgmt: currentUser.isAdmin ? () => setUserMgmt(true) : null

    }),

    /*#__PURE__*/React.createElement("footer", {

      className: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-100 border-t border-slate-300 dark:border-slate-700 relative px-5 mt-6 mb-8 text-center"

    }, /*#__PURE__*/React.createElement("p", {

      className: "text-xs text-slate-100"

    }, "Forderungs- und Rechnungsmanagement / Finanzplan \xB7 v", APP_VERSION))

  ) : /*#__PURE__*/React.createElement(AppShell, {

    currentUser: currentUser,

    onLogout: handleLogout,

    darkMode: darkMode,

    toggleDark: () => setDarkMode(!darkMode),

    onUserMgmt: currentUser.isAdmin ? () => setUserMgmt(true) : null

  });

}

(function(){try{console.log("[SYNC] early export");var r=window.writeSyncFile(collectAllData());console.log("[SYNC] early export result="+JSON.stringify(r));}catch(e){console.log("[SYNC] early export error="+e.message);}})();



ReactDOM.createRoot(document.getElementById('root')).render( /*#__PURE__*/React.createElement(Root, null));