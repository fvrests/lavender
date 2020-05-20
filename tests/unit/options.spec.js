import { shallowMount } from '@vue/test-utils'
import Options from '@/components/options.vue'

describe('options.vue', () => {
    test('is a vue instance', () => {
        const wrapper = shallowMount(Options)

        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})
