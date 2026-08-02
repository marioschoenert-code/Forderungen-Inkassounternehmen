package com.forderungen.app;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.widget.FrameLayout;
import android.widget.FrameLayout.LayoutParams;
import java.io.File;
import android.util.Log;

public class SyncMainActivity extends Activity {

    private WebView webView;

    public WebView getWebView() { return webView; }

    static {
        android.webkit.WebView.setWebContentsDebuggingEnabled(true);
    }

    // Bridge that catches WebView downloads and writes them to /sdcard/Download/
    private static class DownloadBridge implements DownloadListener {
        private final Context context;
        DownloadBridge(Context ctx) { this.context = ctx; }
        @Override
        public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
            try {
                String guessed = android.webkit.URLUtil.guessFileName(url, contentDisposition, mimetype);
                if (guessed == null || guessed.isEmpty()) guessed = "download.bin";
                DownloadManager.Request req = new DownloadManager.Request(android.net.Uri.parse(url));
                req.setMimeType(mimetype);
                req.addRequestHeader("User-Agent", userAgent);
                req.setDescription("ForderungenApp Export");
                req.setTitle(guessed);
                req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                req.setDestinationInExternalPublicDir("Download", "forderungen-sync/" + guessed);
                DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm != null) dm.enqueue(req);
            } catch (Exception e) { e.printStackTrace(); }
        }
    }

    // JS Bridge: window.AndroidBridge.saveFile(filename, base64Payload)
    public static class AndroidBridge {
        private final Context context;
        AndroidBridge(Context ctx) { this.context = ctx; }
        @JavascriptInterface
        public boolean saveFile(String filename, String base64Payload) {
            try {
                byte[] data = android.util.Base64.decode(base64Payload, android.util.Base64.DEFAULT);
                // App-eigener externer Ordner: kein Scoped-Storage-Konflikt (API 33+),
                // von Syncthing beobachtbar: .../Android/data/com.forderungen.app/files/forderungen-sync/
                File dir = new File(context.getExternalFilesDir(null), "forderungen-sync");
                if (!dir.exists()) dir.mkdirs();
                File out = new File(dir, filename);
                java.io.FileOutputStream fos = new java.io.FileOutputStream(out);
                fos.write(data);
                fos.close();
                Log.d("SYNC", "saveFile wrote: " + out.getAbsolutePath() + " (" + data.length + " bytes)");
                // ZUSATZ: auch nach /sdcard/Download/Forderungen-sync/ schreiben (MediaStore,
                // API33-konform), damit Syncthing (Tablet + Desktop) die Datei sieht.
                try {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                        android.net.Uri coll = android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                        // Robust: eindeutigen Dateinamen (Timestamp) verwenden, damit
                        // MediaStore nie auf '(n).json' umbenennen muss (Konflikt-frei).
                        String msName = filename;
                        if ("forderungen-sync.json".equals(filename)) {
                            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd-HHmmss-SSS", java.util.Locale.US);
                            msName = "forderungen-sync-" + sdf.format(new java.util.Date()) + ".json";
                        }
                        // Alle vorhandenen forderungen-sync*.json im Sync-Ordner loeschen (Replace),
                        // damit immer nur die neueste uebrig bleibt. RELATIVE_PATH weglassen,
                        // da MediaStore den Pfad manchmal anders normalisiert (sonst keine Treffer).
                        try {
                            String delSel = android.provider.MediaStore.Downloads.DISPLAY_NAME + " LIKE ?";
                            String[] delArgs = new String[]{ "forderungen-sync%" };
                            android.database.Cursor dcur = context.getContentResolver().query(coll, new String[]{ "_id" }, delSel, delArgs, null);
                            if (dcur != null) {
                                while (dcur.moveToNext()) {
                                    long did = dcur.getLong(0);
                                    context.getContentResolver().delete(android.content.ContentUris.withAppendedId(coll, did), null, null);
                                }
                                dcur.close();
                            }
                        } catch (Exception de) { Log.w("SYNC", "saveFile mediastore delete old: " + de.getMessage()); }
                        // Jetzt sicher einfuegen (eindeutiger Name, kein Konflikt)
                        android.content.ContentValues cv = new android.content.ContentValues();
                        cv.put(android.provider.MediaStore.Downloads.DISPLAY_NAME, msName);
                        cv.put(android.provider.MediaStore.Downloads.RELATIVE_PATH,
                                android.os.Environment.DIRECTORY_DOWNLOADS + "/Forderungen-sync");
                        android.net.Uri targetUri = context.getContentResolver().insert(coll, cv);
                        if (targetUri != null) {
                            java.io.OutputStream os = context.getContentResolver().openOutputStream(targetUri);
                            os.write(data);
                            os.close();
                            Log.d("SYNC", "saveFile wrote (mediastore): " + targetUri.toString() + " (" + data.length + " bytes)");
                        }
                    } else {
                        File pubDir = new File(android.os.Environment.getExternalStorageDirectory(), "Forderungen-sync");
                        if (!pubDir.exists()) pubDir.mkdirs();
                        File pubOut = new File(pubDir, filename);
                        java.io.FileOutputStream pfos = new java.io.FileOutputStream(pubOut);
                        pfos.write(data);
                        pfos.close();
                        Log.d("SYNC", "saveFile wrote (public): " + pubOut.getAbsolutePath() + " (" + data.length + " bytes)");
                    }
                } catch (Exception pe) {
                    Log.w("SYNC", "saveFile public-dir skipped: " + pe.getMessage());
                }
                return true;
            } catch (Exception e) {
                Log.e("SYNC", "saveFile error: " + e.getMessage());
                return false;
            }
        }

        // Import: liest die frischeste forderungen-sync.json aus dem Sync-Ordner
        // und uebergibt den Inhalt an window.__onSyncFilePicked(content).
        @JavascriptInterface
        public void pickSyncFile() {
            final String content = readLatestSyncFile();
            if (context instanceof Activity) {
                ((Activity) context).runOnUiThread(new Runnable() {
                    @Override public void run() {
                        WebView wv = ((SyncMainActivity) context).getWebView();
                        if (wv != null && content != null) {
                            // JSONObject.quote liefert ein JS-sicheres String-Literal
                            String quoted = org.json.JSONObject.quote(content);
                            wv.evaluateJavascript("window.__onSyncFilePicked(" + quoted + ")", null);
                        }
                    }
                });
            }
        }

        private String readLatestSyncFile() {
            try {
                // 1) API33-konform: zuerst aus MediaStore /sdcard/Download/Forderungen-sync/ lesen
                //    (dort schreibt saveFile den Export hin).
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                    try {
                        android.net.Uri coll = android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI;
                        // Alle forderungen-sync* im Ordner, neueste zuerst (Export nutzt
                        // einen eindeutigen Timestamp-Namen, daher die neueste nehmen).
                        String sel = android.provider.MediaStore.Downloads.RELATIVE_PATH + "=? AND " +
                                android.provider.MediaStore.Downloads.DISPLAY_NAME + " LIKE ?";
                        String[] args = new String[]{ android.os.Environment.DIRECTORY_DOWNLOADS + "/Forderungen-sync/", "forderungen-sync%" };
                        android.database.Cursor cur = context.getContentResolver().query(
                                coll, new String[]{ "_id", android.provider.MediaStore.Downloads.DATE_MODIFIED },
                                sel, args, android.provider.MediaStore.Downloads.DATE_MODIFIED + " DESC");
                        if (cur != null) {
                            if (cur.moveToFirst()) {
                                long id = cur.getLong(0);
                                android.net.Uri uri = android.content.ContentUris.withAppendedId(coll, id);
                                java.io.InputStream is = context.getContentResolver().openInputStream(uri);
                                java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
                                byte[] buf = new byte[4096];
                                int n;
                                while ((n = is.read(buf)) != -1) bos.write(buf, 0, n);
                                is.close();
                                cur.close();
                                String result = new String(bos.toByteArray(), "UTF-8");
                                Log.d("SYNC", "pickSyncFile read (mediastore) " + result.length() + " bytes");
                                return result;
                            }
                            cur.close();
                        }
                    } catch (Exception me) { Log.w("SYNC", "readLatestSyncFile mediastore: " + me.getMessage()); }
                }
                // 2) Fallback: app-eigener Ordner (alt)
                File dir = new File(context.getExternalFilesDir(null), "forderungen-sync");
                File f = new File(dir, "forderungen-sync.json");
                if (f.exists()) {
                    java.io.FileInputStream fis = new java.io.FileInputStream(f);
                    java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
                    byte[] buf = new byte[4096];
                    int n;
                    while ((n = fis.read(buf)) != -1) bos.write(buf, 0, n);
                    fis.close();
                    String result = new String(bos.toByteArray(), "UTF-8");
                    Log.d("SYNC", "pickSyncFile read " + result.length() + " bytes from " + f.getAbsolutePath());
                    return result;
                }
                Log.d("SYNC", "pickSyncFile: file not found at " + f.getAbsolutePath());
                return null;
            } catch (Exception e) {
                Log.e("SYNC", "pickSyncFile error: " + e.getMessage());
                return null;
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // RUNTIME PERMISSIONS: READ/WRITE_EXTERNAL_STORAGE anfordern (Schreibzugriff
        // auf /sdcard/Forderungen-sync fuer Syncthing-Sichtbarkeit, auch API33+)
        String permRead = "android.permission.READ_EXTERNAL_STORAGE";
        String permWrite = "android.permission.WRITE_EXTERNAL_STORAGE";
        java.util.List<String> needed = new java.util.ArrayList<String>();
        if (checkSelfPermission(permRead) != android.content.pm.PackageManager.PERMISSION_GRANTED) needed.add(permRead);
        if (checkSelfPermission(permWrite) != android.content.pm.PackageManager.PERMISSION_GRANTED) needed.add(permWrite);
        if (!needed.isEmpty()) requestPermissions(needed.toArray(new String[0]), 1);

        getWindow().setFlags(1024, 1024);
        getWindow().addFlags(128);

        FrameLayout layout = new FrameLayout(this);

        webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        webView.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        webView.getSettings().setSupportZoom(false);
        webView.getSettings().setBuiltInZoomControls(false);
        webView.getSettings().setDisplayZoomControls(false);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setLoadWithOverviewMode(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(android.webkit.WebView view, String url) {
                super.onPageFinished(view, url);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage cm) {
                Log.d("SYNCJS", "[" + cm.messageLevel() + "] " + cm.message());
                return true;
            }
        });
        webView.setDownloadListener(new DownloadBridge(this));
        webView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");

        layout.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(layout);

        webView.loadUrl("file:///android_asset/index.html");

        // Auto-Export: alle 30s (Android-Rundlauf via JS-Bridge)
        webView.postDelayed(new Runnable() {
            @Override public void run() {
                webView.evaluateJavascript("if (typeof window.writeSyncFile === 'function') { try { window.writeSyncFile(window.collectAllData()); } catch(e){} }", null);
            }
        }, 30000);
    }
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }
}
