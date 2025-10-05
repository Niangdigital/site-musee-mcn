<template>
  <div class="language-selector">
    <button
      v-for="lang in languages"
      :key="lang"
      class="language-button"
      :class="{ active: lang === current }"
      @click="$emit('select', lang)"
    >
      <span class="language-flag">{{ getFlag(lang) }}</span>
      <span class="language-label">{{ getLabel(lang) }}</span>
    </button>
  </div>
</template>

<script setup>
import translations from '../../data/translations.json'

defineProps({
  languages: {
    type: Array,
    required: true
  },
  current: {
    type: String,
    default: 'fr'
  }
})

defineEmits(['select'])

const getLabel = (lang) => {
  const labels = {
    fr: 'Français',
    en: 'English',
    wo: 'Wolof'
  }
  return labels[lang] || lang
}

const getFlag = (lang) => {
  const flags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    wo: '🇸🇳'
  }
  return flags[lang] || '🌐'
}
</script>

<style scoped>
.language-selector {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--space-8);
}

.language-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-lg);
  color: var(--color-white);
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
  min-width: 120px;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.language-button.active {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  color: var(--color-primary-dark);
}

.language-flag {
  font-size: 2rem;
}

.language-label {
  font-size: 1rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .language-button {
    min-width: 100px;
    padding: var(--space-3) var(--space-4);
  }
  
  .language-flag {
    font-size: 1.5rem;
  }
  
  .language-label {
    font-size: 0.875rem;
  }
}
</style>