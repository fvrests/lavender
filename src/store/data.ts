import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { setCorrectingInterval, fetchWeather } from '../utils/helpers'
import conditions from '../utils/weather-conditions'
import { useOptionsStore } from './options'

export const useDataStore = defineStore('data', {
	state: () => ({
		init: false,
		data: {
			date: new Date(),
			weather: {
				timestamp: null as number | null,
			},
			position: {
				latitude: null as number | null,
				longitude: null as number | null,
				timestamp: null as number | null,
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
		useOptionsStore() {
			return useOptionsStore()
		},
		formattedDate(state) {
			let hour = ''
			if (useOptionsStore().time.use24Hour) {
				hour = format(state.data.date, 'HH')
			} else if (useOptionsStore().time.layout == 'stacked') {
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
			if (state.data.weather.timestamp) {
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
			if (state.data.weather.timestamp) {
				let celsiusTemp = (state.data.weather?.main.temp - 273.15).toFixed()
				let fahrenheitTemp = (Number(celsiusTemp) * (9 / 5) + 32).toFixed()
				return useOptionsStore().weather.useCelsius
					? celsiusTemp
					: fahrenheitTemp
			} else {
				return 'Please click the cloud to get data!'
			}
		},
		weatherConditions: (state) => {
			if (state.data.weather.timestamp) {
				let condition = useOptionsStore().weather.descriptive
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
			if (useOptionsStore().useChromeStorage) {
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
		getTime() {
			setCorrectingInterval(() => (this.data.date = new Date()), 1000)
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
			return getPosition.then((pos) => {
				if (pos) {
					console.log('pos found', pos)
					this.$patch({
						data: {
							position: {
								latitude: pos.coords.latitude,
								longitude: pos.coords.longitude,
								timestamp: Date.now(),
								fetching: false,
							},
						},
					})
				}
				console.log({
					pos,
					fromState: [
						this.data.position.latitude,
						this.data.position.longitude,
						this.data.position.fetching,
					],
				})
				return pos
			})
		},
		refreshWeather(lat: number, long: number) {
			console.log('refreshing weather')
			let invalidated =
				!this.data.weather.timestamp ||
				Date.now() - this.data.weather.timestamp >= 30 * 60 * 1000
			// don't fetch if recent data exists or no location data
			console.log({ invalidated })
			if (!invalidated) {
				return
			}
			// fetch new weather using last known position
			// no state
			console.log('state', this.data.position)
			if (this.data.position.latitude && this.data.position.longitude)
				fetchWeather(lat, long).then((data) => {
					console.log('raw weather', data)
					return (this.data.weather = {
						...this.data.weather,
						...data,
						timestamp: Date.now(),
					})
				})
			setCorrectingInterval(() => {
				this.refreshWeather()
			}, 5 * 60 * 1000)
		},
	},
})
