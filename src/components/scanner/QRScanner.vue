<template>
  <div class="qr-scanner">
    <div class="scanner-container">
      <video ref="videoEl" class="scanner-video" autoplay playsinline></video>
      <div class="scanner-overlay">
        <div class="scanner-box"></div>
        <div v-if="isScanning" class="scanning-indicator">
          <div class="pulse-rings">
            <span class="pulse-ring"></span>
            <span class="pulse-ring"></span>
            <span class="pulse-ring"></span>
          </div>
          <p class="scanning-text">🔍 {{ t('scanner.scanning') }}</p>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '../../stores/language.js'
import translations from '../../assets/data/translations.json'
import qrScanner from '../../utils/qrScanner.js'

const emit = defineEmits(['scan-success'])
const languageStore = useLanguageStore()

const videoEl = ref(null)
const isScanning = ref(false)
const error = ref('')

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}

const startScanning = async () => {
  error.value = ''
  
  try {
    await qrScanner.startScan(
      videoEl.value,
      (result) => {
        stopScanning()
        emit('scan-success', result)
      },
      (err) => {
        if (err.name !== 'NotFoundException') {
          error.value = t('scanner.error')
        }
      }
    )
    isScanning.value = true
  } catch (err) {
    error.value = t('scanner.error')
    isScanning.value = false
  }
}

const stopScanning = () => {
  qrScanner.stopScan()
  isScanning.value = false
}

onMounted(() => {
  startScanning()
})

onUnmounted(() => {
  stopScanning()
})
</script>

<style scoped>
.qr-scanner {
  max-width: 600px;
  margin: 0 auto;
}

.scanner-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: var(--color-gray-900);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.scanner-box {
  width: 250px;
  height: 250px;
  border: 3px solid var(--color-secondary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: scan 2s ease-in-out infinite;
}

.scanner-controls {
  margin-top: var(--space-6);
  text-align: center;
}

.btn-start, .btn-stop {
  padding: var(--space-4) var(--space-8);
  font-size: 1.125rem;
}

.btn-stop {
  background: var(--color-accent);
}

.scanner-error {
  margin-top: var(--space-4);
  color: var(--color-accent);
  text-align: center;
}

@keyframes scan {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.scanning-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.pulse-rings {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.pulse-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #d4af37;
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

.pulse-ring:nth-child(2) {
  animation-delay: 0.5s;
}

.pulse-ring:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.scanning-text {
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInOut 1.5s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>