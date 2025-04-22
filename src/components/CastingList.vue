<template>
    <div class="page-container">
      <h2 class="page-title">Кастинги фильма №{{ movieId }}</h2>
  
      <div v-if="loading" class="status-text">
        Загрузка…
      </div>
      <div v-else-if="error" class="status-text error">
        Ошибка: {{ errorMessage }}
      </div>
      <div v-else-if="!loading && castings.length === 0" class="status-text">
        Кастингов пока нет.
      </div>
  
      <div v-else class="casting-grid">
        <div v-for="c in castings" :key="c.id" class="casting-card">
          <h3>{{ c.roleName }}</h3>
          <p>{{ c.description }}</p>
          <p><strong>Требования:</strong> {{ c.requirements }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "CastingList",
    data() {
      return {
        castings: [],
        loading: false,
        error: false,
        errorMessage: "",
      };
    },
    computed: {
      movieId() {
        return this.$route.params.movieId;
      },
    },
    created() {
      this.fetchCastings();
    },
    methods: {
      async fetchCastings() {
        this.loading = true;
        this.error = false;
        try {
          const token = localStorage.getItem("token");
          const resp = await axios.get(
            `/casting/allCastingsMovie/${this.movieId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          this.castings = resp.data;
        } catch (e) {
          console.error(e);
          this.error = true;
          this.errorMessage = e.response?.data?.message || e.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .page-container {
    background-color: #0e1117;
    color: #fff;
    min-height: 100vh;
    padding: 30px 20px;
    font-family: 'Segoe UI', sans-serif;
  }
  .page-title {
    font-size: 2rem;
    margin-bottom: 25px;
    text-align: center;
  }
  .status-text {
    text-align: center;
    color: #718096;
    margin-top: 30px;
    font-size: 1.1rem;
  }
  .status-text.error {
    color: #f66;
  }
  .casting-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }
  .casting-card {
    background-color: #1c1f26;
    border: 1px solid #2a2d34;
    border-radius: 12px;
    padding: 20px;
    transition: box-shadow .3s, transform .2s;
    cursor: default;
  }
  .casting-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }
  .casting-card h3 {
    margin-bottom: 10px;
    font-size: 1.3rem;
  }
  .casting-card p {
    color: #ccc;
    margin-bottom: 8px;
  }
  </style>
  