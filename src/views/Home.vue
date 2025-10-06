<template>
  <div class="home-view">
    <Header />
    
    <main class="home-main">
      <section class="hero-section">
        <div class="container">
          <h1>{{ t('navigation.home1') }}</h1>
          <p class="hero-text">{{ t('welcome.subtitle') }}</p>
          
          <div class="action-buttons">
            <router-link to="/scan" class="btn-primary">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                <path d="M9 9h6v6H9z" stroke-width="2"/>
              </svg>
              {{ t('navigation.scan') }}
            </router-link>
            
            <router-link to="/gallery" class="btn-secondary">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2"/>
              </svg>
              {{ t('navigation.gallery') }}
            </router-link>
          </div>
        </div>
      </section>
      
      <section class="featured-section container">
        <h2> {{ t('artwork.featured') }}</h2>
        <div class="grid grid-3">
          <ArtworkCard
            v-for="artwork in artworks.slice(0, 3)"
            :key="artwork.id"
            :artwork="artwork"
          />
        </div>
      </section>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useArtworksStore } from '../stores/artworks'
import { useLanguageStore } from '../stores/language'
import translations from '../assets/data/translations.json'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import ArtworkCard from '../components/artwork/ArtworkCard.vue'

const artworksStore = useArtworksStore()
const languageStore = useLanguageStore()

const artworks = computed(() => artworksStore.allArtworks)

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) {
    value = value[k]
  }
  return value[languageStore.current] || value['fr']
}
</script>

<style scoped>
.home-main {
  min-height: calc(100vh - 140px);
}

.hero-section {
  padding: var(--space-16) 0;
  text-align: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-white);
}
.hero-section h1 {
  color: var(--color-white); /* texte en blanc */
}

.hero-text {
  font-size: 1.25rem;
  margin-bottom: var(--space-8);
  opacity: 0.95;
  color: var(--color-white);

}

.action-buttons {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn-primary {
  background: var(--color-secondary);
  color: var(--color-primary-dark);
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--color-white);
  color: var(--color-white);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: var(--color-white);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.icon {
  width: 24px;
  height: 24px;
}

.featured-section {
  padding: var(--space-16) 0;
}

.featured-section h2 {
  text-align: center;
  margin-bottom: var(--space-8);
  text-align: left;
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--space-8) 0;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>