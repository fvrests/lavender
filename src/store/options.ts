import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { setCorrectingInterval, fetchWeather } from '../utils/helpers'
import { useLocalStorage } from '@vueuse/core'
import { toggleTheme, previewTheme } from '../utils/theme.js'
import conditions from '../utils/weather-conditions'

export const useOptionsStore = defineStore('options', {
	state: () => ({
		init: false,
		useChromeStorage: false,
		theme: {
			color: useLocalStorage('options/theme/color', 'lavender'),
		},
		time: {
			layout: useLocalStorage('options/time/layout', 'default'),
			use24Hour: useLocalStorage('options/time/use-24-hour', false),
		},
		weather: {
			useCelsius: useLocalStorage('options/weather/use-celsius', false),
			descriptive: useLocalStorage('options/weather/descriptive', false),
		},
		data: {
			date: new Date(),
			weather: {
				hasData: false,
				timestamp: null,
			},
			position: {
				hasData: true,
				latitude: 0,
				longitude: 0,
				timestamp: 0,
				fetching: false,
				declined: false,
			},
		},
		errors: {
			weather: '',
			location: '',
		},
	}),
	getters: {
		formattedDate(state) {
			let hour = ''
			if (state.time.use24Hour) {
				hour = format(state.data.date, 'HH')
			} else if (state.time.layout == 'stacked') {
				hour = format(state.data.date, 'hh')
			} else {
				hour = format(state.data.date, 'h')
			}
			return {
				today: format(state.data.date, 'LLLL do, yyyy'),
				hour: hour,
				minute: format(state.data.date, 'mm'),
				descriptor: format(state.data.date, 'B'),
			}
		},
		weatherIconClass: (state) => {
			if (state.data.weather.hasData) {
				let day = true
				day = !!(
					Number(state.data.date) / 1000 > state.data.weather.sys.sunrise &&
					Number(state.data.date) / 1000 < state.data.weather.sys.sunset
				)
				let iconClass = day
					? `wi wi-owm-day-${state.data.weather.weather[0].id}`
					: `wi wi-owm-night-${state.data.weather.weather[0].id}`
				return iconClass
			}
		},
		formattedTemp: (state) => {
			if (state.data.weather.hasData) {
				console.log('WEATHER', state.data.weather)
				let celsiusTemp = (state.data.weather?.main.temp - 273.15).toFixed()
				let fahrenheitTemp = (Number(celsiusTemp) * (9 / 5) + 32).toFixed()
				return state.weather.useCelsius ? celsiusTemp : fahrenheitTemp
			} else {
				return 'Please click the cloud to get data!'
			}
		},
		weatherConditions: (state) => {
			if (state.data.weather.hasData) {
				let condition = state.weather.descriptive
					? conditions[state.data.weather.weather[0].id][0]
					: conditions[state.data.weather.weather[0].id][1]
				return condition
			} else {
				return 'No weather data available!'
			}
		},
	},
	actions: {
		// fix: wip finish setup of store initialization
		// maybe don't even need this? see https://pinia.vuejs.org/cookbook/composables.html#option-stores
		initializeStore() {
			if (this.useChromeStorage) {
				// fix: can't find chrome
				// chrome.storage.sync.get(null, (value) => {
				// 	if (value) {
				// 		this.$state = { ...value, init: true }
				// 	} else {
				// 		this.init = true
				// 	}
				// })
			}
			this.init = true
		},
		toggleTheme(theme: string) {
			toggleTheme(theme)
			this.$patch({ theme: { color: theme } })
		},
		previewTheme(theme: string) {
			previewTheme(theme)
		},
		getTime() {
			setCorrectingInterval(() => (this.data.date = new Date()), 1000)
		},
		toggleOption(option) {
			this[option] = !this[option]
		},
		async fetchPosition() {
			this.$patch({
				data: { position: { fetching: true } },
			})
			const getPosition = new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						resolve(pos)
					},
					(err) => {
						console.warn(err)
						reject(err)
					}
				)
			})
			getPosition.then((pos) => {
				// todo: make position update conditional (only if promise resolved)
				if (pos) {
					this.$patch({
						data: {
							position: {
								latitude: pos.coords.latitude,
								longitude: pos.coords.longitude,
								hasData: true,
								timestamp: Date.now(),
								fetching: false,
							},
						},
					})
				}
				console.log({ pos, fromState: this.data.position })
			})
		},
		async refreshWeather() {
			console.log('refreshing weather')
			let invalidated =
				!this.data.weather.timestamp ||
				Date.now() - this.data.weather.timestamp >= 30 * 60 * 1000
			// don't fetch if recent data exists or no location data
			if (!invalidated || !this.data.position.hasData) {
				return
			}
			// fetch new weather using last known position
			const weather = await fetchWeather(
				this.data.position.latitude,
				this.data.position.longitude
			)
			this.data.weather = {
				...this.data.weather,
				...weather,
				hasData: true,
				timestamp: Date.now(),
			}
			setCorrectingInterval(() => {
				this.refreshWeather()
			}, 5 * 60 * 1000)
		},
	},
})
