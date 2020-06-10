window.themeColor = 'rose'
try {
    const themeColor = window.localStorage.getItem('theme-color')
    document.querySelector('html').className = themeColor
} catch (err) {
    console.warn(err)
}
