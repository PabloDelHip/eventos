import Vue from 'vue'
import store from './store'
import router from './router'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'
import './plugins/vuetify'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuelidate)

//verifica el estado en el que se encuentra el usuario al iniciar sesion, si el JWT ya se vencio o no
auth.onAuthStateChanged(user => {
    if (user) {
        store.dispatch('sesion/iniciarSesion', user.uid)
    } else {
        store.dispatch('sesion/cerrarSesion')
    }
});

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')