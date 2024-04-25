// correcting interval - corrects compounding variation in time between ticks that would occur using setInterval
export const setCorrectingInterval = (func, delay) => {
	var instance = {}
	function tick(func, delay) {
		if (!instance.started) {
			instance.func = func
			instance.delay = delay
			instance.startTime = new Date().valueOf()
			instance.target = delay
			instance.started = true

			setTimeout(tick, delay)
		} else {
			var elapsed = new Date().valueOf() - instance.startTime,
				adjust = instance.target - elapsed

			instance.func()
			instance.target += instance.delay

			setTimeout(tick, instance.delay + adjust)
		}
	}
	return tick(func, delay)
}

// fetches current weather info from OpenWeatherMap API - max 60 calls/minute or 1,000,000 calls/month
export async function fetchWeather(latitude: number, longitude: number) {
	let baseUrl =
		'https://fvrests-openweather-api.netlify.app/.netlify/functions/weather'
	const res = await fetch(
		`${baseUrl}?latitude=${latitude}&longitude=${longitude}`,
	)
	return await res.json()
}
