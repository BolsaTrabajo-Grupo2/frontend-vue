<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'

export default {
    data() {
        return {
            offer: {},
            company: {}
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
    async mounted() {
        const apiService = new APIService(this.user.token)
        try {
            const response = await apiService.showOffer(Number(this.id));
            this.offer = response.data.data
            const responseComapny = await apiService.getCompany(this.offer.CIF)
            this.company = responseComapny.data.data
            console.log(responseComapny.data.data)
        } catch (error) {
            alert(error);
        }
    },
    methods: {
        ...mapActions(useStore, ['addMsgArray']),
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
    <div class="row">
        <div class="col-6 bg-secondary">
            <h5>{{ offer.description }}</h5>
            <p>Duracion: {{ offer.duration }}</p>
            <p>Persona de contacto: {{ offer.responsibleName }}</p>
            <p>Nombre de la empresa: {{ company.companyName }}</p>
            <p>Direccion: {{ company.direccion }}</p>
            <p>Telefono de contacto: {{ company.telefono }}</p>
            <p>Pagina web: {{ company.web }}</p>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'STU'" class="apuntarse btn btn-success"
                @click="singUp">Apuntarse</button>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'COMP'" class="apuntarse btn btn-success"
            @click="this.$router.push('/users-list/'+ offer.id)">Ver
                candidatos</button>
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