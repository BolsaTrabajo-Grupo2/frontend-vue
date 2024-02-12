<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale } from 'yup'
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import axios from 'axios'
import APIService from '../axios/axios.js'
const apiService = new APIService()
const SERVER = import.meta.env.VITE_URL_API

yup.addMethod(yup.string, 'uniqueCIF', function (message = 'Este CIF ya está registrado') {
  return this.test({
    name: 'unique-cif',
    message,
    async test(value) {
      if (!value || value === currentCIF) return true;
      try {
        const response = await axios.get(`${SERVER}/checkCIF/${value}`);
        return !response.data;
      } catch (error) {
        console.error('Error al verificar el CIF:', error);
        return false;
      }
    },
  });
});

setLocale({
  mixed: {
    default: 'Campo no válido',
    required: 'El campo ${path} no puede estar vacío'
  },
  string: {
    min: 'El campo ${path} debe tener al menos ${min} caracteres',
    max: 'El campo ${path} debe tener como máximo ${max} caracteres'
  }
})

let currentCIF = ''

export default {
  data() {
    const mySchema = yup.object({

      name: yup.string().required(),
      surname: yup.string().required(),
      email: yup.string().required().email(),
      password: yup.string().test('password-check', 'La contraseña no cumple con los requisitos', function (value) {
        if (!value || value === '') return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
      }),
      confirmPassword: yup.string().test('password-match', 'Las contraseñas no coinciden', function (value, context) {
        const { password } = context.parent;
        if (password !== '' && value === '') return false
        if (password === '' && value === undefined) return true
        return value === password;
      }),
      CIF: yup.string().required().matches(/^[A-Za-z]\d{8}$/, 'El CIF debe comenzar con una letra seguida de 8 números').uniqueCIF(),
      CP: yup.string().required().matches(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
      address: yup.string().required().max(250),
      phone: yup.string().required().length(9),
      web: yup.string().url().max(100),
      companyName: yup.string().required()

    })
    return {
      company: {},
      titulo: 'Editar Empresa',
      boton: 'Editar',
      mySchema
    }
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  methods: {
    async editCompany() {
      this.company.rol = 'COMP'

      apiService.modCompany(this.company)
        .then()
        .catch(response => {
          alert('Error: ' + response.message)
        });
    },

    async reset() {
      try {
        const response = await axios.get(SERVER + '/company/' + this.id)
        this.company = response.data
      } catch (error) {
        console.error('Error al obtener la información de la empresa:', error)
      }
      this.company.password = ''
    }
  },
  props: ['id'],
  async mounted() {
    await axios.get(SERVER + '/company/' + this.id)
      .then(response => this.company = response.data)
      .catch(response => {
        alert('Error: ' + response.message)
      });
    currentCIF = this.company.CIF
    this.company.password = ''
  }
}
</script>
<template>
  <div class="row">
    <Form @reset="reset" @submit="editCompany" :validation-schema="mySchema">
      <fieldset>
        <legend>{{ titulo }}</legend>
        <div>
          <div>
            <label name="name" for="name">Nombre:</label><br />
            <Field name="name" type="text" v-model="company.name" /><br />
            <ErrorMessage name="name" class="validate-error" />
          </div>

          <div>
            <label name="surname" for="surname">Apellidos:</label><br />
            <Field name="surname" type="text" v-model="company.surname" /><br />
            <ErrorMessage name="surname" class="validate-error" />
          </div>

          <div>
            <label name="phone" for="phone">Teléfono:</label><br />
            <Field name="phone" type="text" v-model="company.phone" /><br />
            <ErrorMessage name="phone" class="validate-error" />
          </div>

          <div>
            <label name="email" for="email">Email:</label><br />
            <Field name="email" type="text" v-model="company.email" disabled /><br />
            <ErrorMessage name="email" class="validate-error" />
          </div>

          <div>
            <label name="password" for="password">Contraseña:</label><br />
            <Field name="password" type="text" v-model="company.password" /><br />
            <ErrorMessage name="password" class="validate-error" />
          </div>

          <div>
            <label name="confirmPassword" for="confirmPassword">Repetir Contraseña:</label><br />
            <Field name="confirmPassword" type="text" /><br />
            <ErrorMessage name="confirmPassword" class="validate-error" />
          </div>

          <div>
            <label name="CIF" for="CIF">CIF:</label><br />
            <Field name="CIF" type="text" v-model="company.CIF" /><br />
            <ErrorMessage name="CIF" class="validate-error" />
          </div>

          <div>
            <label name="companyName" for="companyName">Nombre Empresa:</label><br />
            <Field name="companyName" type="text" v-model="company.company_name" /><br />
            <ErrorMessage name="companyName" class="validate-error" />
          </div>

          <div>
            <label name="web" for="web">Web:</label><br />
            <Field name="web" type="text" v-model="company.web" /><br />
            <ErrorMessage name="web" class="validate-error" />
          </div>

          <div>
            <label name="address" for="address">Dirección:</label><br />
            <Field name="address" type="text" v-model="company.address" /><br />
            <ErrorMessage name="address" class="validate-error" />
          </div>

          <div>
            <label name="CP" for="CP">CP:</label><br />
            <Field name="CP" type="text" v-model="company.CP" /><br />
            <ErrorMessage name="CP" class="validate-error" />
          </div>
        </div>

        <button type="submit" class="btn btn-default btn-primary">{{ boton }}</button>
        <button type="reset">reset</button>
      </fieldset>
    </Form>
  </div>
</template>
<style scoped>
.validate-error {
  color: red;
}

.row {
  margin-left: 5%;
}
</style>
