<template>
  <div class="profile-card">
    <header class="card-header">
      <h2>{{ profile.actorName }}</h2>
      <span class="birth-year">Born: {{ profile.birthYear }}</span>
    </header>
    <section class="card-body">
      <p class="summary">{{ profile.summary }}</p>
      <h3>Notable Filmography</h3>
      <ul class="filmography-list">
        <li v-for="(movie, index) in profile.filmography" :key="index">
          <strong>{{ movie.title }}</strong> ({{ movie.year }}) - as {{ movie.role }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

// ✨ Define the types that match your backend's StructuredResponse DTO
interface Movie {
  title: string;
  year: number;
  role: string;
}

interface StructuredResponse {
  actorName: string;
  birthYear: number;
  summary: string;
  filmography: Movie[];
}

// Define the component's props
defineProps({
  profile: {
    type: Object as PropType<StructuredResponse>,
    required: true,
  },
});
</script>

<style scoped>
.profile-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: left;
}

.card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0;
  color: #333;
}

.birth-year {
  color: #666;
  font-size: 0.9em;
}

.summary {
  line-height: 1.6;
  color: #555;
}

h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #444;
}

.filmography-list {
  list-style-type: none;
  padding-left: 0;
}

.filmography-list li {
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.filmography-list li:last-child {
  border-bottom: none;
}
</style>