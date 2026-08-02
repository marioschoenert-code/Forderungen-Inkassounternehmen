# Forderungen-Inkassounternehmen (ForderungenApp)

Hybrid Android-App (WebView) + WebApp (PWA) zur Verwaltung von Forderungen, Rechnungen und Budget.
Login: Admin / 8484.

## Features

- Dark-Mode-Default (via `index.html`-Injection vor `app.js`)
- Sync zwischen Android-App und WebApp (Datei `forderungen-sync.json`, API33-kompatibel)
- Budget-Verwaltung (Fixkosten / Ausgaben / Einnahmen)
- Forderungs- & Rechnungslisten

## Build (Android APK)

```bash
# 1. Bundle patchen (assets/app.js, index.html mit Dark-Inject)
python build_swap.py

# 2. Java kompilieren + DEX-Merge + signieren (siehe build_from_orig.py / finish_build.py)
#    benötigt: android-34/android.jar, d8, baksmali/smali, apksigner, debug.keystore
```

## Struktur

| Datei | Zweck |
|-------|-------|
| `SyncMainActivity.java` | WebView-Activity, Sync-Bridge (`AndroidBridge`), Auto-Export |
| `SyncApp.java` | App-Klasse |
| `AssetWebViewClient.java` | WebView-Client |
| `build_swap.py` | Tauscht app.js + index.html + classes.dex in der Original-APK |
| `assets/app.js` | React-Bundle (Source of Truth) |
| `assets/index_patched.html` | index.html mit Dark-Inject |
| `_baksmali.jar` / `_smali.jar` / `apktool.jar` | DEX-Tools |

## Wichtig

- **Keystores niemals committen** (`.gitignore` schützt `*.keystore`).
- Sync-Pfad Android: `/sdcard/Android/data/com.forderungen.app/files/forderungen-sync/`
- Detaillierte Projektdoku: siehe `ObsidianVault` (ForderungenApp/-Ordner).

## Stand

Build `ForderungenApp-v1.30.25-final.apk` — Dark-Mode, Black-Screen-Fix, Sync-Round-Trip verifiziert.
