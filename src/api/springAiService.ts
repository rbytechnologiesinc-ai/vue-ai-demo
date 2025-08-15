import apiClient from './index';
import { type AxiosResponse } from 'axios';

// Define a type for the data we expect from the chat endpoint
// Assuming the backend returns an object with a 'response' string
interface AiChatResponse {
  response: string;
}

// Define the service object with typed methods
const springAiService = {
  getAiResponse(prompt: string): Promise<AxiosResponse<AiChatResponse>> {
    return apiClient.post('/chat', { prompt });
  }

  // Example for another typed function
  // generateImage(prompt: string): Promise<AxiosResponse<any>> {
  //   return apiClient.post('/image', { prompt });
  // }
};

export default springAiService;