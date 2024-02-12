<script>
import OffertCart from '@/components/OffertCart.vue'
import APIService from '../axios/axios.js'

const apiService = new APIService()
export default{
    data(){
        return{
            offers: []
        }
    },
    components:{
    OffertCart,
},
    async mounted(){
        try {
            this.offers = await apiService.getOffers()
        } catch (error) {
            alert(error)
        }
    }
}
</script>

<template>
    <h1>Listado de ofertas</h1>
    <offert-cart v-for="offer in offers" :item="offer" :key="offer.id"></offert-cart>

</template>

<style>

</style>