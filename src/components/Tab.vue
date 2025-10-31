<template>
  <div v-if="selectedTab === name">
    <slot />
  </div>
</template>

<script setup>
import { inject, onMounted, computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true }
})

const registerTab = inject('registerTab')
const selected = inject('selectedTab')

onMounted(() => {
  registerTab({ name: props.name })
})

const selectedTab = computed(() => selected.value)
</script>