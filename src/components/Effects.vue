<template>
    <div class="p-2 bg-gray-700 rounded text-white">
        <label class="font-bold">Adicionar Condição</label>
        <div class="flex gap-2 mt-2">
            <select v-model="selectedCondition" class="bg-gray-600 text-white rounded px-2 py-1">
                <option v-for="(cond, name) in conditionsData" :key="name" :value="name">
                    {{ name }}
                </option>
            </select>
            <button @click="addCondition" class="px-2 py-1 bg-blue-600 rounded text-white">Adicionar</button>
        </div>

        <div class="mt-4">
            <label class="font-bold">Condições Adicionadas</label>
            <ul class="mt-2 space-y-2">
                <li v-for="(cond, index) in activeConditions" :key="index"
                    class="flex items-center justify-between bg-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-600 transition">
                    <!-- Nome da condição -->
                    <span class="flex-1 font-semibold text-white">{{ cond.name }}</span>

                    <!-- Custo destacado -->
                    <span class="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-gray-900 font-bold rounded-full">
                        {{ "Custo: " + cond.cost }}
                    </span>

                    <!-- Botões -->
                    <div class="flex gap-2 ml-4">
                        <button @click="showDescription(index)"
                            class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
                            Descrição
                        </button>
                        <button @click="removeCondition(index)"
                            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition">
                            Remover
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <hr class="my-4 border-t border-gray-500/50" />

        <div class="font-bold mb-2">Efeitos de Controle</div>
        <div class="mt-2">
            <EffectControl v-for="(effect, index) in controlEffects" :key="index" :effect="effect"
                v-model="values[effect.name]" @update:cost="updateEffectCost(effect.name, $event)"
                @show-description="openEffectDescription" />
        </div>

        <hr class="my-4 border-t border-gray-500/50" />

        <div class="font-bold mb-2">Efeitos Ofensivos</div>
        <div class="mt-2">
            <EffectControl v-for="(effect, index) in offensiveEffects" :key="index" :effect="effect"
                v-model="values[effect.name]" @update:cost="updateEffectCost(effect.name, $event)"
                @show-description="openEffectDescription" />
        </div>

        <hr class="my-4 border-t border-gray-500/50" />

        <div class="font-bold mb-2">Efeitos de Suporte</div>
        <div class="mt-2">
            <EffectControl v-for="(effect, index) in supportEffects" :key="index" :effect="effect"
                v-model="values[effect.name]" @update:cost="updateEffectCost(effect.name, $event)"
                @show-description="openEffectDescription" />
        </div>

        <hr class="my-4 border-t border-gray-500/50" />

        <div class="mt-4 font-bold">
            Custo Total: {{ totalCost }}
        </div>

        <div v-if="popupVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-gray-800 p-4 rounded max-w-sm w-full relative">
                <button @click="popupVisible = false"
                    class="absolute top-2 right-2 px-2 py-1 bg-red-600 rounded text-white">X</button>
                <p>{{ popupText }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import EffectControl from './EffectControl.vue'

import conditionsData from '../data/conditions_effects.json'
import controlData from '../data/control_effects.json'
import offensiveData from '../data/offensive_effects.json'
import supportData from '../data/support_effects.json'

/* --- Efeitos --- */
const controlEffects = Object.entries(controlData).map(([name, data]) => ({ name, ...data }))
const offensiveEffects = Object.entries(offensiveData).map(([name, data]) => ({ name, ...data }))
const supportEffects = Object.entries(supportData).map(([name, data]) => ({ name, ...data }))

/* --- Reactive Values --- */
const values = reactive({
    ...Object.fromEntries([
        ...controlEffects.map(e => [e.name, 0]),
        ...offensiveEffects.map(e => [e.name, 0]),
        ...supportEffects.map(e => [e.name, 0]),
    ])
})

/* --- Condições --- */
const selectedCondition = ref(Object.keys(conditionsData)[0])
const activeConditions = ref([])

const popupVisible = ref(false)
const popupText = ref('')

function addCondition() {
    const cond = selectedCondition.value
    if (!activeConditions.value.some(c => c.name === cond)) {
        activeConditions.value.push({ name: cond, ...conditionsData[cond] })
    }
}

function removeCondition(index) {
    activeConditions.value.splice(index, 1)
}

function showDescription(index) {
    popupText.value = activeConditions.value[index].description
    popupVisible.value = true
}

function openEffectDescription(effect) {
    popupText.value = effect.description || 'Sem descrição'
    popupVisible.value = true
}

/* --- Custos --- */
const effectCosts = reactive(
    Object.fromEntries([
        ...controlEffects.map(e => [e.name, 0]),
        ...offensiveEffects.map(e => [e.name, 0]),
        ...supportEffects.map(e => [e.name, 0]),
    ])
)

function updateEffectCost(name, cost) {
    effectCosts[name] = cost
}

const totalCost = computed(() =>
    activeConditions.value.reduce((acc, c) => acc + c.cost, 0) +
    Object.values(effectCosts).reduce((acc, c) => acc + c, 0)
)

/* --- Emissão para o componente pai --- */
const emit = defineEmits(['update:total_cost'])
watch(totalCost, (newVal) => emit('update:total_cost', newVal))
</script>