import { env } from 'import.meta'

const apiUrl = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD;

export default apiUrl