<script>
import AppMenu from './components/AppMenu.vue'
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from './stores/store';
import { mapActions } from 'pinia';

export default {
  components: {
    AppMenu,
  },
  methods: {
    ...mapActions(useStore, ['loadCycles', 'loadUser'])
  },
  mounted() {
    this.loadCycles()
    this.loadUser()
  }
}
</script>

<template>
  <nav>
    <h1>Bolsa trabajo</h1>
  </nav>
  <app-menu></app-menu>
  <RouterView/>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css');
</style>
 