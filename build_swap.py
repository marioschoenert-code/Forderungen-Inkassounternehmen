import zipfile, os, subprocess, sys

WORK = r"D:\Forderungsapp\apk-build"
JAVA = r"C:\Program Files\Android\Android Studio\jbr\bin\java.exe"
ZIPALIGN = r"C:\Users\Mario\AppData\Local\Android\Sdk\build-tools\36.1.0\zipalign.exe"
APKSIGNER = r"C:\Users\Mario\AppData\Local\Android\Sdk\build-tools\36.1.0\lib\apksigner.jar"
KEYSTORE = os.path.join(WORK, "debug.keystore")

src = os.path.join(WORK, "ForderungenApp-v1.30.25.apk")
fixed = os.path.join(WORK, "_clean", "assets", "app.js")
classes_merged = os.path.join(WORK, "_classes_merged.dex")
index_patched = os.path.join(WORK, "_clean", "assets", "index_patched.html")
unsigned = os.path.join(WORK, "_from_orig_unsigned.apk")
aligned = os.path.join(WORK, "_aligned.apk")
final = os.path.join(WORK, "ForderungenApp-v1.30.25-final.apk")
classes4 = os.path.join(WORK, "classes4.dex")

# Build patched index.html with DEFAULT DARK MODE (set dark class + localStorage BEFORE app.js loads).
# This avoids the white flash / light default on fresh install (localStorage empty).
# IMPORTANT: source from the ORIGINAL APK's index.html (correct vendor script order).
# The apktool_decoded copy is stale/divergent and must NOT be used as base.
with zipfile.ZipFile(src, 'r') as z:
    orig_index_data = z.read('assets/index.html')
orig_index_tmp = os.path.join(WORK, "_orig_index.html")
with open(orig_index_tmp, 'wb') as f:
    f.write(orig_index_data)
orig_index = orig_index_tmp


with open(orig_index, 'r', encoding='utf-8') as f:
    html = f.read()

# Inject dark-mode default right after <body> opens (before #root + app.js).
# Uses a raw class set on <html> so Tailwind `dark:` variants apply on first paint.
dark_inject = (
    '<script>(function(){try{'
        'var d=localStorage.getItem("forderungen-dark");'
        'if(d===null||d==="1"){document.documentElement.classList.add("dark");'
        'try{localStorage.setItem("forderungen-dark","1");}catch(e){}}'
        '}catch(e){document.documentElement.classList.add("dark");}})();'
        '</script>'
        '<style>'
        'html.dark, html.dark body { background:#0f172a !important; color:#e2e8f0 !important; }'
        'html.dark #root { background:#0f172a !important; }'
        '</style>'
    )
# Insert right after <body> tag (before <div id="root">)
if '<body>' in html:
    html = html.replace('<body>', '<body>' + dark_inject, 1)
else:
    # fallback: before app.js script
    html = html.replace('<script src="./app.js"></script>', dark_inject + '\n<script src="./app.js"></script>', 1)

with open(index_patched, 'w', encoding='utf-8') as f:
    f.write(html)
print("built index_patched.html with default dark mode")


#    (preserving original compression types)
zin = zipfile.ZipFile(src, 'r')
zout = zipfile.ZipFile(unsigned, 'w', zipfile.ZIP_STORED)
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == 'assets/app.js':
        data = open(fixed, 'rb').read()
    if item.filename == 'assets/index.html':
        data = open(index_patched, 'rb').read()
    zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
    zi.compress_type = item.compress_type
    zi.external_attr = item.external_attr
    zi.internal_attr = item.internal_attr
    zi.create_system = item.create_system
    zi.date_time = item.date_time
    if item.filename == 'classes.dex' and os.path.exists(classes_merged):
        data = open(classes_merged, 'rb').read()
    zout.writestr(zi, data)
zin.close()
zout.close()
if os.path.exists(classes_merged):
    print("swapped app.js + MERGED classes.dex (SyncMainActivity in primary dex), preserved compression")
else:
    print("swapped app.js, preserved compression types (no merged dex)")

# 2) zipalign (aligns resources.arsc etc.)
if os.path.exists(aligned): os.remove(aligned)
r = subprocess.run([ZIPALIGN, "-p", "4", unsigned, aligned], capture_output=True, text=True)
print("zipalign:", r.returncode, r.stderr[-200:])
if r.returncode != 0: sys.exit(1)

# 3) classes4.dex injection removed - SyncMainActivity is now in classes3.dex (replaces original MainActivity)
# 3b) inject patched BINARY AndroidManifest.xml (compiled via aapt2, carries versionCode/versionName)
manifest_bin = os.path.join(WORK, "_manifest_binary.xml")
tmp_manifest = os.path.join(WORK, "_manifest_patched.apk")
with zipfile.ZipFile(aligned, 'r') as zin:
    with zipfile.ZipFile(tmp_manifest, 'w', zipfile.ZIP_STORED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'AndroidManifest.xml':
                data = open(manifest_bin, 'rb').read()
            zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
            zi.compress_type = item.compress_type
            zi.external_attr = item.external_attr
            zi.internal_attr = item.internal_attr
            zi.create_system = item.create_system
            zi.date_time = item.date_time
            zout.writestr(zi, data)
print("binary manifest injected (versionCode/versionName)")
aligned = tmp_manifest

# 4) sign — release keystore if env provided, else debug
if os.path.exists(final): os.remove(final)
release_ks = os.environ.get("FORDEUNGEN_KEYSTORE")
if release_ks and os.path.exists(release_ks):
    ks_pass    = os.environ.get("FORDEUNGEN_KS_PASS", "")
    key_alias = os.environ.get("FORDEUNGEN_KEY_ALIAS", "forderungen")
    key_pass  = os.environ.get("FORDEUNGEN_KEY_PASS", ks_pass)
    r = subprocess.run([JAVA, "-jar", APKSIGNER, "sign",
                        "--ks", release_ks, "--ks-pass", f"pass:{ks_pass}",
                        "--ks-key-alias", key_alias, "--key-pass", f"pass:{key_pass}",
                        "--out", final, aligned], capture_output=True, text=True)
    print("apksigner (RELEASE):", r.returncode, r.stderr[-200:])
else:
    r = subprocess.run([JAVA, "-jar", APKSIGNER, "sign",
                        "--ks", KEYSTORE, "--ks-pass", "pass:android",
                        "--ks-key-alias", "androiddebugkey", "--key-pass", "pass:android",
                        "--out", final, aligned], capture_output=True, text=True)
    print("apksigner (DEBUG):", r.returncode, r.stderr[-200:])
if r.returncode != 0: sys.exit(1)
print("FINAL:", os.path.getsize(final), "bytes")
