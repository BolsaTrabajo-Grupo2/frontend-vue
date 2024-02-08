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
        const createSchema = yup.object({
            repetirContraseña: yup.string().oneOf([yup.ref('contraseña'), null], 'Las contraseñas deben coincidir').required('Debes repetir la contraseña'),
            nombre: yup.string().required().max(250),
            apellidos: yup.string().required().max(250),
            email: yup.string()
                .required()
                .email()
                .test('unique-email', 'Este email ya está registrado', async function (value) {
                    if (!value) return true;
                    try {
                        const response = await axios.get(`${SERVER}/checkEmail/${value}`);
                        return !response.data;
                    } catch (error) {
                        console.error('Error al verificar el email:', error);
                        return true;
                    }
                }),
            contraseña: yup.string().required().min(8),
            direccion: yup.string().required(),
            cv: yup.string().matches(
                /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                'Por favor, introduce una URL válida para el CV.'
            ),
            aceptar: yup.boolean().required('Debes aceptar los términos y condiciones para continuar.')
        })
        const editSchema = yup.object({
            name: yup.string().required().max(250),
            surname: yup.string().required().max(250),
            email: yup.string().required().email(),
            direccion: yup.string().required(),
            cv: yup.string().url({
                message: 'Por favor, introduce una URL válida para el CV.'
            })
        })
        return {
            editSchema,
            createSchema,
            cycleFields: [{ selectedCycle: '', date: '' }],
            student: {
                rol: 'STU',
                cycle: []
            },
            tittleForm: 'Registrarse',
            buttonForm: 'Registrarse',
            validateForm: null,
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
        this.validateForm = this.id ? this.editSchema : this.createSchema;
        if (this.id) {
            this.tittleForm = 'Modificar cuenta'
            this.buttonForm = 'Modificar'
                await axios.get(SERVER + '/student/' + this.id)
                    .then(response => this.student = response.data)
                    .catch(response => {
                        alert('Error: ' + response.message)
                    })
            await axios.get(SERVER + '/studentCicles/' + this.id)
                .then(response => this.student.cycle = response.data)
                .catch(response => {
                    alert('Error: ' + response.message)
                })
            this.student.password = ''
            this.cycleFields = this.student.cycle
        }
    },
    methods: {
        async addStudent() {
            this.student.cycle = this.cycleFields
            if (this.id) {
                alert('entra')
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
        <Form :initial-values="student" :validation-schema="this.validateForm" @submit="addStudent()">
            <fieldset>
                <legend>{{ tittleForm }}</legend>

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

                <!-- Text area -->
                <div class="form-group" :hidden="this.id">
                    <label class="col-md-4 control-label">Términos y Condiciones</label>
                    <div class="col-md-4 inputGroupContainer">
                        <div class="input-group">
                            <Field class="form-check-input" name="aceptar" type="checkbox" :value="false" />
                            <label class="form-check-label" for="aceptar">Acepto los términos y condiciones</label>
                        </div>
                        <ErrorMessage name="aceptar" class="error" />
                    </div>
                </div>

                <!-- Button -->
                <div class="form-group">
                    <label class="col-md-4 control-label"></label>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-warning">{{ buttonForm }} <span
                                class="glyphicon glyphicon-send"></span></button>
                    </div>
                </div>
            </fieldset>
        </Form>
    </div>
</template>

<style scoped></style>
