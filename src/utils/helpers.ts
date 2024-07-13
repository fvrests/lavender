// correcting interval - corrects compounding variation in time between ticks that would occur using setInterval
// https://andrewduthie.com/2013/12/31/creating-a-self-correcting-alternative-to-javascripts-setinterval/
export const setCorrectingInterval = (
	func: () => {} | void,
	delay: number,
): number | null => {
	var instance: {
		func: (() => void | {}) | undefined
		delay: number | undefined
		startTime: number | undefined
		target: number | undefined
		started: boolean
	} = {
		func: undefined,
		delay: undefined,
		startTime: undefined,
		target: undefined,
		started: false,
	}
	let timeoutId: number | null = null

	// recurring timeout loop
	function tick(func: () => void | {}, delay: number): number {
		// on first run, set up instance
		if (!instance.started) {
			instance = {
				func: func,
				delay: delay,
				startTime: new Date().valueOf(),
				target: delay,
				started: true,
			}
			timeoutId = setTimeout(tick, instance.delay)
		} else {
			const elapsed = new Date().valueOf() - instance.startTime!
			const adjust = instance.target! - elapsed

			instance.func!()
			instance.target! += instance.delay!

			// ensure timeout is cleared if it's still running
			if (timeoutId !== null) {
				clearTimeout(timeoutId)
			}
			timeoutId = setTimeout(tick, instance.delay! + adjust)
		}
		return timeoutId
	}

	// run once to start timeout loop
	timeoutId = tick(func, delay)
	return timeoutId
}

// fetches current weather info from OpenWeatherMap API - max 60 calls/minute or 1,000,000 calls/month
export async function fetchWeather(latitude: number, longitude: number) {
	let baseUrl = import.meta.env.VITE_WEATHER_API_URL

	const res = await fetch(
		`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_KEY}`,
	)
	return await res.json()
}
