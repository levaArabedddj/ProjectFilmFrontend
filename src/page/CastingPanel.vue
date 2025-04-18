<template>
    <div class="casting-dashboard-container">
      <header class="dashboard-header">
        <h1>Панель Управления Кастингами</h1>
      </header>
      <main class="dashboard-grid">
        <!-- Карточка: Просмотр всех кастингов -->
        <div class="dashboard-card" @click="goToCastingList">
          <h2>Все кастинги</h2>
          <p>Просмотр и управление существующими кастингами</p>
        </div>
        <!-- Карточка: Создать новый кастинг -->
        <div class="dashboard-card" @click="goToCreateCasting">
          <h2>Создать кастинг</h2>
          <p>Добавить новый кастинг для фильма</p>
        </div>
        <!-- Карточка: Заявки актеров -->
        <div class="dashboard-card" @click="goToApplicants">
          <h2>Заявки</h2>
          <p>Управление заявками от актеров</p>
        </div>
        <!-- Карточка: Статистика -->
        <div class="dashboard-card" @click="goToStats">
          <h2>Статистика</h2>
          <p>Анализ откликов и эффективности</p>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CastingDashboard',
    methods: {
      goToCastingList() {
        this.$router.push({ name: 'CastingList', params: { movieId: this.$route.params.movieId } });
      },
      goToCreateCasting() {
        this.$router.push({ name: 'CreateCasting', params: { movieId: this.$route.params.movieId } });
      },
      goToApplicants() {
        this.$router.push({ name: 'CastingApplicants', params: { movieId: this.$route.params.movieId } });
      },
      goToStats() {
        this.$router.push({ name: 'CastingStats', params: { movieId: this.$route.params.movieId } });
      }
    }
  };
  </script>
  
  <style scoped>
/* Общий фон и стили страницы */
.casting-dashboard-container {
  background-color: #0e1117;
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

/* Хедер */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #fff;
}

/* Сетка карточек */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

/* Карточки управления */
.dashboard-card {
  background-color: #1c1f26;
  border: 1px solid #2a2d34;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s;
}
.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transform: translateY(-4px);
}

.dashboard-card h2 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #fff;
}
.dashboard-card p {
  color: #ccc;
  font-size: 1rem;
}

/* Статусы загрузки */
.loading,
.empty {
  text-align: center;
  color: #718096;
  margin-top: 40px;
  font-size: 1.2rem;
}
</style>
  