import axios from "axios"
import env from "../config/env"

const API_URL = env.API_URL

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default client