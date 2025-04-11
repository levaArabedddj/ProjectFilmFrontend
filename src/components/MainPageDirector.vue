<template>
    <div class="films-container">
      <header>
        <h1>Мої фільми</h1>
        <div class="user-avatar" @click="goToUserPage">
          <span>U</span>
        </div>
      </header>
  
      <main>
        <div v-if="loading" class="loading">Завантаження...</div>
        <div v-else-if="films.length === 0" class="empty">Фільмів поки немає</div>
        <div v-else class="films-list">

        <!-- Контейнер для создания нового фильма -->
        <div class="film-card create-new" @click="showCreateForm = true" v-if="!showCreateForm">
          <h2>+ Додати новий фільм</h2>
        </div>

        <!-- Форма создания фильма -->
        <div class="film-card create-form" v-if="showCreateForm">
          <input v-model="newFilm.title" placeholder="Назва фільму" />
          <input v-model="newFilm.description" placeholder="Опис" />
           <!-- Выпадающий список для выбора жанра -->
           <select v-model="newFilm.genre_film">
            <option disabled value="">Оберіть жанр</option>
            <option v-for="genre in genres" :key="genre.value" :value="genre.value">
              {{ genre.label }}
            </option>
          </select>
          <div class="form-buttons">
            <button @click="createFilm">Створити</button>
            <button @click="cancelCreate">Скасувати</button>
          </div>
        </div>

            <div
                class="film-card"
                  v-for="film in films"
                    :key="film.id"
                 @click="openFilm(film.id)"
>
                <h2>{{ film.title }}</h2>
                 <p>{{ film.description }}</p>
            <p v-if="film.genre_film">Жанр: {{ film.genre_film }}</p>
            <!-- Кнопка удаления фильма.
               При клике, событие не всплывает (stopPropagation), чтобы не открывалась карточка -->
          <button class="delete-film-btn" @click.stop="deleteFilm(film.id)">Видалити</button>
            </div>

        </div>
      </main>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  name: "DirectorFilms",
  data() {
    return {
      films: [],
      loading: true,
      showCreateForm: false,
      newFilm: {
        title: "",
        description: "",
        genre_film: ""
      },
      // Массив доступных жанров: значение для бэкенда и отображаемая метка для пользователя
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
  methods: {
    async fetchFilms() {
      try {
        // Получаем токен из localStorage
        const token = localStorage.getItem("token");
        // Отправляем запрос с заголовком Authorization
        const response = await axios.get('/Film/getAllFilms', { // важная часть для получения данных и их отправки !!
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        this.films = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні фільмів:", error);
      } finally {
        this.loading = false;
      }
    },
    async createFilm() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post('/Film/create_movie', this.newFilm, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        console.log("Фільм створено:", response.data);
        this.newFilm = { title: "", description: "", genre_film: "" };
        this.showCreateForm = false;
        await this.fetchFilms(); // обновим список
      } catch (error) {
        console.error("Помилка при створенні фільму:", error);
      }
    },
    cancelCreate() {
      this.showCreateForm = false;
      this.newFilm = { title: "", description: "", genre_film: "" };
    },
    openFilm(filmId) {
      this.$router.push({ name: "DirectorDashboard", params: { id: filmId } });
    },
    async deleteFilm(filmId) {
      try {
        const token = localStorage.getItem("token");
        // Отправляем DELETE-запрос
        const response = await axios.delete(`/Film/DeleteFilm/${filmId}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        console.log("Фільм видалено:", response.data);
        // Обновляем список фильмов, исключая удалённый фильм
        this.films = this.films.filter(film => film.id !== filmId);
      } catch (error) {
        console.error("Помилка при видаленні фільму:", error);
      }
    },
    goToUserPage() {
      this.$router.push("/user-profile");
    }
  },
  mounted() {
    this.fetchFilms();
  }
};
</script>

  
<style scoped>
.films-container {
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

.films-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.film-card {
  background-color: #1c1f26;
  border: 1px solid #2a2d34;
  border-radius: 10px;
  padding: 20px;
  width: calc(33.333% - 20px);
  cursor: pointer;
  transition: 0.3s ease;
  position: relative;
}

.film-card:hover {
  background-color: #23252d;
}

/* Стили для кнопки удаления фильма */
.delete-film-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4d4d;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-film-btn:hover {
  background-color: #e60000;
}

.loading, .empty {
  color: #aaa;
  font-size: 18px;
}

.create-new {
  background-color: #1a1d24;
  color: #ccc;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}

.create-form input,
.create-form select {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  background-color: #2d2f36;
  border: none;
  color: white;
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
</style>

  