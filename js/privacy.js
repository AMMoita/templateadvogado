/* Site LGC — preferências de cookies e consentimento, PT / EN.
   Sem Google Analytics ativo na V8. Ao ativar, aplica bloqueio anterior ao consentimento
   (Consent Mode v2, modo básico), sem requests à Google até aceitar.
*/
(function () {
    "use strict";
    const en = document.documentElement.lang.toLowerCase().startsWith("en");
    const cfg = window.LGC_PRIVACY_CONFIG || {};
    const id = typeof cfg.analyticsMeasurementId === "string" ? cfg.analyticsMeasurementId.trim() : "";
    const analyticsAvailable = cfg.analyticsEnabled === true && /^G-[A-Z0-9]+$/.test(id);
    const key = "lgc-cookie-preferences-v1";
    const validFor = 180 * 24 * 60 * 60 * 1000;
    let scriptLoaded = false;
    let lastFocus = null;

    const labels = en ? {
        bannerTitle: "Your privacy preferences",
        bannerText: "With your permission, we may use Google Analytics to understand visits to this site. Analytics is optional and stays disabled unless you accept.",
        reject: "Reject optional", accept: "Accept analytics", customize: "Customise",
        panelTitle: "Cookie preferences", panelText: "Control optional analytics for this website. You can change your choice at any time.",
        essentialTitle: "Essential preferences", essentialDesc: "Always active. We store your choice locally in your browser; it is not sent to Google.",
        analyticsTitle: "Google Analytics", analyticsDesc: "Optional measurement of visits and website use. Only enabled after your consent.",
        inactive: "Google Analytics is not currently active on this website. No analytics cookies are placed by this website.",
        always: "Always active", save: "Save preferences", close: "Close", status: "Analytics disabled until you opt in.",
        more: "Read the Cookies Policy", other: "Google Fonts are loaded from Google's servers independently of analytics consent."
    } : {
        bannerTitle: "As suas preferências de privacidade",
        bannerText: "Com a sua autorização, poderemos utilizar o Google Analytics para compreender as visitas a este site. A análise é opcional e só é ativada se aceitar.",
        reject: "Rejeitar opcionais", accept: "Aceitar analítica", customize: "Personalizar",
        panelTitle: "Preferências de cookies", panelText: "Controle a analítica opcional deste site. Pode alterar a sua escolha a qualquer momento.",
        essentialTitle: "Preferências essenciais", essentialDesc: "Sempre ativas. A escolha é guardada localmente no seu navegador; não é enviada para a Google.",
        analyticsTitle: "Google Analytics", analyticsDesc: "Medição opcional de visitas e utilização do site. Apenas é ativada após o seu consentimento.",
        inactive: "O Google Analytics ainda não está ativo neste site. Este site não instala cookies de analítica.",
        always: "Sempre ativo", save: "Guardar preferências", close: "Fechar", status: "A analítica permanece desligada até aceitar.",
        more: "Consultar a Política de Cookies", other: "As fontes Google Fonts são obtidas de servidores da Google, independentemente da escolha sobre analítica."
    };
    const link = en ? "cookies.html" : "cookies.html";

    function readChoice() {
        try {
            const c = JSON.parse(localStorage.getItem(key));
            if (!c || c.version !== 1 || typeof c.analytics !== 'boolean' || typeof c.time !== 'number' ||
                Date.now() - c.time > validFor || c.time > Date.now()) return null;
            return c.analytics;
        } catch (_) { return null; }
    }
    function saveChoice(allowed) {
        try { localStorage.setItem(key, JSON.stringify({ version: 1, analytics: !!allowed, time: Date.now() })); }
        catch (_) { /* Sem armazenamento disponível: pedir autorização de novo na próxima visita. */ }
    }
    function gtag() { window.dataLayer.push(arguments); }
    function injectAnalytics() {
        if (!analyticsAvailable || scriptLoaded) return;
        scriptLoaded = true;
        window['ga-disable-' + id] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = gtag;
        gtag('consent', 'default', {
            analytics_storage: 'denied', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied'
        });
        gtag('consent', 'update', {
            analytics_storage: 'granted', ad_storage: 'denied',
            ad_user_data: 'denied', ad_personalization: 'denied'
        });
        gtag('js', new Date());
        gtag('config', id, {allow_google_signals: false, allow_ad_personalization_signals: false});
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
        s.onerror = function () { scriptLoaded = false; };
        document.head.appendChild(s);
    }
    function removeAnalyticsCookies() {
        /* Eliminação de cookies próprios acessíveis por JS; não remove dados anteriormente enviados. */
        const names = document.cookie.split(';').map(s => s.trim().split('=')[0]);
        const host = location.hostname.split('.');
        const domains = [''];
        for (let i = 0; i < host.length - 1; i++) domains.push('.' + host.slice(i).join('.'));
        names.filter(name => /^_ga($|_)/.test(name)).forEach(name => {
            domains.forEach(domain => {
                document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
            });
        });
    }
    function setChoice(allowed) {
        saveChoice(allowed);
        if (analyticsAvailable && allowed) injectAnalytics();
        else {
            if (analyticsAvailable) window['ga-disable-' + id] = true;
            if (typeof window.gtag === 'function') window.gtag('consent', 'update', {
                analytics_storage: 'denied', ad_storage: 'denied',
                ad_user_data: 'denied', ad_personalization: 'denied'
            });
            removeAnalyticsCookies();
        }
        hideBanner(); closePanel();
    }
    const prev = readChoice();
    if (analyticsAvailable && prev === true) injectAnalytics();
    if (analyticsAvailable && prev !== true) window['ga-disable-' + id] = true;

    const banner = document.createElement('aside');
    banner.className = 'lgc-cookie-banner';
    banner.setAttribute('aria-label', labels.bannerTitle);
    banner.hidden = true;
    banner.innerHTML = `<div class="lgc-cookie-banner__text"><strong>${labels.bannerTitle}</strong><p>${labels.bannerText}</p></div>
      <div class="lgc-cookie-banner__actions"><button type="button" class="lgc-cookie-button lgc-cookie-button--outline" data-lgc-reject>${labels.reject}</button>
      <button type="button" class="lgc-cookie-button lgc-cookie-button--outline" data-lgc-customize>${labels.customize}</button>
      <button type="button" class="lgc-cookie-button lgc-cookie-button--solid" data-lgc-accept>${labels.accept}</button></div>`;
    document.body.appendChild(banner);

    const overlay = document.createElement('div');
    overlay.className = 'lgc-cookie-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `<div class="lgc-cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="lgcCookieTitle" aria-describedby="lgcCookieDescription" tabindex="-1">
      <div class="lgc-cookie-dialog__head"><h2 id="lgcCookieTitle">${labels.panelTitle}</h2>
      <button class="lgc-cookie-close" type="button" aria-label="${labels.close}" data-lgc-close>×</button></div>
      <p id="lgcCookieDescription">${labels.panelText}</p>
      <div class="lgc-cookie-row"><div><strong>${labels.essentialTitle}</strong><p>${labels.essentialDesc}</p></div><span class="lgc-cookie-always">${labels.always}</span></div>
      <label class="lgc-cookie-row lgc-cookie-row--toggle"><span><strong>${labels.analyticsTitle}</strong><span class="lgc-cookie-subtext">${analyticsAvailable ? labels.analyticsDesc : labels.inactive}</span></span>
      <input type="checkbox" data-lgc-analytics aria-label="${labels.analyticsTitle}" ${analyticsAvailable ? '' : 'disabled'}></label>
      <p class="lgc-cookie-dialog__other">${labels.other}</p>
      <a class="lgc-cookie-policy-link" href="${link}">${labels.more} →</a>
      <div class="lgc-cookie-dialog__actions">${analyticsAvailable ? `<button type="button" class="lgc-cookie-button lgc-cookie-button--outline" data-lgc-reject>${labels.reject}</button>` : ''}
      <button type="button" class="lgc-cookie-button lgc-cookie-button--solid" data-lgc-save>${analyticsAvailable ? labels.save : labels.close}</button></div></div>`;
    document.body.appendChild(overlay);
    const dialog = overlay.querySelector('.lgc-cookie-dialog');
    const analyticsCheckbox = overlay.querySelector('[data-lgc-analytics]');
    function hideBanner() { banner.hidden = true; }
    function openPanel() {
        lastFocus = document.activeElement;
        if (analyticsCheckbox) analyticsCheckbox.checked = readChoice() === true;
        overlay.hidden = false;
        dialog.focus();
    }
    function closePanel() {
        overlay.hidden = true;
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }
    banner.querySelector('[data-lgc-reject]').addEventListener('click', () => setChoice(false));
    banner.querySelector('[data-lgc-accept]').addEventListener('click', () => setChoice(true));
    banner.querySelector('[data-lgc-customize]').addEventListener('click', openPanel);
    overlay.querySelector('[data-lgc-close]').addEventListener('click', closePanel);
    const rejectInPanel = overlay.querySelector('[data-lgc-reject]');
    if (rejectInPanel) rejectInPanel.addEventListener('click', () => setChoice(false));
    overlay.querySelector('[data-lgc-save]').addEventListener('click', () => {
        if (!analyticsAvailable) closePanel();
        else setChoice(!!analyticsCheckbox.checked);
    });
    overlay.addEventListener('click', event => { if (event.target === overlay) closePanel(); });
    overlay.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); closePanel(); }
        if (event.key !== 'Tab') return;
        const available = Array.from(dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])'));
        if (!available.length) return;
        const first = available[0], last = available[available.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    });
    document.querySelectorAll('.lgc-cookie-settings-trigger').forEach(btn => {
        btn.addEventListener('click', openPanel);
    });
    if (analyticsAvailable && prev === null) banner.hidden = false;
})();
