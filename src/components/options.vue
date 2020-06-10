<template>
    <div class="options">
        <transition name="optionsMenu">
            <div v-show="isOptionsOpen" class="options-menu">
                <div class="menu-title">Options</div>
                <div class="space-small" />
                <div class="italic">data format</div>

                <v-option-toggle
                    option="useMilitaryTime"
                    text="Time: 24 hour format"
                />
                <v-option-toggle
                    option="useCelsius"
                    text="Temperature: display in Celsius"
                />
                <v-options-toggle
                    option="useDescriptiveWeather"
                    text="More descriptive weather conditions"
                />
                <div class="space-small" />
                <div class="italic">layout</div>
                <input
                    type="radio"
                    name="layout"
                    value="horizontal"
                    v-model="selectedOption"
                    :checked="initialValue == 'horizontal'"
                />
                <input
                    type="radio"
                    name="layout"
                    value="vertical"
                    v-model="selectedOption"
                    :checked="initialValue == 'vertical'"
                />
                {{ selectedOption }}
                <div class="space-small" />
                <div v-if="storedWeather.hasData">
                    <div style="font-weight: bold">
                        Your stored location:
                        <span style="font-weight: normal; font-style: italic;">
                            {{ storedWeather.name }},
                            {{ storedWeather.sys.country }}
                        </span>
                    </div>
                </div>
                <div class="space-small" />
                <div>
                    <button
                        @click="fetchPositionAndWeather"
                        :class="button.primary"
                        style="margin: 0 auto;"
                    >
                        Refresh Location
                    </button>
                </div>

                <div class="space-small" />
                <div style="font-weight: bold">Color theme</div>
                <div class="space-small" />
                <div class="row even">
                    <!-- use aria label for buttons -->
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-sand)"
                        @click="toggleTheme('sand')"
                        @mouseenter="previewTheme('sand')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-rose)"
                        @click="toggleTheme('rose')"
                        @mouseenter="previewTheme('rose')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-lavender)"
                        @click="toggleTheme('lavender')"
                        @mouseenter="previewTheme('lavender')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-lemon)"
                        @click="toggleTheme('lemon')"
                        @mouseenter="previewTheme('lemon')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-leaf)"
                        @click="toggleTheme('leaf')"
                        @mouseenter="previewTheme('leaf')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-cloud)"
                        @click="toggleTheme('cloud')"
                        @mouseenter="previewTheme('cloud')"
                        @mouseleave="toggleTheme()"
                    />
                </div>
            </div>
        </transition>
        <div class="space-small" />
        <button
            @click="toggleOptionsMenu"
            :class="[{ open: isOptionsOpen }, button.icon]"
        >
            <v-icon class="options-icon" style="width: 20px; height: 20px;" />
        </button>
        <div v-if="isOptionsOpen" class="overlay" @click="toggleOptionsMenu" />
    </div>
</template>

<script>
import VIcon from '../assets/icons/icon.vue'
import { fetchPositionAndWeather } from '../utils/helpers'
import VOptionToggle from './option-toggle.vue'
// import VOptionCard from './option-card.vue'
import { toggleTheme, previewTheme } from '../utils/theme'
import button from './button.module.css'

export default {
    components: {
        VIcon,
        VOptionToggle
    },
    data: function() {
        return {
            isOptionsOpen: false,
            fetchPositionAndWeather,
            toggleTheme,
            previewTheme,
            selectedOption: '',
            button,
            initialValue: ''
        }
    },
    watch: {
        selectedOption: function(newV) {
            this.$store.commit('changeProperty', {
                property: 'timeFormat',
                newValue: newV
            })
            console.log('v', newV)
        },
        storeInitialized: function() {
            this.initialValue = this.$store.state.timeFormat
            this.selectedOption = this.$store.state.timeFormat
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
        },
        storeInitialized: function() {
            return this.$store.state.init
        }
    }
}
</script>

<style scoped>
.options {
    position: fixed;
    right: var(--page-padding);
    bottom: var(--page-padding);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.options-menu {
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: var(--space-medium);
    border-radius: var(--rounded);
    z-index: 10;
    border: 2px solid var(--color-soft-gray);
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
.overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: transparent;
    z-index: 9;
}
.menu-title {
    font-weight: bold;
    font-size: 16px;
}
.colorToggle {
    height: 24px;
    width: 24px;
    border-radius: var(--rounded-full);
    cursor: pointer;
    border: 1.5px solid var(--color-soft-gray);
}
.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.even {
    justify-content: space-evenly;
}
.open {
    background-color: white;
    border: 2px solid var(--color-soft-gray);
}
.italic {
    text-transform: uppercase;
    font-size: 12px;
    font-style: italic;
}
</style>
