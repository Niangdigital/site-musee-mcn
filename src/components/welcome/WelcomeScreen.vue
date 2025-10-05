<template>
  <div class="welcome-screen">
    <AudioController 
      :is-enabled="audioStore.isEnabled"
      @toggle="audioStore.toggle()"
    />
    
    <div class="welcome-content">
      <VoiceAnimation 
        :is-speaking="isSpeaking"
        :current-language="currentLanguage"
      />
      
      <div class="welcome-text">
        <h1 class="welcome-title">{{ currentText.title }}</h1>
        <p class="welcome-subtitle">{{ currentText.subtitle }}</p>
      </div>
      
      <LanguageSelector 
        :languages="languages"
        :current="currentLanguage"
        @select="handleLanguageSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudioStore } from '../../stores/audio'
import translations from '../assets/data/translations.json'
import AudioController from './AudioController.vue'
import VoiceAnimation from './VoiceAnimation.vue'
import LanguageSelector from './LanguageSelector.vue'

const emit = defineEmits(['language-selected'])
const audioStore = useAudioStore()

const languages = ['fr', 'en', 'wo']
const currentLanguage = ref('fr')
const currentIndex = ref(0)
const isSpeaking = ref(false)
const intervalId = ref(null)

const currentText = computed(() => ({
  title: translations.welcome.title[currentLanguage.value],
  subtitle: translations.welcome.subtitle[currentLanguage.value]
}))

const playAudio = async (lang) => {
  if (!audioStore.isEnabled || !audioStore.isUnlocked) return
  
  isSpeaking.value = true
  const audioPath = `/audio/welcome/${lang}.mp3`
  
  try {
    await audioStore.play(audioPath, `welcome-${lang}`)
    
    setTimeout(() => {
      isSpeaking.value = false
    }, 3000)
  } catch (error) {
    console.error('Audio play error:', error)
    isSpeaking.value = false
  }
}

const cycleLanguages = () => {
  currentIndex.value = (currentIndex.value + 1) % languages.length
  currentLanguage.value = languages[currentIndex.value]
  playAudio(currentLanguage.value)
}

const handleLanguageSelect = (lang) => {
  audioStore.stop()
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  emit('language-selected', lang)
}

onMounted(() => {
  playAudio(currentLanguage.value)
  intervalId.value = setInterval(cycleLanguages, 4000)
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  audioStore.stop()
})
</script>

<style scoped>
.welcome-screen {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: var(--space-8);
}

.welcome-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.welcome-text {
  margin: var(--space-8) 0;
  color: var(--color-white);
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
  color: var(--color-secondary);
  animation: fadeIn 0.6s ease-out;
}

.welcome-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  animation: fadeIn 0.6s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
}
</style>
