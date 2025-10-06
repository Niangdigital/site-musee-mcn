<template>
  <div class="splash-screen" @click="handleClick">
    <div class="splash-bg" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="splash-overlay"></div>
    </div>
    
    <div class="splash-content">
      <div class="logo-container">
        <img v-if="logo" :src="logo" alt="MCA Museum" class="logo" />
        <h1 v-else class="logo-text">MCA</h1>
      </div>
      
      <button class="enter-button" @click.stop="handleClick">
        <span class="enter-text">{{ t.tapToEnter }}</span>
        <svg class="enter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      
      <p class="audio-hint">{{ t.audioHint }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import translations from '../assets/data/translations.json'

const emit = defineEmits(['enter'])

const bgImage = ref('/src/assets/images/museum-bg.jpg')
const logo = ref('/src/assets/images/logo-mca.png')
const currentLang = ref('fr')

const t = computed(() => ({
  tapToEnter: translations.welcome.tapToEnter[currentLang.value],
  audioHint: translations.welcome.audioHint[currentLang.value]
}))

const handleClick = () => {
  emit('enter')
}

onMounted(() => {
  // Cycle langues toutes les 3s
  const langs = ['fr', 'en', 'wo']
  let index = 0
  setInterval(() => {
    index = (index + 1) % langs.length
    currentLang.value = langs[index]
  }, 3000)
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  cursor: pointer;
  overflow: hidden;
}

.splash-bg {
  position: absolute;
  inset: 0;
  
  background-position: center;
  animation: zoomIn 20s ease-in-out infinite alternate;
}

.splash-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(44, 85, 48, 0.85) 0%,
    rgba(30, 58, 35, 0.9) 100%
  );
}

.splash-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-8);
  color: var(--color-white);
  z-index: 1;
}

.logo-container {
  margin-bottom: var(--space-12);
  animation: fadeInUp 1s ease-out;
}

.logo {
  width: 180px;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.logo-text {
  font-size: 5rem;
  font-weight: 700;
  color: var(--color-secondary);
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  margin: 0;
  letter-spacing: 0.1em;
}

.enter-button {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-8);
  font-size: 1.25rem;
  background: var(--color-secondary);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-secondary);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
}

.enter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212, 175, 55, 0.5);
  background: var(--color-white);
}

.enter-icon {
  width: 24px;
  height: 24px;
  transition: transform var(--transition-fast);
}

.enter-button:hover .enter-icon {
  transform: translateX(4px);
}

.audio-hint {
  position: absolute;
  bottom: var(--space-8);
  font-size: 0.875rem;
  opacity: 0.9;
  animation: fadeIn 1s ease-out 1s both;
}

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

@keyframes zoomIn {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .logo {
    width: 120px;
  }
  
  .logo-text {
    font-size: 3rem;
  }
  
  .enter-button {
    font-size: 1rem;
    padding: var(--space-3) var(--space-6);
  }
}
</style>
