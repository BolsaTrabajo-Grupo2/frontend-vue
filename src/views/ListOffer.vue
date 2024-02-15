<script>
import OffertCart from '@/components/OffertCart.vue'
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'

export default {
    data() {
        return {
            offers: {
                data: [],
                prev: []
            },
            searchCIF: ''
        }
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        }),
    },
    components: {
        OffertCart,
    },
    async mounted() {
        const apiService = new APIService(this.user.token)
        try {
            const response = await apiService.getOffers()
            this.offers = response.data
        } catch (error) {

        }
    },
    methods:{
        ...mapActions(useStore, ['addUser', 'addMsgArray']),
        async nextPage(){
            const apiService = new APIService(this.user.token)
            try {
                let page = this.offers.current_page + 1
                const responseNext = await apiService.getOffersPage(page)
                this.offers = responseNext.data
            } catch (error) {
                
            }
        },
        async prevPage(){
            const apiService = new APIService(this.user.token)
            try {
                let page = this.offers.current_page - 1
                const responseNext = await apiService.getOffersPage(page)
                this.offers = responseNext.data
            } catch (error) {
                
            }
        },
        async searchByCIF(){
       
            const apiService = new APIService(this.user.token)
            try {
                const responseCIF = await apiService.getOfferByCIF(this.searchCIF)
                console.log(responseCIF)
                this.offers.data = responseCIF.data
                console.log(this.offers.data)
            } catch (error) {
                this.addMsgArray('danger',error)
            }
        }
    }
}
</script>

<template>
    <div class="container">
        <h1>Listado de ofertas</h1>
        <form @submit.prevent="searchByCIF">
            <input type="text" v-model="searchCIF" placeholder="Buscar por CIF...">
            <button type="submit">Buscar</button>
        </form>
        <div class="row" v-if="this.offers.data.length > 0">
            <offert-cart v-for="offer in this.offers.data" :offer="offer" :key="offer.CIF"></offert-cart>
            <div>
                <button @click="prevPage" :disabled="this.offers.links.prev[0] == null">Anterior</button>
                <span>Página {{ this.offers.current_page }} de {{ this.offers.total_pages }}</span>
                <button @click="nextPage" :disabled="this.offers.links.next[0] == null">Siguiente</button>
            </div>
        </div>
        <div v-else>
            <h3>No tienen ofertas para ver</h3>
        </div>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
}
</style>