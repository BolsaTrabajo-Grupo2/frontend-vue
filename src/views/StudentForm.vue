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
    data() {
        const mySchema = yup.object({
            repassword: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir').required('Debes repetir la contraseña'),
            name: yup.string().required().max(250),
            surname: yup.string().required().max(250),
            email: yup.string().required().email(),
            password: yup.string().required().min(8),
            direccion: yup.string().required(),
            cv: yup.string().url({
                message: 'Por favor, introduce una URL válida para el CV.'
            })
        })
        return {
            mySchema,
            cycleFields: [{ selectedCycle: '', date: '' }],
            student: {rol:'STU',
                        cycle: [] },
            tittleForm: 'Registrarse',
        }
    },
    created() {
        this.student.cycle = this.cycleFields;
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
    methods: {
        async addStudent() {
            if (this.id) {
                axios.put(SERVER + '/user/profile/update/' + this.id, this.student)
                    .then()
                    .catch(response => alert('Error: no se ha modificado el registro. ' + response.message))
            } else {
                try {
                    axios.post(SERVER + '/registerStudent', this.student)
                        .then()
                        .catch(response => alert('Error: no se ha añadido el registro. ' + response.message))
                } catch (error) {
                    alert(error)
                }
            }
        },
        addCycleField(index) {
            if (index === this.cycleFields.length - 1 && this.cycleFields[index].selectedCycle) {
                this.cycleFields.push({ selectedCycle: '', date: '' }); // Agregar un nuevo campo si el último campo tiene un ciclo seleccionado
            }
        },
        removeCycleField(index) {
            this.cycleFields.splice(index, 1); // Eliminar el campo seleccionado
        }
    }
}
</script>

<template>
    <div class="container">
        <Form :initial-values="student" :validation-schema="mySchema" @submit="addStudent()">
            <fieldset>
                <legend>{{ tittleForm }}</legend>

                <div class="form-group">
                    <label class="col-md-4 control-label">Nombre</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="name" placeholder="nombre" class="form-control" type="text"
                                v-model="student.name" />
                            <ErrorMessage name="name" class="error" />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">Apellido</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="surname" placeholder="apellido" class="form-control" type="text"
                                v-model="student.surname" />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label">E-Mail</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="email" placeholder="email" class="form-control" type="email"
                                v-model="student.email" />
                            <ErrorMessage name="email" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Contraseña</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="password" placeholder="contraseña" class="form-control" type="password"
                                v-model="student.password" />
                            <ErrorMessage name="password" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group">
                    <label class="col-md-4 control-label">Repetir Contraseña</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field name="repassword" placeholder="repetir password" class="form-control" type="password" />
                            <ErrorMessage name="repassword" class="error" />
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
                                v-model="student.address"/>
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

                <!-- Text area -->
                <div class="form-group">
                    <label class="col-md-4 control-label">Términos y Condiciones</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field class="form-control" name="aceptar" type="checkbox" />
                            <label for="aceptar">Acepto los términos y condiciones</label>
                        </div>
                        <ErrorMessage name="aceptar" class="error" />
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
        </Form>
    </div>
</template>

<style scoped></style>
