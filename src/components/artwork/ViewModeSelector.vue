<template>
  <div class="view-mode-selector">
    <button
  v-for="mode in modes"
  :key="mode.id"
  class="mode-btn"
  :class="{ active: mode.id === currentMode }"
  @click="$emit('update:mode', mode.id)"
  :title="getTooltip(mode.id)"
  :data-tooltip="getTooltip(mode.id)"
>
  <component :is="mode.icon" />
  <span class="mode-label">{{ mode.label }}</span>
  
  <!-- Tooltip personnalisé -->
  <span class="custom-tooltip">{{ getTooltip(mode.id) }}</span>
</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import translations from '../assets/data/translations.json'

const props = defineProps({
  currentMode: {
    type: String,
    default: '2d'
  }
})
const getTooltip = (mode) => {
  const tooltips = {
    '2d': 'Image haute qualité - Chargement rapide ⚡',
    '3d': 'Vue avec profondeur et cadre - Effet musée 🎨',
    'vr': 'Réalité virtuelle - Casque requis 🥽'
  }
  return tooltips[mode]
}

defineEmits(['update:mode'])

const languageStore = useLanguageStore()

const modes = computed(() => {
  const lang = languageStore.current
  return [
    {
      id: '2d',
      label: translations.artwork.view2d[lang],
      icon: 'Icon2D'
    },
    {
      id: '3d',
      label: translations.artwork.view3d[lang],
      icon: 'Icon3D'
    },
    {
      id: 'vr',
      label: translations.artwork.viewVr[lang],
      icon: 'IconVR'
    }
  ]
})
</script>

<script>
const Icon2D = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
      <path d="M3 9h18M9 21V9" stroke-width="2"/>
    </svg>
  `
}

const Icon3D = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="2" stroke-linejoin="round"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `
}

const IconVR = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="7" width="20" height="10" rx="2" stroke-width="2"/>
      <circle cx="8" cy="12" r="2" stroke-width="2"/>
      <circle cx="16" cy="12" r="2" stroke-width="2"/>
    </svg>
  `
}

export default {
  components: { Icon2D, Icon3D, IconVR }
}
</script>

<style scoped>
.view-mode-selector {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  padding: var(--space-2);
  background: var(--color-gray-100);
  border-radius: var(--border-radius-lg);
}

.mode-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mode-btn {
  position: relative;
}

.custom-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 0.5rem 0.75rem;
  background: #1f2937;
  color: white;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 100;
}

.custom-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1f2937;
}

.mode-btn:hover .custom-tooltip {
  opacity: 1;
}

@media (max-width: 768px) {
  .custom-tooltip {
    display: none;
  }
}

.mode-btn:hover {
  background: var(--color-gray-200);
  transform: none;
  box-shadow: none;
}

.mode-btn.active {
  background: var(--color-white);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.mode-btn svg {
  width: 28px;
  height: 28px;
}

.mode-label {
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .mode-btn svg {
    width: 24px;
    height: 24px;
  }
  
  .mode-label {
    font-size: 0.75rem;
  }
}
</style>