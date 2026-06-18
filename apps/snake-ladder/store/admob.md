# AdMob production setup

1. Create an AdMob app for iOS and Android.
2. Create an **interstitial** ad unit per platform.
3. Copy IDs into `.env` (from `.env.example`):

```bash
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXX~YYYYYYYY
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXX~ZZZZZZZZ
EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL=ca-app-pub-XXXXXXXX/1111111111
EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL=ca-app-pub-XXXXXXXX/2222222222
```

4. Rebuild native binaries (`expo run:ios` / `expo run:android` or EAS production).

When env vars are unset, the app uses Google **test** app and interstitial IDs.