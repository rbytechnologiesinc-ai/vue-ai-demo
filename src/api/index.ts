import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;