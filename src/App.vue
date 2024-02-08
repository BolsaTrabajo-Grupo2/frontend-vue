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
    <h1>Bolsa trabajo</h1>
  </nav>
  <RouterView/>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css");

</style>
