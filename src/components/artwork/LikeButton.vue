<template>
  <button 
    class="like-button"
    :class="{ liked: isLiked }"
    @click="handleLike"
  >
    <span class="like-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
    <span class="like-count">{{ likesCount }}</span>
    <span class="like-label">{{ isLiked ? t('likes.liked') : t('likes.like') }}</span>
  </button>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLikesStore } from '../../stores/Likes.js'
import { useLanguageStore } from '../../stores/language.js'
import translations from '../../assets/data/translations.json'

const props = defineProps({
  artworkId: { type: String, required: true }
})

const likesStore = useLikesStore()
const languageStore = useLanguageStore()

const likesCount = computed(() => likesStore.getLikesCount(props.artworkId))
const isLiked = computed(() => likesStore.isLikedByUser(props.artworkId))

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}

const handleLike = () => {
  likesStore.toggleLike(props.artworkId)
}

onMounted(() => {
  likesStore.loadLikes()
})
</script>

<style scoped>
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.like-button:hover {
  border-color: #fca5a5;
  background: #fef2f2;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.like-button.liked {
  background: #fef2f2;
  border-color: #ef4444;
  animation: likeAnimation 0.4s ease;
}

.like-icon {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.like-button:hover .like-icon {
  transform: scale(1.2);
}

.like-button.liked .like-icon {
  animation: heartbeat 0.6s ease;
}

.like-count {
  font-size: 1rem;
  color: #374151;
  min-width: 20px;
  text-align: center;
}

.like-button.liked .like-count {
  color: #ef4444;
}

.like-label {
  font-size: 0.938rem;
  color: #6b7280;
}

.like-button.liked .like-label {
  color: #ef4444;
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.2); }
}

@media (max-width: 768px) {
  .like-button {
    padding: 0.625rem 1.25rem;
  }
  
  .like-label {
    display: none;
  }
}
</style>