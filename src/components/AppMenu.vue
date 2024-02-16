<script>
import { useStore } from '@/stores/store.js'
import { mapActions, mapState } from 'pinia';
export default {
  computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
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
      <RouterLink v-if="this.user.rol === 'COMP'" to="/offer-add">Añadir Oferta</RouterLink><br>
      <RouterLink to="/profile">Perfil</RouterLink><br>
      <RouterLink to="/" @click="logOut">Cerrar Sesión</RouterLink>
    </ul>
  </nav>
</template>