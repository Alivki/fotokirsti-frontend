import axios from "axios"

const baseURL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Don't redirect on sign-in 401 so the login form can show the error
      const isSignIn =
        typeof error.config?.url === "string" &&
        error.config.url.includes("auth/sign-in")
      if (!isSignIn) {
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export { api }