<script>
import { setLocale } from 'yup'
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
        routeStudent() {
            this.$router.push('/student-add')
        },
        routeCompany() {
            this.$router.push('/company-add')
        }
    }
}
</script>

<template>
        <div class="row">
            <div class="col-12">
                <h1>¿Cómo deseas acceder?</h1>
            </div>
            <div class="row botones">
                <button class="col-6 col-md-6 custom-btn btn student" @click="routeStudent()"><span>Estudiante</span></button>
                <button class="col-6 col-md-6 custom-btn btn company" @click="routeCompany()"><span>Empresa</span></button>
            </div>
        </div>
        <div class="row">
            <div class="col-12"></div>
        </div>
</template>

<style scoped>
.container{
    text-align: center;
}

.btn {
    position: relative;
    width: 100%;
    padding: 20px;
    border-radius: 6px;
    border: 0;
    background: #f26964;
    font-size: 1.2em;
    color: #fff;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, .1);
    box-shadow: 0px 3px 0px #c1524e;
}

.btn:active {
    top: 3px;
    box-shadow: none;
}

.student {
    margin-top: 15px;
    background: #7bb0ff;
    color: white;
    box-shadow: 0px 3px 0px #2c416e;
}

.company {
    margin-top: 15px;
    background: #ff8181;
    color: white;
    box-shadow: 0px 3px 0px #2c416e;
}

</style>
