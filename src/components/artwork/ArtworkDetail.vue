<template>
  <div class="artwork-detail">
    <div class="artwork-viewer-section">
      <ViewModeSelector 
        :current-mode="viewMode"
        @update:mode="$emit('update:view-mode', $event)"
      />
      
      <ArtworkViewer2D 
        v-if="viewMode === '2d'"
        :artwork="artwork"
      />
      
      <ArtworkViewer3D
        v-else-if="viewMode === '3d'"
        :artwork="artwork"
      />
      
      <ArtworkViewerVR
        v-else-if="viewMode === 'vr'"
        :artwork="artwork"
      />
    </div>

    <div class="artwork-content">
      <div class="artwork-actions">
        <LikeButton :artwork-id="artwork.id" />
      </div>
      
      <div class="artwork-header">
        <h1 class="artwork-title">{{ title }}</h1>
        <div class="header-actions">
          <button class="share-btn" @click="shareArtwork" :title="t('artwork.share')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke-width="2"/>
            </svg>
          </button>
          
          <button class="audio-play-btn" @click="toggleAudio" :class="{ playing: isPlaying }">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
            
            <!-- Nouvel indicateur -->
            <span v-if="isPlaying" class="audio-wave">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </span>
          </button>

          <p v-if="isPlaying" class="audio-status">🔊 Lecture en cours...</p>
        </div>
      </div>

      <p class="views-count">👁️ {{ artworksStore.getViews(artwork.id) }} {{ t('artwork.views') }}</p>
      
      <div class="artwork-meta">
        <p><strong>{{ t('artwork.artist') }}:</strong> {{ artist }}</p>
        <p><strong>{{ t('artwork.period') }}:</strong> {{ period }}</p>
      </div>
      
      <VideoPlayer 
        v-if="artwork.video && artwork.video[lang]"
        :video-url="artwork.video[lang]"
        :title="title"
      />
      
      <div class="artwork-tabs">
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'description' }"
          @click="activeTab = 'description'"
        >
          {{ t('artwork.description') }}
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          {{ t('artwork.history') }}
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'cultural' }"
          @click="activeTab = 'cultural'"
        >
          {{ t('artwork.cultural') }}
        </button>
      </div>
      
      <div class="artwork-text">
        <p v-if="activeTab === 'description'">{{ description }}</p>
        <p v-else-if="activeTab === 'history'">{{ history }}</p>
        <p v-else-if="activeTab === 'cultural'">{{ cultural }}</p>
      </div>

      <CommentsSection :artwork-id="artwork.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useLanguageStore } from '../../stores/language.js'
import { useAudioStore } from '../../stores/audio.js'
import { useArtworksStore } from '../../stores/artworks.js'
import translations from '../../assets/data/translations.json'
import ViewModeSelector from './ViewModeSelector.vue'
import ArtworkViewer2D from './ArtworkViewer2D.vue'
import ArtworkViewer3D from './ArtworkViewer3D.vue'
import ArtworkViewerVR from './ArtworkviewerVR.vue'
import VideoPlayer from './VideoPlayer.vue' 
import CommentsSection from './CommentsSection.vue'
import LikeButton from './LikeButton.vue'

const props = defineProps({
  artwork: { type: Object, required: true },
  viewMode: { type: String, default: '2d' }
})

defineEmits(['update:view-mode'])

const languageStore = useLanguageStore()
const audioStore = useAudioStore()
const artworksStore = useArtworksStore()
const activeTab = ref('description')
const isPlaying = ref(false)

const lang = computed(() => languageStore.current)
const title = computed(() => props.artwork.title[lang.value])
const artist = computed(() => props.artwork.artist[lang.value])
const period = computed(() => props.artwork.period[lang.value])
const description = computed(() => props.artwork.description[lang.value])
const history = computed(() => props.artwork.history[lang.value])
const cultural = computed(() => props.artwork.cultural[lang.value])

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) {
    value = value[k]
  }
  return value[lang.value] || value['fr']
}

const toggleAudio = async () => {
  if (!audioStore.isEnabled) return
  
  if (isPlaying.value) {
    audioStore.stop()
    isPlaying.value = false
  } else {
    const audioPath = props.artwork.audio[lang.value]
    await audioStore.play(audioPath, `artwork-${props.artwork.id}`)
    isPlaying.value = true
    
    setTimeout(() => {
      isPlaying.value = false
    }, 30000)
  }
}

const shareArtwork = async () => {
  const shareData = {
    title: title.value,
    text: `Découvrez "${title.value}" au MCA Museum`,
    url: window.location.href
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err)
    }
  } else {
    await navigator.clipboard.writeText(window.location.href)
    alert(t('artwork.linkCopied'))
  }
}

watch(() => props.artwork.id, () => {
  activeTab.value = 'description'
  if (isPlaying.value) {
    audioStore.stop()
    isPlaying.value = false
  }
})

onUnmounted(() => {
  if (isPlaying.value) {
    audioStore.stop()
  }
})
</script>

<style scoped>
/* Layout principal */
.artwork-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.artwork-viewer-section {
  position: sticky;
  top: calc(4rem + 60px);
  height: fit-content;
}

.artwork-content {
  padding: var(--space-4) 0;
}

/* Actions */
.artwork-actions {
  margin-bottom: 1.5rem;
}

/* Header */
.artwork-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.artwork-title {
  margin: 0;
  font-size: 2rem;
  color: var(--color-primary-dark);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.share-btn {
  width: 48px;
  height: 48px;
  min-width: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
}

.share-btn:hover {
  background: #2c5530;
  border-color: #2c5530;
  color: white;
  transform: translateY(-2px);
}

.share-btn svg {
  width: 20px;
  height: 20px;
}

.audio-play-btn {
  position: relative;
  overflow: visible;
  width: 56px;
  height: 56px;
  min-width: 56px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.audio-play-btn:hover {
  background: var(--color-primary-dark);
}

.audio-play-btn.playing {
  background: var(--color-accent);
  animation: pulse 1.5s ease-in-out infinite;
}

.audio-play-btn svg {
  width: 24px;
  height: 24px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.audio-wave {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  align-items: flex-end;
}

.wave-bar {
  width: 3px;
  height: 8px;
  background: currentColor;
  border-radius: 2px;
  animation: wave 0.8s ease-in-out infinite;
}

.wave-bar:nth-child(2) {
  animation-delay: 0.2s;
}

.wave-bar:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 12px; }
}

.audio-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 2rem;
  font-size: 0.875rem;
  color: #166534;
  margin-top: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Meta */
.artwork-meta {
  margin-bottom: var(--space-6);
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius);
}

.artwork-meta p {
  margin-bottom: var(--space-2);
  color: var(--color-gray-700);
}

.artwork-meta p:last-child {
  margin-bottom: 0;
}

/* Tabs */
.artwork-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  border-bottom: 2px solid var(--color-gray-200);
}

.tab-btn {
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--color-primary);
  transform: none;
  box-shadow: none;
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Text */
.artwork-text {
  line-height: 1.8;
  color: var(--color-gray-700);
  font-size: 1.063rem;
  margin-bottom: var(--space-8);
}

.artwork-text p {
  margin-bottom: var(--space-4);
}

/* Views */
.views-count {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-top: 0.5rem;
  margin-bottom: var(--space-4);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-gray-50);
  border-radius: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .artwork-detail {
    grid-template-columns: 1fr;
  }
  
  .artwork-viewer-section {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .artwork-title {
    font-size: 1.5rem;
  }
  
  .artwork-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .audio-play-btn {
    width: 48px;
    height: 48px;
    min-width: 48px;
  }
  
  .artwork-tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    white-space: nowrap;
  }
  
  .artwork-text {
    font-size: 1rem;
  }
}
</style>