<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import * as yup from 'yup'
import APIService from '../axios/axios.js'

export default {
    data() {
        const validationSchema = yup.object({
            description: yup.string().required().max(200),
            duration: yup.string().required().max(50),
            responsible_name: yup.string().max(250),
            cycles: yup.array().min(1, 'Seleccione al menos un ciclo').required(),
        });
        return {
            validationSchema,
            offert: {
                inscription_method: false,
            }
        }
    },
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
    methods:{
        ...mapActions(useStore, ['addMsgArray']),
        async addNewOffert(){
            try{
                const apiService = new APIService(this.user.token)
                this.offert.inscription_method = this.offert.inscription_method == 'on'
                await apiService.addOffert(this.offert)
                this.addMsgArray('sucess', 'Oferta añadida con exito')
            }catch (error){
                this.addMsgArray('danger', 'Error: ' + error)
            }
        }
    }
}
</script>
<template>
    <h1>Formulario nueva oferta</h1>
        <Form :initial-values="offert" :validation-schema="validationSchema" @submit="addNewOffert()">
            <div class="form-group">
                <label for="description">Descripcion del puesto de trabajo ofertado</label><br>
                <Field as="textarea" id="description" name="description" placeholder="Una pequeña descripción del puesto"
                    v-model="offert.description" class="form-control" rows="5"></Field>
                <ErrorMessage name="description"></ErrorMessage>
            </div>
            <div class="form-group">
                <label for="cycles">Seleccione los ciclos a los que va dirigido</label>
                <Field as="select" id="cycles" name="cycles" v-model="offert.selectedCycles" class="form-control" multiple>
                    <option v-for="cycle in cycles" :key="cycle.id" :value="cycle.id">{{ cycle.cliteral }}</option>
                </Field>
                <ErrorMessage name="cycles" component="div" class="text-danger" />
            </div>
            <div class="form-group">
                <label for="duration">Duracion del contrato</label><br>
                <Field id="duration" name="duration" placeholder="Duracion del contrato" v-model="offert.duration"
                    class="form-control"></Field>
                <ErrorMessage name="duration"></ErrorMessage>
            </div>
            <div class="form-group">
                <label for="responsible_name">Nombre del responsable</label><br>
                <Field id="responsible_name" name="responsible_name" placeholder="Nombre del responsable"
                    v-model="offert.responsible_name" class="form-control"></Field>
                <ErrorMessage name="responsible_name"></ErrorMessage>
            </div>
            <div class="form-group">
                <div class="form-check">
                    <Field type="checkbox" id="inscription_method" name="inscription_method" class="form-check-input" v-model="offert.inscription_method" true-value="true" false-value="false" />
                        <label class="form-check-label" for="inscription_method">¿Deseas que los alumnos se apunten aquí?</label>
                </div>
                <ErrorMessage name="inscription_method" />
            </div>
            <br>
            <button type="submit" class="btn btn-primary">Guardar</button>
        </Form>
</template>
<style></style>