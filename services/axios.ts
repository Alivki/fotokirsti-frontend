import axios from "axios"

// Use backend URL when set (prod); otherwise /api (local proxy)
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "/api"

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