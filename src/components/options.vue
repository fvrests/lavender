<template>
    <div class="options">
        <transition name="optionsMenu">
            <div v-show="isOptionsOpen" class="options-menu">
                <h3>Options</h3>
                <v-options-item
                    option="useMilitaryTime"
                    text="⌛️ use Military Time"
                />
                <v-options-item option="useCelsius" text="☁️ use Celsius" />
                <v-options-item
                    option="useHorizontalTime"
                    text="use horizontal time layout"
                />
                <v-options-item
                    option="useDescriptiveWeather"
                    text="🌤 use more descriptive weather"
                />
                <div v-if="storedWeather.hasData">
                    <p>
                        🌎 Stored locale: {{ storedWeather.name }},
                        {{ storedWeather.sys.country }}
                    </p>
                </div>
                <button @click="fetchPositionAndWeather">
                    Refresh location
                </button>
            </div>
        </transition>
        <div
            @click="toggleOptionsMenu"
            class="options-icon-container"
            style="user-select: none"
        >
            <v-icon class="options-icon" style="width: 24px; height: 24px;" />
        </div>
    </div>
</template>

<script>
import VIcon from '../assets/icons/icon.vue'
import { fetchPositionAndWeather } from '../utils/helpers'
import VOptionsItem from './options-item.vue'

export default {
    components: {
        VIcon,
        VOptionsItem
    },
    data: function() {
        return {
            isOptionsOpen: false,
            fetchPositionAndWeather
        }
    },
    methods: {
        toggleProperty(property) {
            this.$store.commit('toggleProperty', property)
            console.log(property, this.$store.state[property])
        },
        toggleOptionsMenu() {
            this.isOptionsOpen = !this.isOptionsOpen
        }
    },
    computed: {
        storedWeather: function() {
            return this.$store.state.weather
        }
    }
}
</script>

<style scoped>
.options {
    position: fixed;
    right: 32px;
    bottom: 32px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.options-menu {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    border-radius: 8px;
}

.optionsMenu-enter-active,
.optionsMenu-leave-active {
    transition: ease-in-out all 100ms;
}
.optionsMenu-enter-from,
.optionsMenu-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.options-icon-container {
    height: 32px;
    width: 32px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    border-radius: 16px;
}
.options-icon-container:hover {
    background-color: #ffffff1a;
}
.options-icon {
    color: #222222;
    transform: scale(0.8);
}
</style>
