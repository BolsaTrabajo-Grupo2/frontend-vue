<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
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
            contraseña: yup.string().test('password-check', 'La contraseña no cumple con los requisitos', function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
            }),
            direccion: yup.string().required(),
            cv: yup.string().matches(
                /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                'Por favor, introduce una URL válida para el CV.'
            ),
            aceptar: yup.boolean().required('Debes aceptar los términos y condiciones para continuar.'),
            cycle: yup.array().min(1, 'Debes seleccionar al menos un ciclo.')
        });
        return {
            validationSchema,
            cycleFields: [{ selectedCycle: '', date: '' }],
            student: {
                rol: 'STU',
                cycle: []
            },
        }
    },
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
    methods: {
        ...mapActions(useStore, ['addMsgArray']),
        async addStudent() {
            this.student.cycle = this.cycleFields;
            try {
                await axios.post(SERVER + '/registerStudent', this.student);
                this.addMsgArray('success', 'Compruebe su correo para activar su cuenta')
            } catch (error) {
                this.addMsgArray('danger', 'Error al añadir el registro: ' + error)
                if (error.response.status === 429) {
                    setTimeout(() => {
                        this.addStudent();
                    }, 5000);
                } else {
                    this.addMsgArray('danger', 'Error: no se ha añadido el registro. ' + error.message)
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
        <Form :initial-values="student" :validation-schema="validationSchema" @submit="addStudent()">
            <fieldset>
                <legend>Registrarse</legend>

                <div class="form-group">
                    <label class="col-md-8 control-label">Nombre</label>
                    <div class="col-md-8 inputGroupContainer">
                        <div class="input-group">
                            <Field name="nombre" placeholder="nombre" class="form-control" type="text"
                                v-model="student.name" />
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

                <div class="form-group">
                    <label class="col-md-8 control-label">E-Mail</label>
                    <div class="col-md-8 inputGroupContainer">
                        <div class="input-group">
                            <Field name="email" placeholder="email" class="form-control" type="email"
                                v-model="student.email" />
                            <ErrorMessage name="email" class="error" />
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
                            <Field name="repetirContraseña" placeholder="repetir contraseña" class="form-control"
                                type="password" />
                            <ErrorMessage name="repetirContraseña" class="error" />
                        </div>
                    </div>
                </div>

                <!-- Text input-->
                <div class="form-group" v-for="(cycleField, index) in cycleFields" :key="index">
                    <label class="col-md-8 control-label">Ciclo</label>
                    <div class="col-md-8 inputGroupContainer">
                        <div class="input-group">
                            <select name="cycle" v-model="cycleField.selectedCycle" class="form-control" @change="addCycleField(index)">
                                <option value="">Seleccionar ciclo</option>
                                <option v-for="cycle in cycles" :key="cycle.id" :value="cycle.id">{{ cycle.title }}</option>
                            </select>
                            <input type="date" v-model="cycleField.date" class="form-control" />
                            <button @click="removeCycleField(index)">Eliminar</button>
                        </div>
                    </div>
                    <ErrorMessage name="cycle" class="error" />
                </div>

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

                <!-- Text area -->
                <div class="form-group">
                    <label class="col-md-8 control-label">Términos y Condiciones</label>
                    <div class="col-md-8 inputGroupContainer">
                        <div class="input-group">
                            <Field class="form-check-input" name="aceptar" type="checkbox" :value="false" />
                            <label class="form-check-label" for="aceptar">Acepto los términos y condiciones</label>
                        </div>
                        <ErrorMessage name="aceptar" class="error" />
                    </div>
                </div>

                <!-- Button -->
                <div class="form-group">
                    <label class="col-md-8 control-label"></label>
                    <div class="col-md-8">
                        <button type="submit" class="btn btn-warning">Registrarse <span
                                class="glyphicon glyphicon-send"></span></button>
                    </div>
                </div>
            </fieldset>
        </Form>
    </div>
</template>

<style scoped>
.container {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f8f9fa; /* Color de fondo */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra */
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
