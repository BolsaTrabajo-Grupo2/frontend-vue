<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale } from 'yup'
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import axios from 'axios'
import APIService from '../axios/axios.js'

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

      nombre: yup.string().required(),
      apellidos: yup.string().required(),
      email: yup.string().required().email(),
      contraseña: yup.string().test('password-check', 'La contraseña no cumple con los requisitos', function (value) {
        if (!value || value === '') return true;
        return /^(?=.[a-z])(?=.[A-Z])(?=.*\d).{8,}$/.test(value);
      }),
      repetirContraseña: yup.string().test('password-match', 'Las contraseñas no coinciden', function (value, context) {
        const { password } = context.parent;
        if (password !== '' && value === '') return false
        if (password === '' && value === undefined) return true
        return value === password;
      }),
      CIF: yup.string().required().matches(/^[A-Za-z]\d{8}$/, 'El CIF debe comenzar con una letra seguida de 8 números').uniqueCIF(),
      CP: yup.string().required().matches(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
      direccion: yup.string().required().max(250),
      tlf: yup.string().required().length(9),
      web: yup.string().url().max(100),
      nombreEmpresa: yup.string().required()

    })
    return {
      company: {},
      mySchema
    }
  },
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    async editCompany() {
      this.company.rol = 'COMP'
      const apiService = new APIService(this.user.token)
      try {
        const response = apiService.modCompany(this.company)
        this.$router.push('/profile')
        this.addMsgArray('sucess','Empresa modificada con exito')
      } catch (error) {
        this.addMsgArray('danger', 'Error: ' + error)
      }
    },

    async reset() {
      try {
        const response = await axios.get(SERVER + '/company/' + this.id)
        this.company = response.data
      } catch (error) {
        this.addMsgArray('danger', 'Error al obtener los datos de la compañia')
      }
      this.company.password = ''
    }
  },
  props: ['id'],
  async mounted() {
    await axios.get(SERVER + '/company/' + this.id)
      .then(response => this.company = response.data)
      .catch(response => {
        this.addMsgArray('danger', 'Error: ' + response.message)
      });
    currentCIF = this.company.CIF
    this.company.password = ''
  }
}
</script>
<template>
  <div class="formbold-main-wrapper">
    <div class="formbold-form-wrapper">
      <Form @submit="addCompany" :validation-schema="mySchema">
        <div class="formbold-form-title">
          <h2 class="">Editar Empresa</h2>
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="nombre" class="formbold-form-label"> Nombre: </label>
            <Field name="nombre" type="text" v-model="company.nombre" class="formbold-form-input" /><br />
            <ErrorMessage name="nombre" class="validate-error" />
          </div>

          <div>
            <label for="apellidos" class="formbold-form-label"> Apellidos: </label>
            <Field name="apellidos" type="text" v-model="company.apellidos" class="formbold-form-input" /><br />
            <ErrorMessage name="apellidos" class="validate-error" />
          </div>
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="tlf" class="formbold-form-label"> Teléfono: </label>
            <Field name="tlf" type="text" v-model="company.tlf" class="formbold-form-input" /><br />
            <ErrorMessage name="tlf" class="validate-error" />
          </div>

          <div>
            <label for="email" class="formbold-form-label"> Email: </label>
            <Field name="email" type="text" v-model="company.email" class="formbold-form-input" /><br />
            <ErrorMessage name="email" class="validate-error" />
          </div>
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="contraseña" class="formbold-form-label"> Contraseña: </label>
            <Field name="contraseña" type="password" v-model="company.contraseña" class="formbold-form-input" /><br />
            <ErrorMessage name="contraseña" class="validate-error" />
          </div>

          <div>
            <label for="repetirContraseña" class="formbold-form-label"> Repetir Contraseña: </label>
            <Field name="repetirContraseña" type="password" class="formbold-form-input" /><br />
            <ErrorMessage name="repetirContraseña" class="validate-error" />
          </div>
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="CIF" class="formbold-form-label"> CIF: </label>
            <Field name="CIF" type="text" v-model="company.CIF" class="formbold-form-input" /><br />
            <ErrorMessage name="CIF" class="validate-error" />
          </div>

          <div>
            <label for="nombreEmpresa" class="formbold-form-label"> Nombre Empresa: </label>
            <Field name="nombreEmpresa" type="text" v-model="company.company_name" class="formbold-form-input" /><br />
            <ErrorMessage name="nombreEmpresa" class="validate-error" />
          </div>
        </div>

        <div class="formbold-mb-3">
          <label for="direccion" class="formbold-form-label"> Dirección: </label>
          <Field name="direccion" type="text" v-model="company.direccion" class="formbold-form-input" /><br />
          <ErrorMessage name="direccion" class="validate-error" />
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="web" class="formbold-form-label"> Web: </label>
            <Field name="web" type="text" v-model="company.web" class="formbold-form-input" /><br />
            <ErrorMessage name="web" class="validate-error" />
          </div>

          <div>
            <label for="CP" class="formbold-form-label">CP:</label>
            <Field name="CP" type="text" v-model="company.CP" class="formbold-form-input" /><br />
            <ErrorMessage name="CP" class="validate-error" />
          </div>
        </div>

        <button type="submit" class="formbold-btn">Editar</button>
        <button class="formbold-btn">Reset</button>
      </Form>
    </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
}

.formbold-mb-3 {
  margin-bottom: 15px;
}

.formbold-relative {
  position: relative;
}

.formbold-opacity-0 {
  opacity: 0;
}

.formbold-stroke-current {
  stroke: currentColor;
}

#supportCheckbox:checked~div span {
  opacity: 1;
}

.formbold-main-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.formbold-form-wrapper {
  margin: 0 auto;
  max-width: 570px;
  width: 100%;
  background: white;
  padding: 40px;
}

.formbold-img {
  margin-bottom: 45px;
}

.formbold-form-title {
  margin-bottom: 30px;
}

.formbold-form-title h2 {
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
  color: #07074d;
}

.formbold-form-title p {
  font-size: 16px;
  line-height: 24px;
  color: #536387;
  margin-top: 12px;
}

.formbold-input-flex {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.formbold-input-flex>div {
  width: 50%;
}

.formbold-form-input {
  text-align: center;
  width: 100%;
  padding: 13px 22px;
  border-radius: 5px;
  border: 1px solid #dde3ec;
  background: #ffffff;
  font-weight: 500;
  font-size: 16px;
  color: #536387;
  outline: none;
  resize: none;
}

.formbold-form-input:focus {
  border-color: #6a64f1;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.formbold-form-label {
  color: #536387;
  font-size: 14px;
  line-height: 24px;
  display: block;
  margin-bottom: 10px;
}

.formbold-checkbox-label {
  display: flex;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  line-height: 24px;
  color: #536387;
}

.formbold-checkbox-label a {
  margin-left: 5px;
  color: #6a64f1;
}

.formbold-input-checkbox {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.formbold-checkbox-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  margin-top: 2px;
  border: 0.7px solid #dde3ec;
  border-radius: 3px;
}

.formbold-btn {
  font-size: 16px;
  border-radius: 5px;
  padding: 14px 25px;
  border: none;
  font-weight: 500;
  background-color: #6a64f1;
  color: white;
  cursor: pointer;
  margin-top: 25px;
}

.formbold-btn:hover {
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.formbold-btn + .formbold-btn {
  margin-left: 10px;
}

.validate-error {
  color: red;
}
</style>
