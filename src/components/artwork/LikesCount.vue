<template>
  <div class="likes-count-badge">
    <span class="heart-icon">❤️</span>
    <span class="count">{{ count }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLikesStore } from '../../stores/Likes.js'

const props = defineProps({
  artworkId: { type: String, required: true }
})

const likesStore = useLikesStore()
const count = computed(() => likesStore.getLikesCount(props.artworkId))

onMounted(() => {
  likesStore.loadLikes()
})
</script>

<style scoped>
.likes-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.heart-icon {
  font-size: 1rem;
}

.count {
  font-weight: 600;
  color: #ef4444;
}
</style>