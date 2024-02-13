<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState } from 'pinia'

export default {
    data(){
        return{
            offer: []
        }
    },
    props: {
        id: String,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
    async mounted(){
        const apiService = new APIService(this.user.token)
        try {
            const response = await apiService.showOffer(Number(this.id));
            this.offer = response.data
        } catch (error) {
            alert(error);
        }
    },
    methods: {

    }
}
</script>
<template>
    <div class="row">
        <div class="col-6 bg-secondary">
            <h5>{{ offer.description }}</h5>
            <p>"Jornada: " {{ offer.duration }}</p>
            <button v-if="offer.inscriptionMethod == 1" class="apuntarse btn btn-success">Apuntarse</button>
        </div>
    </div>
</template>
<style scoped>
.apuntarse {
    margin-right: 5px;
}

.btn {
    margin-bottom: 10px;
}
</style>