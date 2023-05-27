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
export function fetchWeather(latitude: string, longitude: string) {
	console.log('fetching weather')
	let baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
	let appid = import.meta.env.VITE_WEATHER_KEY
	fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${appid}`)
		.then((res) => res.json())
		.then((json) => {
			let weather = json
			return weather
		})
}

// function fetchWeather(latitude, longitude) {
// 	// do stuff with lat and long
// 	const data = {
// 		temp: 10000degrees ouch.
// 	}
// 	return data
// }
//
// const weather = fetchWeather(3141, 12342)
// store.weather = weather
