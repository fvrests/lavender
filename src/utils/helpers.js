import store from '../store'

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

export async function fetchNewPosition() {
    console.log('attempting fetch')
    await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                console.log('pos', pos)
                // console.log('fetching new location...')
                // console.log('pos', pos)
                let { latitude, longitude } = pos.coords
                // console.log('coords:', latitude, longitude)
                store.commit('setPosition', { latitude, longitude })
                // console.log('new: ', store.state.position)
                resolve()
            },
            err => {
                console.log('err', err)
                reject()
            },
            { timeout: 5000, enableHighAccuracy: true }
        )
    })
}

export function fetchPositionAndWeather() {
    fetchNewPosition().then(() => {
        fetchWeather()
    })
}

export function fetchWeather() {
    let baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    let appid = 'de619c7b223045c3ad4bc7d8332d55ab'
    console.log('stored values', store.state.position)
    let { latitude, longitude } = store.state.position
    fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${appid}`)
        .then(res => res.json())
        .then(json => {
            let weather = json
            // use setChromeStorage?
            store.commit('setWeather', weather)
            console.log('weather set!', weather)
        })
}

// not using - use autocomplete from locationIQ? instead?
// export function reverseGeocode() {
//   let baseUrl = 'https://us1.locationiq.com/v1/reverse.php'
//   let key = 'e7d53f1438a4a3'
//   let { latitude, longitude } = store.state.position
//   fetch(`${baseUrl}?key=${key}&lat=${latitude}&lon=${longitude}&format=json`)
//     .then(res => res.json())
//     .then(json => {
//       console.log(
//         'reverse geocode:',
//         json.address.county,
//         ',',
//         json.address.state
//       )
//     })
// }

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
