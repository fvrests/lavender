<template>
    <div class="options" @keyup.esc="isOptionsOpen = false">
        <button
            :class="[{ open: isOptionsOpen }, button.icon]"
            class="options-button"
            @click="toggleOptionsMenu"
        >
            <v-icon class="options-icon" style="width: 20px; height: 20px;" />
        </button>
        <div v-if="isOptionsOpen" class="overlay" @click="toggleOptionsMenu" />
        <transition name="optionsMenu">
            <div v-show="isOptionsOpen" class="options-menu" role="menu">
                <div class="options-menu--inner">
                    <div :class="text.title">Options</div>

                    <div :class="text.subtitle">theme</div>
                    <div class="row">
                        <div :class="text.label">selected:</div>
                        <div :class="text.sublabel">{{ storedTheme }}</div>
                    </div>

                    <div class="row even" style="padding: 6px 0px;">
                        <!-- use aria label for buttons -->
                        <button
                            class="colorToggle"
                            style="background-color: var(--color-lavender);"
                            @click="toggleTheme('lavender')"
                            @mouseenter="previewTheme('lavender')"
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
                            style="background-color: var(--color-lemon);"
                            @click="toggleTheme('lemon')"
                            @mouseenter="previewTheme('lemon')"
                            @mouseleave="toggleTheme()"
                        />
                        <button
                            class="colorToggle"
                            style="background-color: var(--color-sea);"
                            @click="toggleTheme('sea')"
                            @mouseenter="previewTheme('sea')"
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
                            style="background-color: var(--color-sand);"
                            @click="toggleTheme('sand')"
                            @mouseenter="previewTheme('sand')"
                            @mouseleave="toggleTheme()"
                        />
                    </div>

                    <div class="divider" />

                    <div :class="text.subtitle">time</div>
                    <v-option-toggle
                        option="useMilitaryTime"
                        label="24 hour format"
                        role="menuitem"
                    />
                    <div :class="text.label">layout:</div>
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

                    <!-- <div class="space-small" /> -->
                    <div class="divider" />

                    <div :class="text.subtitle">weather</div>
                    <v-option-toggle option="useCelsius" label="celsius" />
                    <v-option-toggle
                        option="useDescriptiveWeather"
                        label="precise conditions"
                    />

                    <!-- <div class="space-small" /> -->

                    <div class="row">
                        <div :class="text.base">source:</div>
                        <v-external-link url="https://openweathermap.org"
                            >OpenWeather</v-external-link
                        >
                    </div>

                    <div class="divider" />

                    <div :class="text.subtitle">location</div>

                    <div v-if="storedWeather.hasData" class="row separated">
                        <div
                            v-if="fetchingPosition == false"
                            :class="text.label"
                        >
                            {{ storedWeather.name }},
                            {{ storedWeather.sys.country }}
                        </div>

                        <div v-else :class="text.label">Fetching...</div>
                        <div>
                            <button
                                :class="button.primary"
                                style="margin: 0 auto;"
                                :disabled="refreshDisabled"
                                @click="handleFetch"
                            >
                                {{
                                    !refreshDisabled
                                        ? 'Refresh'
                                        : 'Please wait 15s'
                                }}
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="row separated">
                            <div
                                v-if="fetchingPosition == false"
                                :class="text.label"
                            >
                                location disabled.
                            </div>
                            <div v-else :class="text.label">fetching...</div>
                            <div>
                                <button
                                    :class="button.primary"
                                    style="margin: 0 auto;"
                                    @click="handleFetch"
                                >
                                    Enable
                                </button>
                            </div>
                        </div>

                        <div :class="text.base">
                            Lavender will never access your location without
                            your permission. Please click 'enable' to enable
                            location access.
                        </div>
                    </div>

                    <div class="divider" />

                    <div class="row even">
                        <v-external-link
                            url="https://github.com/fvrests/lavender/blob/main/privacy-policy.md"
                            >Privacy Policy</v-external-link
                        >
                        <v-external-link
                            url="https://github.com/fvrests/lavender/blob/main/terms-of-use.md"
                            >Terms of Use</v-external-link
                        >
                    </div>

                    <div class="space-small" />

                    <div class="row even">
                        <v-external-link
                            url="https://twitter.com/fvrests"
                            :underline="true"
                            >@fvrests</v-external-link
                        >

                        <v-external-link
                            url="https://givebutter.com/fvrests"
                            :underline="true"
                            >donate ♥</v-external-link
                        >
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import VIcon from '../assets/icons/icon.vue'
import VOptionToggle from './option-toggle.vue'
import VRadioGroup from './radio-group.vue'
import VExternalLink from './external-link.vue'
import button from './button.module.css'
import text from './text.module.css'
import { toggleTheme, previewTheme } from '../utils/theme'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
    components: {
        VIcon,
        VOptionToggle,
        VRadioGroup,
        VExternalLink,
    },
    setup() {
        let store = useStore()
        let storedWeather = computed(() => store.state.weather)
        let storeInitialized = computed(() => store.state.init)
        let storedTheme = computed(() => store.state.themeColor)
        let timeLayout = computed(() => store.state.timeLayout)
        let fetchingPosition = computed(() => store.state.position.fetching)
        let isOptionsOpen = ref(false)
        let isDonationModalOpen = ref(false)
        let positionDeclined = computed(() => store.state.position.declined)
        let refreshDisabled = ref(false)

        function toggleProperty(property) {
            store.commit('toggleProperty', property)
            // console.log(property, store.state[property])
        }
        function toggleOptionsMenu() {
            isOptionsOpen.value = !isOptionsOpen.value
        }
        function toggleDonationModal() {
            isDonationModalOpen.value = !isDonationModalOpen.value
        }
        function handleFetch() {
            refreshDisabled.value = true
            store.dispatch('fetchPosition')
            setTimeout(function () {
                refreshDisabled.value = false
            }, 15 * 1000)
        }

        return {
            toggleProperty,
            toggleOptionsMenu,
            handleFetch,
            storedWeather,
            isOptionsOpen,
            toggleTheme,
            previewTheme,
            button,
            text,
            storeInitialized,
            storedTheme,
            timeLayout,
            fetchingPosition,
            positionDeclined,
            refreshDisabled,
            toggleDonationModal,
            isDonationModalOpen,
        }
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
/* .options-menu {
    z-index: 10;
    width: 320px;
    height: 640px;
    max-height: 100%;
    overflow: scroll;
    position: fixed;
    bottom: calc(var(--page-padding) + 36px + var(--space-small));
    top: var(--page-padding);
    margin-top: auto;
    right: var(--page-padding);
    padding: var(--space-medium);
    border: var(--border);
    border-radius: var(--rounded);
    background-color: white;
} */
.options-menu {
    padding-top: var(--page-padding);
    width: 320px;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    right: var(--page-padding);
    bottom: calc(var(--page-padding) + 36px + var(--space-small));
    z-index: 10;
}
.donation-modal {
    position: fixed;
    left: calc(50% - 150px);
    top: calc(50% - 307.5px);
    z-index: 11;
}
.close:first-child {
    display: flex;
    position: fixed;
    left: calc(50% + 150px + var(--space-small));
    top: calc(50% - 307.5px - var(--space-small));
    width: 20px;
    transform: rotate(45deg);
    background-color: black;
    z-index: 13;
}
.close:last-child {
    display: flex;
    position: fixed;
    left: calc(50% + 150px + var(--space-small));
    top: calc(50% - 307.5px - var(--space-small));
    width: 20px;
    transform: rotate(-45deg);
    background-color: black;
    z-index: 13;
}
.options-menu--inner {
    margin-top: auto;
    padding: var(--space-medium);
    width: 100%;
    height: 100%;
    max-height: 640px;
    background: white;
    border: var(--border);
    border-radius: var(--rounded);
    overflow-y: scroll;
}

.options-button {
    position: fixed;
    bottom: var(--page-padding);
    right: var(--page-padding);
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
.dark {
    background-color: var(--color-dark-gray);
    opacity: 0.6;
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
