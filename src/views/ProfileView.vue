<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import APIService from '../axios/axios.js'

export default {
    data() {
        return {
            usuario: {}
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
                const responseComapny = await apiService.getCompanyEmail(this.user.email)
                this.usuario = responseComapny.data
            } else if (this.user.rol === 'STU') {
                const responseComapny = await apiService.getStudent(this.user.email)
                this.usuario = responseComapny.data
            }
        } catch (error) {
            alert(error);
        }
    },
    methods: {
        edit() {
            if (this.user.rol === 'COMP') {
                this.$router.push('/company-mod/' + Number(this.usuario.id))
            } else if (this.user.rol === 'STU') {
                this.$router.push('/student-mod/' + Number(this.usuario.id))
            }
        },
        async eliminar() {
            const apiService = new APIService(this.user.token)
            try {
                if (this.user.rol === 'COMP') {
                    await apiService.deleteCompany(this.usuario.id)
                } else if (this.user.rol === 'STU') {
                    await apiService.deleteStudent(this.usuario.id)
                }
            } catch (error) {
                alert(error)
            }

        }
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
                    <div v-if="user.rol === 'COMP'" class="col-md-6">
                        <p><strong>CIF:</strong> {{ this.usuario.CIF }} </p>
                        <p><strong>Nombre de la empresa:</strong> {{ this.usuario.company_name }} </p>
                        <p><strong>Dirección:</strong> {{ this.usuario.address }} </p>
                        <p><strong>Código Postal:</strong> {{ this.usuario.CP }} </p>
                        <p><strong>Teléfono:</strong> {{ this.usuario.phone }} </p>
                        <p><strong>Web:</strong> {{ this.usuario.web }} </p>
                    </div>
                    <div v-if="user.rol === 'COMP'" class="col-md-6">
                        <h5>Responsable:</h5>
                        <p><strong>Nombre:</strong> {{ this.usuario.name }} </p>
                        <p><strong>Apellido:</strong> {{ this.usuario.surname }} </p>
                        <p><strong>Email:</strong> {{ this.usuario.email }} </p>
                    </div>
                    <div v-if="user.rol === 'STU'" class="col-md-6">
                        <p><strong>Nombre:</strong> {{ this.usuario.name }} </p>
                        <p><strong>Apellido:</strong> {{ this.usuario.surname }} </p>
                        <p><strong>Email:</strong> {{ this.usuario.email }} </p>
                    </div>
                    <div v-if="user.rol === 'STU'" class="col-md-6">
                        <p><strong>Dirección:</strong> {{ this.usuario.address }} </p>
                        <p><strong>Curriculum Link:</strong> {{ this.usuario.cv_link }} </p>
                    </div>
                    <div v-if="user.rol === 'STU'" class="col-6">
                        <button class="btn btn-info">Editar Perfil</button>
                        <button class="btn btn-danger mt-2">Eliminar Perfil</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-info" @click="edit">Editar Perfil</button>
                        <button class="btn btn-danger mt-2" @click="eliminar">Eliminar Perfil</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>