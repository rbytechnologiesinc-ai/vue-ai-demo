import apiClient from './index';
import { type AxiosResponse } from 'axios';

// Represents the expected response from the AI chat service.
interface AiChatResponse {
    response: string;
}

// Corresponds to the ModelOptions record in the Spring Boot backend.
interface ModelOptions {
    model?: string;
    temperature?: number;
}

/**
 * Defines the structure for a chat request to the backend.
 * This interface matches the ChatRequest DTO in your Spring Boot application.
 */
export interface ChatRequest {
    message: string;
    conversationId?: string; // UUIDs are sent as strings in JSON
    options?: ModelOptions;
}

// Define the service object with typed methods
const springAiService = {
    /**
     * Sends a chat request to the /actor-character_request endpoint.
     * @param request - The ChatRequest object containing the message and optional parameters.
     * @returns A promise that resolves to the AI's response.
     */
    getAiResponse(request: ChatRequest): Promise<AxiosResponse<AiChatResponse>> {
        // The request object is now sent directly as the POST body
        return apiClient.post('/actor-character_request', request);
    },

    /**
     * Sends a simple prompt to the generic /chat endpoint.
     * @param prompt - The user's prompt as a string.
     * @returns A promise that resolves to the AI's response.
     */
    postAiResponse(prompt: string): Promise<AxiosResponse<AiChatResponse>> {
        return apiClient.post('/chat', { prompt });
    }

    // Example for another typed function
    // generateImage(prompt: string): Promise<AxiosResponse<any>> {
    //   return apiClient.post('/image', { prompt });
    // }
};

export default springAiService;