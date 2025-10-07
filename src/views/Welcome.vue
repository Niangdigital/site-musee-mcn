<template>
  <div class="welcome-container">
    <!-- SPLASH SCREEN -->
    <div v-if="showSplash" class="splash-screen">
      <div class="splash-bg" :style="{ backgroundImage: splashBgStyle }">
        <div class="splash-content">
          <h1 class="logo-text">{{ splashText }}</h1>
          <button class="enter-button" @click="handleEnter">
            <span>{{ enterButtonText }}</span>
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- LANGUAGE SELECTION -->
    <div v-else class="welcome-screen" :style="{ backgroundImage: welcomeBgStyle }">
      <div class="welcome-content">
        <!-- Audio Toggle Button -->
        <button 
          class="audio-toggle" 
          @click="toggleAudio"
          :class="{ 'audio-muted': !audioEnabled }"
          aria-label="Toggle audio"
        >
          <svg v-if="audioEnabled" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>
        <div class="wave-animation" :class="{ 'wave-active': isAudioPlaying }">
          <div v-for="i in 5" :key="i" class="wave-bar"></div>
        </div>
        
        <h1 class="welcome-title">{{ currentText.title }}</h1>
        <p class="welcome-subtitle">{{ currentText.subtitle }}</p>
        
        <div class="language-selector">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            @click="selectLanguage(lang.code)" 
            class="language-button"
            :class="{ 'language-active': currentLang === lang.code }"
          >
            <span class="language-flag">{{ lang.flag }}</span>
            <span class="language-label">{{ lang.label }}</span>
          </button>
        </div>
        
        <p class="audio-hint">🎧 {{ audioHintText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language.js'

const router = useRouter()
const languageStore = useLanguageStore()
const showSplash = ref(true)
const currentLang = ref('fr')
const audioEnabled = ref(true)
const isAudioPlaying = ref(false)
const audioElement = ref(null)
const cycleInterval = ref(null)
const isCycling = ref(false)

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳' }
]

const translations = {
  fr: { title: 'Bienvenue au Musée Virtuel des Civilisations Noires', subtitle: 'Choisissez votre langue pour commencer', splashTitle: 'Musée virtuel des Civilisations Noires', enterButton: 'Toucher pour entrer', audioHint: 'Utilisez des écouteurs pour une meilleure expérience' },
  en: { title: 'Welcome to the virtual Museum of Black Civilizations', subtitle: 'Choose your language to begin', splashTitle: 'Virtual Museum of Black Civilizations', enterButton: 'Touch to enter', audioHint: 'Use headphones for a better experience' },
  wo: { title: 'Dalal ak diam ci Musée Virtuel bu Njaxu Njabootu Yàllaay', subtitle: 'Taan sa làkk ngir tàmbalee', splashTitle: 'Musée Virtuel bu Njaxu Njabootu Yàllaay', enterButton: 'Topp ngir dugg', audioHint: 'Jëfandikoo écouteur ngir am xew bu gën a baax' }
}

const currentText = computed(() => translations[currentLang.value])
const splashText = computed(() => translations[currentLang.value].splashTitle)
const enterButtonText = computed(() => translations[currentLang.value].enterButton)
const audioHintText = computed(() => translations[currentLang.value].audioHint)

// Génération automatique des URLs d'images
const museumBgUrl = computed(() => {
  try {
    return new URL('/src/assets/images/museum-bg.jpg', import.meta.url).href
  } catch (e) {
    console.error('Museum background image not found', e)
    return ''
  }
})

const languageBgUrl = computed(() => {
  try {
    return new URL('/src/assets/images/language-selection-bg.jpg', import.meta.url).href
  } catch (e) {
    console.error('Language selection background image not found', e)
    return ''
  }
})

// Styles de background avec gradient
const splashBgStyle = computed(() => {
  if (museumBgUrl.value) {
    return `linear-gradient(135deg, rgba(44, 85, 48, 0.95) 0%, rgba(30, 58, 35, 0.95) 100%), url('${museumBgUrl.value}')`
  }
  return 'linear-gradient(135deg, #2c5530 0%, #1e3a23 100%)'
})

const welcomeBgStyle = computed(() => {
  if (languageBgUrl.value) {
    return `linear-gradient(135deg, rgba(44, 85, 48, 0.90) 0%, rgba(30, 58, 35, 0.90) 100%), url('${languageBgUrl.value}')`
  }
  return 'linear-gradient(135deg, #2c5530 0%, #1e3a23 100%)'
})

// Génération automatique des URLs audio
const getAudioUrl = (langCode) => {
  try {
    return new URL(`/src/assets/audio/welcome/${langCode}.mp3`, import.meta.url).href
  } catch (e) {
    console.error(`Audio file not found for language: ${langCode}`, e)
    return ''
  }
}

// Joue l'audio
const playAudio = async (langCode) => {
  if (!audioEnabled.value) return
  
  const audioUrl = getAudioUrl(langCode)
  if (!audioUrl) {
    console.warn(`No audio URL available for ${langCode}`)
    return
  }
  
  try {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
      audioElement.value.removeEventListener('play', handlePlay)
      audioElement.value.removeEventListener('ended', handleEnded)
      audioElement.value.removeEventListener('error', handleError)
    }
    
    audioElement.value = new Audio(audioUrl)
    audioElement.value.muted = !audioEnabled.value
    audioElement.value.addEventListener('play', handlePlay)
    audioElement.value.addEventListener('ended', handleEnded)
    audioElement.value.addEventListener('error', handleError)
    
    if (audioEnabled.value) await audioElement.value.play()
  } catch (error) {
    console.warn('Erreur lecture audio:', error)
    isAudioPlaying.value = false
  }
}

const handlePlay = () => { 
  isAudioPlaying.value = true 
}

const handleEnded = () => {
  isAudioPlaying.value = false
  if (isCycling.value && !showSplash.value) cycleToNextLanguage()
}

const handleError = () => {
  console.warn(`Audio non trouvé pour ${currentLang.value}`)
  isAudioPlaying.value = false
  if (isCycling.value && !showSplash.value) setTimeout(cycleToNextLanguage, 1000)
}

// Arrête l'audio
const stopAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    audioElement.value.removeEventListener('play', handlePlay)
    audioElement.value.removeEventListener('ended', handleEnded)
    audioElement.value.removeEventListener('error', handleError)
    isAudioPlaying.value = false
  }
}

// Toggle audio on/off avec sauvegarde localStorage
const toggleAudio = () => {
  audioEnabled.value = !audioEnabled.value
  localStorage.setItem('audioEnabled', audioEnabled.value)
  
  if (audioElement.value) {
    audioElement.value.muted = !audioEnabled.value
    if (audioEnabled.value && !isAudioPlaying.value) {
      audioElement.value.play().catch(() => { isAudioPlaying.value = false })
    } else {
      audioElement.value.pause()
      isAudioPlaying.value = false
    }
  }
}

// Cycle des langues
const cycleToNextLanguage = () => {
  const langs = ['fr','en','wo']
  const currentIndex = langs.indexOf(currentLang.value)
  currentLang.value = langs[(currentIndex + 1) % langs.length]
}

// Watch pour jouer l'audio quand la langue change
watch(currentLang, (newLang) => {
  if (!showSplash.value && audioEnabled.value && isCycling.value) playAudio(newLang)
})

// Gestion du clic "Entrer"
const handleEnter = () => {
  if (cycleInterval.value) { 
    clearInterval(cycleInterval.value)
    cycleInterval.value = null 
  }
  showSplash.value = false
  isCycling.value = true
  setTimeout(() => playAudio(currentLang.value), 300)
}

// Sélection de langue
const selectLanguage = (lang) => {
  isCycling.value = false
  stopAudio()
  languageStore.setLanguage(lang)
  router.push({ name: 'Home' })
}

// Montage
onMounted(() => {
  cycleInterval.value = setInterval(() => {
    if (showSplash.value) cycleToNextLanguage()
  }, 4000)

  // Récupérer état audio depuis localStorage
  const savedState = localStorage.getItem('audioEnabled')
  if (savedState !== null) audioEnabled.value = savedState === 'true'
})

onUnmounted(() => { 
  stopAudio()
  isCycling.value = false
  if(cycleInterval.value) clearInterval(cycleInterval.value) 
})
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
}

/* ========== SPLASH SCREEN ========== */
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.splash-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2c5530 0%, #1e3a23 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-content {
  text-align: center;
  color: white;
  animation: fadeInUp 0.8s ease-out;
}

.logo-text {
  font-size: 5rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 3rem;
  letter-spacing: 0.1em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.enter-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
  background: #d4af37;
  color: #2c5530;
  border: 2px solid #d4af37;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
}

.enter-button:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212, 175, 55, 0.5);
}

.arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.enter-button:hover .arrow {
  transform: translateX(4px);
}

.audio-hint {
  margin-top: 2rem;
  font-size: 0.875rem;
  opacity: 0.9;
  color: beige;
}

/* ========== AUDIO TOGGLE BUTTON ========== */
.audio-toggle {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 10;
  width: 64px;
  height: 64px;
  min-width: 64px;
  min-height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(212, 175, 55, 0.5);
  color: #d4af37;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 0;
}

.audio-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: #d4af37;
  transform: scale(1.05);
}

.audio-toggle.audio-muted {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(212, 175, 55, 0.5);
  border-color: rgba(212, 175, 55, 0.3);
}

.audio-toggle svg {
  transition: transform 0.3s ease;
}

.audio-toggle:active svg {
  transform: scale(0.9);
}

/* ========== WELCOME SCREEN ========== */
.welcome-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c5530 0%, #1e3a23 100%);
  background-size: cover;
  background-position: center;
  padding: 2rem;
  position: relative;
}

.welcome-content {
  max-width: 600px;
  text-align: center;
  color: white;
  animation: fadeIn 0.6s ease-out;
}

.wave-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 80px;
  margin-bottom: 2rem;
}

.wave-bar {
  width: 8px;
  height: 20px;
  background: #d4af37;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.wave-animation.wave-active .wave-bar {
  animation: wave 0.8s ease-in-out infinite;
}

.wave-animation.wave-active .wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-animation.wave-active .wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-animation.wave-active .wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-animation.wave-active .wave-bar:nth-child(5) { animation-delay: 0.4s; }

.welcome-title {
  font-size: 2.5rem;
  color: #d4af37;
  margin-bottom: 1rem;
  font-weight: 700;
  transition: opacity 0.3s ease;
}

.welcome-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  transition: opacity 0.3s ease;
  color: beige;
}

.language-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.language-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  color: white;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #d4af37;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.language-button.language-active {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.language-flag {
  font-size: 2rem;
}

.language-label {
  font-size: 1rem;
  font-weight: 600;
}

/* ========== ANIMATIONS ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes wave {
  0%, 100% {
    height: 20px;
    opacity: 0.5;
  }
  50% {
    height: 60px;
    opacity: 1;
  }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .audio-toggle {
    top: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
  }
  
  .audio-toggle svg {
    width: 24px;
    height: 24px;
  }

  .logo-text {
    font-size: 3rem;
  }
  
  .enter-button {
    font-size: 1rem;
    padding: 1rem 2rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .language-button {
    min-width: 100px;
    padding: 1rem 1.5rem;
  }
  
  .language-flag {
    font-size: 1.5rem;
  }
}
</style>