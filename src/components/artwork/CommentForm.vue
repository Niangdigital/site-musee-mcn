<template>
  <form @submit.prevent="submitComment" class="comment-form">
    <div class="form-group">
      <input
        v-model="author"
        type="text"
        :placeholder="t('comments.yourName')"
        class="form-input"
        required
      />
    </div>
    
    <div class="form-group">
      <textarea
        v-model="text"
        :placeholder="t('comments.yourComment')"
        class="form-textarea"
        rows="3"
        required
      ></textarea>
    </div>
    
    <button type="submit" class="submit-btn" :disabled="!canSubmit">
      {{ t('comments.submit') }}
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '../../stores/language.js'
import translations from '../../assets/data/translations.json'

const emit = defineEmits(['submit'])
const languageStore = useLanguageStore()

const author = ref('')
const text = ref('')

const canSubmit = computed(() => {
  return author.value.trim().length > 0 && text.value.trim().length > 0
})

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}

const submitComment = () => {
  if (!canSubmit.value) return
  
  emit('submit', {
    author: author.value.trim(),
    text: text.value.trim()
  })
  
  author.value = ''
  text.value = ''
}
</script>

<style scoped>
.comment-form {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.15s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #a0522d;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #a0522d;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.submit-btn:hover:not(:disabled) {
  background: #a0522d;
}

.submit-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>