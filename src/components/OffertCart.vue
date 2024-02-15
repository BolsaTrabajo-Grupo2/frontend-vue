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
        async singUp(){
            const apiService = new APIService(this.user.token)
            try {
                const response = await apiService.singup(Number(this.offer.id));
                if (response.status === 200) {
                    if (response.data.error === "Ya has aplicado a esta oferta") {
                        this.addMsgArray('Danger', 'Ya estás apuntado a la oferta');
                    } else {
                        this.addMsgArray('Success', 'Te has apuntado con éxito a la oferta');
                        this.$router.push('/listOffers');
                    }
                } else {
                    console.error('Código de estado no manejado:', response.status);
                }
            } catch (error) {
                this.addMsgArray('Danger', 'Ya estas apuntado a la oferta')
            }
        }
    }
}
</script>
<template>
    <div class="col-sm-12 col-md-6 cart">
        <h5>{{ offer.description }}</h5>
        <p class="duracion">Duracion:  {{ offer.duration }}</p>
        <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'STU'" class="apuntarse btn" @click="singUp">Apuntarse</button>
        <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'COMP'" class="apuntarse btn" @click="this.$router.push('/users-list/'+ offer.id)">Ver candidatos</button>
        <button class="details btn" @click="showDetails">Detalles</button>
    </div>    
</template>
<style scoped>
.cart {
    text-align: left;
    background-color: rgba(255, 255, 255, 0.5); 
    border-radius: 10px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); 
    padding: 20px;
}
.apuntarse {
    margin-right: 5px;
    background-color: #A8CED6;
}
.details{
    background-color: #E64663;
}
.btn {
    margin-bottom: 10px;
    transition: box-shadow 0.3s ease;
}
.btn:hover{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.duracion{
    font-style: italic;
}

</style>