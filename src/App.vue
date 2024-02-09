<script>

import { RouterLink, RouterView } from 'vue-router'
import { useStore } from './stores/store';
import { mapActions } from 'pinia';

export default {
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
    <h1>Bolsa Batoi</h1>
  </nav>
  <RouterView/>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css');
nav {
  text-align: center;
  color: rgb(95, 191, 255)
}
</style>
 