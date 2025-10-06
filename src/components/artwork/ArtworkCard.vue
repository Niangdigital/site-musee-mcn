<template>
  <router-link :to="`/artwork/${artwork.id}`" class="artwork-card">
    <div class="artwork-image">
      <img :src="artwork.image" :alt="title"> {{ image }}</img> />

      <span v-if="artwork.isNew" class="new-badge">{{ t('artwork.new') }} ✨</span>
    </div>
    <div class="artwork-info">
      <h3 class="artwork-title">{{ title }}</h3>
      <p class="artwork-artist">{{ artist }}</p>
      <p class="artwork-period">{{ period }}</p>
      <div class="artwork-footer">
        <LikesCount :artwork-id="artwork.id" />
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import translations from '../../assets/data/translations.json'
import LikesCount from './LikesCount.vue'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const languageStore = useLanguageStore()
const lang = computed(() => languageStore.current)

const title = computed(() => props.artwork.title[lang.value])
const artist = computed(() => props.artwork.artist[lang.value])
const period = computed(() => props.artwork.period[lang.value])

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[lang.value] || value['fr']
}
</script>

<style scoped>
.artwork-card {
  display: block;
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  text-decoration: none;
  border: 1px solid var(--color-gray-200);
}

.artwork-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.artwork-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--color-gray-100);
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.new-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #2c5530;
  padding: 0.375rem 0.875rem;
  border-radius: 1.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.artwork-card:hover .artwork-image img {
  transform: scale(1.05);
}

.artwork-info {
  padding: var(--space-4);
}

.artwork-title {
  font-size: 1.125rem;
  color: var(--color-primary-dark);
  margin-bottom: var(--space-2);
}

.artwork-artist {
  color: var(--color-gray-700);
  font-size: 0.938rem;
  margin-bottom: var(--space-1);
}

.artwork-period {
  color: var(--color-gray-500);
  font-size: 0.875rem;
  font-style: italic;
}

.artwork-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}
</style>