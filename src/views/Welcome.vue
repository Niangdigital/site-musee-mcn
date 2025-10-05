<template>
  <div class="welcome-container">
    <!-- SPLASH SCREEN -->
    <div v-if="showSplash" class="splash-screen">
      <div class="splash-bg">
        <div class="splash-content">
          <h1 class="logo-text">MCA</h1>
          
          <button class="enter-button" @click="handleEnter">
            <span>Toucher pour entrer</span>
            <span class="arrow">→</span>
          </button>
          
          <p class="audio-hint">🎧 Utilisez des écouteurs pour une meilleure expérience</p>
        </div>
      </div>
    </div>
    
    <!-- LANGUAGE SELECTION -->
    <div v-else class="welcome-screen">
      <div class="welcome-content">
        <div class="wave-animation">
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
          >
            <span class="language-flag">{{ lang.flag }}</span>
            <span class="language-label">{{ lang.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'

const router = useRouter()
const languageStore = useLanguageStore()
const showSplash = ref(true)
const currentLang = ref('fr')

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳' }
]

const translations = {
  fr: {
    title: 'Bienvenue au MCA',
    subtitle: 'Choisissez votre langue pour commencer'
  },
  en: {
    title: 'Welcome to MCA',
    subtitle: 'Choose your language to begin'
  },
  wo: {
    title: 'Dalal ak diam ci MCA',
    subtitle: 'Taan sa làkk ngir tàmbalee'
  }
}

const currentText = computed(() => translations[currentLang.value])

const handleEnter = () => {
  console.log('Bouton cliqué - Passage au sélecteur de langue')
  showSplash.value = false
}

const selectLanguage = (lang) => {
  console.log('Langue sélectionnée:', lang)
  languageStore.setLanguage(lang)
  router.push({ name: 'Home' })
}

onMounted(() => {
  // Cycle des langues toutes les 3 secondes
  setInterval(() => {
    const langs = ['fr', 'en', 'wo']
    const currentIndex = langs.indexOf(currentLang.value)
    currentLang.value = langs[(currentIndex + 1) % langs.length]
  }, 3000)
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
}

/* ========== WELCOME SCREEN ========== */
.welcome-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c5530 0%, #1e3a23 100%);
  padding: 2rem;
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
  animation: wave 0.8s ease-in-out infinite;
}

.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; }

.welcome-title {
  font-size: 2.5rem;
  color: #d4af37;
  margin-bottom: 1rem;
  font-weight: 700;
}

.welcome-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.95;
}

.language-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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