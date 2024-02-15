<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import APIService from '../axios/axios.js'

export default {
    props: {
        offer: Object,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
    methods:{
        ...mapActions(useStore, ['addMsgArray']),
        showDetails(){
            this.$router.push('/show-details/offer/' + this.offer.id)
        },
        singUp(){
            const apiService = new APIService(this.user.token)
            try {
                const response = apiService.singup(Number(this.offer.id))
                this.addMsgArray('Success','Te has apuntado con exito a la oferta')
                this.$router.push('/listOffers')
            } catch (error) {
                this.addMsgArray('Danger','Ya estas apuntado a la oferta')
            }
        }
    }
}
</script>
<template>
    <div class="col-6 bg-secondary">
        <h5>{{ offer.description }}</h5>
        <p>"Jornada: " {{ offer.duration }}</p>
        <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'STU'" class="apuntarse btn btn-success" @click="singUp">Apuntarse</button>
        <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'COMP'" class="apuntarse btn btn-success">Ver candidatos</button>
        <button class="details btn btn-info" @click="showDetails">Detalles</button>
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