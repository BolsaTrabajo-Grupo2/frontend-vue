<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API


export default {
    data() {
        return {
            users: []
        }
    },
    async mounted() {
        await axios.get(SERVER + '/users')
            .then(response => this.users = response.data)
            .catch(response => {
                alert('Error: ' + response.message)
            });
    },
    methods: {
        
    }
}
</script>

<template>
    <h1>Todos los Usuarios</h1>

</template>

<style scoped>

</style>