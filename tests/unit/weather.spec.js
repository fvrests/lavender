import { shallowMount } from '@vue/test-utils'
import Weather from '@/components/weather.vue'

describe('weather.vue', () => {
    test('is a vue instance', () => {
        const wrapper = shallowMount(Weather)

        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})
