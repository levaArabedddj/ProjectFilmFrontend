<template>
  <div class="page-container">
    <div class="login-card">
      <h2>🎬 Вход в систему</h2>

      <FormKit
        type="text"
        label="Ім'я користувача"
        v-model="credentials.userName"
        validation="required"
        classes="input-field"
      />

      <FormKit
        type="password"
        label="Пароль"
        v-model="credentials.password"
        validation="required"
        classes="input-field"
      />

      <FormKit
        type="submit"
        label="Увійти"
        @click.prevent="handleLogin"
        classes="btn-submit"
      />

      <p class="bottom-text">
        Нет аккаунта?
        <router-link to="/register" class="link">
          Зарегистрироваться
        </router-link>
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
    const response = await api.post("https://film-no9d.onrender.com/auth/signin", credentials.value, {
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
  
  <style scoped>
.page-container {
  background-color: #0e1117;
  color: #fff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}
.login-card {
  background-color: #1c1f26;
  border: 1px solid #2a2d34;
  border-radius: 12px;
  padding: 40px 30px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.login-card h2 {
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
}
.input-field {
  width: 100%;
  margin-bottom: 20px;
  --fk-border: 1px solid #2a2d34;
  --fk-bg: #0e1117;
  --fk-color: #fff;
  --fk-placeholder: #777;
}
.btn-submit {
  width: 100%;
  background-color: #2a2d34;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: box-shadow .3s, transform .2s;
}
.btn-submit:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  transform: translateY(-2px);
}
.bottom-text {
  margin-top: 20px;
  font-size: 0.9rem;
  text-align: center;
  color: #ccc;
}
.link {
  color: #68b0f1;
  text-decoration: underline;
}
</style>
  