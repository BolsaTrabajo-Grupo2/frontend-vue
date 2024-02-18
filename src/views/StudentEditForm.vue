<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import APIService from '../axios/axios.js'
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
        const validationSchema = yup.object({
            nombre: yup.string().required().max(250),
            apellidos: yup.string().required().max(250),
            direccion: yup.string().required(),
            cv: yup.string().url({
                message: 'Por favor, introduce una URL válida para el CV.'
            }),
            contraseña: yup.string().test('password-check', 'La contraseña no cumple con los requisitos', function (value) {
                if (!value || value === '') return true;
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
            }),
            repetirContraseña: yup.string().test('password-match', 'Las contraseñas no coinciden', function (value, context) {
                const { contraseña } = context.parent;
                if (contraseña === '') return true
                return value === contraseña;
            }),
            cycle: yup.array().min(1, 'Debes seleccionar al menos un ciclo.')
        });
        return {
            validationSchema,
            cycleFields: [{ selectedCycle: '', date: '' }],
            student: {},
            passwordStudent: '',
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
        const apiService = new APIService(this.user.token);
        await axios.get(SERVER + '/student/' + this.id)
            .then(response => this.student = response.data)
            .catch(response => {
                this.addMsgArray('danger', 'Error: ' + response.message)
            });
        try {
            const response = await apiService.getStudentCycle(this.id);
            this.student.cycle = response.data
        } catch (error) {
            this.addMsgArray('danger', 'Error: ' + response.message)
        }
        this.cycleFields = this.student.cycle
        this.passwordStudent = this.student.password
        this.student.password = ''
    },
    methods: {
        ...mapActions(useStore, ['addMsgArray']),

        async editStudent() {
            if (this.validateCycleField()) {
                const apiService = new APIService(this.user.token)
                this.student.cycle = this.cycleFields;
                this.student.password = this.student.password == '' ? this.passwordStudent : this.student.password;
                apiService.modStudent(this.student)
                    .then(this.$router.push('/profile'))
                    .catch(response => {
                        this.addMsgArray('danger', 'Error: ' + response.message)
                    });
            }
        },
        validateCycleField() {
            this.cycleError = ""
            if (this.cycleFields.length < 2) {
                this.cycleError = "Selecciona al menos un ciclo"
                return false;
            }

            const selectedCycles = new Set();

            for (const field of this.cycleFields) {
                if (selectedCycles.has(field.selectedCycle)) {
                    this.cycleError = "No puedes seleccionar el mismo ciclo dos veces"
                    return false;
                }
                selectedCycles.add(field.selectedCycle);
            }

            return true;
        },
        addCycleField() {
            this.cycleError = "";
            const lastCycle = this.cycleFields[this.cycleFields.length - 1];
            if (lastCycle.selectedCycle !== '') {
                this.cycleFields.push({ selectedCycle: '', date: '' });
            } else {
                this.cycleError = "Selecciona un ciclo antes de añadir uno nuevo";
            }
        },
        removeCycleField(index) {
            this.cycleError = ""
            if (this.cycleFields.length > 1) {
                this.cycleFields.splice(index, 1);
            } else {
                this.cycleError = "Debes dejar al menos un ciclo seleccionado"
            }
        },
    }
}
</script>

<template>
    <p>Si no deseas cambiar la contraseña no introduzcas nada en el campo contraseña</p>
    <Form :initial-values="student" :validation-schema="validationSchema" @submit="editStudent()">
        <fieldset>
            <legend>Modificar perfil</legend>

            <div class="form-group">
                <label class="col-md-8 control-label">Nombre</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field name="nombre" placeholder="nombre" class="form-control" type="text" v-model="student.name" />
                        <ErrorMessage name="nombre" class="error" />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="col-md-8 control-label">Apellido</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field name="apellidos" placeholder="apellido" class="form-control" type="text"
                            v-model="student.surname" />
                        <ErrorMessage name="apellidos" class="error" />
                    </div>
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-8 control-label">Contraseña</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field name="contraseña" placeholder="contraseña" class="form-control" type="password"
                            v-model="student.password" />
                        <ErrorMessage name="contraseña" class="error" />
                    </div>
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-8 control-label">Repetir Contraseña</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field name="repetirContraseña" placeholder="repetir password" class="form-control"
                            type="password" />
                        <ErrorMessage name="repetirContraseña" class="error" />
                    </div>
                </div>
            </div>

            <div class="form-group" v-for="(cycleField, index) in cycleFields" :key="index">
                <label class="col-md-8 control-label">Ciclo</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <select name="cycle" v-model="cycleField.selectedCycle" class="form-control">
                            <option value="">Seleccionar ciclo</option>
                            <option v-for="cycle in cycles" :key="cycle.id" :value="cycle.id">{{ cycle.title }}</option>
                        </select>
                        <input type="date" v-model="cycleField.date" class="form-control" />
                        <button type="button" @click="removeCycleField(index)">Eliminar</button>
                    </div>
                </div>
            </div>
            <span class="error">{{ cycleError }}</span><br>
            <button type="button" @click="addCycleField">Añadir ciclo</button>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-8 control-label">Dirección</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field name="direccion" placeholder="direccion" class="form-control" type="text"
                            v-model="student.address" />
                        <ErrorMessage name="direccion" class="error" />
                    </div>
                </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
                <label class="col-md-8 control-label">Link Curriculum</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field name="cv" placeholder="cv" class="form-control" type="text" v-model="student.cv_link" />
                    </div>
                    <ErrorMessage name="cv" class="error" />
                </div>
            </div>

            <div class="form-group" :hidden="this.user.rol != 'RESP'">
                <label class="col-md-8 control-label">Observaciones</label>
                <div class="col-md-8 inputGroupContainer">
                    <div class="input-group">
                        <Field type="textarea" name="observaciones" placeholder="observaciones" class="form-control"
                            v-model="student.observation" />
                        <ErrorMessage name="direccion" class="error" />
                    </div>
                </div>
            </div>



            <!-- Button -->
            <div class="form-group">
                <label class="col-md-8 control-label"></label>
                <div class="col-md-8">
                    <button type="submit" class="btn btn-warning">Modificar<span
                            class="glyphicon glyphicon-send"></span></button>
                </div>
            </div>
        </fieldset>
    </Form>
</template>
<style>
.container {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f8f9fa;
    /* Color de fondo */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    /* Sombra */
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-weight: bold;
}

.input-group {
    display: flex;
    align-items: center;
}

.input-group input,
.input-group select,
.input-group button {
    margin-right: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
}

.input-group button {
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
}

.input-group button:hover {
    background-color: #0056b3;
}

.error {
    color: red;
    font-size: 0.8rem;
}

.btn-warning {
    background-color: #ffc107;
    color: #212529;
    border-color: #ffc107;
}

.btn-warning:hover {
    background-color: #e0a800;
    border-color: #d39e00;
}
</style>