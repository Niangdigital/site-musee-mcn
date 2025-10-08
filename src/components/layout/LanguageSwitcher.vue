<template>
  <div class="language-switcher">
    <button 
      v-for="lang in languages"
      :key="lang"
      class="lang-btn"
      :class="{ active: lang === current }"
      @click="changeLanguage(lang)"
      :title="getLabel(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../../stores/language'

const languageStore = useLanguageStore()
const languages = computed(() => languageStore.available)
const current = computed(() => languageStore.current)

const changeLanguage = (lang) => {
  console.log('[LanguageSwitcher] Changement vers:', lang)
  languageStore.setLanguage(lang)
  // PAS DE RELOAD - le listener dans ArtworkDetail gère tout
}

const getLabel = (lang) => languageStore.labels[lang]
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: var(--space-1);
  background: var(--color-gray-100);
  padding: var(--space-1);
  border-radius: var(--border-radius);
}

.lang-btn {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  font-weight: 600;
  background: transparent;
  border: none;
  color: var(--color-gray-700);
  border-radius: calc(var(--border-radius) - 2px);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.lang-btn:hover {
  background: var(--color-gray-200);
  transform: none;
  box-shadow: none;
}

.lang-btn.active {
  background: var(--color-primary);
  color: var(--color-white);
}
</style>