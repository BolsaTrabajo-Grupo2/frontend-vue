import { reactive } from 'vue'
import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state() {
    return {
      cycles: [],
      user: null,
      messages: [],
    }
  },
  actions: {
    async loadCycles() {
      await axios.get(SERVER + '/cycles')
        .then(response => this.cycles = response.data)
        .catch(response => {
          this.messages.push({
            id: id++,
            type: 'danger',
            text: response.message
          })
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
    },
    addMsgArray(type, text) {
      this.messages.push({
        id: id++,
        type: type,
        text: text
      })
    },
    clearErrorMessages(index) {
      this.messages.splice(index, 1)
    },
    cleanUser(){
      this.user = null
    }
  },

  getters: {
    
  }
})

let id = 1

