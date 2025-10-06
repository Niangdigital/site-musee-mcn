<template>
  <div class="video-player-container">
    <div class="video-header">
      <h3> {{ t('video.title') }}</h3>
      <button @click="isExpanded = !isExpanded" class="toggle-btn">
        {{ isExpanded ? '▼ ' + t('video.hide') : '▶ ' + t('video.show') }}
      </button>
    </div>
    
    <div v-if="isExpanded" class="video-wrapper">
      <video 
        ref="videoEl"
        :src="computedVideoUrl"
        controls
        class="video-element"
        @play="handlePlay"
        @pause="handlePause"
        @error="handleError"
      >
        Votre navigateur ne supporte pas les vidéos HTML5.
      </video>
      
      <div v-if="isPlaying" class="video-indicator">
        <span class="pulse-dot"></span>
        {{ t('video.playing') }}
      </div>
      
      <div v-if="error" class="error-msg">
        Erreur de chargement vidéo
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import translations from '../../assets/data/translations.json'

const props = defineProps({
  artworkId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const languageStore = useLanguageStore()
const videoEl = ref(null)
const isExpanded = ref(false)
const isPlaying = ref(false)

const computedVideoUrl = computed(() => {
  const lang = languageStore.current
  return new URL(`../../assets/public/videos/${props.artworkId}-${lang}.mp4`, import.meta.url).href
})

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}

const handlePlay = () => { isPlaying.value = true }
const handlePause = () => { isPlaying.value = false }
</script>

<style scoped>
.video-player-container {
  margin: 1.5rem 0;
  background: #f9fafb;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}
.error-msg {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.75rem;
}
.video-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: white;
}

.video-header h3 {
  font-size: 1.125rem;
  color: #2c5530;
  margin: 0;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}

.toggle-btn:hover {
  background: #f3f4f6;
  border-color: #2c5530;
  transform: none;
  box-shadow: none;
}

.video-wrapper {
  position: relative;
  padding: 1.5rem;
}

.video-element {
  width: 100%;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.video-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: #16a34a;
  font-size: 0.875rem;
  font-weight: 600;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

@media (max-width: 768px) {
  .video-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .toggle-btn {
    width: 100%;
  }
}
</style>