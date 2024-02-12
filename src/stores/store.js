import { reactive } from 'vue'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state() {
    return {
      cycles: [],
      user: null,
      message: [],
    }
  },
  actions: {
    async loadCycles() {
      await axios.get(SERVER + '/cycles')
        .then(response => this.cycles = response.data)
        .catch(response => {
          alert('Error: ' + response.message)
        })
    },
    loadUser(){
      const storedCart = localStorage.getItem('user')
      if (storedCart) {
        this.user = JSON.parse(storedCart)
      } else {
        this.user = []
      }
    },
    addUser(usuario){
      this.user = usuario
    }
  },

  getters: {
    
  }
})

