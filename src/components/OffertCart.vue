<script>
export default {
    props: {
        offer: Object,
    }
}
</script>
<template>
    <h5>{{ offer.description }}</h5>
    <p>"Jornada: " {{ offer.duration }}</p>
</template>
<style></style>