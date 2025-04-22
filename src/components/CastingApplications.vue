<template>
  <div class="page-container">
    <h2 class="page-title">
      Заявки на кастинг №{{ castingId }} (фильм №{{ filmId }})
    </h2>

    <div v-if="loading" class="status-text">Загрузка…</div>
    <div v-else-if="error" class="status-text error">
      Ошибка: {{ errorMessage }}
    </div>
    <div v-else-if="!loading && applications.length === 0" class="status-text">
      Заявок пока нет.
    </div>

    <div v-else class="application-list">
      <div
        v-for="app in applications"
        :key="app.id"
        class="application-card"
      >
        <p><strong>ID заявки:</strong> {{ app.id }}</p>
        <p><strong>Роль:</strong> {{ app.castingRole }}</p>
        <h3 v-if="app.actor">
          {{ app.actor.name }} {{ app.actor.surName }}
        </h3>
        <h3 v-else class="text-muted">
          Информация об актёре отсутствует
        </h3>
        <div v-if="app.actor">
          <p><strong>Зарплата в час:</strong> {{ app.actor.salaryPerHour }}₴</p>
          <p><strong>Рейтинг:</strong> {{ app.actor.rating }}</p>
        </div>
        <p><strong>Сообщение:</strong> {{ app.message }}</p>
        <p><strong>Статус:</strong> <span :class="statusClass(app.status)">{{ app.status }}</span></p>

        <!-- Блок кнопок принятия/отклонения -->
        <div class="actions" v-if="app.status === 'Pending'">
          <button @click="onReview(app.id, 'Approved')">Принять</button>
          <button @click="onReview(app.id, 'Rejected')">Отклонить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CastingApplications",
  props: {
    filmId: { type: [String, Number], required: true },
    castingId: { type: [String, Number], required: true },
  },
  data() {
    return {
      applications: [],
      loading: false,
      error: false,
      errorMessage: "",
    };
  },
  created() {
    this.fetchApplications();
  },
  methods: {
    statusClass(status) {
      return {
        Approved: "status-accepted",
        Rejected: "status-rejected",
        Pending: "status-pending",
      }[status] || "";
    },
    async fetchApplications() {
      this.loading = true;
      this.error = false;
      try {
        const token = localStorage.getItem("token");
        const url = `/casting/applications/${this.filmId}/${this.castingId}`;
        const resp = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.applications = resp.data;
      } catch (e) {
        console.error(e);
        this.error = true;
        this.errorMessage = e.response?.data?.message || e.message;
      } finally {
        this.loading = false;
      }
    },
    async onReview(applicationId, newStatus) {
      // спросим у режиссёра комментарий
      const feedback = window.prompt(
        `Введите комментарий к действию (${newStatus}):`,
        ""
      );
      if (feedback === null) {
        // отмена
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `/casting/review/${applicationId}`,
          { status: newStatus, feedback },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // обновим статус локально, чтобы не перезагружать всю страницу
        const idx = this.applications.findIndex((a) => a.id === applicationId);
        if (idx !== -1) {
              this.applications[idx] = {
            ...this.applications[idx],
             status: newStatus,
        };
        }
      } catch (e) {
        console.error(e);
        alert("Не удалось отправить решение: " + (e.response?.data?.message || e.message));
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
    text-align: center;
    margin-bottom: 25px;
  }
  .status-text {
    text-align: center;
    color: #718096;
    margin-top: 30px;
  }
  .status-text.error {
    color: #f66;
  }
  .application-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  .application-card {
    background-color: #1c1f26;
    border: 1px solid #2a2d34;
    border-radius: 12px;
    padding: 20px;
  }
  .text-muted {
    color: #999;
  }
  .actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.actions button:hover {
  opacity: 0.9;
}

.status-accepted {
  color: #9f9;
}
.status-rejected {
  color: #f99;
}
.status-pending {
  color: #fff;
}
  </style>
  