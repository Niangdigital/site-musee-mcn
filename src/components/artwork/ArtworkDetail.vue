<template>
  <div class="artwork-detail">
    <!-- SECTION GAUCHE : Viewer & Sélecteur de mode -->
    <aside class="artwork-viewer-section">
      <!-- Boutons share et audio en haut sur mobile -->
      <div class="mobile-top-actions">
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
          <span v-if="isPlaying" class="audio-wave">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </span>
        </button>
      </div>

      <ViewModeSelector 
        :current-mode="viewMode"
        @update:mode="$emit('update:view-mode', $event)"
      />
      <div class="viewer-wrapper">
        <ArtworkViewer2D v-if="viewMode === '2d'" :artwork="artwork" />
        <ArtworkViewer3D v-else-if="viewMode === '3d'" :artwork="artwork" />
        <ArtworkViewerVR v-else-if="viewMode === 'vr'" :artwork="artwork" />
      </div>
      <div class="artwork-actions-row">
        <p class="views-count">👁️ {{ artworksStore.getViews(artwork.id) }} {{ t('artwork.views') }}</p>
        <LikeButton :artwork-id="artwork.id" />
      </div>
    </aside>

    <!-- SECTION DROITE : Infos & Actions -->
    <section class="artwork-content">
      <header class="artwork-header">
        <div class="header-info">
          <h1 class="artwork-title">{{ title }}</h1>
          <div class="artwork-meta">
            <p><strong>{{ t('artwork.artist') }}:</strong> {{ artist }}</p>
            <p><strong>{{ t('artwork.period') }}:</strong> {{ period }}</p>
          </div>
        </div>
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
            <span v-if="isPlaying" class="audio-wave">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </span>
          </button>
        </div>
      </header>
      <p v-if="isPlaying" class="audio-status">Lecture en cours...</p>
      <VideoPlayer 
        v-if="artwork.video && artwork.video[lang]"
        :artwork-id="artwork.id"
        :title="title"
      />

      <!-- Onglets -->
      <nav class="artwork-tabs" aria-label="Artwork Tabs">
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
      </nav>
      <div class="artwork-text">
        <p v-if="activeTab === 'description'">{{ description }}</p>
        <p v-else-if="activeTab === 'history'">{{ history }}</p>
        <p v-else-if="activeTab === 'cultural'">{{ cultural }}</p>
      </div>
      <CommentsSection :artwork-id="artwork.id" />
    </section>

    <!-- Bouton flottant Scan -->
    <button class="floating-scan-btn" @click="goToScan" :title="t('artwork.gotoScan')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="4" y="4" width="6" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="14" y="4" width="6" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="4" y="14" width="6" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="14" y="14" width="6" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
      <span class="float-label">{{ t('artwork.scanShort') }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const languageStore = useLanguageStore()
const audioStore = useAudioStore()
const artworksStore = useArtworksStore()
const activeTab = ref('description')
const isPlaying = ref(false)
const audioElement = ref(null)
const lastTime = ref(0)

const audioEnabled = ref(true)
const savedAudioState = localStorage.getItem('audioEnabled')
if (savedAudioState !== null) {
  audioEnabled.value = savedAudioState === 'true'
}

const lang = computed(() => languageStore.current)
const title = computed(() => props.artwork.title[lang.value])
const artist = computed(() => props.artwork.artist[lang.value])
const period = computed(() => props.artwork.period[lang.value])
const description = computed(() => props.artwork.description[lang.value])
const history = computed(() => props.artwork.history[lang.value])
const cultural = computed(() => props.artwork.cultural[lang.value])

const audioUrl = computed(() => {
  try {
    return new URL(
      `/src/assets/audio/descriptions/${props.artwork.id}-${lang.value}.mp3`, 
      import.meta.url
    ).href
  } catch (e) {
    console.error('Audio not found:', props.artwork.id)
    return props.artwork.audio?.[lang.value] || ''
  }
})

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) {
    value = value[k]
  }
  return value[lang.value] || value['fr']
}

onMounted(async () => {
  audioElement.value = new Audio(audioUrl.value)
  audioElement.value.currentTime = lastTime.value
  audioElement.value.muted = !audioEnabled.value

  if (audioEnabled.value) {
    try {
      await audioElement.value.play()
      isPlaying.value = true
    } catch (err) {
      isPlaying.value = false
      lastTime.value = 0
    }
  }

  audioElement.value.addEventListener('ended', () => {
    isPlaying.value = false
    lastTime.value = 0
  })
})

const toggleAudio = async () => {
  if (!audioElement.value) return

  audioEnabled.value = !audioEnabled.value
  localStorage.setItem('audioEnabled', audioEnabled.value)
  audioElement.value.muted = !audioEnabled.value

  try {
    if (!audioElement.value.paused) {
      audioElement.value.pause()
      lastTime.value = audioElement.value.currentTime
      isPlaying.value = false
    } else if (audioEnabled.value) {
      await audioElement.value.play()
      isPlaying.value = true
    }
  } catch (err) {}
}

watch(() => props.artwork.id, async () => {
  activeTab.value = 'description'
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    isPlaying.value = false
  }
  audioElement.value = new Audio(audioUrl.value)
  audioElement.value.currentTime = 0
  audioElement.value.muted = !audioEnabled.value
  audioElement.value.addEventListener('ended', () => {
    isPlaying.value = false
    lastTime.value = 0
  })
})

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

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})

const goToScan = () => {
  router.push({ name: 'Scan' })
}
</script>

<style scoped>
.artwork-detail {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2.5rem;
  position: relative;
}

.artwork-viewer-section {
  position: sticky;
  top: calc(4rem + 60px);
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: var(--color-gray-50);
  padding: var(--space-5) var(--space-4);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 18px 0 rgb(44 85 48 / 5%);
  min-width: 0;
}

/* Boutons en haut sur mobile - cachés par défaut */
.mobile-top-actions {
  display: none;
}

.viewer-wrapper {
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Nouvelle ligne pour actions (Like + Views) */
.artwork-actions-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}

.views-count {
  font-size: 0.95rem;
  color: var(--color-gray-600);
  background: #e6f4e6;
  border-radius: 1rem;
  padding: 0.35rem 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  margin: 0;
}

.artwork-actions {
  display: flex;
  justify-content: flex-end;
}

.artwork-content {
  padding: var(--space-5) var(--space-1) var(--space-2) 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.artwork-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
}

.header-info {
  flex: 1 1 0;
  min-width: 0;
}

.artwork-title {
  margin: 0 0 0.7rem 0;
  font-size: 2.2rem;
  color: var(--color-primary-dark);
  line-height: 1.1;
  word-break: break-word;
}

.artwork-meta {
  margin-bottom: 0;
  padding: 0.3rem 0 0 0;
  font-size: 1.04rem;
  color: var(--color-gray-650);
  background: none;
  border-radius: 0;
}

.artwork-meta p {
  margin-bottom: 0.25rem;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
  min-width: 60px;
}

.share-btn {
  width: 48px;
  height: 48px;
  min-width: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c5530;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
}

.share-btn:hover {
  background: white;
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
  padding: 0.5rem 1.1rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 2rem;
  font-size: 0.94rem;
  color: #166534;
  margin: 0 0 1.15rem 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Onglets */
.artwork-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
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
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.artwork-text {
  line-height: 1.8;
  color: var(--color-gray-700);
  font-size: 1.09rem;
  margin-bottom: var(--space-8);
}

.artwork-text p {
  margin-bottom: var(--space-4);
}

/* === BOUTON FLOTTANT SCAN === */
.floating-scan-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem 0.6rem 0.7rem;
  background: #f3f4f6cc;
  border: 1.5px solid #2c5530;
  border-radius: 2rem;
  box-shadow: 0 3px 12px 0 rgb(44 85 48 / 9%);
  color: #2c5530;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, color 0.15s;
  font-size: 1rem;
  opacity: 0.92;
  gap: 0.5rem;
  backdrop-filter: blur(3px);
}
.floating-scan-btn:hover {
  background: #2c5530;
  color: #fff;
  box-shadow: 0 6px 24px 0 rgb(44 85 48 / 18%);
}
.floating-scan-btn svg {
  width: 22px;
  height: 22px;
  stroke-width: 2.1;
  display: block;
}
.float-label {
  font-size: 0.99rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding-right: 0.12em;
  white-space: nowrap;
  opacity: 0.95;
  transition: font-size 0.15s;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .artwork-detail {
    grid-template-columns: 1fr 2.5fr;
  }
}
@media (max-width: 1024px) {
  .artwork-detail {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }
  .artwork-viewer-section {
    position: relative;
    top: 0;
    margin-bottom: 1.5rem;
  }
  .artwork-content {
    padding: var(--space-3) 0 0 0;
  }
}
@media (max-width: 768px) {
  .artwork-detail {
  padding: 0 var(--space-3);
}
  /* Afficher les boutons en haut sur mobile */
  .mobile-top-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  /* Cacher les boutons du header sur mobile */
  .header-actions {
    display: none;
  }

  /* Réduire la taille de l'image */
  .viewer-wrapper {
    max-height: 500px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: var(--border-radius);

  }

  /* Ajuster la section viewer */
  .artwork-viewer-section {
    gap: 1.5rem;
    padding: var(--space-4) var(--space-3);
  }

  /* Like button et vues sur la même ligne */
  .artwork-actions-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
  }

  .views-count {
    flex: 1;
    font-size: 0.9rem;
    padding: 0.3rem 0.8rem;
  }

  /* Boutons plus petits sur mobile */
  .mobile-top-actions .share-btn {
    width: 44px;
    height: 44px;
    min-width: 44px;
  }

  .mobile-top-actions .audio-play-btn {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }

  .mobile-top-actions .audio-play-btn svg {
    width: 22px;
    height: 22px;
  }

  .mobile-top-actions .share-btn svg {
    width: 18px;
    height: 18px;
  }

  .artwork-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .artwork-meta {
    font-size: 0.95rem;
  }

  .artwork-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    margin-bottom: var(--space-4);
  }

  .artwork-tabs {
    overflow-x: auto;
  }

  .tab-btn {
    white-space: nowrap;
    padding: var(--space-2) var(--space-3);
    font-size: 0.95rem;
  }

  .artwork-text {
    font-size: 0.98rem;
  }

  .floating-scan-btn {
    bottom: 1.1rem;
    right: 1.1rem;
    font-size: 0.91rem;
    padding: 0.5rem 0.78rem 0.5rem 0.52rem;
    gap: 0.35rem;
  }

  .float-label {
    font-size: 0.87rem;
    padding-right: 0;
    opacity: 0.93;
  }
}
</style>