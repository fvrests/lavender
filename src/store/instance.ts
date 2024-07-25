import { defineStore } from 'pinia'
import { useOptionsStore } from './options'
import { format } from 'date-fns'
import { useDataStore } from './data'

export const useInstanceStore = defineStore('instance', {
	state: () => ({
		init: false,
		date: new Date(),
		timeoutIds: {} as { [name: string]: number },
	}),
	getters: {
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
	},
	actions: {
		pauseFetchWhenHidden() {
			document.addEventListener('visibilitychange', () => {
				if (this.init && document.hidden) {
					// page became hidden
					console.log('page hidden -- clearing intervals')
					this.clearInterval('time')
					this.clearInterval('weather')
				} else {
					// page became visible
					console.log('page visible -- restarting intervals')
					this.startClock()
					useDataStore().refreshWeatherIfInvalidated()
					useDataStore().subscribeToWeather()
				}
			})
		},
		initialize() {
			this.init = true
			this.startClock()
			this.pauseFetchWhenHidden()
		},
		startClock() {
			this.date = new Date()
			this.setCorrectingInterval(
				() => {
					return (this.date = new Date())
				},
				1000,
				'time',
			)
		},
		clearInterval(name: string) {
			clearTimeout(this.timeoutIds[name])
			delete this.timeoutIds[name]
		},
		setCorrectingInterval(func: () => {} | void, delay: number, name: string) {
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

			// recurring timeout loop
			let store = this
			function tick(func: () => void | {}, delay: number) {
				if (name === 'weather') console.log('running weather interval')
				store.clearInterval(name)
				// on first run, set up instance
				if (!instance.started) {
					instance = {
						func: func,
						delay: delay,
						startTime: new Date().valueOf(),
						target: delay,
						started: true,
					}
					store.timeoutIds[name] = setTimeout(tick, instance.delay)
				} else {
					const elapsed = new Date().valueOf() - instance.startTime!
					const adjust = instance.target! - elapsed

					instance.func!()
					instance.target! += instance.delay!

					store.timeoutIds[name] = setTimeout(tick, instance.delay! + adjust)
				}
			}

			// run once to start timeout loop if none exists
			tick(func, delay)
			// return this.timeoutIds[name]
		},
	},
})
