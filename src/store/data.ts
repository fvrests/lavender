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
		isChrome: false,
		date: new Date(),
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
			console.log('weather', state.weather.weather)
			console.log('id', state.weather)
			let condition = useOptionsStore().weather.descriptive
				? conditions[state.weather.weather[0].id][0]
				: conditions[state.weather.weather[0].id][1]
			return condition
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
						this.$patch(localData)
						this.date = new Date(localData.date)
					}
				},
				(err) => {
					console.warn(err)
				},
			)
			this.isChrome =
				!!(navigator as any).userAgentData &&
				(navigator as any).userAgentData.brands.some(
					(data: any) => data.brand == 'Google Chrome',
				)
			this.init = true
			this.$subscribe((_, state) => {
				if (this.init) {
					localStorage.setItem('data', JSON.stringify(state))
				}
			})
		},
		async fetchPosition() {
			this.$patch({
				position: { fetching: true },
			})
			const getPosition = new Promise<GeolocationPosition>(
				// todo: make sure fetching set to false after error
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							resolve(pos)
						},
						(err) => {
							console.warn('Error fetching position', err)
							this.errors.location = err.message
							reject(err)
							this.$patch({
								position: {
									fetching: false,
								},
							})
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
						fetching: false,
					},
				})
				return pos
			})
		},
		refreshWeather(lat: number, long: number) {
			// console.log('refreshing weather')
			// fix: doesn't always fetch new weather on first load?
			let invalidated =
				!this.weather?.timestamp ||
				Number(Date.now()) - this.weather?.timestamp >= 30 * 60 * 1000
			// don't fetch if recent data exists or no location data
			if (!invalidated) {
				return
			}
			// fetch new weather using last known position
			fetchWeather(lat, long).then((res) => {
				return (
					(this.weather = {
						...this.weather,
						...res,
						timestamp: Number(Date.now()),
					}),
					(err: any) => {
						console.warn('error fetching weather', err)
					}
				)
			})
			setCorrectingInterval(
				() => {
					if (!this.position.latitude || !this.position.longitude) {
						return console.log('No location data available')
					}
					this.refreshWeather(this.position.latitude, this.position.longitude)
				},
				5 * 60 * 1000,
			)
		},
		async handleInitialFetch() {
			await this.fetchPosition().then(
				(pos) => {
					this.refreshWeather(pos.coords.latitude, pos.coords.longitude)
				},
				(err) => {
					console.log('error fetching location', err)
				},
			)
		},
	},
})
