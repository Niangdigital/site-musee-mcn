<template>
  <div class="comment-item">
    <div class="comment-header">
      <div class="author-info">
        <span class="author-avatar">{{ initials }}</span>
        <span class="author-name">{{ comment.author }}</span>
        <span class="comment-date">{{ formattedDate }}</span>
      </div>
      
      <button @click="$emit('delete', comment.id)" class="delete-btn" title="Supprimer">
        ×
      </button>
    </div>
    
    <p class="comment-text">{{ comment.text }}</p>
    
    <div class="comment-actions">
      <button @click="$emit('like', comment.id)" class="like-btn">
        <span class="like-icon">❤️</span>
        <span class="like-count">{{ comment.likes || 0 }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  comment: { type: Object, required: true }
})

defineEmits(['like', 'delete'])

const initials = computed(() => {
  return props.comment.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const formattedDate = computed(() => {
  const date = new Date(props.comment.date)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
})
</script>

<style scoped>
.comment-item {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.15s;
}

.comment-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #2c5530;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
}

.author-name {
  font-weight: 600;
  color: #374151;
}

.comment-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.delete-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 0.25rem;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
  transform: none;
  box-shadow: none;
}

.comment-text {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;
}

.like-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  transform: none;
  box-shadow: none;
}

.like-icon {
  font-size: 1rem;
}

.like-count {
  font-weight: 600;
  color: #374151;
}

@media (max-width: 768px) {
  .author-info {
    flex-wrap: wrap;
  }
  
  .comment-date {
    width: 100%;
    margin-left: 3.25rem;
  }
}
</style>