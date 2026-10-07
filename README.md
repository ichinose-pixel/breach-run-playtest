# ぶっちび — v23 iOS update

This branch integrates published Web commit 0248b3ea19e203e6fb0b3181dbb1072a254a455e into the existing iOS 1.0 app. All 47 baseline files exactly match that release. The original iOS source is a001383abe8b7cd2613e23bc3d7ce1856317251c.

App Store Connect: 6820066209. Bundle: io.github.ichinosepixel.bucchibi. Team: Q632QFMNAP. Existing integration Codemagic hamudoku, certificate hamudoku-distribution and profile bucchibi-app-store are retained. Marketing version remains 1.0.

The native Preferences envelope bucchibi.native.v1 and campaign key bucchibi-campaign-v2 are unchanged. Store, lifecycle, shell, Capacitor versions, identity, privacy declaration, approved icon and project configuration scripts are unchanged. Existing app saves stay in the same app container. Browser saves are separate and are not imported. No migration, reset or new persistence key is introduced.

Web differences from the previous iOS payload: campaign.js, enemy-rules.js, impact-trial.js, mission-data.js, opening-missions.js, spectacle.js and baseline README. This includes v22 lane behavior and reviewed v23 heavy-shooter, captain, hit/death/advance feedback. No gameplay change is added by the native integration. The existing build transform still adds durable native saves and lifecycle pause behavior.

Validation completed locally: exact approved Web hash check; offline bundle generation; all 7 persistence/transaction/lifecycle tests; Chrome fallback offline-only requests and 11 audio samples; pause/reload and 320/390 layouts; normal pointer play of mission001; native identity/icon/privacy/build-number override validation against a copied project fixture. The fixture number 2 is a test input, NOT a reserved or confirmed Apple build number. No Swift compilation, signing or upload has been performed in this environment.

## Cloud execution

Use the existing Codemagic app 6ac628419b8bff86effed748 and workflow ios-owner-testflight, after checking free minutes and coordinating with hamudoku. Do not start overlapping builds of this app. No paid capacity or new credentials are authorized.

The workflow queries the existing app's maximum TestFlight build number across all versions and exports max+1 as BUCCHIBI_BUILD_NUMBER before generating the project. It stops if the authenticated lookup fails or returns an invalid result. The static buildNumber 1 in native/ios-release.json is the historical local default; the cloud build overrides it. Confirm the selected number in the job output and App Store Connect.

Signing and upload reuse the existing integration. Internal-only export remains enabled; external Beta Review and App Store submission remain disabled. After Apple processing, assign the new build only to the existing owner test group for r.123nose@gmail.com and verify it is available for installation. A successful upload is not yet a distributed build.

Current handoff limitation: this Windows task has no browser-control connector or authenticated Codemagic/ASC session. Maximum build number, free quota, cloud execution and tester availability must be checked by the connected cloud operator. Do not report this source integration as a delivered TestFlight build.
