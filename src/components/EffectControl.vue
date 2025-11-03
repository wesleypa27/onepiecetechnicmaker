<template>
  <div
    class="flex flex-col bg-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-600 transition mb-2"
  >
    <div class="flex items-center justify-between">
      <span class="flex-1 font-semibold text-white">
        {{ effect.name }}
        <span
          v-if="effect.requiresConcentration"
          class="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded"
        >
          Concentração
        </span>
      </span>

      <span
        class="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-gray-900 font-bold rounded-full"
      >
        Custo: {{ displayCost }}
      </span>

      <div class="flex gap-2 ml-4">
        <!-- Binary -->
        <template v-if="effect.type === 'binary'">
          <input
            type="checkbox"
            v-model="localValue"
            class="w-5 h-5 accent-blue-500"
          />
        </template>

        <!-- Scaling -->
        <template v-else-if="effect.type === 'scaling'">
          <button
            @click="decrease"
            class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
          >
            -
          </button>
          <span class="min-w-[2ch] text-center">{{ localValue }}</span>
          <button
            @click="increase"
            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            +
          </button>
        </template>

        <!-- levelBased -->
        <template v-else-if="effect.type === 'levelBased'">
          <input
            type="checkbox"
            v-model="localValue"
            class="w-5 h-5 accent-blue-500"
          />
        </template>

        <!-- complex -->
        <template v-else-if="effect.type === 'complex'">
          <input
            type="checkbox"
            v-model="complexActive"
            class="w-5 h-5 accent-blue-500"
          />
        </template>

        <!-- Botão de descrição -->
        <button
          v-if="effect.description"
          @click="showDescription"
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
        >
          Descrição
        </button>
      </div>
    </div>

    <!-- Área de escalonamento complex -->
    <div
      v-if="effect.type === 'complex' && complexActive"
      class="mt-3 flex flex-wrap gap-2"
    >
      <div
        v-for="(cost, name) in effect.scalingRules"
        :key="name"
        class="flex items-center gap-2 bg-gray-600 p-2 rounded-md"
      >
        <span class="text-white font-medium">{{ name }}</span>
        <button
          @click="changeScaling(name, -1)"
          class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
        >
          -
        </button>
        <span class="w-6 text-center text-white font-mono">{{
          complexScaling[name] || 0
        }}</span>
        <button
          @click="changeScaling(name, 1)"
          class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          +
        </button>
      </div>
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
const complexActive = ref(false)
const complexScaling = ref({}) // Ex: { CR: 1, HP: 2, ... }

// Calcula custo do efeito
const displayCost = computed(() => {
  if (props.effect.cost !== undefined) return props.effect.cost

  if (props.effect.type === 'binary')
    return localValue.value ? props.effect.baseCost : 0

  if (props.effect.type === 'scaling') {
    const scaling = props.effect.scalingCost ?? 1
    if (localValue.value === 0) return 0
    return props.effect.baseCost + (localValue.value - 1) * scaling
  }

  if (props.effect.type === 'levelBased') {
    const level = 2
    return localValue.value ? eval(props.effect.baseCost) : 0
  }

  if (props.effect.type === 'complex') {
    if (!complexActive.value) return 0
    let total = props.effect.baseCost ?? 0
    for (const [key, value] of Object.entries(complexScaling.value)) {
      total += (props.effect.scalingRules[key] ?? 0) * value
    }
    return total
  }

  return props.effect.baseCost ?? 0
})

// Sincroniza com o pai
watch(
  [localValue, complexActive, complexScaling],
  () => {
    emit('update:modelValue', localValue.value)
    emit('update:cost', displayCost.value)
  },
  { deep: true }
)

// Manipulação de escalas
function increase() {
  localValue.value++
}
function decrease() {
  if (localValue.value > 0) localValue.value--
}

// Manipulação dos botões complex
function changeScaling(key, delta) {
  complexScaling.value[key] = (complexScaling.value[key] || 0) + delta
  if (complexScaling.value[key] < 0) complexScaling.value[key] = 0
}

// Emitir evento para abrir descrição
function showDescription() {
  emit('show-description', props.effect)
}
</script>
