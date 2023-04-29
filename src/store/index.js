import { createStore } from 'vuex'
import conditions from '../utils/weather-conditions'
import errorCodes from '../utils/error-codes.json'

const store = createStore({
	state: {
		init: false,
		useMilitaryTime: false,
		useCelsius: false,
		timeLayout: 'default',
		isDaytime: true,
		useDescriptiveWeather: false,
		themeColor: 'lavender',
		position: {
			hasData: false,
			latitude: '',
			longitude: '',
			timestamp: null,
			fetching: false,
			declined: false,
		},
		weather: {
			hasData: false,
			timestamp: null,
		},
		errors: {
			weather: '',
			location: '',
		},
	},
	mutations: {
		initializeStore(state) {
			// todo: add back functionality
			chrome.storage.sync.get(null, (value) => {
				if (value) {
					store.replaceState(Object.assign(state, { ...value, init: true }))
				} else {
					state.init = true
					// console.log('setting storage w default values')
				}
			})
			// state.init = true
		},
		update(state, { key, value }) {
			state[key] = value
		},
		toggleProperty(state, property) {
			state[property] = !state[property]
		},
		setPosition(state, coords) {
			state.position = {
				...coords,
				hasData: true,
				timestamp: Date.now(),
			}
		},
		setWeather(state, weather) {
			state.weather = {
				...weather,
				hasData: true,
				timestamp: Date.now(),
			}
		},
		setIsDaytime(state, day = true) {
			state.isDaytime = day
		},
	},
	getters: {
		weatherIconClass: (state) => {
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
		formattedTemp: (state) => {
			if (state.weather.hasData) {
				let celsiusTemp = (state.weather.main.temp - 273.15).toFixed()
				let fahrenheitTemp = (celsiusTemp * (9 / 5) + 32).toFixed()
				return state.useCelsius ? celsiusTemp : fahrenheitTemp
			} else {
				return 'Pls click the cloud to get data!'
			}
		},
		weatherConditions: (state) => {
			if (state.weather.hasData) {
				let condition = state.useDescriptiveWeather
					? conditions[state.weather.weather[0].id][0]
					: conditions[state.weather.weather[0].id][1]
				return condition
			} else {
				return 'No weather data available!'
			}
		},
	},
	actions: {
		fetchPosition({ commit, state }) {
			commit('update', {
				key: 'position',
				value: { ...state.position, fetching: true },
			})
			async function fetchNewPosition() {
				// console.log('attempting fetch')
				await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							console.log('pos', pos)
							let { latitude, longitude } = pos.coords
							commit('setPosition', { latitude, longitude })
							console.log('position set', store.state.position)
							commit('update', {
								key: 'position',
								value: {
									...state.position,
									fetching: false,
								},
							})
							resolve()
						},
						(err) => {
							console.log(
								errorCodes.position[err.code] ||
									'😱oh no! an unknown error has occurred.'
							)
							reject(err)
						},
						{ timeout: 5000, enableHighAccuracy: false }
					)
				})
			}
			let error = fetchNewPosition().catch((err) => {
				commit('update', {
					key: 'position',
					value: { ...state.position, fetching: false },
				})
				return err
			})
			return error
		},
	},
})

export default store
