// fetches current weather info from OpenWeatherMap API - max 60 calls/minute or 1,000,000 calls/month
export async function fetchWeather(latitude: number, longitude: number) {
	let baseUrl = ''
	if (process.env.NODE_ENV === 'production') {
		baseUrl = import.meta.env.VITE_WEATHER_API_URL
	} else {
		baseUrl = 'http://localhost:3000'
	}

	try {
		const res = await fetch(
			`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_KEY}`,
		)
		return await res.json()
	} catch (error) {
		console.error('fetch error', error)
	}
}

export function hexToRgb(hex: string) {
	// Remove the hash at the start if it's there
	hex = hex.slice(1)

	if (hex.length < 5) {
		hex = hex.replace(/./g, '$&$&')
	}

	// Parse r, g, b values
	const color = +('0x' + hex)
	const r = color >> 16
	const g = (color >> 8) & 255
	const b = color & 255

	return { r, g, b }
}

// https://awik.io/determine-color-bright-dark-using-javascript/
export function isColorDark(hex: string) {
	const { r, g, b } = hexToRgb(hex)
	// HSP (Hue - Saturation - Perceived brightness) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
	return hsp < 127.5
}
