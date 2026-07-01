import axios from "axios"
const base_url = process.env.API_URL || "http://localhost:3000/api"

export const API = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
})
