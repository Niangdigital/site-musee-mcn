<template>
  <div class="gallery-filter">
    <div class="search-box">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8" stroke-width="2"/>
        <path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input
        type="text"
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        placeholder="Rechercher une œuvre..."
        class="search-input"
      />
    </div>
    <select v-model="sortBy" @change="$emit('update:sort', sortBy)" class="sort-select">
  <option value="default">Par défaut</option>
  <option value="mostLiked">Plus aimés</option>
  <option value="recent">Plus récents</option>
</select>

  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: ''
  }
})

defineEmits(['update:search'])
</script>

<style scoped>
.gallery-filter {
  margin-bottom: var(--space-6);
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--color-gray-500);
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) + 32px);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>