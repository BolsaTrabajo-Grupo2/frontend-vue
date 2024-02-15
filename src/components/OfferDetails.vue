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
        <div class="col-md-6 details" >
            <h5>{{ offer.description }}</h5>
            <p><span>Duracion: </span>{{ offer.duration }}</p>
            <p><span>Persona de contacto: </span>{{ offer.responsibleName }}</p>
            <p><span>Nombre de la empresa: </span>{{ company.companyName }}</p>
            <p><span>Direccion: </span>{{ company.direccion }}</p>
            <p><span>Telefono de contacto: </span>{{ company.telefono }}</p>
            <p><span>Pagina web: </span>{{ company.web }}</p>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'STU'" class="apuntarse btn btn-success"
                @click="singUp">Apuntarse</button>
            <button v-if="offer.inscriptionMethod == 1 && this.user.rol == 'COMP'" class="apuntarse btn btn-success"
                @click="this.$router.push('/users-list/' + offer.id)">Ver
                candidatos</button>
        </div>
    </div>
</template>
<style scoped>
.details {
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.details h5 {
    margin-bottom: 10px;
}

.details p {
    margin-bottom: 5px;
}
.details span{
    font-weight: bold;
}

.apuntarse {
    margin-top: 10px;
    background-color: #448694;
}
.apuntarse:hover{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.btn {
    margin-bottom: 10px;
}
</style>