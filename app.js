console.log("app.js chargé !");

// --- 1. COULEURS AU SCROLL (ACTIVES EN MODE SOMBRE ET CLAIR) ---
// Teinte de départ (Bleu cyan ~199°) -> Teinte d'arrivée (Violet ~271°)
const startHue = 199;
const endHue   = 271;

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

function isLightMode() {
    return document.body.classList.contains('light-mode');
}

function updateScrollColors() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    const progress = maxScroll > 0
        ? Math.min(Math.max(scrollTop / maxScroll, 0), 1)
        : 0;

    const hue = Math.round(lerp(startHue, endHue, progress));

    // Luminosité adaptée pour garder un bon contraste sur fond sombre ou clair
    const lightness = isLightMode() ? '42%' : '58%';
    const saturation = '90%';

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--accent', `hsl(${hue}, ${saturation}, ${lightness})`);
    rootStyle.setProperty('--accent-dim', `hsla(${hue}, ${saturation}, ${lightness}, 0.14)`);
    rootStyle.setProperty('--accent-border', `hsla(${hue}, ${saturation}, ${lightness}, 0.35)`);
}

let isTicking = false;

window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(() => {
            updateScrollColors();
            isTicking = false;
        });
        isTicking = true;
    }
});

window.addEventListener('resize', updateScrollColors);


// --- 2. GESTION DU MODE SOMBRE / CLAIR ---
const themeToggleBtn = document.getElementById('theme-toggle');
const STORAGE_KEY = 'portfolio-theme';

function applyTheme(theme) {
    const light = theme === 'light';
    document.body.classList.toggle('light-mode', light);

    if (themeToggleBtn) {
        themeToggleBtn.textContent = light ? 'Mode sombre' : 'Mode clair';
    }

    // Recalcule immédiatement la nuance adaptée au nouveau thème
    updateScrollColors();
}

const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
applyTheme(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const nextTheme = isLightMode() ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    });
}