<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale, } from 'yup'
import axios from 'axios'
import { mapActions } from 'pinia'
import { useStore } from '@/stores/store'
const SERVER = import.meta.env.VITE_URL_API

yup.addMethod(yup.string, 'url', function () {
  return this.test({
    name: 'url',
    message: 'La URL no es válida',
    test: (value) => {
      if (!value) {
        return true
      }
      return /^(ftp|http|https):\/\/[^ "]+$/.test(value)
    }
  })
})

yup.addMethod(yup.string, 'contraseña', function () {
  return this.test({
    name: 'contraseña',
    message:
      'La contraseña ha de contener al menos 8 carácteres, entre ellos una mayúscula y un número',
    test: (value) => {
      if (value === null || value === undefined || value === '') {
        return true
      }
      return value.length >= 8 && /[A-Z]/.test(value) && /\d/.test(value)
    }
  })
})

yup.addMethod(yup.string, 'uniqueCIF', function (message = 'Este CIF ya está registrado') {
  return this.test({
    name: 'unique-cif',
    message,
    async test(value) {
      if (!value) return true;
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

export default {
  data() {
    const mySchema = yup.object({
      nombre: yup.string().required(),
      apellidos: yup.string().required(),
      email: yup.string().required().email(),
      contraseña: yup.string().required().contraseña(),
      repetirContraseña: yup.string().oneOf([yup.ref('contraseña'), null], 'Las contraseñas deben coincidir').required('Debes confirmar la contraseña'),
      CIF: yup.string().required().matches(/^[A-Za-z]\d{8}$/, 'El CIF debe comenzar con una letra seguida de 8 números').uniqueCIF(),
      CP: yup.string().required().matches(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
      direccion: yup.string().required().max(250),
      tlf: yup.string().required().length(9),
      web: yup.string().url().max(100),
      nombreEmpresa: yup.string().required(),
      aceptar: yup.boolean().required('Debes aceptar los términos y condiciones para continuar.')
    })
    return {
      company: {},
      mySchema
    }
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    async addCompany() {
      this.company.rol = 'COMP'
      try {
        await axios.post(SERVER + '/registerCompany', this.company);
        this.$router.push('/')
        this.addMsgArray('success', 'Compruebe su correo para activar su cuenta');
      } catch (error) {
        this.addMsgArray('danger', 'Error al añadir el registro: ' + error);
        if (error.response.status === 429) {
          setTimeout(() => {
            this.addStudent();
          }, 5000);
        } else {
          this.addMsgArray('danger', 'Error: no se ha añadido el registro. ' + error.message);
        }
      }
    }
  }
}
</script>

<template>
  <div class="formbold-main-wrapper">
    <div class="formbold-form-wrapper">
      <Form @submit="addCompany" :validation-schema="mySchema">
        <div class="formbold-form-title">
          <h2 class="">Añadir Empresa</h2>
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="nombre" class="formbold-form-label"> Nombre: </label>
            <Field name="nombre" type="text" v-model="company.name" class="formbold-form-input" /><br />
            <ErrorMessage name="nombre" class="validate-error" />
          </div>

          <div>
            <label for="apellidos" class="formbold-form-label"> Apellidos: </label>
            <Field name="apellidos" type="text" v-model="company.surname" class="formbold-form-input" /><br />
            <ErrorMessage name="apellidos" class="validate-error" />
          </div>
        </div>

        <div class="formbold-input-flex">
          <div>
            <label for="tlf" class="formbold-form-label"> Teléfono: </label>
            <Field name="tlf" type="text" v-model="company.phone" class="formbold-form-input" /><br />
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
            <Field name="contraseña" type="password" v-model="company.password" class="formbold-form-input" /><br />
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
          <Field name="direccion" type="text" v-model="company.address" class="formbold-form-input" /><br />
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

        <div class="formbold-checkbox-wrapper">
          <label for="supportCheckbox" class="formbold-checkbox-label">
            <div class="formbold-relative">
              <Field type="checkbox" class="formbold-input-checkbox" id="supportCheckbox" name="aceptar" :value="false" />
              <div class="formbold-checkbox-inner">
                <span class="formbold-opacity-0">
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none" class="formbold-stroke-current">
                    <path
                      d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                      stroke-width="0.4"></path>
                  </svg>
                </span>
              </div>
            </div>
            Acepto los términos y condiciones
          </label>
          <ErrorMessage name="aceptar" class="validate-error" />
        </div>


        <button type="submit" class="formbold-btn">Añadir</button>
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
  font-weight: bold;
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

.validate-error {
  color: red;
}
</style>
