window.themeColor = 'lavender'
try {
    const themeColor = window.localStorage.getItem('theme-color')
    if (themeColor) {
        document.querySelector('html').className = themeColor
    } else {
        document.querySelector('html').className = 'lavender'
    }
} catch (err) {
    console.warn(err)
}
