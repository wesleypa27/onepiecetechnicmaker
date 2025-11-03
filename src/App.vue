<template>
  <div class="bg-gray-900">
    <label> Gerador de tecnicas </label>
    <div>
      <button key="technic_fight" @click="selected_type = 'fight'" class="px-4 py-2 rounded text-white transition"
        :class="selected_type === 'fight'
          ? 'bg-blue-600 font-bold'
          : 'bg-gray-400 hover:bg-gray-500'">
        Tecnica de luta
      </button>
      <button key="technic_fruit" @click="selected_type = 'fruit'" class="px-4 py-2 rounded text-white transition"
        :class="selected_type === 'fruit'
          ? 'bg-blue-600 font-bold'
          : 'bg-gray-400 hover:bg-gray-500'">
        Tecnica de akuma no mi
      </button>
    </div>
    <Tabs>
      <Tab name="Grau">
        <div class="flex flex-col gap-2 mt-2 w-32">
          <SelectButtons :items="levels" v-model:selected="selected_level" keyPrefix="id_level" labelPrefix="Grau" />
        </div>
      </Tab>

      <Tab name="Alcance">
        <div class="flex flex-col gap-2 mt-2 w-32">
          <SelectButtons :items="ranges" v-model:selected="selected_range" keyPrefix="id_range" />
        </div>
      </Tab>

      <Tab name="Dano">
        <SelectButtons :items="damages" v-model:selected="selected_damage" keyPrefix="id_damage" />
        <div v-if="selected_damage === 'id_damage_Alvo unico' || selected_damage === 'id_damage_Multiplos Alvos'"
          class="mt-4 p-1 bg-gray-500 rounded">
          <label class="font-bold">Dados de dano</label>
          <div class="flex gap-2 mt-2 w-32 items-center  p-1">
            <button key="sub_dice" @click="dice_quantity = Math.max(0, dice_quantity - 1)"
              class="px-2 py-1 text-white rounded"
              :class="0 === dice_quantity
                ? 'bg-gray-600'
                : 'bg-blue-600'"
              >-</button>
            <label>{{ dice_quantity }}</label>
            <button key="add_dice" @click="dice_quantity = Math.min(dice_max_size, dice_quantity + 1)"
              class="px-2 py-1 text-white rounded"
              :class="dice_max_size === dice_quantity
                ? 'bg-gray-600'
                : 'bg-blue-600'"
              >+</button>
            <div class="flex gap-2 mt-2 w-32 items-center h-16">
              <img :src="diceImage" alt="Dado" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </Tab>
      <Tab name="Efeitos">
        <Effects v-model:total_cost="total_effect_cost" />
      </Tab>
    </Tabs>
<div class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600 p-4 flex justify-between items-center text-white z-50">
  <span class="text-lg font-semibold">Custo Total:</span>
  <span class="text-2xl font-bold text-yellow-400">{{ totalFooterText }}</span>
</div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Tabs from './components/Tabs.vue'
import Tab from './components/Tab.vue'
import SelectButtons from './components/SelectButtons.vue'
import Effects from './components/Effects.vue'

const levels = [1, 2, 3, 4, 5, 6, 7, 'Auxiliar']
const maxPointsByLevel = {
  'id_level_1': 2,
  'id_level_2': 4,
  'id_level_3': 6,
  'id_level_4': 9,
  'id_level_5': 12,
  'id_level_6': 16,
  'id_level_7': 20,
  'id_level_Auxiliar': 10,
}
const totalFooterText = computed(() => {
  const maxPoints = maxPointsByLevel[selected_level.value] || 0

  // Puxa o custo dos efeitos
  let cost = total_effect_cost.value

  // Redução de -1 para estilo de luta
  if (selected_type.value === 'fight') cost -= 1

  // Custo extra pelos dados de dano
  if (selected_damage.value === 'id_damage_Alvo unico' || selected_damage.value === 'id_damage_Multiplos Alvos') {
    cost += dice_quantity.value
  }

  return `${cost}/${maxPoints}`
})


const ranges = ["Linha", "Cone", "Esfera"]
const damages = ["Auxiliar", "Alvo unico", "Multiplos Alvos"]


const totalCost = computed(() => {
  let cost = 0

  // Efeitos vindos do componente Effects
  cost += total_effect_cost.value

  // Custo baseado no nível 
  cost += Number(selected_level.value.replace('id_level_', ''))

  return cost
})



const selected_type = ref('fight')
const selected_level = ref('id_level_1')
const selected_range = ref('id_range_Linha')
const selected_damage = ref('id_damage_Auxiliar')

const dice_quantity = ref(0)
const dice_size = ref('d10')
const dice_max_size = ref(2)

const total_effect_cost = ref(0)


watch(selected_damage, (newVal) => {
  if (newVal === 'id_damage_Alvo unico') {
    dice_size.value = 'd10'
  } else if (newVal === 'id_damage_Multiplos Alvos') {
    dice_size.value = 'd6'
  }
})

const diceImage = computed(() =>
  new URL(`./assets/images/dices/${dice_size.value}.svg`, import.meta.url).href
)



</script>