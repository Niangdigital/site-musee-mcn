<template>
  <div class="scan-view">
    <Header />
    
    <main class="scan-main container">
      <h1>{{ t('scanner.title') }}</h1>
      <p class="scan-instructions">{{ t('scanner.instructions') }}</p>
      
      <!-- Tabs pour choisir mode -->
      <div class="scan-tabs">
        <button 
          class="tab-btn"
          :class="{ active: scanMode === 'qr' }"
          @click="scanMode = 'qr'"
        >
          📷 {{ t('scanner.tabQR') }}
        </button>
        <button 
          class="tab-btn"
          :class="{ active: scanMode === 'code' }"
          @click="scanMode = 'code'"
        >
          🔢 {{ t('scanner.tabCode') }}
        </button>
      </div>
      
      <!-- Scanner QR -->
      <QRScanner 
        v-if="scanMode === 'qr'"
        @scan-success="handleScanSuccess" 
      />
      
      <!-- Saisie code -->
      <CodeInput
        v-else
        @code-submitted="handleCodeSubmit"
      />
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'
import translations from '../assets/data/translations.json'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import QRScanner from '../components/scanner/QRScanner.vue'
import CodeInput from '../components/scanner/CodeInput.vue'

const router = useRouter()
const languageStore = useLanguageStore()
const scanMode = ref('qr')

const handleScanSuccess = (data) => {
  try {
    const parsed = JSON.parse(data)
    if (parsed.artworkId) {
      router.push({ name: 'Artwork', params: { id: parsed.artworkId } })
    }
  } catch (e) {
    console.error('Invalid QR code format:', e)
  }
}

const handleCodeSubmit = (artworkId) => {
  router.push({ name: 'Artwork', params: { id: artworkId } })
}

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}
</script>

<style scoped>
.scan-main {
  min-height: calc(100vh - 140px);
  padding: 2rem 0;
  text-align: center;
}

.scan-instructions {
  margin-bottom: 2rem;
  font-size: 1.125rem;
  color: #6b7280;
}

.scan-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn:hover {
  border-color: #2c5530;
  transform: none;
  box-shadow: none;
}

.tab-btn.active {
  background: #2c5530;
  border-color: #2c5530;
  color: white;
}

@media (max-width: 768px) {
  .scan-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
}
</style>