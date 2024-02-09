<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import * as yup from 'yup'
import { setLocale } from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

setLocale({
    mixed: {
        required: 'El campo ${path} no puede estar vacio'
    },
    string: {
        min: 'Debe tener al menos ${min} caracteres',
        max: 'Deebe tener menos de ${max} caracteres'
    },
})
export default {
    methods: {
        routeStudent(){
            this.$router.push('/login')
        },
        routeCompany() {
            
        }
    }
}
</script>

<template>
        <div class="container">
        <div class="row">
            <div class="col-12"><h1>¿Cómo deseas acceder?</h1></div>
            <div class="row  botones">
                <button class="col-12 col-md-6 custom-btn btn-3" @click="routeStudent()"><span>Estudiante</span></button>
                <button class="col-12 col-md-6 custom-btn btn-3"><span>Empresa</span></button>
            </div>
        </div>
        <div class="row">
            <div class="col-12"></div>
        </div>
    </div>
</template>

<style scoped>

</style>
