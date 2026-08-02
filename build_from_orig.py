import zipfile, os, subprocess, sys, shutil

WORK = r"D:\Forderungsapp\apk-build"
JAVA = r"C:\Program Files\Android\Android Studio\jbr\bin\java.exe"
ZIPALIGN = r"C:\Users\Mario\AppData\Local\Android\Sdk\build-tools\36.1.0\zipalign.exe"
APKSIGNER = r"C:\Users\Mario\AppData\Local\Android\Sdk\build-tools\36.1.0\lib\apksigner.jar"
KEYSTORE = os.path.join(WORK, "debug.keystore")

SRC = os.path.join(WORK, "ForderungenApp-v1.30.25.apk")
FINAL = os.path.join(WORK, "ForderungenApp-v1.30.25-final.apk")
TMP = os.path.join(WORK, "_repack_tmp")

# Clean tmp
if os.path.exists(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP)

# Extract original APK
with zipfile.ZipFile(SRC, 'r') as z:
    z.extractall(TMP)

# Overwrite assets
for name in ['app.js', 'index.html']:
    src = os.path.join(WORK, 'build', name)
    dst = os.path.join(TMP, 'assets', name)
    open(dst, 'wb').write(open(src, 'rb').read())

# Remove META-INF
m = os.path.join(TMP, 'META-INF')
if os.path.exists(m):
    shutil.rmtree(m)

# Repack preserving compression
unsigned = os.path.join(WORK, '_build_unsigned.apk')
aligned = os.path.join(WORK, '_build_aligned.apk')

with zipfile.ZipFile(SRC, 'r') as zin:
    with zipfile.ZipFile(unsigned, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = open(os.path.join(TMP, item.filename), 'rb').read() if os.path.exists(os.path.join(TMP, item.filename)) else zin.read(item.filename)
            zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
            zi.compress_type = item.compress_type
            zi.external_attr = item.external_attr
            zi.internal_attr = item.internal_attr
            zi.create_system = item.create_system
            zout.writestr(zi, data)

print('repacked')

# zipalign
r = subprocess.run([ZIPALIGN, "-p", "4", unsigned, aligned], capture_output=True, text=True)
print("zipalign:", r.returncode, r.stderr[-300:])
if r.returncode != 0:
    sys.exit(1)

# sign
r = subprocess.run([JAVA, "-jar", APKSIGNER, "sign",
                    "--ks", KEYSTORE, "--ks-pass", "pass:android",
                    "--ks-key-alias", "androiddebugkey", "--key-pass", "pass:android",
                    "--out", FINAL, aligned], capture_output=True, text=True)
print("apksigner:", r.returncode, r.stderr[-300:])
if r.returncode != 0:
    sys.exit(1)

print("FINAL:", os.path.getsize(FINAL), "bytes")
