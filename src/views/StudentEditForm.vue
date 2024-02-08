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
        max: 'Deebe tener menos de ${max} caracteres',
        email: 'El campo ${path} debe ser un correo electrónico válido'
    },

})
export default {
    data() {
        let validationSchema = yup.object({
            nombre: yup.string().required().max(250),
            apellidos: yup.string().required().max(250),
            direccion: yup.string().required(),
            cv: yup.string().url({
                message: 'Por favor, introduce una URL válida para el CV.'
            })
        });
        return {
            validationSchema,
            cycleFields: [{ selectedCycle: '', date: '' }],
            student: {},
        }
    },
    props: ['id'],
    computed: {
        ...mapState(useStore, {
            cycles: 'cycles',
            user: 'user'
        })
    },
    components: {
        Form,
        Field,
        ErrorMessage
    },
    async mounted() {
        await axios.get(SERVER + '/student/' + this.id)
            .then(response => this.student = response.data)
            .catch(response => {
                alert('Error: ' + response.message)
            });
        await axios.get(SERVER + '/studentCicles/' + this.id)
            .then(response => this.student.cycle = response.data)
            .catch(response => {
                alert('Error: ' + response.message)
            });
        this.cycleFields = this.student.cycle
        this.student.password = ''
    },
    methods: {
        async editStudent() {
            alert('entra')
            this.student.cycle = this.cycleFields;
            try {
                axios.put(SERVER + '/user/student/update/' + this.id, this.student)
                    .then()
                    .catch(response => alert('Error: no se ha modificado el registro. ' + response.message))
            } catch (error) {
                alert(error)
            }
        },
        addCycleField(index) {
            if (index === this.cycleFields.length - 1 && this.cycleFields[index].selectedCycle) {
                this.cycleFields.push({ selectedCycle: '', date: '' });
            }
        },
        removeCycleField(index) {
            this.cycleFields.splice(index, 1);
        },
    }
}
</script>

<template>
    <div class="container">
        <p>Si no deaseas cambiar la contraseña no introduzcas nada en el campo contraseña</p>
        <Form :initial-values="student" :validation-schema="validationSchema" @submit="editStudent()">
            <fieldset>
                <legend>Modificar perfil</legend>

                <div class="form-group">
                    <label class="col-md-4 control-label">Nombre</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="nombre" placeholder="nombre" class="form-control" type="text"
                                v-model="student.name" />
                            <ErrorMessage name="nombre" class="error" />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">Apellido</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="apellidos" placeholder="apellido" class="form-control" type="text"
                                v-model="student.surname" />
                            <ErrorMessage name="apellidos" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Contraseña</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="contraseña" placeholder="contraseña" class="form-control" type="password"
                                v-model="student.password" />
                            <ErrorMessage name="contraseña" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Repetir Contraseña</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="repetirContraseña" placeholder="repetir password" class="form-control"
                                type="password" />
                            <ErrorMessage name="repetirContraseña" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group" v-for="(cycleField, index) in cycleFields" :key="index">
                    <label class="col-md-4 control-label">Ciclo</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <select v-model="cycleField.selectedCycle" class="form-control" @change="addCycleField(index)">
                                <option value="">Seleccionar ciclo</option>
                                <option v-for="cycle in cycles" :key="cycle.id" :value="cycle.id">{{ cycle.title }}</option>
                            </select>
                            <input type="date" v-model="cycleField.date" class="form-control" />
                            <button @click="removeCycleField(index)">Eliminar</button>
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Dirección</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="direccion" placeholder="direccion" class="form-control" type="text"
                                v-model="student.address" />
                            <ErrorMessage name="direccion" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Link Curriculum</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="cv" placeholder="cv" class="form-control" type="text" v-model="student.cv_link" />
                        </div>
                        <ErrorMessage name="cv" class="error" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">Observaciones</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field type="textarea" name="observaciones" placeholder="observaciones" class="form-control"
                                v-model="student.observation" />
                            <ErrorMessage name="direccion" class="error" />
                        </div>
                    </div>
                </div>

                

                <!-- Button -->
                <div class="form-group">
                    <label class="col-md-4 control-label"></label>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-warning">Modificar<span
                                class="glyphicon glyphicon-send"></span></button>
                    </div>
                </div>
            </fieldset>
        </Form>
    </div>
</template>
<style></style>