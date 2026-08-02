package com.forderungen.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;

/**
 * WebViewClient that serves app assets over a virtual http origin
 * (http://127.0.0.1:8080/assets/...) so that Tesseract.js workers can
 * importScripts from http:// (file:// workers are blocked on Android WebView).
 */
public class AssetWebViewClient extends WebViewClient {
    private final Context context;

    public AssetWebViewClient(Context ctx) {
        this.context = ctx;
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String url = request.getUrl().toString();
        if (!url.startsWith("file://") && !url.startsWith("http://127.0.0.1:8080")) {
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            context.startActivity(i);
            return true;
        }
        return false;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
        android.util.Log.d("OCRSELFTEST", "REQ:" + url);
        if (url.contains("127.0.0.1:8080")) {
            int idx = url.indexOf("8080");
            if (idx >= 0) {
                String path = url.substring(idx + 5);
                if (path.startsWith("/")) {
                    path = path.substring(1);
                }
                int q = path.indexOf('?');
                String query = "";
                if (q >= 0) {
                    query = path.substring(q + 1);
                    path = path.substring(0, q);
                }
                try {
                    if (path.equals("ocrselftest") || path.equals("ocrselftest.html")) {
                        android.util.Log.d("OCRSELFTEST", "PAGE_LOADED");
                        return new WebResourceResponse("text/html", "UTF-8",
                                new java.io.ByteArrayInputStream(buildOcrSelfTest().getBytes("UTF-8")));
                    }
                    if (path.equals("ocrresult")) {
                        String dec = java.net.URLDecoder.decode(query, "UTF-8");
                        int ti = dec.indexOf("t=");
                        String text = ti >= 0 ? dec.substring(ti + 2) : dec;
                        android.util.Log.d("OCRSELFTEST", "RESULT:" + text);
                        return new WebResourceResponse("text/plain", "UTF-8",
                                new java.io.ByteArrayInputStream("OK".getBytes("UTF-8")));
                    }
                    InputStream is = context.getAssets().open(path);
                    String mime = guessMime(path);
                    boolean text = mime.startsWith("text/")
                            || mime.equals("application/javascript")
                            || mime.equals("application/json");
                    return new WebResourceResponse(mime, text ? "UTF-8" : null, is);
                } catch (IOException e) {
                    return null;
                }
            }
        }
        return null;
    }

    private String buildOcrSelfTest() {
        return "<!DOCTYPE html><html lang=\"de\"><head><meta charset=\"utf-8\">"
                + "<title>OCR Self-Test</title>"
                + "<style>body{font-family:sans-serif;background:#fff;color:#111;padding:16px}"
                + "#out{white-space:pre-wrap;border:1px solid #888;padding:8px;margin-top:8px}"
                + "#img{max-width:300px;border:1px solid #ccc}</style></head><body>"
                + "<h2>ForderungsApp OCR Self-Test</h2>"
                + "<p>Worker loaded over <b>http://127.0.0.1:8080</b> (same-origin) &mdash; proving the file:// importScripts block is bypassed.</p>"
                + "<img id=\"img\" src=\"assets/receipt_test.png\"><div id=\"out\">running...</div>"
                + "<script src=\"assets/vendor/tesseract/tesseract.min.js\"></script>"
                + "<script>"
                + "const out=document.getElementById('out');"
                + "async function run(){try{"
                + "const du=document.getElementById('img').src;"
                + "out.textContent='Tesseract v'+(Tesseract.version||'?')+' — recognizing...';"
                + "const r=await Tesseract.recognize(du,'deu+eng',{"
                + "workerPath:'assets/vendor/tesseract/worker.min.js',"
                + "corePath:'assets/vendor/tesseract/tesseract-core.wasm.js',"
                + "langPath:'assets/vendor/tesseract'});"
                + "out.textContent='OCR_OK\\n\\n'+(r.data.text||'(empty)');"
                + "fetch('http://127.0.0.1:8080/ocrresult?t='+encodeURIComponent(r.data.text||'(empty)'));"
                + "}catch(e){out.textContent='OCR_ERR: '+String(e&&e.stack||e);"
                + "fetch('http://127.0.0.1:8080/ocrresult?t='+encodeURIComponent('ERR:'+String(e&&e.stack||e)));}"
                + "run();"
                + "</script></body></html>";
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        return shouldInterceptRequest(view, request.getUrl().toString());
    }

    private String guessMime(String path) {
        int dot = path.lastIndexOf('.');
        if (dot < 0) {
            return "application/octet-stream";
        }
        String ext = path.substring(dot + 1).toLowerCase();
        switch (ext) {
            case "html":
            case "htm":
                return "text/html";
            case "js":
                return "application/javascript";
            case "css":
                return "text/css";
            case "wasm":
                return "application/wasm";
            case "png":
                return "image/png";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "gif":
                return "image/gif";
            case "svg":
                return "image/svg+xml";
            case "json":
                return "application/json";
            case "woff":
                return "font/woff";
            case "woff2":
                return "font/woff2";
            case "ttf":
            case "otf":
                return "font/ttf";
            case "gz":
            case "traineddata":
                return "application/octet-stream";
            default:
                return "application/octet-stream";
        }
    }
}
