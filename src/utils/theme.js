import store from '../store'

// todo: maybe add option to follow system theme (swap between light and dark hues)

export function toggleTheme(newTheme) {
    // fix: needs to retain light color scheme (no dark class) on mouseoff
    if (!newTheme) {
        newTheme = window.localStorage.getItem('theme-color') || 'lavender'
    }
    document.querySelector('html').className = newTheme
    window.localStorage.setItem('theme-color', newTheme)
    // fix: is this needed?
    window.theme = newTheme
    store.commit('update', { key: 'themeColor', value: newTheme })
}

export function previewTheme(newTheme) {
    document.querySelector('html').className = newTheme
}
