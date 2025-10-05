<template>
  <div class="artwork-viewer-2d">
    <div class="image-container">
      <img 
        :src="artwork.image" 
        :alt="title"
        class="artwork-image"
        @load="onImageLoad"
      />
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </div>
    <div class="image-frame"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '../../stores/language'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const languageStore = useLanguageStore()
const loading = ref(true)

const title = computed(() => props.artwork.title[languageStore.current])

const onImageLoad = () => {
  loading.value = false
}
</script>

<style scoped>
.artwork-viewer-2d {
  position: relative;
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.artwork-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: var(--border-radius);
}

.image-frame {
  position: absolute;
  inset: var(--space-4);
  border: 4px solid var(--color-secondary);
  border-radius: var(--border-radius-lg);
  pointer-events: none;
  opacity: 0.3;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
