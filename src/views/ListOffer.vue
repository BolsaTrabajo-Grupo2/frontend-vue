<script>
import OffertCart from '@/components/OffertCart.vue'
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState } from 'pinia'

export default {
    data() {
        return {
            offers: [], // Inicializar como una matriz vacía
            currentPage: 1,
            pageSize: 10,
            totalRecords: 0,
            paginationLinks: {
                prev: null,
                next: null
            }
        }
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        }),
        totalPages() {
            return Math.ceil(this.totalRecords / this.pageSize);
        },
        paginatedOffers() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.offers.slice(start, end);
        }
    },
    components: {
        OffertCart,
    },
    async mounted() {
        await this.fetchOffers();
        this.currentPage = 1;
    },
    methods: {
        async fetchOffers() {
            const apiService = new APIService(this.user.token);
            try {
                const response = await apiService.getOffers({
                    page: this.currentPage
                });
                this.offers = response.data.data;
                this.totalRecords = response.data.total_records;
                this.paginationLinks = response.data.links;
            } catch (error) {
                alert(error);
            }
        },
        async nextPage() {
            if (this.paginationLinks.next) {
                this.currentPage++;
                await this.fetchOffers();
            }
        },
        async prevPage() {
            if (this.paginationLinks.prev) {
                this.currentPage--;
                await this.fetchOffers();
            }
        }
    }
}
</script>

<template>
    <div class="container">
        <h1>Listado de ofertas</h1>
        <div class="row">
            <offert-cart v-for="offer in paginatedOffers" :offer="offer" :key="offer.CIF"></offert-cart>
        </div>
        <div>
            <button @click="prevPage" :disabled="!paginationLinks.prev">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="!paginationLinks.next">Siguiente</button>
        </div>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
}
</style>