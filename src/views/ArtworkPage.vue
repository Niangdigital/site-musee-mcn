<template>
  <div class="artwork-page" v-if="artwork">
    <Header />
    
    <main class="artwork-main container">
      <ArtworkDetail 
        :artwork="artwork"
        :view-mode="viewMode"
        @update:view-mode="viewMode = $event"
      />
    </main>
    
    <Footer />
  </div>
  <div v-else class="loading">
    <p>Chargement...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArtworksStore } from '../stores/artworks.js'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import ArtworkDetail from '../components/artwork/ArtworkDetail.vue'

const route = useRoute()
const artworksStore = useArtworksStore()
const viewMode = ref('2d')

const artwork = computed(() => artworksStore.getArtworkById(route.params.id))

onMounted(() => {
 artworksStore.setCurrentArtwork(route.params.id)
  artworksStore.incrementViews(route.params.id)
})
</script>

<style scoped>
.artwork-main {
  min-height: calc(100vh - 140px);
  padding: var(--space-8) 0;
}

.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
