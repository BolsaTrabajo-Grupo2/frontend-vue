<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale } from 'yup';
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API

yup.addMethod(yup.string, 'url', function () {
  return this.test({
    name: 'url',
    message: 'La URL no es válida',
    test: (value) => {
      if (!value) {
        return true;
      }
      return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
    }
  });
});

yup.addMethod(yup.string, 'password', function () {
  return this.test({
    name: 'password',
    message: 'La contraseña ha de contener al menos 8 carácteres, entre ellos una mayúscula y un número',
    test: (value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return (
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /\d/.test(value)
      );
    }
  });
});
yup.addMethod(yup.string, 'uniqueEmail', function (message = 'Este email ya está registrado') {
  return this.test({
    name: 'unique-email',
    message,
    test: async function (value) {
      if (!value) return true;
      try {
        const response = await axios.get(`${SERVER}/checkEmail/${value}`);
        return !response.data;
      } catch (error) {
        console.error('Error al verificar el email:', error);
        return true;
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
    max: 'El campo ${path} debe tener como máximo ${max} caracteres',
  },
});

export default {
  data() {
    const mySchema = yup.object({
      name: yup.string().required(),
      surname: yup.string().required(),
      email: yup.string().required().email().uniqueEmail(),
      password: yup.string().required().password(),
      confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir').required('Debes confirmar la contraseña'),
      CIF: yup.string().required().matches(/^[A-Za-z]\d{8}$/, 'El CIF debe comenzar con una letra seguida de 8 números'),
      CP: yup.string().required().matches(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
      address: yup.string().required().max(250),
      phone: yup.string().required().length(9),
      web: yup.string().url().max(100),
      companyName: yup.string().required(),
      aceptar: yup.boolean().required('Debes aceptar los términos y condiciones para continuar.')
    })
    return {
      company: {},
      titulo: "Añadir Empresa",
      boton: "Añadir",
      mySchema,
    }
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  methods: {
    async addCompany() {
      this.company.rol = "COMP"

      axios.post(SERVER + '/registerCompany', this.company)
        .then()
        .catch(response => alert('Error: no se ha añadido el registro. ' + response.message))
    },
  },

}
</script>

<template>
  <div class="row">
    <Form @submit="addCompany" :validation-schema="mySchema">
      <fieldset>
        <legend>{{ titulo }}</legend>
        <div>

          <div>
            <label name="name" for="name">Nombre:</label><br>
            <Field name="name" type="text" v-model="company.name" /><br />
            <ErrorMessage name="name" class="validate-error" />
          </div>

          <div>
            <label name="surname" for="surname">Apellidos:</label><br>
            <Field name="surname" type="text" v-model="company.surname" /><br />
            <ErrorMessage name="surname" class="validate-error" />
          </div>

          <div>
            <label name="phone" for="phone">Teléfono:</label><br>
            <Field name="phone" type="text" v-model="company.phone" /><br />
            <ErrorMessage name="phone" class="validate-error" />
          </div>

          <div>
            <label name="email" for="email">Email:</label><br>
            <Field name="email" type="text" v-model="company.email" /><br />
            <ErrorMessage name="email" class="validate-error" />
          </div>

          <div>
            <label name="password" for="password">Contraseña:</label><br>
            <Field name="password" type="text" v-model="company.password" /><br />
            <ErrorMessage name="password" class="validate-error" />
          </div>

          <div>
            <label name="confirmPassword" for="confirmPassword">Repetir Contraseña:</label><br>
            <Field name="confirmPassword" type="text" /><br />
            <ErrorMessage name="confirmPassword" class="validate-error" />
          </div>

          <div>
            <label name="CIF" for="CIF">CIF:</label><br>
            <Field name="CIF" type="text" v-model="company.CIF" /><br />
            <ErrorMessage name="CIF" class="validate-error" />
          </div>

          <div>
            <label name="companyName" for="companyName">Nombre Empresa:</label><br>
            <Field name="companyName" type="text" v-model="company.company_name" /><br />
            <ErrorMessage name="companyName" class="validate-error" />
          </div>

          <div>
            <label name="web" for="web">Web:</label><br>
            <Field name="web" type="text" v-model="company.web" /><br />
            <ErrorMessage name="web" class="validate-error" />
          </div>

          <div>
            <label name="address" for="address">Dirección:</label><br>
            <Field name="address" type="text" v-model="company.address" /><br />
            <ErrorMessage name="address" class="validate-error" />
          </div>

          <div>
            <label name="CP" for="CP">CP:</label><br>
            <Field name="CP" type="text" v-model="company.CP" /><br />
            <ErrorMessage name="CP" class="validate-error" />
          </div>

          <div>
            <Field class="form-check-input" name="aceptar" type="checkbox" :value="false" />
            <label class="form-check-label" for="aceptar"> Acepto los términos y condiciones</label>
            <ErrorMessage name="aceptar" class="validate-error" />
          </div>

        </div>

        <button type="submit" class="btn btn-default btn-primary">{{ boton }}</button>
      </fieldset>
    </Form>
  </div>
</template>
<style scoped>
.validate-error {
  color: red;
}
</style>