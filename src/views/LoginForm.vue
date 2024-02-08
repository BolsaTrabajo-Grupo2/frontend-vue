<script>
import { useStore } from '@/stores/store';
import { mapState } from 'pinia';
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import $ from 'jquery';
import * as yup from 'yup'
import { setLocale } from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

setLocale({
    mixed: {
        required: 'El campo ${path} no puede estar vacio'
    },
    string: {
        min: 'Debe tener al menos ${min} caracteres',
        max: 'Deebe tener menos de ${max} caracteres'
    },
})
export default {
    data() {
        const mySchema = yup.object({
            repassword: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir').required('Debes repetir la contraseña'),
            name: yup.string().required().max(250),
            surname: yup.string().required().max(250),
            email: yup.string().required().email(),
            password: yup.string().required().min(8),
            direccion: yup.string().required(),
            cv: yup.string().url({
                message: 'Por favor, introduce una URL válida para el CV.'
            })
        })
        return {
            mySchema,
            user: {email: '', password: ''}
        }
    },
    components: {
        Form,
        Field,
        ErrorMessage
    },
    async mounted() {
        $(document).ready(function (e) {
            $('h6').on('click', function () {
                $('.social').stop().slideToggle();
            });
        })
        })
    },
    methods: {
        logIng(){
            try {
                await axios.post(SERVER + '/login', this.user)
                    .then(
                        // response => this.addUser(response.data),
                        response => {
                        localStorage.setItem('user', JSON.stringify(response.data))
                        this.addUser(this.user)
                        },
            this.$router.push('/student-mod/44')
            )
                    .catch(response => alert('Error: no se ha modificado el registro. ' + response.message))
                axios.put(SERVER + '/login' + this.user.email, this.user.password)
                    .then(response => localStorage.setItem('usuario', JSON.stringify(response.data)))
                    .catch(response => alert('Error: no se ha modificado el registro. ' + response.message))
                this.$router.push('/hola')
            } catch (error) {
                alert('No existe ese usuario, vuelva a intentarlo')
            }
        }
    }
}
</script>

<template>
    <Form>
        <h1><span>Iniciar</span> Sesion</h1>
        <Field placeholder="Email" type="text" v-model="user.email"/>
        <Field placeholder="Password" type="password" v-model="user.password"/>
        <button class="btn" @click="logIng">Log in</button>
        <h6>Más opciones</h6>
        <div class="social">
            <button class="github btn">Git Hub</button>
            <button class="google fb btn">Google+</button>
        </div>
    </Form>

    <footer>
        <h5>
            Bolsa Trabajo
        </h5>
    </footer>
</template>

<style scoped>
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
nav,
section {
    display: block;
}

html {
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
}

input:focus,
textarea:focus {
    outline: none;
}

label,
select,
button,
input[type="submit"],
input[type="radio"],
input[type="checkbox"] input[type="button"] {
    cursor: pointer;
}

a,
a:visited,
a:active {
    text-decoration: none;
}

a:hover {
    text-decoration: none;
}

::selection {
    background: #ed327b;
    color: #fff;
}

::-moz-selection {
    background: #ed327b;
    color: #fff;
}

* {
    font-size: 100%;
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

* {
    font-family: "Helvetica Neue", Helvetica, Arial;
}

h5 {
    text-align: center;
    margin-top: 5px;
    color: rgba(0, 0, 0, .3);
}

h5>a,
a:visited {
    color: #fff;
    text-decoration: underline;
}

h5>a:hover {
    text-decoration: none;
}

form {
    background: #7eabff;
    border-radius: 6px;
    padding: 20px;
    padding-top: 30px;
    width: 300px;
    margin: 50px auto;
    box-shadow: 15px 15px 0px rgba(0, 0, 0, .1);
}

h1 {
    text-align: center;
    font-size: 1.4em;
    font-weight: 700;
    color: #ccc;
    margin-bottom: 24px;
}

span {
    font-weight: 200;
}

input {
    width: 100%;
    background: #f5f5f5;
    border: 0;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 10px;
    border: 1px solid #eee;
}

.btn {
    position: relative;
    width: 100%;
    padding: 20px;
    border-radius: 6px;
    border: 0;
    background: #f26964;
    font-size: 1.2em;
    color: #fff;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, .1);
    box-shadow: 0px 3px 0px #c1524e;
}

.btn:active {
    top: 3px;
    box-shadow: none;
}

h6 {
    text-align: center;
    padding: 20px;
    padding-top: 35px;
    color: #777;
    cursor: pointer;
}

.social {
    display: none;
}

.github {
    margin-top: 15px;
    background: #2c2e31;
    color: white;
    box-shadow: 0px 3px 0px #2c416e;
}

.google {
    margin-top: 5px;
    background: #db4a39;
    box-shadow: 0px 3px 0px #b93f31;
}
</style>
