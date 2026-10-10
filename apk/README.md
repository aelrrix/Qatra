# Place your APK here

Drop the signed release APK in this folder and name it:

    qatra-1.0.0.apk

The site is already configured (in `../site-config.js`) to look for:

    apk/qatra-1.0.0.apk

## What happens when a file exists

The download buttons on the site will:
1. Probe this path with an HTTP `HEAD` request.
2. If the file exists → the buttons become **direct download links** (`download` attribute set).
3. If the file is missing → the buttons fall back to the GitHub **Releases** page automatically, and the download page shows a clear message.

## Renaming / versioning

When you release a new version:

1. Rename the APK file to match the new version, e.g. `qatra-1.0.1.apk`.
2. Update `product.version` and `apk.localUrl` in `../site-config.js`.
3. Also update `repo.releasesUrl` if it changes.

## Notes

- Do **not** commit debug or unsigned APKs.
- Keep the folder path lowercase (`apk/`), it is case-sensitive on GitHub Pages.
- This README is safe to keep in the repo — it is not served as a page.
