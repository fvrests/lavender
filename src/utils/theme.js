export function toggleTheme(newTheme) {
	if (!newTheme) {
		newTheme = window.localStorage.getItem('theme-color') || 'lavender'
	}
	document.querySelector('html').className = newTheme
	window.localStorage.setItem('theme-color', newTheme)
	// fix: is this needed?
	window.theme = newTheme
}

export function previewTheme(newTheme) {
	document.querySelector('html').className = newTheme
}
