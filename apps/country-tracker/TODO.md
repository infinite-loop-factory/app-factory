# Country Tracker Release TODO

## Remaining Launch Tasks

- Publish the web export so these public URLs actually resolve:
  - `https://infinite-loop-factory.github.io/app-factory/country-tracker/privacy`
  - `https://infinite-loop-factory.github.io/app-factory/country-tracker/support`
  - `https://infinite-loop-factory.github.io/app-factory/country-tracker/terms`
- Replace the placeholder iOS submit values in `eas.json`:
  - `ascAppId`
  - `appleTeamId`
- Add `google-service-account.json` for Play Console submission automation.
- Record the Google Play background location review video:
  - install
  - login
  - in-app disclosure
  - foreground/background permission grant
  - country visit appearing after sync
- Upload final App Store / Play Store screenshots and complete the store listings.

## Verification Before Submission

- Re-run `npx expo-doctor@latest` and confirm duplicate native dependency warnings are gone.
- Run production EAS builds for both platforms.
- Verify the privacy policy, support page, and terms page load over the public URLs after deployment.
