<script>
import APIService from '../axios/axios.js'
import { useStore } from '@/stores/store'
import { mapState } from 'pinia'

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
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'STUD'"
                class="apuntarse btn btn-success">Apuntarse</button>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'COMP'" class="apuntarse btn btn-success">Ver
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