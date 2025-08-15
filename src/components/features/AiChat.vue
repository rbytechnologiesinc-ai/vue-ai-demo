<template>
  <div class="chat-container">
    <div class="chat-window" ref="chatWindow">
      <div v-for="message in messages" :key="message.id" class="message-wrapper">
        <div v-if="message.sender === 'user'" class="message user-message">
          <p>{{ message.content }}</p>
        </div>
        <div v-else class="message ai-message">
           <ActorProfileCard :profile="message.content" />
        </div>
      </div>

      <div v-if="isLoading" class="message-wrapper">
        <div class="message ai-message">
          <p class="typing-indicator">AI is thinking...</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="chat-input-form">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Ask for an actor's profile..."
        :disabled="isLoading"
      />
      <button type="submit" :disabled="isLoading || !newMessage.trim()">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import springAiService, { type ChatRequest } from '@/api/springAiService'; // Adjust path if needed

import ActorProfileCard from '../ActorProfileCard.vue'; // 👈 Import the new component

// ✨ START: Define types matching the full backend ChatResponse DTO
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

interface Usage {
  prompt_tokens: number;
  generation_tokens: number;
  total_tokens: number;
}

interface MetaData {
  model: string;
  usage: Usage;
}

export interface ChatResponse {
  structuredResponse: StructuredResponse;
  conversationId: string;
  metaData: MetaData;
}
// ✨ END: Type definitions

// 🔧 The Message interface now supports structured content for the AI
interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string | StructuredResponse; // Content can be a string or a profile object
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const chatWindow = ref<HTMLDivElement | null>(null);
const conversationId = ref<string | null>(null);

onMounted(() => {
  conversationId.value = null;
});

const scrollToBottom = async () => {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

const sendMessage = async () => {
  const userText = newMessage.value.trim();
  if (!userText || isLoading.value) return;

  // Add user message to UI (content is a string)
  messages.value.push({ id: Date.now(), content: userText, sender: 'user' });
  newMessage.value = '';
  scrollToBottom();
  isLoading.value = true;

  try {
    const request: ChatRequest = {
      message: userText,
      conversationId: conversationId.value!,
    };

    // 💡 The service now needs to be typed to expect a `ChatResponse`
    // In springaiservice.ts, change the return type to:
    // Promise<AxiosResponse<ChatResponse>>
    const response = await springAiService.getAiResponse(request);
    const aiData: ChatResponse = response.data;

    // 🔧 CORE CHANGE: Push the structuredResponse object as the AI message content
    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      content: aiData.structuredResponse, // Pass the whole profile object
    });

    // You can also use the metadata for logging or analytics
    console.log('AI Response Metadata:', aiData.metaData);

  } catch (error) {
    console.error('Failed to get AI response:', error);
    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      // Provide a simple string for error messages
      content: 'Sorry, I couldn\'t process that request. The AI may not have found a match.',
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};
</script>

<style scoped>
/* Styles from previous example are unchanged, but ensure they don't conflict. */
/* The .ai-message class will now act as a container for the card. */
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  height: 70vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
}

.chat-window {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message {
  max-width: 95%; /* Allow AI card to be wider */
  padding: 0.5rem 1rem;
  border-radius: 12px;
  line-height: 1.5;
}

.user-message {
  background-color: #007bff;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 2px;
}

.ai-message {
  /* Remove default AI styling to let the card handle its own appearance */
  background-color: transparent;
  padding: 0;
  margin-right: auto;
}

.typing-indicator {
  font-style: italic;
  color: #666;
  background-color: #e9ecef;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 12px;
}

.chat-input-form {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ccc;
  background-color: #fff;
}

.chat-input-form input {
  flex-grow: 1;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 20px;
  margin-right: 0.5rem;
}

.chat-input-form button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

.chat-input-form button:disabled {
  background-color: #a0cffc;
  cursor: not-allowed;
}
</style>