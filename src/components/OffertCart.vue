<script>
export default {
    props: {
        offer: Object,
    },
    methods:{
        showDetails(){
            this.$router.push('/show-details/offer/' + this.offer.id)
        }
    }
}
</script>
<template>
    <div class="col-6 bg-secondary">
        <h5>{{ offer.description }}</h5>
        <p>"Jornada: " {{ offer.duration }}</p>
        <button v-if="offer.inscriptionMethod == 1" class="apuntarse btn btn-success">Apuntarse</button>
        <button class="details btn btn-info" @click="showDetails">Detalles</button>
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