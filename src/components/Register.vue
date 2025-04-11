<template>
  <div class="flex justify-center items-center min-h-screen bg-purple-700">
    <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-900">Регистрация</h2>

      <div class="form-container bg-purple-600 p-6 rounded-xl">
        <FormKit type="form" @submit="handleSubmit">
          <FormKit type="text" label="Имя пользователя" v-model="user.userName" validation="required" />
          <FormKit type="email" label="Gmail" v-model="user.gmail" validation="required|email" />
          
          <FormKit type="select" label="Роль" v-model="user.role" validation="required">
            <option value="ACTOR">Актёр</option>
            <option value="CREW_MEMBER">Член команды</option>
            <option value="ADMIN">Администратор</option>
            <option value="DIRECTOR">Режиссёр</option>
            <option value="VISITOR">Посетитель</option>
          </FormKit>

          <FormKit type="password" label="Пароль" v-model="user.password" validation="required|min:6" />
          <FormKit type="text" label="Имя" v-model="user.name" validation="required" />
          <FormKit type="text" label="Фамилия" v-model="user.surName" validation="required" />

          <FormKit type="select" label="Пол" v-model="user.gender" validation="required">
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
          </FormKit>

          <FormKit type="tel" label="Телефон" v-model="user.phone" validation="required" />

          <FormKit type="submit" label="Зарегистрироваться" classes="bg-purple-800 text-white p-2 rounded-lg hover:bg-purple-900 w-full mt-4 transition-all duration-300" />
        </FormKit>
      </div>

      <p class="mt-4 text-sm text-center text-white">
        Уже есть аккаунт?
        <router-link to="/login" class="text-blue-300 hover:underline">Войти</router-link>
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api"; // Подключение API

const router = useRouter();

const user = ref({
  userName: "",
  gmail: "",
  password: "",
  role: "USER",
  name: "",
  surName: "",
  gender: "MALE",
  phone: "",
});

const handleSubmit = async () => {
  if (!user.value.userName || !user.value.gmail || !user.value.password || !user.value.role || !user.value.name || !user.value.surName || !user.value.phone) {
    alert("Заполните все поля!");
    return;
  }

  if (user.value.password.length < 6) {
    alert("Пароль должен быть не менее 6 символов!");
    return;
  }

  try {
    const response = await api.post("auth/signup-Login", user.value, {
      headers: { "Content-Type": "application/json" },
      responseType: "text",
    });

    if (typeof response.data === "string") {
      localStorage.setItem("authToken", response.data);
    } else if (response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    alert("Успешная регистрация!");
    router.push("/dashboard"); // Перенаправление
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    alert(`Ошибка: ${error.response?.status || "Неизвестная"} ${error.response?.data || ""}`);
  }
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #7e3f9f; /* фиолетовый фон */
  padding: 2rem;
  border-radius: 1rem;
}

.form-container .FormKit {
  margin-bottom: 16px;
}

.bg-purple-800 {
  background-color: #5a1d91;
}
</style>