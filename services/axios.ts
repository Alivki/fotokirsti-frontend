import axios from "axios";

// /api is proxied to backend via Next.js rewrites (see next.config.ts)
const api = axios.create({
  baseURL: "/api",
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
        // Clear the hint cookie so middleware won't let the user back into
        // /admin on refresh after their backend session has been revoked.
        document.cookie = "logged_in=; Path=/; Max-Age=0; SameSite=Lax"
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export { api }