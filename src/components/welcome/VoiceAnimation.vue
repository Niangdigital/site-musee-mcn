<template>
  <div class="voice-animation">
    <div class="wave-container">
      <div 
        v-for="i in 5" 
        :key="i"
        class="wave-bar"
        :class="{ active: isSpeaking }"
        :style="{ animationDelay: `${i * 0.1}s` }"
      ></div>
    </div>
    
    <div class="language-indicator">
      <span class="flag">{{ getFlag(currentLanguage) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isSpeaking: {
    type: Boolean,
    default: false
  },
  currentLanguage: {
    type: String,
    default: 'fr'
  }
})

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
.voice-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.wave-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 80px;
}

.wave-bar {
  width: 8px;
  height: 20px;
  background: var(--color-secondary);
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.wave-bar.active {
  animation: wave 0.8s ease-in-out infinite;
}

.language-indicator {
  padding: var(--space-2) var(--space-4);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
}

.flag {
  font-size: 1.5rem;
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

@media (max-width: 768px) {
  .wave-container {
    height: 60px;
  }
  
  .wave-bar {
    width: 6px;
  }
  
  @keyframes wave {
    0%, 100% {
      height: 15px;
      opacity: 0.5;
    }
    50% {
      height: 45px;
      opacity: 1;
    }
  }
}
</style>
