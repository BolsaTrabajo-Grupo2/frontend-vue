<script>
import { useStore } from '@/stores/store';
import { mapActions, mapState } from 'pinia';
import APIService from '../axios/axios.js'
import UserLi from '@/components/UserLi.vue';


export default {
    data() {
        return {
            students: []
        }
    },
    props: ['id'],
    computed: {
        ...mapState(useStore, {
            user: 'user'
        }),
    },
    async mounted() {
        const apiService = new APIService(this.user.token)
        try {
            const response = await apiService.getUsersOffer(this.id)
            console.log(response.data)
            this.students = response.data
        } catch (error) {
            this.addMsgArray('danger','No se ha podido recuperar las usuarios apuntados a la oferta')
        }
    },
    components: {
        UserLi
    },
    methods: {
        ...mapActions(useStore, ['addMsgArray']),
    }
}
</script>

<template>
    <div class="container">
        <h1 class="titulo">Usuarios que han aplicado</h1>
        <table class="table table-striped" v-if="this.students.length > 0">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                <user-li class="user" v-for="student in this.students" :student="student" :key="student.id"></user-li>
            </tbody>
        </table>
        <h3 v-if="this.students.length == 0">Aun no han aplicado alumnos a esta oferta</h3>
    </div>
</template>

<style>
.container {
    align-items: center;
    height: 100%;
}

.titulo {
    font-size: 24px;
    font-weight: bold;
    color: rgb(21, 103, 157);
    margin-bottom: 20px;
    position: relative;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
}
</style>