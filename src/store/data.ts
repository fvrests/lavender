import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { setCorrectingInterval, fetchWeather } from '../utils/helpers'
import conditions from '../utils/weather-conditions'
import { useOptionsStore } from './options'

interface Weather extends OpenWeatherResponse {
	timestamp: number | null
}

export const useDataStore = defineStore('data', {
	state: () => ({
		init: false,
		date: new Date(),
		isChromeExtension: false,
		weather: null as Weather | null,
		position: {
			latitude: null as number | null,
			longitude: null as number | null,
			timestamp: null as number | null,
			fetching: false,
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
			let date = new Date(state.date)
			if (useOptionsStore().time.use24Hour) {
				hour = format(date, 'HH')
			} else if (useOptionsStore().time.layout == 'stacked') {
				hour = format(date, 'hh')
			} else {
				hour = format(date, 'h')
			}
			return {
				today: format(date, 'LLLL do, yyyy'),
				hour: hour,
				minute: format(date, 'mm'),
				descriptor: format(date, 'B'),
			}
		},
		weatherIconClass: (state) => {
			let iconClass = 'wi wi-cloud-refresh'
			if (state.weather?.timestamp) {
				let day = true
				day = !!(
					Number(state.date) / 1000 > state.weather.sys.sunrise &&
					Number(state.date) / 1000 < state.weather.sys.sunset
				)
				iconClass = day
					? `wi wi-owm-day-${state.weather.weather[0].id}`
					: `wi wi-owm-night-${state.weather.weather[0].id}`
			}
			return iconClass
		},
		formattedTemp: (state) => {
			if (!state.weather?.timestamp) {
				return 'No weather data available'
			}
			let celsiusTemp = (state.weather.main.temp - 273.15).toFixed()
			let fahrenheitTemp = (Number(celsiusTemp) * (9 / 5) + 32).toFixed()
			return useOptionsStore().weather.useCelsius ? celsiusTemp : fahrenheitTemp
		},
		weatherConditions: (state) => {
			if (!state.weather?.timestamp || !state.weather.weather.length) {
				return 'No weather data available'
			}

			let conditionCode = state.weather.weather[0].id
			let conditionText: string = ''
			if (conditionCode in conditions) {
				conditionText = useOptionsStore().weather.descriptive
					? conditions[conditionCode as keyof typeof conditions][0]
					: conditions[conditionCode as keyof typeof conditions][1]
			} else {
				conditionText = 'Conditions unknown'
			}
			return conditionText
		},
	},
	actions: {
		startClock() {
			setCorrectingInterval(() => (this.date = new Date()), 1000)
		},
		initialize() {
			this.startClock()
			async function getLocalData() {
				return localStorage.getItem('data')
			}
			getLocalData().then(
				(data) => {
					if (data) {
						const localData = JSON.parse(data)
						localData.date = new Date()
						this.$patch(localData)
						if (localData.position.latitude && localData.position.longitude) {
							this.refreshWeatherIfInvalidated(
								localData.position.latitude,
								localData.position.longitude,
							)
						}
					}
				},
				(err) => {
					console.warn(err)
				},
			)
			this.isChromeExtension = !!(
				window.chrome &&
				chrome.runtime &&
				chrome.runtime.id
			)
			this.init = true
			this.$subscribe((_, state) => {
				if (this.init) {
					localStorage.setItem('data', JSON.stringify(state))
				}
			})
		},
		async fetchPosition() {
			const getPosition = new Promise<GeolocationPosition>(
				(resolve, reject) => {
					this.$patch({
						position: { fetching: true },
					})
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							this.$patch({
								position: {
									fetching: false,
								},
							})
							resolve(pos)
						},
						(err) => {
							console.warn('Error fetching position', err)
							this.errors.location = err.message
							this.$patch({
								position: {
									fetching: false,
								},
							})
							reject(err)
						},
					)
				},
			)
			return getPosition.then((pos) => {
				this.$patch({
					position: {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						timestamp: Number(Date.now()),
					},
				})
				return pos
			})
		},
		refreshWeatherIfInvalidated(latitude: number, longitude: number) {
			// don't fetch if no location data or recent data exists
			let invalidated =
				!this.weather?.timestamp ||
				Number(Date.now()) - this.weather?.timestamp >= 30 * 60 * 1000
			if (!invalidated) return
			// fetch new weather using last known position
			fetchWeather(latitude, longitude).then(
				(res) => {
					this.weather = {
						...this.weather,
						...res,
						timestamp: Number(Date.now()),
					}
				},
				(err: any) => {
					this.errors.weather = err.message
					console.warn('error fetching weather', err)
				},
			)
			setCorrectingInterval(
				// refresh weather every 5 minutes if location data exists
				() => {
					if (!this.position.latitude || !this.position.longitude) {
						return console.log('No location data available')
					}
					this.refreshWeatherIfInvalidated(
						this.position.latitude,
						this.position.longitude,
					)
				},
				5 * 60 * 1000,
			)
		},
		async handleInitialFetch() {
			await this.fetchPosition().then(
				(pos) => {
					this.refreshWeatherIfInvalidated(
						pos.coords.latitude,
						pos.coords.longitude,
					)
				},
				(err) => {
					return err
				},
			)
		},
	},
})
