# Qatra × Aeltrix — Official Website

Static, RTL-first Arabic website for **Qatra** (قطرة), an Android
water-reminder app developed by **Aeltrix**. Built to deploy on
GitHub Pages without a build step.

## Preview locally

Any static server works. From the repo root:

    python3 -m http.server 8000
    # then open http://localhost:8000

Or with Node:

    npx serve .

Do **not** open `index.html` via `file://` — the download availability
check requires HTTP.

## Project structure

    index.html          Home
    download.html       Download & install guide
    about.html          About Aeltrix
    404.html            Fallback page
    site-config.js      Single source of truth for URLs, version, APK path
    assets/css/         Design tokens & styles
    assets/js/          Nav, dock, reveal, download logic
    assets/icons/       Favicon
    assets/images/      Team image (see README inside)
    apk/                Place the signed APK here (see README inside)

## Configure

Edit **`site-config.js`** to update:

- `product.version` — shown across the site.
- `product.packageName` — for the download meta panel.
- `repo.githubUrl` / `repo.releasesUrl` — real repository links.
- `apk.localUrl` — path to the APK inside `apk/`.
- `assets.teamImage` — path to the team image.

> Never commit API keys or secrets. This is a purely static site.

## Add or update the APK

1. Put the signed APK in `apk/`, e.g. `apk/qatra-1.0.0.apk`.
2. Match the filename with `apk.localUrl` in `site-config.js`.
3. Commit and push. The download buttons detect it and switch
   from "Releases page" to "direct download".

The site never *pretends* the file exists: if it is not there, the
buttons fall back to the GitHub Releases URL and the download page
shows a clear message.

## Add the real Aeltrix team image

Drop `aeltrix-team.png` into `assets/images/`. No code changes needed.
See `assets/images/README.md` for the recommended size and format.

## Publish on GitHub Pages

### Option 1 — Branch deploy (recommended for a static site)

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under *Build and deployment*:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
4. Save. The site publishes at
   `https://<username>.github.io/<repository>/`.

All internal paths are **relative** (`assets/...`, `index.html`, ...),
so the site works both under a project subpath and under a custom domain.

### Option 2 — GitHub Actions (only if you want an explicit workflow)

If you prefer a workflow-driven deploy, create `.github/workflows/pages.yml`
that uploads the repository root as an artifact using
`actions/upload-pages-artifact` and `actions/deploy-pages`. Not required
for this project.

### Custom domain

Add a `CNAME` file at the root with your domain, then configure DNS at
your registrar. No other changes are needed.

## Accessibility & performance

- `lang="ar" dir="rtl"` on every page.
- Keyboard-focus visible on all interactive elements.
- `prefers-reduced-motion` respected (animations disabled).
- No tracking scripts, no analytics, no cookies.
- Fonts are loaded from Google Fonts with `preconnect`.

## Design language

- **Shout color**: Qatra green (`#8CE04C`), matching the AELTRIX wordmark.
- **Void**: `#0A0A0A` / `#171717`.
- **Liquid sectioning**: asymmetric bottom radii, glass card overlays.
- **Floating dock**: a vanilla-JS port of the macOS-style magnification
  dock, used as a secondary desktop navigation.

## License

Site content © Aeltrix. Fonts under their respective licenses.
