// correcting interval - corrects compounding variation in time between ticks that would occur using setInterval
// https://andrewduthie.com/2013/12/31/creating-a-self-correcting-alternative-to-javascripts-setinterval/
type Instance = {
	func: (() => void) | undefined
	delay: number | undefined
	startTime: number | undefined
	target: number | undefined
	started: boolean
}
export const setCorrectingInterval = (func: () => {} | void, delay: number) => {
	var instance: Instance = {
		func: undefined,
		delay: undefined,
		startTime: undefined,
		target: undefined,
		started: false,
	}
	function tick(func: () => void | {}, delay: number) {
		if (!instance.started) {
			instance = {
				func: func,
				delay: delay,
				startTime: new Date().valueOf(),
				target: delay,
				started: true,
			}

			setTimeout(tick, delay)
		} else {
			var elapsed = new Date().valueOf() - instance.startTime!,
				adjust = instance.target! - elapsed

			instance.func!()
			instance.target! += instance.delay!

			setTimeout(tick, instance.delay! + adjust)
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
