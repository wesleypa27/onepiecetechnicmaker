<template>
  <div class="flex flex-col gap-2 mt-2 w-32">
    <button
      v-for="item in items"
      :key="`${keyPrefix}_${item}`"
      @click="emit('update:selected', `${keyPrefix}_${item}`)"
      class="px-4 py-2 rounded text-white transition"
      :class="selected === `${keyPrefix}_${item}`
        ? 'bg-blue-600 font-bold'
        : 'bg-gray-400 hover:bg-gray-500'"
    >
      {{ formatLabel(item) }}
    </button>
  </div>
</template>

<script setup>

// props genéricas pra reutilizar o componente
const props = defineProps({
  items: { type: Array, required: true },
  selected: { type: String, required: true },
  keyPrefix: { type: String, required: true },
  labelPrefix: { type: String, default: '' }
})

// emite o update da seleção
const emit = defineEmits(['update:selected'])

// função para mostrar o texto do botão
const formatLabel = (item) => {
  return props.labelPrefix ? `${props.labelPrefix} ${item}` : item
}
</script>
