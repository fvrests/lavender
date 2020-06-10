<template>
    <div class="item-wrapper">
        <div class="text" style="font-weight: bold">{{ text }}</div>
        <div class="space-small" />
        <label :for="option">
            <input
                type="radio"
                :id="option"
                name="layout"
                v-model="selected"
                :value="newValue"
            />
            <span class="dot"></span>
        </label>
        {{ selected }}
        {{ newValue }}
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    props: {
        text: { type: String, required: true },
        option: { type: String, required: true },
        newValue: { type: Boolean, required: true }
    },
    setup(props) {
        let store = useStore()
        let initialValue = computed(() => store.state[props.option])
        let selected = ref(false)
        console.log('nv', initialValue)

        function select() {
            store.commit('changeProperty', props.option, props.newValue)
        }

        return { initialValue, select, selected }
    }
}
</script>

<style scoped>
.card-container {
    border-radius: var(--rounded);
    border: 2px solid var(--color-soft-gray);
    padding: var(--space-small);
}
/* .item-wrapper {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.item-wrapper input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}
.dot {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: var(--theme-bg);
    border-radius: 50%;
} */
</style>
