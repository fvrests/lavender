import store from '../store'

// correcting interval - corrects compounding variation in time between ticks that would occur using setInterval
export const setCorrectingInterval = (func, delay, init = false) => {
    var instance = {}

    if (init) func()

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

// fetch new position from geolocation - must be called on user input
export async function fetchNewPosition() {
    console.log('attempting fetch')
    await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log('pos', pos)
                let { latitude, longitude } = pos.coords
                store.commit('setPosition', { latitude, longitude })
                resolve()
            },
            (err) => {
                console.log('err', err)
                reject()
            },
            { timeout: 5000, enableHighAccuracy: true }
        )
    })
}

// handles instances where weather must be fetched asynchronously after position is resolved
export function fetchPositionAndWeather() {
    fetchNewPosition().then(() => {
        fetchWeather()
    })
}

// fetches current weather info from OpenWeatherMap API - max 60 calls/minute or 1,000,000 calls/month
export function fetchWeather() {
    let baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    let appid = 'de619c7b223045c3ad4bc7d8332d55ab'
    console.log('stored values', store.state.position)
    let { latitude, longitude } = store.state.position
    fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${appid}`)
        .then((res) => res.json())
        .then((json) => {
            let weather = json
            store.commit('setWeather', weather)
            console.log('weather set!', weather)
        })
}

/**
 *
 * @param {timestamp} timestamp
 * @param {number} maxAge
 */
export function invalidateProperty(timestamp, maxAge = 30 * 60) {
    if (store.state.init) {
        return !timestamp || Date.now() - timestamp >= maxAge
    } else return
}
