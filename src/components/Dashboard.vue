<template>
    <div class="dashboard">
      <h1>Добро пожаловать на вашу панель управления!</h1>
      <p>Здесь будет информация о вашем аккаунте.</p>
  
      <!-- Пример кнопки для выхода -->
      <button @click="logout">Выйти</button>
    </div>
  </template>
  
  <script>
 import { useAuthStore } from "@/store/auth"; // Проверить путь
import { useRouter } from "vue-router";
import { watchEffect } from "vue";

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    watchEffect(() => {
  if (!authStore.token || authStore.token.trim() === "") {
    router.push("/login");
  }
});


    return {};
  },
};

  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    padding: 20px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #f56565;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #e53e3e;
  }
  </style>
  