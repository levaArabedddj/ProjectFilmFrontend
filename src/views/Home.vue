<template>
  <div class="home-page">
    <div class="overlay">
      <!-- Верхний текст -->
      <p class="top-text">🎥 Часть съемочной группы? Выбирай проекты, где твои навыки станут незаменимыми!</p>
      
      <!-- Левый текст -->
      <p class="left-text">🎭 Ты актер? Найди свою роль, пройди кастинг и стань звездой нового фильма!</p>
      
      <!-- Правый текст -->
      <p class="right-text">🎬 Ты режиссер? Собери команду мечты и сними фильм, который покорит зрителей!</p>
      
      <div class="content">
        <h1>🎬 Добро пожаловать в MovieVerse</h1>
        <p>
          **Твое место в мире кино!**  
          Режиссеры создают фильмы, актеры находят роли, съемочные группы участвуют в проектах,  
          а зрители следят за новинками и ожидаемыми премьерами.  
          Присоединяйся и стань частью великого кинематографа!
        </p>
        <div class="buttons">
          <router-link to="/signin" class="btn login">Войти</router-link>
          <router-link to="/register" class="btn register">Зарегистрироваться</router-link>
          <a
      class="btn google"
      href="https://film-no9d.onrender.com/oauth2/authorization/google"
    >
      Войти через Google
    </a>
        </div>
      </div>
      
      <!-- Нижний текст -->
      <p class="bottom-text">🎁 Ты зритель? Будь первым, кто узнает о премьерах и получай уникальный доступ к бэкстейджу!</p>
    </div>
  </div>
</template>

<style scoped>
/* Фон на весь экран */
.home-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('https://source.unsplash.com/1920x1080/?cinema,movie,film') no-repeat center center/cover;
}

/* Затемнение */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 20px;
}

/* Заголовок */
h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Описание */
p {
  font-size: 1.2rem;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 30px;
}

/* Контейнер для кнопок */
.buttons {
  display: flex;
  gap: 40px;
}

/* Стили кнопок */
.btn {
  display: inline-block;
  padding: 15px 30px;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.3s, transform 0.2s;
}

/* Кнопка "Войти" */
.btn.login {
  background: #d32f2f;
  color: white;
}

.btn.login:hover {
  background: #b71c1c;
  transform: scale(1.05);
}

/* Кнопка "Зарегистрироваться" */
.btn.register {
  background: #1976d2;
  color: white;
}

.btn.register:hover {
  background: #0d47a1;
  transform: scale(1.05);
}

/* Верхний текст */
.top-text {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  color: #ffd700;
  font-weight: bold;
}

/* Левый текст */
.left-text {
  position: absolute;
  left: 20px; /* Фиксированное расстояние от левого края */
  top: 50%; /* Выравнивание по вертикали */
  transform: translateY(-50%);
  max-width: 300px; /* Ограничение ширины, чтобы текст не растягивался */
  word-wrap: break-word; /* Перенос длинных слов */
  text-align: left;
}
@media (max-width: 768px) {
  .left-text {
    position: static; /* Возвращаем к обычному потоку */
    text-align: center;
    margin: 10px auto;
  }
}
/* Правый текст */
.right-text {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  max-width: 300px;
  font-size: 1.2rem;
  color: #32cd32;
  font-weight: bold;
}

/* Нижний текст */
.bottom-text {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.btn.google {
  background: #db4437;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  margin-left: 10px;
}
.btn.google:hover {
  background: #c23321;
}
</style>