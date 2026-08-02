package com.forderungen.app;

import android.app.Application;
import android.util.Log;

/**
 * Application entry. Merged into the primary classes.dex by DexMerger, so it is loaded
 * automatically with no MultiDex needed.
 */
public class SyncApp extends Application {
    private static final String TAG = "SYNC";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "SyncApp.onCreate");
    }
}
