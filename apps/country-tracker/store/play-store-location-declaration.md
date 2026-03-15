# Google Play Store - Background Location Access Declaration

## Feature: Automatic Visit Tracking

### Core functionality requiring background location
Country Tracker automatically records which countries users visit by detecting their GPS location in the background. This is the app's primary feature — without background location, users would need to manually log every country visit.

### Why background access is necessary
- Users travel across country borders while the app is not in the foreground
- Border crossings happen at unpredictable times (overnight flights, road trips, train rides)
- Requiring the app to be open would defeat the purpose of automatic tracking
- Location is checked approximately once per hour to minimize battery impact

### User consent flow
1. On first launch, users see a permission dialog explaining why location is needed
2. Users must explicitly grant "Always Allow" location permission
3. Users can revoke permission at any time in device Settings
4. Users can delete all collected location data from Settings > Delete Account
5. A denylist feature lets users exclude specific countries from tracking

### Data handling
- Location data is stored securely in Supabase with Row Level Security
- Each user can only access their own data
- No location data is shared with third parties
- No advertising or analytics use of location data
- Users can export or delete their data at any time

### Video demonstration
[Record a short video showing: app install → permission grant → background tracking → country appearing in list]
