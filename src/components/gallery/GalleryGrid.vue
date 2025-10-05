<template>
  <div class="gallery-grid">
    <ArtworkCard 
      v-for="artwork in artworks"
      :key="artwork.id"
      :artwork="artwork"
    />
  </div>
</template>

<script setup>
import ArtworkCard from '../artwork/ArtworkCard.vue'

defineProps({
  artworks: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
