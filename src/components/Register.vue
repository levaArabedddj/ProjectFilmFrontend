<template>
  <div class="page-container">
    <div class="login-card">
      <h2>📝 Регистрация</h2>

      <FormKit type="form" @submit="handleSubmit">
        <FormKit
          type="text"
          label="Имя пользователя"
          v-model="user.userName"
          validation="required"
          classes="input-field"
        />
        <FormKit
          type="email"
          label="Gmail"
          v-model="user.gmail"
          validation="required|email"
          classes="input-field"
        />
        <FormKit
          type="select"
          label="Роль"
          v-model="user.role"
          validation="required"
          classes="input-field"
        >
          <option value="ACTOR">Актёр</option>
          <option value="CREW_MEMBER">Член команды</option>
          <option value="ADMIN">Администратор</option>
          <option value="DIRECTOR">Режиссёр</option>
          <option value="VISITOR">Посетитель</option>
        </FormKit>
        <FormKit
          type="password"
          label="Пароль"
          v-model="user.password"
          validation="required|min:6"
          classes="input-field"
        />
        <FormKit
          type="text"
          label="Имя"
          v-model="user.name"
          validation="required"
          classes="input-field"
        />
        <FormKit
          type="text"
          label="Фамилия"
          v-model="user.surName"
          validation="required"
          classes="input-field"
        />
        <FormKit
          type="select"
          label="Пол"
          v-model="user.gender"
          validation="required"
          classes="input-field"
        >
          <option value="MALE">Мужской</option>
          <option value="FEMALE">Женский</option>
        </FormKit>
        <FormKit
          type="tel"
          label="Телефон"
          v-model="user.phone"
          validation="required"
          classes="input-field"
        />

        <FormKit
          type="submit"
          label="Зарегистрироваться"
          @click.prevent="handleSubmit"
          classes="btn-submit"
        />
      </FormKit>

      <p class="bottom-text">
        Уже есть аккаунт?
        <router-link to="/login" class="link">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";    // <-- импортируем store
import api from "../api";
// Вариант A: именованный импорт «по‑умолчанию»
import { jwtDecode } from "jwt-decode";
import axios from 'axios';



const router = useRouter();
const authStore = useAuthStore();

const user = ref({
  userName: "",
  gmail: "",
  password: "",
  role: "ROLE_VISITOR",  // значение по умолчанию
  name: "",
  surName: "",
  gender: "MALE",
  phone: "",
});

const handleSubmit = async () => {
  // простая валидация
  for (const key in user.value) {
    if (!user.value[key]) {
      alert("Заполните все поля!");
      return;
    }
  }
  if (user.value.password.length < 6) {
    alert("Пароль должен быть не менее 6 символов!");
    return;
  }

  try {
    const response = await api.post(
      "https://film-no9d.onrender.com/auth/signup-Login",
      user.value,
      {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      }
    );

    // предполагаем, что response.data — это строковый JWT
    const token = typeof response.data === "string"
      ? response.data
      : response.data.token;

    // сохраняем токен в Zustand/Vuex/Pinia
    authStore.setToken(token);

    // декодируем токен и вытаскиваем роли
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    // выбираем путь редиректа
    let redirectPath = "/dashboard";
    if (roles.includes("ROLE_DIRECTOR")) {
      redirectPath = "/main-page-director";
    } else if (roles.includes("ROLE_ACTOR")) {
      redirectPath = "/actor-dashboard";
    } else if (roles.includes("ROLE_CREW_MEMBER")) {
      redirectPath = "/crew-dashboard";
    } else if (roles.includes("ROLE_ADMIN")) {
      redirectPath = "/admin-dashboard";
    } else if (roles.includes("ROLE_VISITOR")) {
      redirectPath = "/visitor-home";
    }

    alert("Успешная регистрация!");
    router.push(redirectPath);

  } catch (error) {
    console.error("Ошибка регистрации:", error);
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
