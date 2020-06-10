import Vuex from 'vuex'
import conditions from '../utils/weather-conditions'

const store = new Vuex.Store({
    state: {
        init: false,
        useMilitaryTime: false,
        useCelsius: false,
        timeFormat: 'horizontal',
        isDaytime: true,
        useDescriptiveWeather: false,
        themeColor: 'var(--color-rose)',
        position: {
            hasData: false,
            latitude: '',
            longitude: '',
            timestamp: ''
        },
        weather: {
            hasData: false,
            timestamp: ''
        }
    },
    mutations: {
        toggleProperty(state, property) {
            state[property] = !state[property]
        },
        changeProperty(state, { property, newValue }) {
            console.log('changing property', property, newValue)
            state[property] = newValue
        },
        initializeStore(state) {
            chrome.storage.sync.get(null, value => {
                if (value) {
                    store.replaceState(
                        Object.assign(state, { ...value, init: true })
                    )
                } else {
                    state.init = true
                    console.log('setting storage w default values')
                }
            })
        },
        setPosition(state, coords) {
            state.position = { ...coords, hasData: true, timestamp: Date.now() }
        },
        setWeather(state, weather) {
            state.weather = { ...weather, hasData: true, timestamp: Date.now() }
        },
        setIsDaytime(state, day = Boolean) {
            state.isDaytime = day
        }
    },
    getters: {
        weatherIconClass: state => {
            if (state.weather.hasData) {
                let day = true
                day = !!(
                    Date.now() / 1000 > store.state.weather.sys.sunrise &&
                    Date.now() / 1000 < store.state.weather.sys.sunset
                )
                let iconClass = day
                    ? `wi wi-owm-day-${state.weather.weather[0].id}`
                    : `wi wi-owm-night-${state.weather.weather[0].id}`
                return iconClass
            }
        },
        formattedTemp: state => {
            if (state.weather.hasData) {
                let celsiusTemp = (state.weather.main.temp - 273.15).toFixed()
                let fahrenheitTemp = (celsiusTemp * (9 / 5) + 32).toFixed()
                return state.useCelsius ? celsiusTemp : fahrenheitTemp
            } else {
                return 'Pls click the cloud to get data!'
            }
        },
        weatherConditions: state => {
            if (state.weather.hasData) {
                let condition = state.useDescriptiveWeather
                    ? conditions[state.weather.weather[0].id][0]
                    : conditions[state.weather.weather[0].id][1]
                return condition
            } else {
                return 'No weather data available!'
            }
        }
    }
})

export default store
