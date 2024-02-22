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
  <nav class="row">
    <p class="titulo col-sm-12 col-md-2">Bolsa Batoi</p>
    <RouterLink to="/listOffers" class="col-sm-12 col-md-2 links">Listado de Ofertas</RouterLink>
    <RouterLink v-if="this.user.rol === 'COMP'" to="/offer-add" class="col-sm-12 col-md-2 links">Añadir Oferta
    </RouterLink>
    <RouterLink v-if="this.user.rol === 'COMP' || this.user.rol =='STU'" to="/profile" class="col-sm-12 col-md-2 links">Perfil</RouterLink>
    <RouterLink to="/" @click="logOut" class="col-sm-12 col-md-2 links cerrar">Cerrar Sesión</RouterLink>
    <p class="col-sm-12 col-md-2 nombre">Hola, {{ user.name }}</p>
  </nav>
</template>
<style>
.titulo{
  font-size: 20px;
  color: rgb(95, 191, 255);
  font-weight: bold;
}
nav {
  margin-top: 30px;
  margin-bottom: 0px;
}

.links {
  text-decoration: none;
  color: black;
  font-size: 18px;
}

.nombre {
  font-size: 18px;
  color: rgb(12, 93, 175);
}

.cerrar {
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color: black;
  transition: background-color 0.3s;
}
.cerrar:hover{
  background-color: rgb(198, 16, 16);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>