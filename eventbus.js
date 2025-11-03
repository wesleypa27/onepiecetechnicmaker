// src/eventBus.js
import { reactive, computed } from 'vue'

export const globalTotals = reactive({
  componentes: {} // exemplo: { pagina1: 20, pagina2: 15 }
})

export function setTotal(name, value) {
  globalTotals.componentes[name] = value
}

export function removeTotal(name) {
  delete globalTotals.componentes[name]
}

export const somaGlobal = computed(() =>
  Object.values(globalTotals.componentes).reduce((a, b) => a + b, 0)
)
