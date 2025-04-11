<script setup>
import { ref } from 'vue';
import api from '../api';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const isRegister = ref(false); // Перемикач між реєстрацією та входом
const message = ref('');

const submit = async () => {
  try {
    if (isRegister.value) {
      await api.post('/register', { username: username.value, password: password.value });
      message.value = 'Реєстрація успішна! Увійдіть у систему.';
      isRegister.value = false;
    } else {
      const response = await api.post('/login', { username: username.value, password: password.value });
      authStore.setToken(response.data);
      router.push('/');
    }
  } catch (error) {
    message.value = 'Помилка: ' + (error.response?.data || 'Спробуйте ще раз');
  }
};
</script>

<template>
    <div>
      <h1>Login Page</h1>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Enter your username" />
        <input v-model="password" type="password" placeholder="Enter your password" />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      login() {
        console.log('Logged in:', this.username);
      },
    },
  };
  </script>
  
