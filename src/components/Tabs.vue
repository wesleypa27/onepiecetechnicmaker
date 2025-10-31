<template>
  <div>
    <div class="flex border-b mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="selected = tab.name"
        class="px-4 py-2"
        :class="selected === tab.name ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'"
      >
        {{ tab.name }}
      </button>
    </div>

    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const selected = ref(null)
const tabs = ref([])

function registerTab(tab) {
  tabs.value.push(tab)
  if (!selected.value) selected.value = tab.name
}

provide('registerTab', registerTab)
provide('selectedTab', selected)
</script>
