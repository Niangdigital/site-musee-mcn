<template>
  <button class="audio-controller" @click="$emit('toggle')" :title="title">
    <svg v-if="isEnabled" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-width="2"/>
      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-width="2"/>
      <line x1="23" y1="9" x2="17" y2="15" stroke-width="2" stroke-linecap="round"/>
      <line x1="17" y1="9" x2="23" y2="15" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isEnabled: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle'])

const title = computed(() => 
  props.isEnabled ? 'Désactiver l\'audio' : 'Activer l\'audio'
)
</script>

<style scoped>
.audio-controller {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: 100;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
  color: var(--color-white);
}

.audio-controller:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: var(--color-secondary);
  transform: scale(1.1);
}

.icon {
  width: 28px;
  height: 28px;
}

@media (max-width: 768px) {
  .audio-controller {
    width: 48px;
    height: 48px;
    top: var(--space-4);
    right: var(--space-4);
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
}
</style>