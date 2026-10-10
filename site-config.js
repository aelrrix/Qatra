/* =========================================================
   QATRA × AELTRIX — Site Configuration
   Update these values — the UI reads from this file.
   ========================================================= */
window.QATRA_CONFIG = {
  product: {
    nameAr: 'قطرة',
    nameEn: 'Qatra',
    version: '1.0.0',
    packageName: 'com.qatra.water',
    minAndroid: '8.0',
    format: 'APK',
  },
  repo: {
    githubUrl: 'https://github.com/aeltrix/qatra',
    releasesUrl: 'https://github.com/aeltrix/qatra/releases',
  },
  apk: {
    /* Path is relative to site root. Put the real file here. */
    localUrl: 'apk/qatra-1.0.0.apk',
    /* The dock/CTA will check this at runtime and gracefully
       fall back to the releases page if the file is missing. */
    directAvailable: false,
  },
  assets: {
    teamImage: 'assets/images/aeltrix-team.png',
  },
};
