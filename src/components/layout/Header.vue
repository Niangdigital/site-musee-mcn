<template>
  <header class="header">
    <div class="container header-content">
      <router-link to="/home" class="logo">
        <img v-if="logoSrc" :src="logoSrc" alt="MCA" class="logo-img" />
        <span v-else class="logo-text">MCA</span>
      </router-link>
      
      <nav class="nav">
        <router-link to="/home" class="nav-link">{{ t('navigation.home') }}</router-link>
        <router-link to="/gallery" class="nav-link">{{ t('navigation.gallery') }}</router-link>
        <router-link to="/scan" class="nav-link">{{ t('navigation.scan') }}</router-link>
      </nav>
      
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguageStore } from 'src/stores/language.js'
import translations from '../assets/data/translations.json'
import LanguageSwitcher from './LanguageSwitcher.vue'

const languageStore = useLanguageStore()
const logoSrc = ref('/images/logo-mca.png')

const t = (key) => {
  const keys = key.split('.')
  let value = translations
  for (const k of keys) value = value[k]
  return value[languageStore.current] || value['fr']
}
</script>

<style scoped>
.header {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.05em;
}

.nav {
  display: flex;
  gap: var(--space-6);
}

.nav-link {
  font-weight: 500;
  color: var(--color-gray-700);
  transition: color var(--transition-fast);
  padding: var(--space-2) 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

@media (max-width: 768px) {
  .nav {
    gap: var(--space-3);
    font-size: 0.875rem;
  }
}
</style>