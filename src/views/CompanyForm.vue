<script>
import { mapActions, mapState } from 'pinia'
import { useCounterStore } from '../stores'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale } from 'yup';

yup.addMethod(yup.string, 'url', function() {
  return this.test({
    name: 'url',
    message: 'La URL no es válida',
    test: (value) => {
      if (!value) {
        return true;
      }
      return yup.string().url().isValidSync(value);
    }
  });
});

yup.addMethod(yup.boolean, 'accepted', function() {
  return this.test({
    name: 'accepted',
    message: 'Debe aceptar las condiciones',
    test: (value) => {
      return value === true;
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
      password: yup.string().min(8),
      CIF: yup.string().lenght(9),
      CP: yup.number().lenght(5), //Comprobacion
      street: yup.string().required().max(75),
      number: yup.number().required().max(15),
      province: yup.string().required().max(40),
      poblation: yup.string().required().max(40),
      datail: yup.string().max(75),
      phone: yup.number().required().lenght(9),
      web: yup.string().url().max(100)

    })
    return {
      juego: {},
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
    ...mapState(useCounterStore, {
      plataformas: 'plataformas',
      categorias: 'categorias',
    })
  },
  async mounted() {
    try {
      const repository = new JuegosRepository
      if (this.$route.params.id) {
        this.juego = await repository.getById(this.$route.params.id)
        this.titulo = "Editar Juego"
        this.boton = "Editar"
      }
    }
    catch {
      alert('Error al cargar el juego')
    }
  },
  methods: {
    async create() {
      try {
        const repository = new JuegosRepository()
        if (this.juego.id) {
          await repository.change(this.juego)
          alert('juego editado correctamente')
        }
        else {
          await repository.add(this.juego)
          alert('juego añadido correctamente')
        }
        this.$router.push("/")
      }
      catch {
        alert('Error al crear o añadir el juego')
      }
    },
    async cancel() {
      this.$router.push("/")
    },
    ...mapActions(useCounterStore, ['getAutorById']),
  },

}
</script>

<template>
  <div class="row">
    <Form @submit="create" :validation-schema="mySchema">
      <fieldset>
        <legend>{{ this.titulo }}</legend>
        <div>
          <div>
            <Field name="rol" type="text" value="COMP" hidden /><br />
          </div>

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
            <Field name="CP" type="CP" /><br />
            <ErrorMessage name="CP" class="validate-error" />
          </div>
          <div>
            <input type="checkbox" id="accept" name="accept">
            <label name="accept" for="accept">Aceptar</label><br>
            <ErrorMessage name="accept" class="validate-error" />
          </div>
        </div>

        <button type="submit" class="btn btn-default btn-primary">Guardar</button>
        <button type="button" @click="cancel" class="btn btn-danger">Cancelar</button>
      </fieldset>
    </form>
  </div>
</template>
<style scoped>
.validate-error {
  color: red;
}
</style>