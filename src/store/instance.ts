import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { useOptionsStore } from './options'
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
		initialize() {
			this.init = true
			this.startClock()
			// listen to visibility & pause fetch when hidden
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
			const clearBc = new BroadcastChannel('clear')
			clearBc.onmessage = (message) => {
				console.log("received 'reset' broadcast message", message)
				if (message.data === 'clear') {
					this.clearData(false)
				}
			}
		},
		clearInterval(name: string) {
			clearTimeout(this.timeoutIds[name])
			delete this.timeoutIds[name]
		},
		reset() {
			this.clearInterval('weather')
			this.clearInterval('time')
			this.$reset()
		},
		clearData(broadcast: boolean = false) {
			// if this is the first tab to reset, broadcast to other tabs
			if (broadcast === true) {
				const clearBc = new BroadcastChannel('clear')
				clearBc.postMessage('clear')
			} else {
				localStorage.clear()

				useOptionsStore().reset()
				useDataStore().reset()
				this.reset()

				this.initialize()
				useOptionsStore().initialize()
				useDataStore().initialize()
			}
		},
		// correcting interval - corrects compounding variation in time between ticks that would occur using setInterval
		// https://andrewduthie.com/2013/12/31/creating-a-self-correcting-alternative-to-javascripts-setinterval/
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
