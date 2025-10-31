<template>
  <label> Gerador de tecnicas </label>
  <button></button>
  <button></button>
  <Tabs>
    <Tab name="Nivel">
      <div class="flex flex-col gap-2 mt-2 w-32">
        <button v-for="level in levels" :key="level_key(level)" @click="selected = level_key(level)"
          class="px-4 py-2 rounded text-white transition" :class="selected === level_key(level)
            ? 'bg-blue-600 font-bold'
            : 'bg-gray-400 hover:bg-gray-500'">
          {{ "Nível " + level }}
        </button>
      </div>
    </Tab>

    <Tab name="Tipo">
      <p>text</p>
    </Tab>

    <Tab name="Caracteristicas">
      <p>text</p>
    </Tab>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from './components/Tabs.vue'
import Tab from './components/Tab.vue'

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const selected = ref('level_1')

function level_key(level) {
  return `level_${level}`
}
</script>