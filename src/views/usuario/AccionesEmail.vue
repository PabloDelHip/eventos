<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
        <v-card v-if="email" class="elevation-6">
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
                Nueva Contraseña
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              Ingresa una nueva contraseña para {{ email }}
          </v-card-text>
          <v-card-text>
            <v-text-field @blur="$v.f1.password.$touch()" :error-messages="erroresPassword" v-model="f1.password" label="Password" type="password"></v-text-field>
            <v-text-field @blur="$v.f1.repetirPassword.$touch()" :error-messages="erroresRepetirPassword" v-model="f1.repetirPassword" label="Repetir Password" type="password"></v-text-field>
          </v-card-text>
          <v-card-text>
            <v-layout justify-end>
              <v-btn :depressed="$v.f1.$invalid" :disabled="$v.f1.$invalid" @click="cambiarPassword" color="secondary">Aceptar</v-btn>
            </v-layout>
          </v-card-text>

        </v-card>
    </v-flex>
  </v-layout>
</template>


<script>

import { auth } from '@/firebase'
import { mapMutations, mapGetters } from 'vuex'
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'

export default {
    data(){
        return {
            actionCode: '',
            email: '',
            f1: {
                password: '',
                repetirPassword: ''
            },
        }
    },
    validations: {
        f1: {
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(20)
            },
            repetirPassword: {
                sameAs: sameAs('password')
            }
        },
    },
    computed: {
        ...mapGetters('sesion', ['saludo']),
        erroresPassword() {
            let errores = []
            if (!this.$v.f1.password.$dirty) { return errores }
            if (!this.$v.f1.password.required) { errores.push('Ingresa tu password.') }
            if (!this.$v.f1.password.minLength) { errores.push('Ingresa al menos 6 caracteres.') }
            if (!this.$v.f1.password.maxLength) { errores.push('Ingresa máximo 20 caracteres.') }
            return errores
        },
        erroresRepetirPassword() {
            let errores = []
            if (!this.$v.f1.repetirPassword.$dirty) { return errores }
            if (!this.$v.f1.repetirPassword.sameAs) { errores.push('Las contraseñas no coinciden.') }
            return errores
        },
    },
    methods: {
        ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarInformacion', 'mostrarExito', 'mostrarError', 'mostrarAdvertencia']),
         ...mapMutations('sesion', ['actualizarUsuario']),
        async validar()
        {
            let mode = this.$route.query.mode;
            this.actionCode = this.$route.query.oobCode;

            switch(mode) {
            case 'verifyEmail':
                this.mostrarOcupado({ titulo: 'verificando Código', mensaje:'Validando el codigo de verificación' })

                try {
                    //funcion para validar el correo con el codigo que se manda por la URL
                    await auth.applyActionCode(this.actionCode);
                    this.mostrarExito('Email validado con éxito. Ingresar tus credenciales para continuar');
                    this.$router.push({ name: 'login' })
                } catch (error) {
                    this.mostrarError("No fue posible validar tu dirección de email.");
                }
                finally {
                    this.ocultarOcupado();
                }

                break
            case 'resetPassword':

                this.mostrarOcupado({titulo: 'Verificando Código', mensaje: 'Validando código para restablecimiento de contraseña...'});

                try {
                    //indicamos que lo que se va a realizar es un cambio de contraseña
                    this.email = await auth.verifyPasswordResetCode(this.actionCode)
                    this.mostrarInformacion('Ingresa una nueva contraseña para ' + this.email);
                } catch (error) {
                    this.mostrarError('No fue posible leer el códiggo de restablecimiento de contraseña')
                }
                finally {
                    this.ocultarOcupado()
                }
                break
            }
        },
        async cambiarPassword() {
            this.mostrarOcupado({ titulo: 'Estableciendo Contraseña', mensaje: 'Cambiar Contraseña...'})

            try {
                await auth.confirmPasswordReset(this.actionCode, this.f1.password);
                await auth.signInWithEmailAndPassword(this.email, this.f1.password);

                this.mostrarExito(this.saludo + 'tu contraseña ha sido cambiada exitosamente.')
                this.$router.push({ name: 'home' })

            } catch (error) {
                this.mostrarError("No fue posible cambiar la contraseña");
            }
            finally {
                this.ocultarOcupado();
            }
        }
    },
    created() {
        this.validar();
    }
}
</script>