/**
 * Expo Config Plugin for iOS Widget Extension
 *
 * This plugin will configure:
 * 1. App Group entitlement for data sharing between app and widget
 * 2. Widget extension target in Xcode project
 * 3. Copy Swift widget source files
 *
 * To use: Add to app.config.ts plugins array:
 *   ["./plugins/widget-config-plugin"]
 *
 * Prerequisites:
 * - Run `npx expo prebuild` to generate native project
 * - App Group ID: group.com.gracefullight.countrytracker
 *
 * TODO: Implement withIos mod to:
 * - Add App Group capability
 * - Create widget extension target
 * - Add Swift files for WidgetKit
 */

const { withInfoPlist } = require("expo/config-plugins");

function withWidgetConfig(inputConfig) {
  const result = withInfoPlist(inputConfig, (plistConfig) => {
    // App Groups will be configured via Xcode entitlements
    // This is a placeholder for the full implementation
    return plistConfig;
  });

  return result;
}

module.exports = withWidgetConfig;
