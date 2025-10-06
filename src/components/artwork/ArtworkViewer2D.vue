<template>
  <div class="artwork-viewer-2d" :style="{ aspectRatio: imageAspectRatio }">
    <div class="image-container">
      <img 
        ref="imgRef"
        :src="imageUrl" 
        :alt="title"
        class="artwork-image"
        @load="onImageLoad"
        @error="onImageError"
      />
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
      <div v-if="error" class="error-message">
        Image non trouvée
      </div>
    </div>
    <div 
      class="image-frame"
      :style="{ aspectRatio: imageAspectRatio }"
    ></div>
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
const error = ref(false)
const imgRef = ref(null)
const imageAspectRatio = ref('4/3') // Valeur par défaut

const title = computed(() => props.artwork.title[languageStore.current])

const imageUrl = computed(() => {
  try {
    return new URL(`/src/assets/images/artworks/${props.artwork.id}.jpg`, import.meta.url).href
  } catch (e) {
    console.error('Image not found:', props.artwork.id, e)
    return ''
  }
})

const onImageLoad = () => {
  loading.value = false
  error.value = false
  if (imgRef.value) {
    const width = imgRef.value.naturalWidth
    const height = imgRef.value.naturalHeight
    if (width && height) {
      imageAspectRatio.value = `${width}/${height}`
    }
  }
}

const onImageError = () => {
  loading.value = false
  error.value = true
  console.error('Failed to load image:', props.artwork.id)
}
</script>

<style scoped>
.artwork-viewer-2d {
  position: relative;
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  width: 100%;
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

.error-message {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-danger);
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-lg);
  text-align: center;
  padding: var(--space-4);
}
</style>
