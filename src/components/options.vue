<template>
    <div class="button-wrapper">
        <div class="weather-buttons" />
        <p>Weather format ☁️</p>
        <button @click="toggleCelsius">
            {{ useCelsius ? 'Fahrenheit' : 'Celsius' }}
        </button>
        <div class="time-buttons" />
        <p>Time format ⌛️</p>
        <button @click="toggleMilitaryTime">
            {{ useMilitaryTime ? 'Standard' : 'Military' }}
        </button>
    </div>
</template>

<script>
export default {
    components: {},
    mounted() {
        this.$store.commit('getCachedOptions')
        console.log('got cached options - complete!~')
    },
    methods: {
        toggleCelsius() {
            this.$store.commit('toggleCelsius')
            console.log(this.$store.state)
        },
        toggleMilitaryTime() {
            this.$store.commit('toggleMilitaryTime')
            console.log(this.$store.state)
        }
    },
    computed: {
        useMilitaryTime: function() {
            return this.$store.state.useMilitaryTime
        },
        useCelsius: function() {
            return this.$store.state.useCelsius
        }
    }
}
</script>

<style scoped>
button {
    background-color: white;
    color: black;
    font-weight: bold;
    height: 24px;
    border-radius: 12px;
    padding: 0px 6px;
}
.button-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 120px;
}
</style>
