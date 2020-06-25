import store from '../store'

export function toggleTheme(newTheme) {
    if (!newTheme) {
        newTheme = window.localStorage.getItem('theme-color') || 'lavender'
    }
    document.querySelector('html').className = newTheme
    window.localStorage.setItem('theme-color', newTheme)
    window.theme = newTheme
    store.commit('changeProperty', {
        property: 'themeColor',
        newValue: newTheme,
    })
}

export function previewTheme(newTheme) {
    document.querySelector('html').className = newTheme
}
