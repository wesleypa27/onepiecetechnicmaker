<template>
  <div class ="bg-gray-900">
    <label> Gerador de tecnicas </label>
    <div>
      <button key="technic_fight" @click="selected_type = 'fight'"
        class="px-4 py-2 rounded text-white transition" :class="selected_type === 'fight'
          ? 'bg-blue-600 font-bold'
          : 'bg-gray-400 hover:bg-gray-500'">
        Tecnica de luta
      </button>
      <button key="technic_fruit" @click="selected_type = 'fruit'"
        class="px-4 py-2 rounded text-white transition" :class="selected_type === 'fruit'
          ? 'bg-blue-600 font-bold'
          : 'bg-gray-400 hover:bg-gray-500'">
        Tecnica de akuma no mi
      </button>
    </div>
    <Tabs>
      <Tab name="Nivel">
        <div class="flex flex-col gap-2 mt-2 w-32">
          <button v-for="level in levels" :key="level_key(level)" @click="selected_level = level_key(level)"
            class="px-4 py-2 rounded text-white transition" :class="selected_level === level_key(level)
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from './components/Tabs.vue'
import Tab from './components/Tab.vue'

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const selected_level = ref('level_1')
const selected_type = ref('fight')

function level_key(level) {
  return `level_${level}`
}
</script>