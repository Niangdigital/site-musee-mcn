<template>
  <button 
    class="like-button"
    :class="{ liked: isLiked }"
    @click="handleLike"
    :aria-pressed="isLiked"
    :title="isLiked ? t('likes.liked') : t('likes.like')"
  >
    <span class="like-icon" aria-hidden="true">{{ isLiked ? '❤️' : '🤍' }}</span>
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
  gap: var(--space-1);
  padding: 0.35rem 1.1rem;
  background: var(--color-white);
  border: 1.5px solid var(--color-gray-200);
  border-radius: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.98rem;
  min-height: 2rem;
  line-height: 1.1;
  transition: 
    background var(--transition-fast), 
    border-color var(--transition-fast), 
    transform var(--transition-fast), 
    box-shadow var(--transition-fast);
  box-shadow: var(--shadow-sm);
  user-select: none;
}

.like-button:hover, .like-button:focus-visible {
  border-color: #fca5a5;
  background: #fef2f2;
  transform: scale(1.035);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
  outline: none;
}

.like-button.liked {
  background: #fef2f2;
  border-color: #ef4444;
  animation: likeAnimation 0.30s ease;
}

.like-icon {
  font-size: 1.11rem;
  transition: transform var(--transition-fast);
  line-height: 1;
  display: flex;
  align-items: center;
}

.like-button:hover .like-icon,
.like-button:focus-visible .like-icon {
  transform: scale(1.16);
}

.like-button.liked .like-icon {
  animation: heartbeat 0.45s ease;
}

.like-count {
  font-size: 0.92rem;
  color: var(--color-gray-700);
  min-width: 18px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.like-button.liked .like-count {
  color: #ef4444;
}

.like-label {
  font-size: 0.91rem;
  color: var(--color-gray-500);
  margin-left: var(--space-1);
  letter-spacing: 0.01em;
  transition: color var(--transition-fast);
}

.like-button.liked .like-label {
  color: #ef4444;
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.22); }
  60% { transform: scale(1.09); }
  80% { transform: scale(1.15); }
}

@media (max-width: 768px) {
  .like-button {
    padding: 0.3rem 0.7rem;
    font-size: 0.93rem;
    min-height: 1.65rem;
  }
  .like-label {
    display: none;
  }
  .like-icon { font-size: 1rem; }
  .like-count { font-size: 0.88rem; min-width: 14px; }
}

@media (max-width: 480px) {
  .like-button {
    padding: 0.19rem 0.54rem;
    min-height: 1.25rem;
    font-size: 0.89rem;
  }
  .like-icon { font-size: 0.95rem; }
  .like-count { font-size: 0.83rem; min-width: 12px; }
}
</style>