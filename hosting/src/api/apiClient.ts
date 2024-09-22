import axios from "axios";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json'
  },
})

export default apiClient;