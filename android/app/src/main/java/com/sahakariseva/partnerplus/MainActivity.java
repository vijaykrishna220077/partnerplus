package com.sahakariseva.partnerplus;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (FirebaseApp.getApps(this).isEmpty()) {
            try {
                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setApplicationId("1:100000000000:android:0000000000000000")
                        .setApiKey("AIzaSyDummyApiKeyForDevelopmentModeOnly0")
                        .setGcmSenderId("100000000000")
                        .setProjectId("sahakari-seva-dev")
                        .build();
                FirebaseApp.initializeApp(this, options);
            } catch (Exception e) {
                // Ignore fallback initialization error if any
            }
        }
    }
}
