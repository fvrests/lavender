import { defineStore } from 'pinia'

type Intervals = {
	[intervalId: number]: () => null
}

export const useInstanceStore = defineStore('instance', {
	state: () => ({
		date: { intervalCount: 0, intervals: {} as Intervals },
		weather: { intervalCount: 0, intervals: {} },
		intervalIds: {} as { [name: string]: number },
	}),
	actions: {
		clearInterval(name: string) {
			if (this.intervalIds[name] !== null) {
				clearTimeout(this.intervalIds[name])
			}
			delete this.intervalIds[name]
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
				clearInterval(store.intervalIds[name])
				// on first run, set up instance
				if (!instance.started) {
					instance = {
						func: func,
						delay: delay,
						startTime: new Date().valueOf(),
						target: delay,
						started: true,
					}
					store.intervalIds[name] = setTimeout(tick, instance.delay)
				} else {
					const elapsed = new Date().valueOf() - instance.startTime!
					const adjust = instance.target! - elapsed

					instance.func!()
					instance.target! += instance.delay!

					store.intervalIds[name] = setTimeout(tick, instance.delay! + adjust)
				}
			}

			// run once to start timeout loop if none exists
			tick(func, delay)
			return this.intervalIds[name]
		},
	},
})
