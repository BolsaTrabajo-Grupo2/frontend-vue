<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import APIService from '../axios/axios.js'
import { resolveTransitionHooks } from 'vue';

export default {
    props: {
        offer: Object,
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        })
    },
    methods: {
        ...mapActions(useStore, ['addMsgArray']),
        showDetails() {
            this.$router.push('/show-details/offer/' + this.offer.id)
        },
        async singUp() {
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
    <tr>
        <td>{{ offer.description }}</td>
        <td>{{ offer.duration }}</td>
        <td>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'STU'" class="apuntarse btn btn-success"
                @click="singUp">Apuntarse</button>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'COMP'" class="apuntarse btn btn-success"
                @click="this.$router.push('/users-list')">Ver candidatos</button>
            <button class="details btn btn-info" @click="showDetails">Detalles</button>
        </td>
    </tr>
</template>
<style scoped>
.apuntarse {
    margin-right: 5px;
}

.btn {
    margin-bottom: 10px;
}
</style>