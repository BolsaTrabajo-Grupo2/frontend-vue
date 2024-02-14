<script>

import { RouterLink, RouterView } from 'vue-router'
import { useStore } from './stores/store';
import { mapActions, mapState } from 'pinia';
import AppMessage from './components/AppMessage.vue'

export default {
  methods: {
    ...mapActions(useStore, ['loadCycles', 'loadUser'])
  },
  mounted() {
    this.loadCycles()
    this.loadUser()
  },
  computed: {
    ...mapState(useStore, {
      messages: 'messages',
  })
  },
  components: {
    AppMessage
  },
}
</script>

<template>
  <nav>
    <h1>Bolsa Batoi</h1>
    <app-message v-for="(message, index) in messages" :key="message.id" :message="message" :index="index"></app-message>
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
 