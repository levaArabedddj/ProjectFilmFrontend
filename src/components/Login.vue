<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">🎬 Вход в систему</h2>

      <FormKit
  type="text"
  label="Ім'я користувача"
  v-model="credentials.userName"
  validation="required"
/>

<FormKit
  type="password"
  label="Пароль"
  v-model="credentials.password"
  validation="required"
/>
<FormKit
  type="submit"
  label="Увійти"
  @click.prevent="handleLogin"
  classes="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 w-full mt-4"
/>



      <p class="text-center mt-5 text-gray-600">
        Нет аккаунта?
        <router-link to="/register" class="text-blue-500 hover:underline">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from '../store/auth';
 // Импортируем хранилище
  import api from "../api"; 
  import { jwtDecode } from "jwt-decode";
  import { FormKit } from "@formkit/vue";
  
  const router = useRouter();
  const authStore = useAuthStore(); // Получаем хранилище
  
  const credentials = ref({
    userName: "",
    password: "",
  });
  
  const handleLogin = async () => {
  if (!credentials.value.userName || !credentials.value.password) {
    alert("Введите имя пользователя и пароль!");
    return;
  }

  try {
    const response = await api.post("auth/signin", credentials.value, {
      headers: { "Content-Type": "application/json" },
      responseType: "text",
    });

    const token = response.data;
    authStore.setToken(token);

    try {
      const decoded = jwtDecode(token);
      console.log("Токен успешно декодирован:", decoded);

      // Определяем маршрут на основе роли
      const userRoles = decoded.roles || [];
      let redirectPath = "/dashboard"; // По умолчанию

      if (userRoles.includes("ROLE_DIRECTOR")) {
        redirectPath = "/main-page-director"; // Путь для директора
      } else if (userRoles.includes("ROLE_ACTOR")) {
        redirectPath = "/actor-dashboard";
      } else if (userRoles.includes("ROLE_CREW_MEMBER")) {
        redirectPath = "/crew-dashboard";
      }

      alert("Вы успешно вошли!");
      router.push(redirectPath); // Перенаправляем пользователя

    } catch (err) {
      console.error("Ошибка при декодировании токена:", err);
      alert("Ошибка при обработке токена!");
    }

  } catch (error) {
    console.error("Ошибка входа:", error);
    alert(`Ошибка: ${error.response?.status || "Неизвестная"} ${error.response?.data || ""}`);
  }
};

  </script>
  
  