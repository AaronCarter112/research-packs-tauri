# Code Signing & Notarization

Use GitHub Actions to sign Windows/MSI and notarize macOS DMG.

## macOS (notarization)
- Secrets: APPLE_ID, APPLE_PASSWORD (app-specific), APPLE_TEAM_ID

## Windows (signing)
- Secrets: WINDOWS_CERTIFICATE (base64 of .pfx), WINDOWS_CERTIFICATE_PASSWORD

## Trigger
- Push a tag like v0.8.0; artifacts attach to the GitHub Release.

## Local unsigned builds
- `cd frontend && npm run tauri:build`
