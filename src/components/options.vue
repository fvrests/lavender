<template>
  <div>
    <h2>options</h2>
    <button @click="toggleCelsius">Toggle temp format</button>
    <button @click="toggleMilitaryTime">Toggle time format</button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    toggleCelsius() {
      this.$store.commit('toggleCelsius')
      console.log(this.$store.state)
    },
    toggleMilitaryTime() {
      this.$store.commit('toggleMilitaryTime')
      console.log(this.$store.state)
    }
  }
}
</script>

<style scoped></style>
