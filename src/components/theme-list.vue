<script>
import { toggleTheme, previewTheme } from '../utils/theme'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    props: {
        themes: { type: Array, required: true },
    },
    setup() {
        let store = useStore()
        let storedTheme = computed(() => store.state.themeColor)
        return {
            toggleTheme,
            previewTheme,
            storedTheme,
        }
    },
}
</script>
<template>
    <ul>
        <li v-for="theme in themes">
            <button
                class="color-toggle"
                :class="storedTheme === theme ? 'selected' : null"
                :style="{ background: `var(--color-${theme})` }"
                :aria-label="theme"
                @click="toggleTheme(theme)"
                @mouseenter="previewTheme(theme)"
                @mouseleave="toggleTheme()"
            ></button>
        </li>
    </ul>
</template>
<style scoped>
ul {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
}

button {
    height: 28px;
    width: 28px;
    border-radius: var(--rounded-full);
    cursor: pointer;
    border: var(--border);
}

/* todo: add checkmark or other active style. need to differentiate hue*/
button.selected {
    border-color: red;
    background: red;
}
</style>
