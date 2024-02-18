<script>

import { useStore } from './stores/store';
import { mapActions, mapState } from 'pinia';
import AppMessage from './components/AppMessage.vue'
import AppMenu from './components/AppMenu.vue';

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
      user: 'user'
    }),
    isAuthenticated() {
      return this.user && Object.values(this.user).length !== 0;
    }
  },
  components: {
    AppMessage,
    AppMenu
  },
}
</script>

<template>
  <div class="container">
    <nav>
      <app-menu v-if="isAuthenticated"></app-menu>
      <app-message v-for="(message, index) in messages" :key="message.id" :message="message" :index="index"></app-message>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css');

nav {
  text-align: center;
  color: rgb(95, 191, 255)
}
.container{
  max-width: 90%;
  height: 100%;
}
</style>
 