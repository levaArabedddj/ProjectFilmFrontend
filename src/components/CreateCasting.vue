<template>
    <div class="create-casting">
      <h2>Додати кастинг для фільму {{ movieId }}</h2>
  
      <!-- Ошибка валидации -->
      <div v-if="error" class="error">{{ error }}</div>
  
      <!-- Динамический список форм -->
      <div
        v-for="(form, index) in forms"
        :key="index"
        class="casting-form"
      >
        <h3>Кастинг #{{ index + 1 }}</h3>
  
        <label>
          Назва ролі:
          <input
            v-model="form.roleName"
            placeholder="Role Name"
          />
        </label>
  
        <label>
          Опис:
          <textarea
            v-model="form.description"
            placeholder="Description"
          ></textarea>
        </label>
  
        <label>
          Вимоги:
          <textarea
            v-model="form.requirements"
            placeholder="Requirements"
          ></textarea>
        </label>
  
        <!-- Кнопка удаления этой формы (если их больше одной) -->
        <button
          v-if="forms.length > 1"
          class="remove-form-btn"
          @click="removeForm(index)"
        >
          Видалити цей кастинг
        </button>
  
        <hr />
      </div>
  
      <!-- Кнопка добавления новой формы -->
      <button
        class="add-form-btn"
        @click="addForm"
      >
        + Додати ще один кастинг
      </button>
  
      <!-- Отправка всех сразу -->
      <div class="buttons">
        <button @click="submitCasting">Створити</button>
        <button @click="cancel">Відміна</button>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CreateCasting',
    props: {
      movieId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        forms: [
      { roleName: '', description: '', requirements: '' }
    ],
        error: ''
      };
    },
    methods: {

        addForm() {
    this.forms.push({ roleName: '', description: '', requirements: '' });
  },
  async submitCasting() {
    this.error = '';
    // валидируем, минимум одна роль
    if (!this.forms.length || !this.forms[0].roleName.trim()) {
    this.error = 'Role name обов’язкове';
    return;
  }

    for (let f of this.forms) {
        if (!f.roleName.trim()) {
          this.error = 'У кожного кастинга має бути назва ролі';
          return;
        }
      }

      try {
        const token = localStorage.getItem('token');
        // Отправляем N отдельных запросов
        await Promise.all(this.forms.map(f =>
          axios.post(
            `https://film-no9d.onrender.com/casting/create/${this.movieId}`,
            f,
            { headers: { Authorization: 'Bearer ' + token } }
          )
        ));
        // После успеха — перенаправляем на дашборд
        this.$router.push({ name: 'DirectorDashboard', params: { id: this.movieId } });
      } catch (e) {
        this.error = e.response?.data || 'Не вдалося створити кастингі';
      }
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>
  
  <style scoped>
  .create-casting {
    background: #1c1f26;
    padding: 20px;
    border-radius: 8px;
    color: #fff;
  }
  label {
    display: block;
    margin-bottom: 12px;
  }
  input, textarea {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    background: #2d2f36;
    border: none;
    border-radius: 4px;
    color: #fff;
  }
  textarea { resize: vertical; min-height: 80px; }
  .buttons {
    margin-top: 16px;
  }
  button {
    background: #3a3d45;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
  }
  button:hover { background: #4b4e57; }
  .error {
    background: #c0392b;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 12px;
    text-align: center;
  }
  </style>
  