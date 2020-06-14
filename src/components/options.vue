<template>
    <div class="options">
        <transition name="optionsMenu">
            <div v-show="isOptionsOpen" class="options-menu">
                <div :class="text.title">Options</div>

                <div :class="text.subtitle">time</div>
                <v-option-toggle
                    option="useMilitaryTime"
                    label="Format:"
                    sublabel="24 hour"
                />
                <div :class="text.label">Layout:</div>
                <v-radio-group
                    property="timeLayout"
                    :options="['default', 'stacked']"
                >
                    <template #default>
                        <div class="time">
                            <div>9:41</div>
                        </div>
                    </template>

                    <template #stacked>
                        <div class="time">
                            <div class="outline">
                                <div :class="text.monospaced">
                                    <span>0</span>
                                    <span>9</span>
                                </div>
                                <div :class="text.monospaced">
                                    <span>4</span>
                                    <span>1</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </v-radio-group>

                <div class="divider" />

                <div :class="text.subtitle">weather</div>
                <v-option-toggle
                    option="useCelsius"
                    label="Units:"
                    sublabel="Celsius"
                />
                <v-option-toggle
                    option="useDescriptiveWeather"
                    label="Conditions:"
                    sublabel="More specific values"
                />

                <div class="divider" />

                <div :class="text.subtitle">location</div>
                <div class="row separated">
                    <div v-if="storedWeather.hasData">
                        <div class="row" :class="text.label">
                            Stored location:
                            <div :class="text.sublabel">
                                {{ storedWeather.name }},
                                {{ storedWeather.sys.country }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            :class="button.primary"
                            style="margin: 0 auto;"
                            @click="fetchPositionAndWeather"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div class="divider" />

                <div :class="text.subtitle">theme</div>
                <div class="row" :class="text.label">
                    Selected:
                    <div :class="text.sublabel">{{ storedTheme }}</div>
                </div>
                <div class="row even" style="padding-top: 6px;">
                    <!-- use aria label for buttons -->
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-sand);"
                        @click="toggleTheme('sand')"
                        @mouseenter="previewTheme('sand')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-rose);"
                        @click="toggleTheme('rose')"
                        @mouseenter="previewTheme('rose')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-lavender);"
                        @click="toggleTheme('lavender')"
                        @mouseenter="previewTheme('lavender')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-lemon);"
                        @click="toggleTheme('lemon')"
                        @mouseenter="previewTheme('lemon')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-leaf);"
                        @click="toggleTheme('leaf')"
                        @mouseenter="previewTheme('leaf')"
                        @mouseleave="toggleTheme()"
                    />
                    <button
                        class="colorToggle"
                        style="background-color: var(--color-sea);"
                        @click="toggleTheme('sea')"
                        @mouseenter="previewTheme('sea')"
                        @mouseleave="toggleTheme()"
                    />
                </div>
            </div>
        </transition>

        <div class="space-small" />
        <button
            :class="[{ open: isOptionsOpen }, button.icon]"
            @click="toggleOptionsMenu"
        >
            <v-icon class="options-icon" style="width: 20px; height: 20px;" />
        </button>
        <div v-if="isOptionsOpen" class="overlay" @click="toggleOptionsMenu" />
    </div>
</template>

<script>
import VIcon from '../assets/icons/icon.vue'
import VOptionToggle from './option-toggle.vue'
import VRadioGroup from './radio-group.vue'
import button from './button.module.css'
import text from './text.module.css'
import { toggleTheme, previewTheme } from '../utils/theme'
import { fetchPositionAndWeather } from '../utils/helpers'

export default {
    components: {
        VIcon,
        VOptionToggle,
        VRadioGroup,
    },
    data: function () {
        return {
            isOptionsOpen: false,
            fetchPositionAndWeather,
            toggleTheme,
            previewTheme,
            button,
            text,
        }
    },
    computed: {
        storedWeather: function () {
            return this.$store.state.weather
        },
        storeInitialized: function () {
            return this.$store.state.init
        },
        storedTheme: function () {
            return this.$store.state.themeColor
        },
        timeLayout: function () {
            return this.$store.state.timeLayout
        },
    },
    methods: {
        toggleProperty(property) {
            this.$store.commit('toggleProperty', property)
            console.log(property, this.$store.state[property])
        },
        toggleOptionsMenu() {
            this.isOptionsOpen = !this.isOptionsOpen
        },
    },
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
    padding: var(--space-medium);
    border-radius: var(--rounded);
    z-index: 10;
    border: var(--border);
    min-width: 320px;
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
.colorToggle {
    height: 24px;
    width: 24px;
    border-radius: var(--rounded-full);
    cursor: pointer;
    border: var(--border);
}
.time {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
}
.outline {
    border: var(--border);
    padding: 4px;
}
</style>
