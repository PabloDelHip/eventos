import { auth } from '@/firebase'

export default {
    namespaced: true,
    state: {
        usuario: null
    },
    mutations: {
        actualizarUsuario(state, usuario) {
            state.usuario = usuario
        }
    },
    actions: {
        // iniciarSesion({ commit }, uid) {

        //     //  commit('actualizarUsuario', usuario)
        // },
        cerrarSesion({ commit }) {
            //le indicamos a firebase que destruya el token y cierre sesion
            auth.signOut();
            commit('actualizarUsuario', null)
        }
    },
    getters: {
        saludo(state) {
            if (!state.usuario) {
                return ''
            }

            let vocal = state.usuario.sexo && state.usuario.sexo == 'F' ? 'a' : 'o'
            return `¡Bienvenid${vocal} ${state.usuario.nombres}!`
        }
    }
}