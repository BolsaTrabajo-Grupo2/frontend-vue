<script>
import OffertCart from '@/components/OffertCart.vue'
import APIService from '../axios/axios.js'

const apiService = new APIService()
export default {
    data() {
        return {
            offers: []
        }
    },
    components: {
        OffertCart,
    },
    async mounted() {
        try {
            const response = await apiService.getOffers();
            this.offers = response.data.data
        } catch (error) {
            alert(error);
        }
    }
}
</script>

<template>
    <div class="container">
        <h1>Listado de ofertas</h1>
        <div class="row">
            <offert-cart v-for="offer in offers" :offer="offer" :key="offer.id" ></offert-cart>
        </div>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
}
</style>