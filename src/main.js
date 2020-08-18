import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';
import 'firebase/auth'
import './firebase.js'

import VueFirestore from 'vue-firestore';
import router from '@/router';
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueFirestore, {key: 'id'});

//acá creamos nuestro almacén

const store = new Vuex.Store({
  //en mi estado tengo un usuario y mensaje de error
  state: {
    usuario: null,
    error: null,
  },

  mutations: {
    //mutacion para cambiar el "usuario"
    //nuevo_usuario es mi argumento
    set_usuario(state, nuevo_usuario){
      state.usuario = nuevo_usuario;
    },
    //mutacion para cambia el "error"
    set_error(state, nuevo_error){
      state.error = nuevo_error;
    },
    increment(state) {
      state.likes++
    }
  },
  // las acciones se utilizan cuando necesito crear una funcion asincrona
  // acá llamamos a la accion àra registrar al usuario

  actions: { // esta es nuestra accion REGISTRO
    registro(context, datos){
      firebase.auth().createUserWithEmailAndPassword(datos.email, datos.password)

      // si es que el registro es exitoso, ejecuto esta función
      .then(function () {
        // si el registro es exitoso agrego el nombre
        firebase.auth().currentUser.updateProfile({
          displayName: datos.nombre
        })
      })
      .then(() => {
        // acá guardamos nuestros datos en el almacén
        context.commit('set_error', null);
        // set usuario tiene dos objetos email y name, dentro guardamos los datos 
        // en set_usuario guardamos todos los datos del usuario, datos.email y datos.nombre
        context.commit('set_usuario', {email: datos.email, nombre: datos.nombre}),
        router.push('/');
      })

      // si ocurre un error
      .catch(function (error) {
        context.commit('set_error', error.message);
        context.commit('set_usuario', null);
      });
    },

    login (context, datos) {
      firebase.auth().signInWithEmailAndPassword(datos.email, datos.password)

        // si el login es exitoso, ejecuto esta funcion
        .then(respuesta => {
          context.commit('set_error', null);
          context.commit('set_usuario', {email: datos.email, nombre: respuesta.user.displayName});
          router.push({path: '/'})
        })
        // si ocurre un error
        .catch(err => {
          context.commit('set_error', err.message);
          context.commit('set_usuario', null);
        })
    },

    logout (context) {
      //console.log('logout', context) //acá probamos si logout esta llegando a la consola
      firebase.auth().signOut()
      //si la salida es exitosa dejamos usuario y error en null
      .then(() => {
        context.commit('set_error',null);
        context.commir('set_usuario',null);
        router.push({path: '/'})
      })
    }
  }
})


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
