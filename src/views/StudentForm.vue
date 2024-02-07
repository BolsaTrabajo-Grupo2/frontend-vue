<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
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
    data() {
        return {
            student: {},
            tittleForm: 'Registrarse',
            inputs: [],
        }
    },
    props: ['id'],
    computed: {
        ...mapState(useStore, {
            cycles: 'cycles',
        })
    },
    components: {
        Form,
        Field,
        ErrorMessage
    },
    async mounted() {
        if (this.id) {
            this.tittleForm = 'Modificar cuenta'
        }
    },
}
</script>

<template>
    <div class="container">
        <Form class="well form-horizontal" action=" " method="post" id="contact_form">
            <fieldset>
                <legend>{{ tittleForm }}</legend>

                <div class="form-group">
                    <label class="col-md-4 control-label">Nombre</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="first_name" placeholder="nombre" class="form-control" type="text"
                                v-model="student.name">
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">Apellido</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="last_name" placeholder="apellido" class="form-control" type="text"
                                v-model="student.surname">
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">E-Mail</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="email" placeholder="email" class="form-control" type="email"
                                v-model="student.email">
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Contraseña</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="password" placeholder="contraseña" class="form-control" type="password"
                                v-model="student.password">
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Repetir Contraseña</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="repassword" placeholder="repetir password" class="form-control" type="password">
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Ciclos</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field as="select" name="ciclos" v-model="student.cycle" class="form-control">
                                <option value="">Seleccionar ciclo</option>
                                <option v-for="cycle in cycles" :key="cycle.id"> {{ cycle.title }}</option>
                            </Field>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div v-for="(input, index) in inputs" :key="index">
                        <input v-model="input.value" type="text" :placeholder="input.id" />
                        <input v-model="input.date" type="date" />
                        <button @click="removeField(index)">Eliminar</button>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Dirección</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="direccion" placeholder="direccion" class="form-control" type="text"
                                v-model="student.address">
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Link Curriculum</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input name="cv" placeholder="cv" class="form-control" type="text" v-model="student.cv_link">
                        </div>
                    </div>
                </div>

                <!-- Text area -->
                <div class="form-group">
                    <label class="col-md-4 control-label">Términos y Condiciones</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <input class="form-control" name="aceptar" type="checkbox" />
                            <label for="aceptar">Acepto los términos y condiciones</label>
                        </div>
                    </div>
                </div>

                <!-- Button -->
                <div class="form-group">
                    <label class="col-md-4 control-label"></label>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-warning">Registrarse <span
                                class="glyphicon glyphicon-send"></span></button>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</template>

<style scoped></style>
