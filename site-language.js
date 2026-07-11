(function initSiteLanguage() {
  const storageKey = "xiaobenben-site-locale";
  const root = document.documentElement;
  const currentLocale = root.dataset.locale || "zh-CN";
  const pageKind = root.dataset.pageKind || "home";
  const guideId = root.dataset.guideId || "";
  const localePaths = {
    "zh-CN": "",
    "zh-TW": "/zh-tw",
    en: "/en",
    "ko-KR": "/ko",
    "vi-VN": "/vi",
    "pt-BR": "/pt-br",
    "ja-JP": "/ja",
  };

  function readStoredLocale() {
    try {
      const value = localStorage.getItem(storageKey);
      return Object.hasOwn(localePaths, value) ? value : "";
    } catch (_) {
      return "";
    }
  }

  function rememberLocale(locale) {
    if (!Object.hasOwn(localePaths, locale)) return;
    try {
      localStorage.setItem(storageKey, locale);
    } catch (_) {
      // Language switching still works when storage is unavailable.
    }
  }

  function resolveLocale(languages) {
    for (const language of languages) {
      const value = String(language || "").toLowerCase();
      if (value.startsWith("zh-hant") || value.startsWith("zh-tw") || value.startsWith("zh-hk") || value.startsWith("zh-mo")) return "zh-TW";
      if (value.startsWith("zh")) return "zh-CN";
      if (value.startsWith("ja")) return "ja-JP";
      if (value.startsWith("ko")) return "ko-KR";
      if (value.startsWith("vi")) return "vi-VN";
      if (value.startsWith("pt")) return "pt-BR";
      if (value.startsWith("en")) return "en";
    }
    return "en";
  }

  function pathFor(locale) {
    const prefix = localePaths[locale];
    if (pageKind === "privacy") return `${prefix}/privacy.html`;
    if (pageKind === "learn") return `${prefix}/learn`;
    if (pageKind === "guide") {
      if (locale === "zh-CN" || locale === "en") return `${prefix}/learn/${guideId}`;
      return `${prefix}/learn#${guideId}`;
    }
    return prefix || "/";
  }

  document.querySelectorAll("[data-locale-option]").forEach((link) => {
    link.addEventListener("click", () => rememberLocale(link.dataset.localeOption));
  });

  if (currentLocale !== "zh-CN" || root.dataset.autoLocale !== "true") return;
  const preferred = readStoredLocale() || resolveLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);
  if (preferred !== currentLocale) window.location.replace(pathFor(preferred));
})();
