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
            searchCP: ''
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
    methods: {
        ...mapActions(useStore, ['addUser', 'addMsgArray']),
        async nextPage() {
            const apiService = new APIService(this.user.token)
            try {
                let page = this.offers.current_page + 1
                const responseNext = await apiService.getOffersPage(page)
                this.offers = responseNext.data
            } catch (error) {

            }
        },
        async prevPage() {
            const apiService = new APIService(this.user.token)
            try {
                let page = this.offers.current_page - 1
                const responseNext = await apiService.getOffersPage(page)
                this.offers = responseNext.data
            } catch (error) {

            }
        },
        async searchByCIF() {

            const apiService = new APIService(this.user.token)
            try {
                if (this.searchCP != '') {
                    const responseCIF = await apiService.getOfferByCP(this.searchCP)
                    this.offers = responseCIF.data
                } else {
                    const response = await apiService.getOffers()
                    this.offers = response.data
                }

            } catch (error) {
                this.addMsgArray('danger', error)
            }
        },
        orderByDurationLargo() {
            this.offers.data = this.offers.data.sort((offer1, offer2) => offer1.duration.localeCompare(offer2.duration))
        },
        orderByDurationCorto() {
            this.offers.data = this.offers.data.sort((offer1, offer2) => offer2.duration.localeCompare(offer1.duration))
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <h1>Listado de ofertas</h1>
            <form @submit.prevent="searchByCIF" class="cif">
                <input type="text" v-model="searchCP" placeholder="Buscar por CP...">
                <button type="submit" class="buscar">Buscar</button>
            </form>
            <div class="order-buttons row justify-content-md-center">
                <div class="col-md-6">
                    <button @click="orderByDurationLargo" class="largo btn btn-block mb-2">Ordenar por contrato más
                        largo</button>
                </div>
                <div class="col-md-6">
                    <button @click="orderByDurationCorto" class="corto btn btn-block">Ordenar por contrato más
                        corto</button>
                </div>
            </div>
            <div class="row" v-if="this.offers.data.length > 0">
                <offert-cart v-for="offer in this.offers.data" :offer="offer" :key="offer.CIF"></offert-cart>
                <div class="paginas">
                    <button @click="prevPage" :disabled="this.offers.links.prev[0] == null">Anterior</button>
                    <span>Página {{ this.offers.current_page }} de {{ this.offers.total_pages }}</span>
                    <button @click="nextPage" :disabled="this.offers.links.next[0] == null">Siguiente</button>
                </div>
            </div>
            <div v-else class="row">
                <h3>No tienen ofertas para ver</h3>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
    max-width: 70%;
}

.cif {
    margin-top: 10px;
    margin-bottom: 10px;
}

.cif input[type="text"] {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.cif .buscar {
    padding: 8px 20px;
    background-color: #f984ea;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cif .buscar:hover {
    background-color: #cc10b3;
}

.order-buttons .btn {
    transition: transform 0.3s ease;
    padding: 8px 20px;
    background-color: #f97c52;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 5px;
    margin-bottom: 10px;
}

.order-buttons .btn:hover {
    transform: scale(1.05);
}

.paginas {
    margin-top: 10px;
}

.paginas button {
    padding: 8px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 5px;
}

.paginas button:hover {
    background-color: #0056b3;
}

.paginas button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>