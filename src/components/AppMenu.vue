<script>
import { useStore } from '@/stores/store.js'
import { mapActions } from 'pinia';
export default {
    methods: {
      ...mapActions(useStore, ['cleanUser']),
        logOut() {
            localStorage.clear()
            this.cleanUser()
        },
    },
};
</script>

<template>
  <nav>
    <ul>
      <RouterLink to="/listOffers">Listado de Ofertas</RouterLink><br>
      <RouterLink to="/profile">Perfil</RouterLink>
      <RouterLink to="/" @click="logOut">Cerrar Sesión</RouterLink>
    </ul>
  </nav>
</template>