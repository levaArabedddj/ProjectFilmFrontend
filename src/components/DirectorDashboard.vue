<template>
  <div class="dashboard-container">
    <header>
      <h1>{{ film ? film.title : "Director Dashboard" }}</h1>
      <div class="user-avatar" @click="goToUserPage">
        <span>U</span>
      </div>
    </header>

    <main v-if="film">
      <!-- Блок Основной информации -->
      <div class="section-block">
        <h2>Основна інформація</h2>
        <!-- Если включена форма редактирования фильма, показываем поля для редактирования -->
        <div v-if="showFilmEditForm" class="edit-film-form">
          <input v-model="updatedFilm.title" placeholder="Назва фільму" />
          <input v-model="updatedFilm.description" placeholder="Опис" />
          <select v-model="updatedFilm.genre_film">
            <option disabled value="">Оберіть жанр</option>
            <option v-for="genre in genres" :key="genre.value" :value="genre.value">
              {{ genre.label }}
            </option>
          </select>
          <div class="form-buttons">
            <button @click="updateFilmData">Зберегти</button>
            <button @click="cancelFilmEdit">Скасувати</button>
          </div>
        </div>
        <!-- Если форма редактирования не включена, показываем данные фильма и кнопку редактирования -->
        <div v-else>
          <p><strong>Опис:</strong> {{ film.description }}</p>
          <p><strong>Жанр:</strong> {{ film.genre_film }}</p>
          <p><strong>Дата створення:</strong> {{ film.dateTimeCreated }}</p>
          <button class="edit-film-btn" @click="openFilmEditForm">Редагувати фільм</button>
        </div>
      </div>

      <!-- Блок Финансы -->
      <div class="section-block">
        <h2>Фінанси</h2>
        <!-- Если финансы созданы и форма редактирования не открыта, показываем данные и кнопку редактирования -->
        <div v-if="financeExists && !showFinanceUpdateForm">
          <p><strong>Бюджет:</strong> {{ film.finance.budget || 'Немає' }}</p>
          <p><strong>Зарплата акторів:</strong> {{ film.finance.actorsSalary || 'Немає' }}</p>
          <p><strong>Зарплата команди:</strong> {{ film.finance.crewSalary || 'Немає' }}</p>
          <p><strong>Витрати на рекламу:</strong> {{ film.finance.advertisingCost || 'Немає' }}</p>
          <p><strong>Витрати на монтаж:</strong> {{ film.finance.editingCost || 'Немає' }}</p>
          <p><strong>Витрати на обладнання:</strong> {{ film.finance.equipmentCost || 'Немає' }}</p>
          <button class="edit-finance-btn" @click="openFinanceUpdateForm">Редагувати фінанси</button>
        </div>
        <!-- Если финансы не созданы или поле бюджет не заполнено, показываем возможность их создать -->
<div v-else-if="!film.finance || !film.finance.budget">
  <p>Фінанси не створені.</p>
  <button class="add-finance-btn" @click="showFinanceForm = true">Додати фінанси</button>
  
  <!-- Форма создания финансов -->
  <div v-if="showFinanceForm" class="finance-form">
    <input v-model="newFinance.budget" placeholder="Бюджет" />
    <input v-model="newFinance.actorsSalary" placeholder="Зарплата акторів" />
    <input v-model="newFinance.crewSalary" placeholder="Зарплата команди" />
    <input v-model="newFinance.advertisingCost" placeholder="Витрати на рекламу" />
    <input v-model="newFinance.editingCost" placeholder="Витрати на монтаж" />
    <input v-model="newFinance.equipmentCost" placeholder="Витрати на обладнання" />
    <div class="form-buttons">
      <button @click="createFinance">Зберегти</button>
      <button @click="cancelFinance">Скасувати</button>
    </div>
  </div>
</div>
        <!-- Форма обновления финансов (если открыта) -->
        <div v-if="showFinanceUpdateForm" class="finance-form">
          <input v-model="updateFinance.budget" placeholder="Бюджет" />
          <input v-model="updateFinance.actorsSalary" placeholder="Зарплата акторів" />
          <input v-model="updateFinance.crewSalary" placeholder="Зарплата команди" />
          <input v-model="updateFinance.advertisingCost" placeholder="Витрати на рекламу" />
          <input v-model="updateFinance.editingCost" placeholder="Витрати на монтаж" />
          <input v-model="updateFinance.equipmentCost" placeholder="Витрати на обладнання" />
          <div class="form-buttons">
            <button @click="updateFinanceData">Зберегти</button>
            <button @click="cancelFinanceUpdate">Скасувати</button>
          </div>
        </div>
      </div>

       <!-- Блок Съемочные дни --> 
<div class="section-block">
  <h2>Съемочні дні</h2>
  
  <!-- Кнопка открытия формы создания нового дня (если не редактируем) -->
  <button class="add-day-btn" @click="showShootingForm = true" v-if="!showShootingForm && editingShootingDayId === null">
    Додати зйомочний день
  </button>
  
  <!-- Форма создания съемочного дня -->
  <div v-if="showShootingForm" class="day-form">
    <label>
      Дата зйомки:
      <input type="date" v-model="newShootingDay.shootingDate" />
    </label>
    <label>
      Час зйомки:
      <input type="time" v-model="newShootingDay.shootingTime" />
    </label>
    <label>
      Локація:
      <input type="text" v-model="newShootingDay.shootingLocation" placeholder="Локація" />
    </label>
    <label>
      Тривалість (години):
      <input type="number" v-model="newShootingDay.estimatedDurationHours" placeholder="Тривалість" />
    </label>
    <div class="form-buttons">
      <button @click="createShootingDay">Зберегти</button>
      <button @click="cancelShootingDay">Скасувати</button>
    </div>
  </div>
  
  <!-- Список съемочных дней -->
  <div v-if="film.shootingDays && film.shootingDays.length">
    <div v-for="(day, index) in film.shootingDays" :key="day.id" class="shooting-day">
      <!-- Если этот день выбран для редактирования, отображаем форму редактирования -->
      <div v-if="editingShootingDayId === day.id" class="edit-shooting-day-form">
        <label>
          Дата зйомки:
          <input type="date" v-model="editedShootingDay.shootingDate" />
        </label>
        <label>
          Час зйомки:
          <input type="time" v-model="editedShootingDay.shootingTime" />
        </label>
        <label>
          Локація:
          <input type="text" v-model="editedShootingDay.shootingLocation" placeholder="Локація" />
        </label>
        <label>
          Тривалість (години):
          <input type="number" v-model="editedShootingDay.estimatedDurationHours" placeholder="Тривалість" />
        </label>
        <div class="form-buttons">
          <button @click="updateShootingDayData">Зберегти</button>
          <button @click="cancelShootingDayEdit">Скасувати</button>
        </div>
      </div>
      <!-- Иначе, отображаем данные дня и кнопки редактирования/удаления -->
      <div v-else>
        <p><strong>Дата:</strong> {{ day.shootingDate }}</p>
        <p><strong>Час:</strong> {{ day.shootingTime }}</p>
        <p><strong>Локація:</strong> {{ day.shootingLocation }}</p>
        <p><strong>Тривалість (год):</strong> {{ day.estimatedDurationHours }}</p>
        <button class="edit-day-btn" @click.stop="openShootingDayEdit(day)">Редагувати</button>
        <button class="delete-day-btn" @click.stop="deleteShootingDay(day.id)">Видалити</button>
        <hr>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Съемочних днів не зазначено.</p>
  </div>
</div>

    </main>
    <main v-else>
      <p>Завантаження інформації про фільм...</p>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "DirectorDashboard",
  data() {
    return {
      film: null,
      token: localStorage.getItem("token"),
      showFinanceForm: false,
      showFinanceUpdateForm: false,
      showFinanceUpdateForm: false,
      showFilmEditForm: false,
      newFilmData: null, // для новой информации о фильме (при создании уже фильма здесь не нужен)
      // Для редактирования фильма – новые данные
      showShootingDayForm: false,
      updatedFilm: {
        title: "",
        description: "",
        genre_film: ""
      },
      // Для создания финансов
      newFinance: {
        budget: "",
        actorsSalary: "",
        crewSalary: "",
        advertisingCost: "",
        editingCost: "",
        equipmentCost: ""
      },
      updateFinance: {
        budget: "",
        actorsSalary: "",
        crewSalary: "",
        advertisingCost: "",
        editingCost: "",
        equipmentCost: ""
      },
      showShootingForm: false,
    newShootingDay: {
      shootingDate: "",
      shootingTime: "",
      shootingLocation: "",
      estimatedDurationHours: ""
    },
    newShootingDay: {
      shootingDate: "",
      shootingTime: "",
      shootingLocation: "",
      estimatedDurationHours: ""
    },
    // Для редактирования съемочного дня
    editingShootingDayId: null, // id выбранного дня
    editedShootingDay: {
      shootingDate: "",
      shootingTime: "",
      shootingLocation: "",
      estimatedDurationHours: ""
    },
    
      genres: [
        { value: 'ACTION', label: 'Боевик' },
        { value: 'ADVENTURE', label: 'Приключения' },
        { value: 'ANIMATION', label: 'Анимация' },
        { value: 'BIOGRAPHY', label: 'Биография' },
        { value: 'COMEDY', label: 'Комедия' },
        { value: 'CRIME', label: 'Криминал' },
        { value: 'DOCUMENTARY', label: 'Документальный' },
        { value: 'DRAMA', label: 'Драма' },
        { value: 'FAMILY', label: 'Семейный' },
        { value: 'FANTASY', label: 'Фэнтези' },
        { value: 'FILM_NOIR', label: 'Фильм-нуар' },
        { value: 'HISTORY', label: 'Исторический' },
        { value: 'HORROR', label: 'Ужасы' },
        { value: 'MUSIC', label: 'Музыкальный' },
        { value: 'MUSICAL', label: 'Мюзикл' },
        { value: 'MYSTERY', label: 'Детектив/Загадка' },
        { value: 'ROMANCE', label: 'Романтика' },
        { value: 'SCI_FI', label: 'Научная фантастика' },
        { value: 'SHORT', label: 'Короткометражка' },
        { value: 'SPORT', label: 'Спорт' },
        { value: 'SUPERHERO', label: 'Супергерои' },
        { value: 'THRILLER', label: 'Триллер' },
        { value: 'WAR', label: 'Военный' },
        { value: 'WESTERN', label: 'Вестерн' },
        { value: 'OTHER', label: 'Другой' },
      ]
    };
  },
  computed: {
    financeExists() {
      return this.film && this.film.finance && this.film.finance.budget !== null;
    }
},
  methods: {
    async fetchFilmDetails() {
      try {
        const filmId = this.$route.params.id;
        console.log("filmId:", filmId);
        const response = await axios.get(`/Film/getMovieById/${filmId}`, {
          headers: {
            'Authorization': 'Bearer ' + this.token
          }
        });
        this.film = Array.isArray(response.data) ? response.data[0] : response.data;
        if (!this.film) {
          console.error('Фільм з таким id не знайдено!');
        }
      } catch (error) {
        console.error("Помилка при завантаженні деталей фільму:", error);
      }
    },

    async updateFilmData() {
      try {
        const filmId = this.film.id;
        const response = await axios.post(`/Film/update_movie/${filmId}`, this.updatedFilm, {
          headers: {
            'Authorization': 'Bearer ' + this.token
          }
        });
        console.log("Фільм оновлено:", response.data);
        // Обновляем локальные данные фильма
        this.film.title = response.data.title;
        this.film.description = response.data.description;
        this.film.genre_film = response.data.genre_film;
        this.showFilmEditForm = false;
      } catch (error) {
        console.error("Помилка при оновленні фільму:", error);
      }
    },
    openFilmEditForm() {
      // Открываем форму редактирования и предзаполняем данные
      if (this.film) {
        this.updatedFilm = {
          title: this.film.title,
          description: this.film.description,
          genre_film: this.film.genre_film
        };
        this.showFilmEditForm = true;
      }
    },
    cancelFilmEdit() {
      this.showFilmEditForm = false;
      // Сброс обновленных данных если нужно
      this.updatedFilm = {
        title: "",
        description: "",
        genre_film: ""
      };
    },
    async createFinance() {
  try {
    const filmId = this.film.id;
    const response = await axios.post(`/Finance/createFinance/${filmId}`, this.newFinance, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    });
    console.log("Фінанси створено:", response.data);

    // Сброс формы создания
    this.newFinance = {
      budget: "",
      actorsSalary: "",
      crewSalary: "",
      advertisingCost: "",
      editingCost: "",
      equipmentCost: ""
    };
    this.showFinanceForm = false;

    // 1) Тут делаем повторный запрос, чтобы обновить локальный объект film
    await this.fetchFilmDetails();

    // 2) По желанию сразу открыть форму обновления (если так задумано):
    this.openFinanceUpdateForm();
    
  } catch (error) {
    console.error("Помилка при створенні фінансів:", error);
  }
},
    cancelFinance() {
      this.showFinanceForm = false;
      this.newFinance = {
        budget: "",
        actorsSalary: "",
        crewSalary: "",
        advertisingCost: "",
        editingCost: "",
        equipmentCost: ""
      };
    },
    openFinanceUpdateForm() {
      // Заполняем форму редактирования текущими значениями
      if (this.film.finance) {
        this.updateFinance = { ...this.film.finance };
        this.showFinanceUpdateForm = true;
      }
    },
    async updateFinanceData() {
      try {
        const filmId = this.film.id;

        const financeId = this.film.finance.id; 
        if (!financeId) {
          console.error("financeId is undefined. Проверьте, что createFinance возвращает корректное id.");
          return;
        }
         // Создаем копию объекта без поля id
    const { id, ...financeData } = this.updateFinance;

        const response = await axios.put(`/Finance/updateFinance/${filmId}/${financeId}`, financeData, {
          headers: {
            'Authorization': 'Bearer ' + this.token
          }
        });
        console.log("Фінанси оновлено:", response.data);
        // Если backend возвращает сообщение, можно дополнительно обновить film.finance
        // Например, заново вызвать fetchFilmDetails или обновить локально.
        // В этом примере предполагаем, что обновление успешно и обновляем локально:
        this.film.finance = { ...financeData, id: financeId }; // сохраняем id, чтобы не потерять его
        this.showFinanceUpdateForm = false;
      } catch (error) {
        console.error("Помилка при оновленні фінансів:", error);
      }
    },
    cancelFinanceUpdate() {
      this.showFinanceUpdateForm = false;
      this.updateFinance = {
        budget: "",
        actorsSalary: "",
        crewSalary: "",
        advertisingCost: "",
        editingCost: "",
        equipmentCost: ""
      };
    },
    async createShootingDay() {
    try {
      const filmId = this.film.id;
      const response = await axios.post(`/ShootingDay/create_shootingDay/${filmId}`, this.newShootingDay, {
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      });

      console.log("Зйомочний день створено:", response.data);

      // Обновим список съемочных дней
      await this.fetchFilmDetails();

      // Сброс формы
      this.newShootingDay = {
        shootingDate: "",
        shootingTime: "",
        shootingLocation: "",
        estimatedDurationHours: ""
      };
      this.showShootingForm = false;

    } catch (error) {
      console.error("Помилка при створенні зйомочного дня:", error);
    }
  },
  cancelShootingDay() {
    this.showShootingForm = false;
    this.newShootingDay = {
      shootingDate: "",
      shootingTime: "",
      shootingLocation: "",
      estimatedDurationHours: ""
    }; 
  },
      async deleteShootingDay(shootingDayId) {
        try {
          const filmId = this.film.id;
          const token = localStorage.getItem("token");
          // Отправляем DELETE-запрос
          const response = await axios.delete(`/ShootingDay/delete/shootingDay/${filmId}/${shootingDayId}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          console.log("Съемочный день удалён:", response.data);
          // Обновляем список съемочных дней, например, убираем удалённый из массива
          this.film.shootingDays = this.film.shootingDays.filter(day => day.id !== shootingDayId);
        } catch (error) {
          console.error("Помилка при видаленні зйомочного дня:", error);
        }
      },

      openShootingDayEdit(day) {
    // Запоминаем id редактируемого дня
    this.editingShootingDayId = day.id;
    // Предзаполняем форму данными текущего дня
    this.editedShootingDay = { 
      shootingDate: day.shootingDate,
      shootingTime: day.shootingTime,
      shootingLocation: day.shootingLocation,
      estimatedDurationHours: day.estimatedDurationHours 
    };
  },
  
  cancelShootingDayEdit() {
    this.editingShootingDayId = null;
    this.editedShootingDay = {
      shootingDate: "",
      shootingTime: "",
      shootingLocation: "",
      estimatedDurationHours: ""
    };
  },
  async updateShootingDayData() {
    try {
      const filmId = this.film.id;
      const shootingDayId = this.editingShootingDayId;
      const token = localStorage.getItem("token");
      // Отправляем PUT‑запрос с обновлёнными полями (формат JSON Map<String, Object>)
      const updates = { ...this.editedShootingDay }; // Можно дополнительно удалить лишние свойства, если они есть
      const response = await axios.put(`/ShootingDay/update/shootingDay/${filmId}/${shootingDayId}`, updates, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      console.log("Съемочный день обновлен:", response.data);
      // Перезагружаем детали фильма, чтобы обновить список съемочных дней
      await this.fetchFilmDetails();
      // Сбрасываем состояние редактирования
      this.cancelShootingDayEdit();
    } catch (error) {
      console.error("Помилка при оновленні зйомочного дня:", error);
    }
  },

    goToUserPage() {
      this.$router.push("/user-profile");
    }
  },
  mounted() {
    this.fetchFilmDetails();
  }
};
</script>
<style scoped>
.dashboard-container {
  background-color: #0e1117;
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #2d2f36;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
}

.section {
  margin-bottom: 30px;
}

.section-block {
  background-color: #1c1f26;
  border: 1px solid #2a2d34;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.section-block h2 {
  margin-bottom: 10px;
}

.section-block p {
  margin: 5px 0;
}

.edit-film-btn {
  background-color: #4fa3ff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.edit-film-btn:hover {
  background-color: #357acc;
}

.add-finance-btn,
.edit-finance-btn {
  background-color: #3a3d45;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.add-finance-btn:hover,
.edit-finance-btn:hover {
  background-color: #4b4e57;
}

.finance-form input,
.edit-film-form input,
.edit-film-form select {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  background-color: #2d2f36;
  border: none;
  color: #fff;
  border-radius: 5px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.form-buttons button {
  background-color: #3a3d45;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.form-buttons button:hover {
  background-color: #4b4e57;
}
.shooting-day {
  position: relative;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #2d2f36;
  border-radius: 5px;
}
.delete-day-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff4d4d;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
}
.delete-day-btn:hover {
  background-color: #e60000;
}
/* Стили для всего блока съемочных дней */
.section-block {
  background-color: #1c1f26;
  border: 1px solid #2a2d34;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
}

/* Заголовок блока */
.section-block h2 {
  margin-bottom: 15px;
}

/* Стили для формы создания и редактирования съёмочного дня (тёмная версия) */
.day-form,
.edit-shooting-day-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #2d2f36; /* тёмный фон для формы */
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  /* Можно добавить лёгкую тень, но в тёмном оформлении её стоит уменьшить: */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Метки (label) для полей — светлый текст */
.day-form label,
.edit-shooting-day-form label {
  font-size: 14px;
  color: #ddd;
}

/* Стили для инпутов в форме — темный фон, светлый текст */
.day-form input,
.edit-shooting-day-form input {
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #444;
  border-radius: 8px;
  width: 100%;
  background-color: #1e2128;
  color: #fff;
}

/* Кнопки формы — оптимизированы для тёмного оформления */
.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.form-buttons button {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Кнопка сохранения */
.form-buttons button:first-child {
  background-color: #4caf50;
}
.form-buttons button:first-child:hover {
  background-color: #45a049;
}

/* Кнопка отмены */
.form-buttons button:last-child {
  background-color: #d9534f;
}
.form-buttons button:last-child:hover {
  background-color: #c9302c;
}

/* Стили для карточек съёмочного дня */
.shooting-day {
  background-color: #1c1f26;
  border: 1px solid #2a2d34;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  position: relative;
}

/* Текст карточки — можно сделать чуть светлее */
.shooting-day p {
  margin: 4px 0;
  color: #ccc;
}

/* Стили для кнопок редактирования и удаления дня */
.edit-day-btn,
.delete-day-btn {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  margin-right: 10px;
}
/* Кнопка редактирования (ранее была жёлтой #ffc107) */
.edit-day-btn {
  background-color: #52555c; /* Тёмный серо-синий фон */
  color: #fff;
  border: none;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s;
}
.edit-day-btn:hover {
  background-color: #60636a; /* При наведении чуть светлее */
}
.delete-day-btn {
  background-color: #c0392b; /* Тёмно-красный */
  color: #fff;
}
.delete-day-btn:hover {
  background-color: #a93226; /* При наведении ещё темнее */
}

/* Кнопка добавления нового дня (подгоняем для тёмной темы) */
.add-day-btn {
  background-color: #3a3d45; /* Тёмно-серый фон */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  display: block;
}
.add-day-btn:hover {
  background-color: #2980b9;
}
</style>
