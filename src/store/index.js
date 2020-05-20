import Vuex from 'vuex'

// export default Vuex.createStore({
const store = new Vuex.Store({
    state: {
        useMilitaryTime: false,
        useCelsius: false,
        isDaytime: true,
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
        toggleCelsius(state) {
            state.useCelsius = !state.useCelsius
        },
        toggleMilitaryTime(state) {
            state.useMilitaryTime = !state.useMilitaryTime
        },
        getCachedOptions(state) {
            chrome.storage.sync.get(null, value => {
                let temp = {}
                state.useMilitaryTime = value.useMilitaryTime
                temp = value
                console.log('Temp', temp)
                console.log('\nValue', value, '\nState', state)
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
        config: state => state,
        orange: state => state.orange,
        weatherIconClass: state => {
            if (state.weather.hasData) {
                let iconClass = state.isDaytime
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
        }
    }
})

store.subscribe((mutation, state) => {
    chrome.storage.sync.set({ ...state, lastSynced: Date.now() })
})

// To unsubscribe (do this on onDestroyed?):
// unsubscribe()

export default store
