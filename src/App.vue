<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <v-weather msg="app is working ON VUE3 :)))))" />
    <v-options />
    <v-time />
  </div>
</template>

<script>
import Weather from './components/weather.vue'
import Options from './components/options.vue'
import Time from './components/time.vue'

export default {
  name: 'App',
  components: {
    'v-weather': Weather,
    'v-options': Options,
    'v-time': Time
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
