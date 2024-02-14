<script>
export default {
    props: {
        student: Object,
    },
}

</script>
<template>
    <tr>
        <td>{{ this.student.name }}</td>
        <td>{{ this.student.surname }}</td>
    </tr>
</template>
<style></style>