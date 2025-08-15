<script setup lang="ts">
import { ref } from 'vue';
import springAiService from '@/api/springAiService';

const prompt = ref<string>('');
const response = ref<string>('');
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

async function getResponse(): Promise<void> {
  if (!prompt.value) return;

  isLoading.value = true;
  error.value = null;
  response.value = '';

  try {
    // Because our service is typed, 'res' is automatically typed!
    const res = await springAiService.getAiResponse(prompt.value);
    // TypeScript knows res.data contains an object with a 'response' property.
    response.value = res.data.response; 
  } catch (err) {
    console.error('Error fetching AI response:', err);
    error.value = 'Failed to get response from the server.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="ai-chat-container">
    <h2>Spring AI Chat</h2>
    <div class="chat-box">
      <div v-if="response" class="response">
        <strong>AI:</strong> {{ response }}
      </div>
      <div v-if="isLoading" class="loading">
        Thinking...
      </div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
    <form @submit.prevent="getResponse">
      <input
        v-model="prompt"
        type="text"
        placeholder="Ask something..."
        :disabled="isLoading"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Styles remain the same */
.ai-chat-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.chat-box {
  min-height: 100px;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
form {
  display: flex;
}
input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}
.error {
  color: red;
}
</style>