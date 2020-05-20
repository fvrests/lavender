import store from '@/store'
const unsubscribe = store.watch(
    (state, getters) => {
        return [state, getters.weatherIconClass, getters.formattedTemp]
    },
    watched => {
        console.log('State is:', watched[0])
        console.log('weather icon class is:', watched[1])
        console.log('formattedtemp is:', watched[2])
    },
    {}
)

// To unsubscribe:
unsubscribe()
