const THEME = 'theme';
const root = document.documentElement;

function readSavedTheme() {
    try {
        return localStorage.getItem(THEME);
    } catch {
        return null;
    }
}

function save(theme) {
    try {
        localStorage.setItem(THEME, theme);
    } catch {}
}

function apply(theme) {
    root.dataset.theme = theme;
}

function curr(){
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
}

const savedTheme = readSavedTheme();

if (savedTheme === 'light' || savedTheme === 'dark') {
    apply(savedTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    if(!button) return;

    function updateLabel() {
        const next = curr() === 'dark' ? 'light' : 'dark';
        button.textContent = `Switch to ${next} theme`;
    }

    button.addEventListener('click', () => {
        const next = curr() === 'dark' ? 'light' : 'dark';
        
        function switchTheme() {
            apply(next);
            updateLabel();
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(switchTheme);
        } else {
            switchTheme();
        }

        save(next);
    });

    updateLabel();
    button.hidden = false;
})