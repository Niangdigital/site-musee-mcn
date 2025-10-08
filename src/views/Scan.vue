<template>
  <div class="scan-view">
    <Header />
    
    <main class="scan-main container">
      <h1>{{ t('scanner.title') }}</h1>
      
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

// MODIFICATION ICI
const handleScanSuccess = (data) => {
  try {
    // Essaye de parser comme du JSON (cas QR code JSON)
    const parsed = JSON.parse(data)
    if (parsed.artworkId) {
      router.push({ name: 'Artwork', params: { id: parsed.artworkId } })
      return
    }
  } catch (e) {
    // Si ce n'est pas du JSON, check si c'est une URL
    if (typeof data === 'string' && data.startsWith('http')) {
      // Redirige vers l'URL du QR code
      window.location.href = data
      return
    }
    // Sinon, c'est du texte non reconnu
    console.error('QR code non reconnu :', data)
    // Tu peux afficher un message à l'utilisateur ici
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
  border-color: #a0522d;
  transform: none;
  box-shadow: none;
}

.tab-btn.active {
  background: #a0522d;
  border-color: #a0522d;
  color: white;
}

@media (max-width: 768px) {

  .scan-main {
    padding: 2rem var(--space-3);
  }
  .scan-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
}
</style>