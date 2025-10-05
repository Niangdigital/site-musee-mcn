<template>
  <button 
    @click="handleToggle"
    class="audio-control"
    :class="{ 'muted': !isAudioEnabled }"
    :aria-label="audioLabel"
    :title="audioLabel"
  >
    <svg 
      v-if="isAudioEnabled" 
      class="icon"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>

    <svg 
      v-else 
      class="icon"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>

    <span v-if="showLabel" class="label">
      {{ audioLabel }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useAudioPreferences } from '../../composables/useAudioPreferences'
import { useTranslation } from '../../composables/useTranslation'

defineProps({
  showLabel: {
    type: Boolean,
    default: false
  }
})

const { isAudioEnabled, toggleAudio } = useAudioPreferences()
const { t } = useTranslation()

const audioLabel = computed(() => {
  return isAudioEnabled.value ? t.value('audio.mute') : t.value('audio.unmute')
})

const handleToggle = () => {
  toggleAudio()
}
</script>

<style scoped>
.audio-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.audio-control:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.audio-control:active {
  transform: scale(0.95);
}

.audio-control.muted {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.audio-control.muted:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.label {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.audio-control:not(:has(.label)) {
  padding: 10px;
  border-radius: 50%;
}

@media (max-width: 640px) {
  .audio-control {
    padding: 8px 12px;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
  
  .label {
    font-size: 12px;
  }
}
</style>