<script>
import { mapActions, mapState } from 'pinia'
import { useCounterStore } from '../stores'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale } from 'yup';

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
      email: yup.string().required().email(),
      password: yup.string().min(8).required(),
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
      titulo: "Añadir Juego",
      boton: "Añadir",
      mySchema,
    }
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  computed: {
  },
  async mounted() {
    try {
      if (this.$route.params.id) {
        this.company = {}
        this.titulo = "Editar Juego"
        this.button = "Editar"
      }
    }
    catch {
      alert('Error al cargar el juego')
    }
  },
  methods: {
    async submitForm() {
      alert("creado")
    },
    async cancel() {
      this.$router.push("/")
    },
  },

}
</script>

<template>
  <div class="row">
    <Form @submit="submitForm" :validation-schema="mySchema">
      <fieldset>
        <legend>{{ this.titulo }}</legend>
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
            <label name="email" for="email">Email:</label><br>
            <Field name="email" type="text" v-model="company.email" /><br />
            <ErrorMessage name="email" class="validate-error" />
          </div>

          <div>
            <label name="password" for="password">Contraseña:</label><br>
            <Field name="password" type="text" /><br />
            <ErrorMessage name="password" class="validate-error" />
          </div>

          <div>
            <label name="confirmPassword" for="confirmPassword">Repetir Contraseña:</label><br>
            <Field name="confirmPassword" type="text" /><br />
            <ErrorMessage name="confirmPassword" class="validate-error" />
          </div>

          <div>
            <label name="CIF" for="CIF">CIF:</label><br>
            <Field name="CIF" type="text" /><br />
            <ErrorMessage name="CIF" class="validate-error" />
          </div>

          <div>
            <label name="companyName" for="companyName">Nombre Empresa:</label><br>
            <Field name="companyName" type="text" /><br />
            <ErrorMessage name="companyName" class="validate-error" />
          </div>

          <div>
            <label name="web" for="web">Web:</label><br>
            <Field name="web" type="text" /><br />
            <ErrorMessage name="web" class="validate-error" />
          </div>

          <div>
            <label name="address" for="address">Dirección:</label><br>
            <Field name="address" type="text" /><br />
            <ErrorMessage name="address" class="validate-error" />
          </div>

          <div>
            <label name="CP" for="CP">CP:</label><br>
            <Field name="CP" type="text" /><br />
            <ErrorMessage name="CP" class="validate-error" />
          </div>

          <div class="form-group">
            <label class="col-md-4 control-label">Términos y Condiciones</label>
            <div class="col-md-4 inputGroupContainer">
              <div class="input-group">
                <Field class="form-check-input" name="aceptar" type="checkbox" :value="false" />
                <label class="form-check-label" for="aceptar">Acepto los términos y condiciones</label>
              </div>
              <ErrorMessage name="aceptar" class="validate-error" />
            </div>
          </div>

        </div>

        <button type="submit" class="btn btn-default btn-primary">Guardar</button>
        <button type="button" @click="cancel" class="btn btn-danger">Cancelar</button>
      </fieldset>
    </Form>
  </div>
</template>
<style scoped>
.validate-error {
  color: red;
}
</style>