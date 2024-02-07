<script>
import { mapActions, mapState } from 'pinia'
import { useCounterStore } from '../stores'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { setLocale } from 'yup';
import JuegosRepository from '@/repositories/juegos.repository';
extend('url', {
  validate: (value) => {
    if (value === null || value === undefined || value === '') {
      return true;
    }
    return yup.string().url().isValidSync(value);
  },
  message: 'La URL no es válida',
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
          <div v-if="this.$route.params.id">
            <label for="id">Id:</label>
            <Field name="id" type="text" v-model="juego.id" disabled /><br />
            <br>
            <ErrorMessage name="id" class="validate-error" />
          </div>

          <div>
            <label name="nombre" for="nombre">Nombre:</label><br>
            <Field name="nombre" type="text" v-model="juego.nombre" /><br />
            <ErrorMessage name="nombre" class="validate-error" />
          </div>

          <div>
            <label for="descripcion">Descripcion:</label><br>
            <textarea v-model="juego.descrip"></textarea>
          </div>

          <div>
            <label for="categoria">Categoría:</label>
            <div class="form-check" v-for="categoria in categorias" :key="categoria.id">
              <Field type="radio" class="form-check-input" name="categoria" :value="categoria.id"
                v-model="juego.categoria" />{{
                  categoria.nombre }}
            </div>
            <br>
            <ErrorMessage name="categoria" class="validate-error" />
          </div>

          <div>
            <label for="plataforma">Plataforma:</label>
            <Field name="plataforma" v-model="juego.plataforma" class="form-control" as="select">
              <option value="" disabled>-- Selecciona una Plataforma --</option>
              <option v-for="plataforma in plataformas" :key="plataforma.id" :value="plataforma.id">{{ plataforma.nombre
              }}</option>
            </Field>
            <ErrorMessage name="plataforma" class="validate-error" />
          </div>
          <div class="form-group">
            <label name="imagen" for="imagen">Imagen:</label><br>
            <Field name="imagen" type="text" class="form-control" v-model="juego.img" /><br />
            <ErrorMessage name="imagen" class="validate-error" />
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