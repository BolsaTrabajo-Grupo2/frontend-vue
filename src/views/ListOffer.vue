<script>
import APIService from '../axios/axios.js'
const apiService = new APIService()
export default{
    data(){
        return{
            offers: []
        }
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

</template>

<style>

</style>