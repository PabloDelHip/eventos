<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card class="elevation-6">
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            Ingresa tus Credenciales
          </v-toolbar-title>
        </v-toolbar>
         <v-card-text class="subheading text-xs-center">
            Ingresa con tu red social preferida
          </v-card-text>
          <v-card-text>
            <v-layout justify-center>
              <a @click="ingresar('facebook')"  class="mx-3">
                <v-avatar tile :size="40">
                  <img  alt="Ingreso Facebook" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M483.7 0H28.3C12.7 0 0 12.7 0 28.3v455.5C0 499.3 12.7 512 28.3 512h245.2V314H207v-77.5h66.5v-57c0-66.1 40.4-102.1 99.4-102.1 28.3 0 52.5 2.1 59.6 3v69.1h-40.7c-32.1 0-38.3 15.3-38.3 37.6v49.4h76.7l-10 77.5h-66.7v198h130.2c15.6 0 28.3-12.7 28.3-28.3V28.3C512 12.7 499.3 0 483.7 0z' fill='%234267b2'/><path d='M353.5 512V314h66.8l10-77.5h-76.8v-49.4c0-22.4 6.2-37.6 38.3-37.6h40.7V80.4c-7.1-.9-31.4-3-59.6-3-59 0-99.4 36-99.4 102.1v57H207V314h66.5v198h80z' fill='%23fff'/></svg>">
                </v-avatar>
              </a>
              <a @click="ingresar('google')" class="mx-3">
                <v-avatar tile :size="40">
                  <img  alt="Ingreso Google" src="data:image/svg+xml;utf8,<svg viewBox='0 0 533.5 544.3' xmlns='http://www.w3.org/2000/svg'><path d='M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z' fill='%234285f4'/><path d='M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z' fill='%2334a853'/><path d='M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z' fill='%23fbbc04'/><path d='M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z' fill='%23ea4335'/></svg>">
                </v-avatar>
              </a>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="subheading text-xs-center">
            Ingresa con una cuenta de email y contraseña
          </v-card-text>
        <v-card-text>
          <v-text-field label="Email" autofocus v-model="formulario.email" :error-messages="erroresEmail" @blur="$v.formulario.email.$touch()"></v-text-field>
          <v-text-field label="Password" @keyup.enter="ingresar('email')" v-model="formulario.password" :error-messages="erroresPassword" @blur="$v.formulario.password.$touch()" type="password"></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end>
            <v-btn @click="ingresar('email')" :depressed="$v.formulario.$invalid" :disabled="$v.formulario.$invalid" color="secondary">Ingresar</v-btn>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="solicitudPassword = true" flat color="secondary">
            ¿Olvidaste tu contraseña?.
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn :to="{ name: 'registro' }" flat color="secondary">
            ¿No tienes cuenta? Regístrate.
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog v-model="solicitudPassword" max-width="400" persistent>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
              Restablecer Contraseña
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="subheading">
            Ingresa la dirección de email con la cual te registraste
          </v-card-text>
          <v-card-text>
            <v-text-field label="Email" autofocus v-model="emailEnvio" :error-messages="erroresEmailEnvio" @blur="$v.emailEnvio.$touch()"></v-text-field>
          </v-card-text>
          <v-card-text>
            <v-layout>
              <v-flex xs6>
                <v-layout justify-start>
                  <v-btn @click="solicitudPassword = false" >Cancelar</v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout justify-end>
                  <v-btn color="secondary" @click="enviarSolicitudPassword"  :depressed="$v.emailEnvio.$invalid" :disabled="$v.emailEnvio.$invalid">Enviar</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>

import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations, mapGetters } from 'vuex'
import { firebase, auth } from '@/firebase';

export default {
  data() {
    return {
      formulario: {
        email: '',
        password: '',
      },
      solicitudPassword: false,
      emailEnvio: ''
    }
  },
  validations: {
    formulario: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
    },
    emailEnvio: {
        required,
        email
      }
  },
  methods: {
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarAdvertencia', 'mostrarError']),
    ...mapMutations('sesion', ['actualizarUsuario']),
    ingresar(metodo){
      switch(metodo) {
        case 'email':
          this.ingresarEmail();
          break
        case 'facebook':
          this.ingresarFacebook();
          break
        case 'google':
          this.ingresarGoogle();
          break
      }
    },
    async ingresarEmail() {
      if (this.$v.formulario.$invalid) {
        this.$v.formulario.$touch()
        return
      }

      let ocupado = {
        titulo: 'Validando Credenciales',
        mensaje: 'Estamos validando tu información...'
      }

      this.mostrarOcupado(ocupado)

      try{
        await auth.signInWithEmailAndPassword(this.formulario.email, this.formulario.password);
        this.mostrarExito(this.saludo)
        this.$router.push({ name: 'home' })
      }
      catch(error) {
        switch(error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.mostrarAdvertencia('Usuario no valido. Revisa tu correo y contraseña');
            break

          default:
            console.log(error);
            this.mostrarError('Ocurrio un error validando la información');
        }
      }
      finally {
        this.ocultarOcupado();
      }
    },
    async ingresarFacebook() {
      //indicamos que queremos inisiar sesion con facebook
      let provider = new firebase.auth.FacebookAuthProvider();

      //indicamos que saldra una ventana emergente para aceptar la sesiopn con facebook
      provider.setCustomParameters({
        'display': 'popup'
      });

      auth.languageCode = 'es_MX';

      try {
        
        await auth.signInWithPopup(provider);

        this.mostrarExito(this.saludo);
        this.$router.push({ name: 'home' })

      } catch (error) {
        this.mostrarError("Ocurrio un error validando tu informacion")
      }
    },
    async ingresarGoogle() {
      //indicamos que queremos inisiar sesion con facebook
      let provider = new firebase.auth.GoogleAuthProvider();

      //indicamos que saldra una ventana emergente para aceptar la sesiopn con facebook
      provider.setCustomParameters({
        'display': 'popup'
      });

      auth.languageCode = 'es_MX';

      try {
        
        await auth.signInWithPopup(provider);

        this.mostrarExito(this.saludo);
        this.$router.push({ name: 'home' })

      } catch (error) {
        this.mostrarError("Ocurrio un error validando tu informacion")
      }
    },
    async enviarSolicitudPassword() {
      this.solicitudPassword = false;
      this.mostrarOcupado({titulo: 'Enviando Solicitud', mensaje: 'Enviando solicitus de restablecimiento de contraseña'});

      try {
        //enviamos el restablecimiento de contraseña
        await auth.sendPasswordResetEmail(this.emailEnvio);
        this.mostrarExito("Se ha enviado la solicitud de restablecimiento de contraseña");
      } catch (error) {
        this.mostrarError("ocurrio un error enviando la solicitud");
      }
      finally {
        this.ocultarOcupado();
      }
    }
  },
  computed: {
    ...mapGetters('sesion', ['saludo']),
    erroresEmail() {
      let errores = []
      if (!this.$v.formulario.email.$dirty) { return errores }
      if (!this.$v.formulario.email.required) { errores.push('Ingresa tu email.') }
      if (!this.$v.formulario.email.email) { errores.push('Ingresa un email válido.') }
      return errores
    },
    erroresPassword() {
      let errores = []
      if (!this.$v.formulario.password.$dirty) { return errores }
      if (!this.$v.formulario.password.required) { errores.push('Ingresa tu password.') }
      if (!this.$v.formulario.password.minLength) { errores.push('Ingresa al menos 6 caracteres.') }
      if (!this.$v.formulario.password.maxLength) { errores.push('Ingresa máximo 20 caracteres.') }
      return errores
    },
    erroresEmailEnvio() {
      let errores = []
      if (!this.$v.emailEnvio.$dirty) { return errores }
      if (!this.$v.emailEnvio.required) { errores.push('Ingresa tu email.') }
      if (!this.$v.emailEnvio.email) { errores.push('Ingresa un email válido.') }
      return errores
    },
  }
}
</script>
