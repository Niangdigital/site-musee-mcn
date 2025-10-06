<template>
  <div class="gallery-view">
    <Header />
    
    <main class="gallery-main container">
      <div class="gallery-header">
        <h1>{{ t('navigation.gallery') }}</h1>
        <p>{{ t('navigation.gallery2') }}</p>
        <GalleryFilter 
          :search="searchQuery"
          :sort="sortBy"
          @update:search="searchQuery = $event"
          @update:sort="sortBy = $event"
        />
      </div>
      
      <GalleryGrid 
        v-if="sortedArtworks.length > 0" 
        :artworks="sortedArtworks" 
      /> 
      
      <div v-else class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>{{ t('search.noResults') }}</h3>
        <p>{{ t('search.noResultsFor') }} "{{ searchQuery }}"</p>
        <button @click="searchQuery = ''" class="reset-btn">
          {{ t('search.reset') }}
        </button>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useArtworksStore } from '../stores/artworks'
import { useLanguageStore } from '../stores/language'
import { useLikesStore } from '../stores/Likes.js'
import translations from '../assets/data/translations.json'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import GalleryGrid from '../components/gallery/GalleryGrid.vue'
import GalleryFilter from '../components/gallery/GalleryFilter.vue'

const artworksStore = useArtworksStore()
const languageStore = useLanguageStore()
const likesStore = useLikesStore()

const searchQuery = ref('')
const sortBy = ref('default')

// Charger les likes au montage du composant
onMounted(() => {
  likesStore.loadLikes()
})

const filteredArtworks = computed(() => {
  if (!searchQuery.value) return artworksStore.allArtworks
  return artworksStore.searchArtworks(searchQuery.value, languageStore.current)
})

const sortedArtworks = computed(() => {
  let result = [...filteredArtworks.value]
  
  if (sortBy.value === 'mostLiked') {
    result.sort((a, b) => {
      const aLikes = likesStore.getLikesCount(a.id)
      const bLikes = likesStore.getLikesCount(b.id)
      return bLikes - aLikes
    })
  } else if (sortBy.value === 'recent') {
    // Si vous avez une propriété date dans vos artworks
    result.sort((a, b) => {
      // Adapter selon votre structure de données
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }
  
  return result
})

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}
</script>

<style scoped>
.gallery-main {
  min-height: calc(100vh - 140px);
  padding: var(--space-8) 0;
}

.gallery-header {
  margin-bottom: var(--space-8);
}

.gallery-header h1 {
  margin-bottom: var(--space-6);
}


.gallery-header p {
    font-size: 1.25rem;
    margin-bottom: var(--space-8);
    opacity: 0.95;
    color: var(--color-primary-dark);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: #f9fafb;
  border-radius: 1rem;
  border: 2px dashed #e5e7eb;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  animation: search 2s ease-in-out infinite;
}

@keyframes search {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}

.no-results h3 {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.reset-btn {
  padding: 0.75rem 2rem;
  background: #2c5530;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.reset-btn:hover {
  background: #1e3a23;
  transform: translateY(-2px);
}
</style>