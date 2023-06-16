window.themeColor = 'lavender'
try {
	const storedColor = window.localStorage.getItem('options/theme/color')
	if (storedColor) {
		document.querySelector('html').className = themeColor
	} else {
		document.querySelector('html').className = 'lavender'
	}
} catch (err) {
	console.warn(err)
}
