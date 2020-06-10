export function toggleTheme(newTheme) {
    if (!newTheme) {
        newTheme = window.localStorage.getItem('theme-color')
    }
    document.querySelector('html').className = newTheme
    window.localStorage.setItem('theme-color', newTheme)
    window.theme = newTheme
}

export function previewTheme(newTheme) {
    document.querySelector('html').className = newTheme
}
// make sure class is deleted on change if it was added on page load
