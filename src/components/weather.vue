<template>
  <h2>weather</h2>
  <p>{{ msg }}</p>
  <p>Weather: {{ weather }}</p>
  <button @click="getWeather">Get weather</button>
</template>

<script>
import store from '@/store'
export default {
  components: {},
  props: ['msg'],
  setup() {
    function getWeather() {
      console.log('prev: ', store.state.weather)
      if (
        !store.state.weather.main ||
        Date.now() - store.state.weather.timestamp >= 30 * 60
      ) {
        navigator.geolocation.getCurrentPosition(pos => {
          let { latitude, longitude } = pos.coords
          store.commit('setPosition', { latitude, longitude })
          console.log('new: ', store.state)
        })
      } else {
        console.log('using last known location...')
        console.log(store.state.position)
      }
    }

    return {
      getWeather
    }
  }
}
</script>

<style scoped></style>
