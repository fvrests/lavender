import Vuex from 'vuex'

export default Vuex.createStore({
  state: {
    useMilitaryTime: true,
    useCelsius: true,
    position: {
      latitude: '',
      longitude: ''
    },
    weather: {}
  },
  mutations: {
    toggleCelsius(state) {
      state.useCelsius = !state.useCelsius
    },
    toggleMilitaryTime(state) {
      state.useMilitaryTime = !state.useMilitaryTime
    },
    setPosition(state, coords) {
      state.position = { ...coords, timestamp: Date.now() }
    }
  }
})
