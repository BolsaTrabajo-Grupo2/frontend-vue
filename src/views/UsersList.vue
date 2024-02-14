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
            this.students = response.data
        } catch (error) {

        }
    },
    components:{
        UserLi
    },
    methods: {
        ...mapActions(useStore, ['addMsgArray']),
    }
}
</script>

<template>
    <h1>Todos los Usuarios</h1>
    <div class="container" v-if="this.students.length > 0">
        <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
        </tr>
        <user-li v-for="student in this.students" :offer="student" :key="student.id"></user-li>
    </div>
    <div class="container" v-else>
        <h3>Aun no se han apuntado candidatos a esta oferta</h3>
    </div>
</template>

<style scoped></style>