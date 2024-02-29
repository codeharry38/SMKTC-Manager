import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = process.env.VUE_APP_API;

export const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token') || null,
        role: localStorage.getItem('rl') || null,
        uName: localStorage.getItem('uName') || null
    },

    // Gatter
    getters: {
        loggedIn(state) {
          return state.token !== null
        },
    },
    mutations: {
        retrieveToken(state, token) {
          state.token = token
        },
        destroyToken(state) {
          state.token = null;
          state.role = null;
        },
    },
    actions: {
      // Destroy Token on logout
      destroyToken(context) {
        if (context.getters.loggedIn) {
          return new Promise((resolve, reject) => {
            axios.post('/user/logout')
              .then(response => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('rl')
                localStorage.removeItem('uName')
                context.commit('destroyToken')
                resolve(response)
              })
              .catch(error => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('rl')
                localStorage.removeItem('uName')
                context.commit('destroyToken')
                reject(error)
              })
          })
        }
      },
      // Fetch Token on Login
      retrieveToken(context, credentials) {
        return new Promise((resolve, reject) => {
          axios.post('/user/login', {
            username: credentials.username,
            password: credentials.password,
          })
          .then(response => {
            if(response.status == 200){
              const token = response.data.data.access_token
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
              localStorage.setItem('access_token', token);
              localStorage.setItem('rl',response.data.loginManage.role);
              localStorage.setItem('uName',response.data.loginManage.name);
              context.commit('retrieveToken', token);
              resolve(response)
            }else{
              response.error;
            }
             
          })
          .catch(error => {
           reject(error)
          })
        })
      },
    }
});