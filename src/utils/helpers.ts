// fetches current weather info from OpenWeatherMap API - max 60 calls/minute or 1,000,000 calls/month
export async function fetchWeather(latitude: number, longitude: number) {
	let baseUrl = ''
	if (process.env.NODE_ENV === 'production') {
		baseUrl = import.meta.env.VITE_WEATHER_API_URL
	} else {
		baseUrl = 'http://localhost:3000'
	}

	const res = await fetch(
		`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_KEY}`,
	)
	return await res.json()
}
