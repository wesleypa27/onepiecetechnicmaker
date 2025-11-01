<template>
  <div class="flex items-center justify-between bg-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-600 transition">
    <span class="flex-1 font-semibold text-white">
      {{ effect.name }}
      <span v-if="effect.requiresConcentration"
        class="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded">Concentração</span>
    </span>

    <span class="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-gray-900 font-bold rounded-full">
      Custo: {{ displayCost }}
    </span>

    <div class="flex gap-2 ml-4">
      <!-- Binary -->
      <template v-if="effect.type === 'binary'">
        <input type="checkbox" v-model="localValue" class="w-5 h-5 accent-blue-500" />
      </template>

      <!-- Scaling -->
      <template v-else-if="effect.type === 'scaling'">
        <button @click="decrease"
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">-</button>
        <span class="min-w-[2ch] text-center">{{ localValue }}</span>
        <button @click="increase"
          class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition">+</button>
      </template>

      <!-- levelBased -->
      <template v-if="effect.type === 'levelBased'">
        <input type="checkbox" v-model="localValue" class="w-5 h-5 accent-blue-500" />
      </template>

      <!-- complex -->
      <template v-if="effect.type === 'complex'">
        <input type="checkbox" v-model="localValue" class="w-5 h-5 accent-blue-500" />
      </template>

      <!-- Botão de descrição -->
      <button v-if="effect.description" @click="showDescription"
        class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
        Descrição
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  effect: { type: Object, required: true },
  modelValue: { type: [Boolean, Number], default: false },
})

const emit = defineEmits(['update:modelValue', 'update:cost', 'show-description'])

// Estado interno local
const localValue = ref(props.modelValue)

// Calcula custo do efeito
const displayCost = computed(() => {
  // Se o efeito tiver custo fixo definido, usa ele
  if (props.effect.cost !== undefined) return props.effect.cost

  // Binary
  if (props.effect.type === 'binary') return localValue.value ? props.effect.baseCost : 0

  // Scaling
  if (props.effect.type === 'scaling') {
    const scaling = props.effect.scalingCost ?? 1
    if (localValue.value === 0) return 0
    return props.effect.baseCost + (localValue.value - 1) * scaling
  }

  //levelBased
  if (props.effect.type === 'levelBased') {
    const scaling = props.effect.scalingCost ?? 1
    if (localValue.value === 0) return 0
    return props.effect.baseCost + (localValue.value - 1) * scaling
  }

  // Default
  return props.effect.baseCost ?? 0
})

// Sincroniza com o pai e emite custo
watch(localValue, (val) => {
  emit('update:modelValue', val)
  emit('update:cost', displayCost.value)
})
watch(() => props.modelValue, (val) => localValue.value = val)

// Manipulação de escalas
function increase() { localValue.value++ }
function decrease() { if (localValue.value > 0) localValue.value-- }

// Emitir evento para abrir descrição no pai
function showDescription() {
  emit('show-description', props.effect)
}
</script>