<script>
import { useStore } from '@/stores/store';
import { mapActions, mapState } from 'pinia';
import axios from 'axios'
import APIService from '../axios/axios.js'
import * as yup from 'yup'
import { setLocale } from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

const SERVER = import.meta.env.VITE_URL_API

export default {
    data() {
        return {
            Usuario: {}
        }
    },
    computed: {
        ...mapState(useStore, {
            user: 'user'
        }),
    },
    async mounted() {
        const apiService = new APIService(this.user.token)
        try {
            if (this.user.rol === 'COMP') {
                const responseComapny = await apiService.getCompany(this.offer.CIF)
                this.company = responseComapny.data.data
            }

        } catch (error) {
            alert(error);
        }
    },
    methods: {

    }
}
</script>

<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h2 class="text-center">Perfil de Usuario</h2>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>CIF:</strong> </p>
                        <p><strong>Nombre de la empresa:</strong> </p>
                        <p><strong>Dirección:</strong> </p>
                        <p><strong>Código Postal:</strong> </p>
                        <p><strong>Teléfono:</strong> </p>
                        <p><strong>Web:</strong> </p>
                    </div>
                    <div class="col-md-6">
                        <h5>Responsable:</h5>
                        <p><strong>Nombre:</strong> </p>
                        <p><strong>Apellido:</strong> </p>
                        <p><strong>Email:</strong> </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>