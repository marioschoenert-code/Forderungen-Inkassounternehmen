import zipfile, os, subprocess, sys

WORK = r"D:\Forderungsapp\apk-build"
JAVA = r"C:\Program Files\Android\Android Studio\jbr\bin\java.exe"
ZIPALIGN = r"C:\Users\Mario\AppData\Local\Android\Sdk\build-tools\36.1.0\zipalign.exe"
APKSIGNER = r"C:\Users\Mario\AppData\Local\Android\Sdk\build-tools\36.1.0\lib\apksigner.jar"
KEYSTORE = os.path.join(WORK, "debug.keystore")

unsigned = os.path.join(WORK, "_unsigned.apk")
aligned = os.path.join(WORK, "_aligned.apk")
final = os.path.join(WORK, "ForderungenApp-v1.30.25-final.apk")
classes4 = os.path.join(WORK, "classes4.dex")

# 1) zipalign
if os.path.exists(aligned): os.remove(aligned)
r = subprocess.run([ZIPALIGN, "-p", "4", unsigned, aligned], capture_output=True, text=True)
print("zipalign:", r.returncode, r.stderr[-300:])
if r.returncode != 0: sys.exit(1)

# 2) inject classes4.dex (if not present)
z = zipfile.ZipFile(aligned, 'a')
if 'classes4.dex' not in z.namelist():
    z.write(classes4, 'classes4.dex')
    print("classes4.dex injected")
else:
    print("classes4.dex already present")
z.close()

# 3) sign
if os.path.exists(final): os.remove(final)
r = subprocess.run([JAVA, "-jar", APKSIGNER, "sign",
                    "--ks", KEYSTORE, "--ks-pass", "pass:android",
                    "--ks-key-alias", "androiddebugkey", "--key-pass", "pass:android",
                    "--out", final, aligned], capture_output=True, text=True)
print("apksigner:", r.returncode, r.stderr[-300:])
if r.returncode != 0: sys.exit(1)
print("FINAL:", os.path.getsize(final), "bytes")
